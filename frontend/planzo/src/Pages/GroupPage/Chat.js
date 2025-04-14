import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Users,
  Send,
  Paperclip,
  Image,
  Smile,
  X,
  Phone,
  Video,
  ChevronLeft,
  Info,
  MoreVertical,
  ChevronRight,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Menu from "./Menu";
import GroupSetting from "./GroupSetting";
import { useGroupChatService } from "../../services/chatService";
import { useWebSocketService } from "../../services/webSocketService";

const Chat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { getGroupChatById, updateGroupChat } = useGroupChatService();
  const {
    isConnected,
    error: socketError,
    joinChat,
    leaveChat,
    sendMessage: sendSocketMessage,
    sendTyping,
    onNewMessage,
    onUserTyping,
  } = useWebSocketService();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isClipboardOpen, setIsClipboardOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [members, setMembers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef({});

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
  }, [chatId, getGroupChatById]);

  useEffect(() => {
    if (chatId && isConnected) {
      fetchChatData();
      joinChat(chatId);

      return () => {
        leaveChat(chatId);
      };
    }
  }, [chatId,  isConnected, joinChat, leaveChat]);

  useEffect(() => {
    const cleanup = onNewMessage((message) => {
      setMessages((prevMessages) => {
        // Check if message already exists in the messages array
        const exists = prevMessages.some((msg) => msg._id === message._id);

        // Check if this is a server-confirmed version of a temporary message
        const isConfirmationOfTemp = prevMessages.some(
          (msg) =>
            msg._id.startsWith("temp-") &&
            msg.content === message.content &&
            msg.sender === message.sender
        );

        // If message exists or is a confirmation of temp message, don't add it
        if (exists || isConfirmationOfTemp) {
          // If it's a confirmation, we could replace the temp message with the confirmed one
          if (isConfirmationOfTemp) {
            return prevMessages.map((msg) =>
              msg._id.startsWith("temp-") &&
              msg.content === message.content &&
              msg.sender === message.sender
                ? message
                : msg
            );
          }
          return prevMessages;
        }

        return [...prevMessages, message];
      });

      setTypingUsers((prev) => {
        const updated = { ...prev };
        delete updated[message.sender];
        return updated;
      });
    });

    return cleanup;
  }, [onNewMessage, user?.sub]);

  useEffect(() => {
    const cleanup = onUserTyping(({ userId, isTyping }) => {
      if (isTyping) {
        const member = members.find((m) => m.auth0Id === userId);
        const username = member ? member.name : "Someone";

        setTypingUsers((prev) => ({
          ...prev,
          [userId]: username,
        }));

        if (typingTimeoutRef.current[userId]) {
          clearTimeout(typingTimeoutRef.current[userId]);
        }

        typingTimeoutRef.current[userId] = setTimeout(() => {
          setTypingUsers((prev) => {
            const updated = { ...prev };
            delete updated[userId];
            return updated;
          });
        }, 3000);
      } else {
        setTypingUsers((prev) => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });

        if (typingTimeoutRef.current[userId]) {
          clearTimeout(typingTimeoutRef.current[userId]);
        }
      }
    });

    return () => {
      cleanup && cleanup();
      Object.values(typingTimeoutRef.current).forEach((timeout) => {
        clearTimeout(timeout);
      });
    };
  }, [onUserTyping, members]);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    sendTyping(chatId, e.target.value.length > 0);
  };

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-focus input after sending message
  useEffect(() => {
    if (!sending && inputRef.current) {
      inputRef.current.focus();
    }
  }, [sending]);

  // Check if user prefers dark mode
  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDark);
  }, []);

  const [groupData, setGroupData] = useState({
    name: "Chat Recipient",
    description: "",
    budget: "",
    date: "",
    destination: "",
    privacy: "public",
    notifications: "all",
  });

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
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      _id: tempId,
      sender: user?.sub,
      senderName: "You",
      content: newMessage,
      timestamp: new Date(),
      attachments: [],
    };

    // Clear input field immediately to improve UX
    setNewMessage("");
    setMessages((prev) => [...prev, tempMessage]);

    try {
      setSending(true);
      sendTyping(chatId, false);

      await sendSocketMessage(chatId, newMessage);
      // Message sent successfully
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
      setError("Failed to send message. Please try again.");
    } finally {
      // Make sure sending state is always reset
      setSending(false);
    }
  };

  // Add this useEffect to reset the sending state if it gets stuck
  useEffect(() => {
    if (sending) {
      const timer = setTimeout(() => {
        setSending(false);
      }, 1000); // Force reset after 1 second

      return () => clearTimeout(timer);
    }
  }, [sending]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (loading) {
    return (
      <div
        className={`flex h-screen items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div
            className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
              isDarkMode ? "border-indigo-400" : "border-indigo-600"
            } mx-auto`}
          ></div>
          <p
            className={`mt-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Loading chat...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex h-screen items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div
          className={`text-center p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-lg`}
        >
          <p className="text-red-500">Error: {error}</p>
          <button
            onClick={handleGoBack}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const mainThemeClass = isDarkMode
    ? "bg-gray-900 text-gray-700"
    : "bg-gray-50 text-gray-800";

  const headerThemeClass = isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";

  const sidebarThemeClass = isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";

  const messageUserBubble = isDarkMode
    ? "bg-indigo-700 text-white"
    : "bg-indigo-600 text-white";

  const messageOtherBubble = isDarkMode
    ? "bg-gray-700 text-gray-200"
    : "bg-white text-gray-800";

  const inputThemeClass = isDarkMode
    ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
    : "bg-white border-gray-200 text-gray-800 placeholder-gray-500";

  return (
    <div className={`flex h-screen ${mainThemeClass}`}>
      <Menu
        isOpen={isClipboardOpen}
        onClose={() => setIsClipboardOpen(false)}
        isDarkMode={isDarkMode}
      />

      {/* Backdrop for sidebar on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar for members - visible on larger screens or when toggled */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative z-20 w-72 lg:w-80 h-full ${sidebarThemeClass} shadow-lg transition-transform duration-300 ease-in-out overflow-hidden`}
      >
        <div
          className={`p-4 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          } flex items-center justify-between`}
        >
          <div className="flex items-center space-x-3">
            <button
              className={`p-2 rounded-full ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              } transition-colors md:hidden`}
              aria-label="Close sidebar"
              onClick={toggleSidebar}
            >
              <X
                className={`size-5 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              />
            </button>
            <h2
              className={`text-lg font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              }`}
            >
              Members
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`${
                isDarkMode
                  ? "bg-indigo-900 text-indigo-300"
                  : "bg-indigo-100 text-indigo-800"
              } text-xs px-2 py-1 rounded-full`}
            >
              {members.length}
            </span>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                isDarkMode
                  ? "bg-gray-700 text-yellow-400"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        <div className="p-3 overflow-y-auto max-h-[calc(100vh-200px)]">
          {members.map((member) => (
            <div
              key={member.auth0Id}
              className={`flex items-center p-3 ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
              } rounded-xl transition duration-150 mb-1`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mr-3 text-white">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {member.name}
                </p>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {member.role || "Member"}
                </p>
              </div>
              {member.auth0Id === user?.sub && (
                <span
                  className={`ml-auto text-xs ${
                    isDarkMode
                      ? "bg-indigo-900 text-indigo-300"
                      : "bg-indigo-100 text-indigo-800"
                  } px-2 py-1 rounded-full`}
                >
                  You
                </span>
              )}
            </div>
          ))}
        </div>

        {chatData?.tripId && (
          <div>
            
            <div className="mt-2 space-y-2">
              {groupData.destination && (
                <div
                  className={`flex items-center text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <span className="mr-2">📍</span>
                  <span>{groupData.destination}</span>
                </div>
              )}
              {groupData.date && (
                <div
                  className={`flex items-center text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <span className="mr-2">📅</span>
                  <span>{groupData.date}</span>
                </div>
              )}
              {groupData.budget && (
                <div
                  className={`flex items-center text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <span className="mr-2">💰</span>
                  <span>${groupData.budget}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div
          className={`p-4 border-b ${headerThemeClass} sticky top-0 z-10 shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className={`p-2 rounded-full ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                } transition-colors mr-2 md:hidden`}
                aria-label="Toggle sidebar"
              >
                {isSidebarOpen ? (
                  <ChevronLeft
                    className={`w-5 h-5 ${
                      isDarkMode ? "text-indigo-400" : "text-indigo-600"
                    }`}
                  />
                ) : (
                  <Users
                    className={`w-5 h-5 ${
                      isDarkMode ? "text-indigo-400" : "text-indigo-600"
                    }`}
                  />
                )}
              </button>
              <button
                onClick={handleGoBack}
                className={`p-2 rounded-full ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                } transition-colors mr-3`}
              >
                <ChevronLeft
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                />
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-md"
              >
                {groupData.name.charAt(0).toUpperCase()}
              </button>
              <div>
                <h2
                  className={`font-semibold ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  {groupData.name}
                </h2>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {members.length} members
                  {isConnected ? (
                    <span className="ml-2 inline-flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      Online
                    </span>
                  ) : (
                    <span className="ml-2 inline-flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                      Connecting...
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-3">
              <button
                className={`sm:p-2 p-1 rounded-full ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                } transition-colors`}
              >
                <Phone
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    isDarkMode ? "text-indigo-400" : "text-indigo-600"
                  }`}
                />
              </button>
              <button
                className={`sm:p-2 p-1 rounded-full ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                } transition-colors`}
              >
                <Video
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    isDarkMode ? "text-indigo-400" : "text-indigo-600"
                  }`}
                />
              </button>
              <button
                className={`sm:p-2 p-1 rounded-full ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                } transition-colors sm:block hidden`}
              >
                <Info
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                />
              </button>
              <button
                className={`sm:p-2 p-1 rounded-full ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                } transition-colors`}
                onClick={toggleDarkMode}
              >
                {isDarkMode ? (
                  <span className="text-yellow-400 text-lg">☀️</span>
                ) : (
                  <span className="text-gray-600 text-lg">🌙</span>
                )}
              </button>
              <button
                className={`sm:p-2 p-1 rounded-full ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                } transition-colors`}
              >
                <MoreVertical
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                />
              </button>
            </div>
          </div>

          {groupData.description && (
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              } mt-2 px-1 line-clamp-1`}
            >
              {groupData.description}
            </p>
          )}
        </div>

        <GroupSetting
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          groupData={groupData}
          onUpdateGroup={handleUpdateGroup}
          isDarkMode={isDarkMode}
        />

        {socketError && (
          <div
            className={`${
              isDarkMode
                ? "bg-red-900 border-red-700 text-red-200"
                : "bg-red-50 border-red-500 text-red-700"
            } border-l-4 p-3 mb-2 mx-4 mt-2 rounded-md text-sm`}
          >
            <p>{socketError} - Trying to reconnect...</p>
          </div>
        )}

        {/* Message container */}
        <div
          ref={messageContainerRef}
          className={`flex-1 overflow-y-auto p-4 space-y-3 ${
            isDarkMode ? "bg-gray-900" : "bg-gray-50"
          }`}
        >
          {formattedMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div
                className={`text-center p-6 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } rounded-xl shadow-sm max-w-sm`}
              >
                <div
                  className={`w-16 h-16 ${
                    isDarkMode ? "bg-indigo-900" : "bg-indigo-100"
                  } rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <Users
                    className={`w-8 h-8 ${
                      isDarkMode ? "text-indigo-400" : "text-indigo-600"
                    }`}
                  />
                </div>
                <p
                  className={`font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  No messages yet
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } mt-2`}
                >
                  Start the conversation by sending the first message!
                </p>
              </div>
            </div>
          ) : (
            formattedMessages.map((message, index) => {
              const showAvatar =
                index === 0 ||
                formattedMessages[index - 1].sender !== message.sender;
              const isConsecutive =
                index > 0 &&
                formattedMessages[index - 1].sender === message.sender;

              return (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  } ${isConsecutive ? "mt-1" : "mt-4"}`}
                >
                  {message.sender !== "user" && showAvatar && (
                    <div className="w-8 h-8 rounded-full flex-shrink-0 mr-2 overflow-hidden shadow-md relative">
                      {message.profilePic ? (
                        <img
                          src={message.profilePic}
                          alt={`${message.username}'s profile`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs ${
                          message.profilePic ? "hidden" : "flex"
                        }`}
                        style={{
                          position: message.profilePic
                            ? "absolute"
                            : "relative",
                          top: 0,
                          left: 0,
                        }}
                      >
                        {message.username.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}
                  {message.sender !== "user" && !showAvatar && (
                    <div className="w-8 mr-2 flex-shrink-0"></div>
                  )}
                  <div className="flex flex-col max-w-[70%] sm:max-w-[65%]">
                    {showAvatar && message.sender !== "user" && (
                      <span
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        } mb-1 ml-1`}
                      >
                        {message.username}
                      </span>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 break-words shadow-sm ${
                        message.sender === "user"
                          ? `${messageUserBubble} rounded-br-sm`
                          : `${messageOtherBubble} rounded-bl-sm`
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-[10px] mt-1 text-right ${
                          message.sender === "user"
                            ? "text-indigo-200"
                            : isDarkMode
                            ? "text-gray-400"
                            : "text-gray-400"
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                  {message.sender === "user" && showAvatar && (
                    <div className="w-8 h-8 rounded-full flex-shrink-0 ml-2 overflow-hidden shadow-md relative">
                      {message.profilePic ? (
                        <img
                          src={message.profilePic}
                          alt={`${message.username}'s profile`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs ${
                          message.profilePic ? "hidden" : "flex"
                        }`}
                        style={{
                          position: message.profilePic
                            ? "absolute"
                            : "relative",
                          top: 0,
                          left: 0,
                        }}
                      >
                        {message.username.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}
                  {message.sender === "user" && !showAvatar && (
                    <div className="w-8 ml-2 flex-shrink-0"></div>
                  )}
                </div>
              );
            })
          )}
          {Object.values(typingUsers).length > 0 && (
            <div className="flex items-start">
              <div
                className={`flex items-center space-x-1 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } rounded-2xl p-3 shadow-sm max-w-[60%] ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <div className="flex space-x-1">
                  <span
                    className={`h-2 w-2 ${
                      isDarkMode ? "bg-gray-400" : "bg-gray-400"
                    } rounded-full animate-bounce`}
                  ></span>
                  <span
                    className={`h-2 w-2 ${
                      isDarkMode ? "bg-gray-400" : "bg-gray-400"
                    } rounded-full animate-bounce`}
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className={`h-2 w-2 ${
                      isDarkMode ? "bg-gray-400" : "bg-gray-400"
                    } rounded-full animate-bounce`}
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                </div>
                <span
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } ml-1`}
                >
                  {Object.values(typingUsers).length > 1
                    ? `${Object.values(typingUsers)
                        .slice(0, 2)
                        .join(", ")} and ${
                        Object.values(typingUsers).length - 2
                      } more are typing...`
                    : `${Object.values(typingUsers)[0]} is typing...`}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div
          className={`p-3 sm:p-4 border-t ${headerThemeClass} sticky bottom-0 shadow-lg`}
        >
          <form
            onSubmit={handleSendMessage}
            className="flex items-center space-x-2 sm:space-x-3"
          >
            <div className="hidden md:flex space-x-1">
              <button
                type="button"
                className={`p-2 ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                } rounded-full transition duration-150`}
                onClick={() => setIsClipboardOpen(!isClipboardOpen)}
              >
                <Paperclip className="w-5 h-5 text-gray-500" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-full transition duration-150"
              >
                <Image className="w-5 h-5 text-gray-500" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-full transition duration-150"
              >
                <Smile className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full transition duration-150 md:hidden"
              onClick={() => setIsClipboardOpen(!isClipboardOpen)}
            >
              <Paperclip className="w-5 h-5 text-gray-500" />
            </button>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Write something..."
                className="w-full text-slate-700 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 pl-4 pr-10"
                value={newMessage}
                onChange={handleTyping}
                disabled={sending || !isConnected}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition duration-150 md:hidden"
              >
                <Smile className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <button
              type="submit"
              disabled={sending || !newMessage.trim() || !isConnected}
              className={`p-3 rounded-full transition-colors ${
                sending || !newMessage.trim() || !isConnected
                  ? "bg-indigo-300"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white shadow-md`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          {!isConnected && (
            <p className="text-xs text-red-500 mt-2 text-center">
              Reconnecting to chat server...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
