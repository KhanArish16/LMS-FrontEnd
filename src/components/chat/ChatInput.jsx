import { useState } from "react";
import { socket } from "../../services/socket";

export default function ChatInput({ selected, user, setMessages }) {
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text.trim()) return;

    const receiver = selected.members.find((m) => m._id !== user._id);

    socket.emit("sendMessage", {
      senderId: user._id,
      receiverId: receiver._id,
      text,
    });

    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="px-5 py-4 border-t border-gray-100 bg-white shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-sm outline-none"
            placeholder="Type a message..."
          />
        </div>

        <button
          onClick={sendMessage}
          disabled={!text.trim()}
          className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors shadow-sm shadow-blue-200 shrink-0"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
