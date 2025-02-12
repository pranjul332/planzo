import React, { useState } from "react";
import { User, Send, Paperclip, Image, Smile, X, Phone } from "lucide-react";
import Menu from "./Menu";

const Chat = () => {
  const [isClipboardOpen, setIsClipboardOpen] = useState(false);
  const messages = [
    {
      id: 1,
      sender: "user",
      username: "You",
      text: "Hello! How are you?",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "other",
      username: "John Doe",
      text: "Hi! I am doing great, thanks for asking!",
      time: "10:31 AM",
    },
    {
      id: 3,
      sender: "user",
      username: "You",
      text: "That is wonderful to hear!",
      time: "10:32 AM",
    },
    {
      id: 4,
      sender: "other",
      username: "John Doe",
      text: "How has your day been so far?",
      time: "10:33 AM",
    },
    {
      id: 5,
      sender: "user",
      username: "You",
      text: "Pretty good! Working on some new projects.",
      time: "10:34 AM",
    },
    // Adding more messages to demonstrate scrolling
    ...Array.from({ length: 10 }, (_, i) => ({
      id: i + 6,
      sender: i % 2 === 0 ? "user" : "other",
      username: i % 2 === 0 ? "You" : "John Doe",
      text: `Message ${
        i + 6
      } - This is a longer message to demonstrate the scrolling functionality.`,
      time: "10:35 AM",
    })),
  ];

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
              aria-label="Close"
            >
              <X className="size-5 text-black" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col relative">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center group">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-500" />
            </div>
            <div className="ml-3 flex-1">
              <h2 className="font-semibold">Chat Recipient</h2>
              <p className="text-sm text-gray-500">Online</p>
            </div>
            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-full mr-2"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <Phone className="w-6 h-6 text-gray-500" />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {messages.map((message) => (
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
                className={`min-w-[70px] max-w-[40%] md:max-w-[30%] right-0 rounded-lg p-3 break-words  ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-[10px] mt-1 opacity-75">{message.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-white sticky bottom-0">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={() => setIsClipboardOpen(!isClipboardOpen)}
              >
                <Paperclip className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Image className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Smile className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Write something..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
