import React, { useState } from "react";
import { X, Send } from "lucide-react";

const Chat = ({ visible, onClose, messages, userType, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md h-96 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold" style={{ color: "#373737" }}>
            Chat
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === userType ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  message.type === "teacher" ? "bg-purple-100" : "bg-blue-100"
                }`}
              >
                <div
                  className="text-xs font-medium mb-1"
                  style={{ color: "#6E6E6E" }}
                >
                  {message.sender}
                </div>
                <div style={{ color: "#373737" }}>{message.text}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:outline-none"
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="p-2 rounded-lg text-white"
              style={{ backgroundColor: "#7765DA" }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
