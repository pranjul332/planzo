import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  User,
  Send,
  Paperclip,
  Image,
  Smile,
  X,
  Phone,
  Users,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Menu from "./Menu";
import GroupSetting from "./GroupSetting";
import { useGroupChatService } from "../../services/chatService";

const Chat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { getGroupChatById, sendMessage, updateGroupChat } =
    useGroupChatService();

  // State variables
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isClipboardOpen, setIsClipboardOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [members, setMembers] = useState([]);

  // Refs
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);

  const fetchChatData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getGroupChatById(chatId);

      setChatData(data);
      setMessages(data.messages || []);

      setMembers(data.members || []);

      setGroupData({
        name: data.name || "Group Chat",
        description: data.description || "",
        destination: data.destination || "",
        date: data.date || "",
        budget: data.budget || "",
        privacy: data.settings?.privacy || "public",
        notifications: data.settings?.notifications || "all",
      });
    } catch (err) {
      console.error("Error fetching chat:", err);
      setError(err.message || "Failed to load chat");
    } finally {
      setLoading(false);
    }
  }, [chatId]); // Ensure all external dependencies are included

  useEffect(() => {
    if (chatId) {
      fetchChatData();
    }
  }, [chatId, fetchChatData]); // ✅ useCallback prevents infinite re-renders

  // Format messages for display
  const formattedMessages = messages.map((msg) => ({
    id: msg._id,
    sender: msg.sender === user?.sub ? "user" : "other",
    username: msg.sender === user?.sub ? "You" : msg.senderName,
    text: msg.content,
    time: new Date(msg.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    attachments: msg.attachments,
  }));

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Group settings
  const [groupData, setGroupData] = useState({
    name: "Chat Recipient",
    description: "",
    budget: "",
    date: "",
    destination: "",
    privacy: "public",
    notifications: "all",
  });

  // Handle group settings update
  const handleUpdateGroup = async (newData) => {
    try {
      await updateGroupChat(chatId, {
        name: newData.name,
        description: newData.description,
        settings: {
          privacy: newData.privacy,
          notifications: newData.notifications,
        },
      });

      setGroupData(newData);
      // Update chat data to reflect changes
      setChatData((prev) => ({
        ...prev,
        name: newData.name,
        description: newData.description,
        settings: {
          ...prev.settings,
          privacy: newData.privacy,
          notifications: newData.notifications,
        },
      }));
    } catch (err) {
      console.error("Failed to update group settings:", err);
      // Show error notification to user
    }
  };

  // Handle sending messages
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      setSending(true);

      // Optimistic update
      const tempMessage = {
        id: `temp-${Date.now()}`,
        sender: "user",
        username: "You",
        text: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        attachments: [],
      };

      setMessages((prev) => [
        ...prev,
        {
          _id: tempMessage.id,
          sender: user?.sub,
          senderName: "You",
          content: newMessage,
          timestamp: new Date(),
          attachments: [],
        },
      ]);

      setNewMessage("");

      // Send to API
      const result = await sendMessage(chatId, newMessage);

      // Replace temp message with real one from API
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempMessage.id
            ? {
                _id: result._id || result.id || Date.now().toString(),
                sender: result.sender,
                senderName: result.senderName,
                content: result.content,
                timestamp: result.timestamp,
                attachments: result.attachments || [],
              }
            : msg
        )
      );
    } catch (err) {
      console.error("Failed to send message:", err);
      // Show error to user and remove the temp message
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== `temp-${Date.now()}`)
      );
    } finally {
      setSending(false);
    }
  };

  // Handle back button
  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <p className="text-red-500">Error: {error}</p>
          <button
            onClick={handleGoBack}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Add ClipboardMenu */}
      <Menu
        isOpen={isClipboardOpen}
        onClose={() => setIsClipboardOpen(false)}
      />

      {/* Sidebar */}
      <div className="w-80 bg-white border-r">
        <div className="p-3 border-b">
          <div className="flex items-center space-x-3">
            <button
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Back"
              onClick={handleGoBack}
            >
              <X className="size-5 text-black" />
            </button>
            <h2 className="text-lg font-semibold">Group Members</h2>
          </div>
        </div>

        {/* Members List */}
        <div className="p-2 overflow-y-auto max-h-[calc(100vh-200px)]">
          {members.map((member) => (
            <div
              key={member.auth0Id}
              className="flex items-center p-2 hover:bg-gray-100 rounded-lg"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <User className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-xs text-gray-500">
                  {member.role || "Member"}
                </p>
              </div>
              {member.auth0Id === user?.sub && (
                <span className="ml-auto text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  You
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Trip info could go here */}
        {chatData?.tripId && (
          <div className="p-4 border-t">
            <h3 className="font-medium text-gray-700">Trip Details</h3>
            <p className="text-sm text-gray-500 mt-1">
              This chat is connected to a trip
            </p>
            {/* You could add a link to view trip details */}
          </div>
        )}
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col relative">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center group">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
            >
              <User className="w-6 h-6 text-gray-500" />
            </button>
            <div className="ml-3 flex-1">
              <h2 className="font-semibold">{groupData.name}</h2>
              <p className="text-sm text-gray-500">
                {members.length} members
                {groupData.destination && ` • 📍 ${groupData.destination}`}
                {groupData.date && ` • 📅 ${groupData.date}`}
              </p>
            </div>
            <Phone className="w-6 h-6 text-gray-500 mr-2" />
          </div>
          {groupData.description && (
            <p className="text-sm text-gray-600 mt-2 px-2">
              {groupData.description}
            </p>
          )}
          {groupData.budget && (
            <p className="text-sm text-gray-600 mt-1 px-2">
              Budget: ${groupData.budget}
            </p>
          )}
        </div>

        {/* Settings Modal */}
        <GroupSetting
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          groupData={groupData}
          onUpdateGroup={handleUpdateGroup}
        />

        {/* Messages Area */}
        <div
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >
          {formattedMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6">
                <p className="text-gray-500">No messages yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  Be the first to send a message!
                </p>
              </div>
            </div>
          ) : (
            formattedMessages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${
                  message.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <span className="text-xs text-gray-500 mb-1 px-2">
                  {message.username}
                </span>
                <div
                  className={`min-w-[70px] max-w-[60%] md:max-w-[40%] right-0 rounded-lg p-3 break-words ${
                    message.sender === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-[10px] mt-1 opacity-75">{message.time}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-white sticky bottom-0">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center space-x-4"
          >
            <div className="flex space-x-2">
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={() => setIsClipboardOpen(!isClipboardOpen)}
              >
                <Paperclip className="w-5 h-5 text-gray-500" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Image className="w-5 h-5 text-gray-500" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Smile className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Write something..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className={`p-2 ${
                sending || !newMessage.trim()
                  ? "bg-purple-400"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white rounded-lg transition-colors`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
