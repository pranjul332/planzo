import { io } from "socket.io-client";
import { useAuth0 } from "@auth0/auth0-react";
import { useCallback, useEffect, useState } from "react";

export const useWebSocketService = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  // Initialize socket connection
  const initSocket = useCallback(async () => {
    if (!isAuthenticated) {
      setError("User not authenticated");
      return;
    }

    try {
      console.log("Initializing WebSocket connection...");
      const token = await getAccessTokenSilently();

      if (!token) {
        throw new Error("Failed to obtain authentication token");
      }

      console.log("Token obtained, connecting to socket...");

      const socketUrl = "http://localhost:5000";
      const newSocket = io(socketUrl, {
        auth: {
          token: `Bearer ${token}`,
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ["websocket", "polling"],
      });

      newSocket.on("connect", () => {
        console.log("Socket connected successfully");
        setIsConnected(true);
        setError(null);
      });

      newSocket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
        setError(`Connection error: ${err.message}`);
        setIsConnected(false);
      });

      newSocket.on("error", (err) => {
        console.error("Socket general error:", err);
        const errorMessage =
          typeof err === "string" ? err : err.message || "Server error";
        setError(errorMessage);
      });

      newSocket.on("server-error", (errData) => {
        console.error("Server error:", errData);
        setError(`Server error: ${errData.message}`);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        if (newSocket) {
          console.log("Cleaning up socket connection");
          newSocket.disconnect();
        }
      };
    } catch (err) {
      console.error("Failed to initialize socket:", err);
      setError(err instanceof Error ? err.message : "Authentication error");
      return undefined;
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    let cleanup;

    const setup = async () => {
      cleanup = await initSocket();
    };

    setup();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [initSocket]);

  const joinChat = useCallback(
    (chatId) => {
      if (!socket || !isConnected) {
        console.warn("Cannot join chat: Socket not connected");
        return;
      }
      socket.emit("join-chat", chatId);
    },
    [socket, isConnected]
  );

  const leaveChat = useCallback(
    (chatId) => {
      if (!socket || !isConnected) {
        console.warn("Cannot leave chat: Socket not connected");
        return;
      }
      socket.emit("leave-chat", chatId);
    },
    [socket, isConnected]
  );

  const sendMessage = useCallback(
    (chatId, content, attachments = []) => {
      if (!socket || !isConnected) {
        const error = "Not connected to chat server";
        setError(error);
        return Promise.reject(error);
      }
      return new Promise((resolve, reject) => {
        socket.emit(
          "send-message",
          { chatId, content, attachments },
          (response) => {
            if (response?.error) {
              reject(response.error);
            } else {
              resolve(response);
            }
          }
        );
      });
    },
    [socket, isConnected]
  );

  const sendTyping = useCallback(
    (chatId, isTyping) => {
      if (!socket || !isConnected) {
        console.warn("Cannot send typing indicator: Socket not connected");
        return;
      }
      socket.emit("typing", { chatId, isTyping });
    },
    [socket, isConnected]
  );

  const onNewMessage = useCallback(
    (callback) => {
      if (!socket) {
        console.warn("Cannot subscribe to messages: Socket not initialized");
        return;
      }
      socket.on("new-message", callback);
      return () => socket.off("new-message", callback);
    },
    [socket]
  );

  const onUserTyping = useCallback(
    (callback) => {
      if (!socket) {
        console.warn(
          "Cannot subscribe to typing indicators: Socket not initialized"
        );
        return;
      }
      socket.on("user-typing", callback);
      return () => socket.off("user-typing", callback);
    },
    [socket]
  );

  return {
    socket,
    isConnected,
    error,
    joinChat,
    leaveChat,
    sendMessage,
    sendTyping,
    onNewMessage,
    onUserTyping,
  };
};
