const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const http = require("http");
const { Server } = require("socket.io");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const connectDB = require("./db/dbConnection");
const tripRoutes = require("./routes/tripRoutes");
const groupChatRoutes = require("./routes/chatRoutes");
const { jwtDecode } = require("jwt-decode");
const GroupChat = require("./db/schema/Chat");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

connectDB();

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      console.log("Socket.IO: No token provided");
      return next(new Error("Authentication error: Token not provided"));
    }

    try {
      const decoded = jwtDecode(token);
      socket.userId = decoded.sub;
      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Authentication error"));
    }
  } catch (error) {
    console.error("Socket.IO middleware error:", error);
    next(new Error("Server error"));
  }
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.userId || "unknown"} (${socket.id})`);

  let userId = null;
  if (socket.handshake.auth && socket.handshake.auth.token) {
    try {
      const decoded = jwtDecode(socket.handshake.auth.token);
      userId = decoded.sub;
      socket.userId = userId;
      console.log(`Authenticated user connected: ${userId}`);
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }

  socket.on("join-chat", (chatId) => {
    try {
      if (!chatId) {
        socket.emit("error", { message: "Invalid chat ID" });
        return;
      }

      socket.join(chatId);
      console.log(`User ${socket.userId} joined chat ${chatId}`);
      socket.emit("joined-chat", { chatId });
    } catch (error) {
      console.error(`Error joining chat ${chatId}:`, error);
      socket.emit("error", { message: "Error joining chat" });
    }
  });

  socket.on("leave-chat", (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.userId} left chat ${chatId}`);
  });

  socket.on("send-message", async (data) => {
    try {
      console.log("Received message data:", data);

      const { chatId, content, attachments = [] } = data;

      if (!chatId || !content) {
        socket.emit("error", { message: "Missing required message data" });
        return;
      }

      const groupChat = await GroupChat.findOne({
        chatId: chatId,
        "members.auth0Id": socket.userId,
      });

      if (!groupChat) {
        socket.emit("error", { message: "Chat not found or access denied" });
        return;
      }

      const member = groupChat.members.find((m) => m.auth0Id === socket.userId);
      const senderName = member ? member.name : "Unknown User";

      const messageData = {
        _id: new mongoose.Types.ObjectId(),
        sender: socket.userId,
        senderName,
        content,
        timestamp: new Date(),
        attachments: attachments || [],
      };

      groupChat.messages.push(messageData);
      await groupChat.save();

      io.to(chatId).emit("new-message", messageData);
      console.log(`Message sent and saved to chat ${chatId}`);
    } catch (error) {
      console.error("Error handling message:", error);
      socket.emit("error", { message: "Failed to process message" });
    }
  });

  socket.on("typing", ({ chatId, isTyping }) => {
    socket.to(chatId).emit("user-typing", {
      userId: socket.userId,
      isTyping,
    });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
});

app.use("/api/users", authRoutes);
app.use("/api/trips", authMiddleware, tripRoutes);
app.use("/api/chats", authMiddleware, groupChatRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
