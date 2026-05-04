import { useEffect, useRef, useState } from "react";
import API from "../../services/api";
import { socket } from "../../services/socket";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

export default function ChatWindow({ selected, user, onBack }) {
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!selected) return;
    fetchMessages();
  }, [selected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    const res = await API.get(`/messages/${selected._id}`);
    setMessages(res.data.data);
  };

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (msg.conversationId === selected?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => socket.off("receiveMessage");
  }, [selected]);

  if (!selected) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Select a conversation
      </div>
    );
  }

  const other = selected.members.find((m) => m._id !== user._id);
  const initials = other?.name?.slice(0, 2).toUpperCase() || "??";

  const colors = [
    "from-blue-400 to-blue-600",
    "from-violet-400 to-violet-600",
    "from-emerald-400 to-emerald-600",
    "from-rose-400 to-rose-600",
    "from-amber-400 to-amber-600",
    "from-cyan-400 to-cyan-600",
  ];
  const colorIdx = (other?.name?.charCodeAt(0) || 0) % colors.length;

  return (
    <div className="flex-1 flex flex-col h-full bg-white min-w-0">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 bg-white shrink-0">
        <button
          onClick={onBack}
          className="md:hidden text-gray-400 hover:text-gray-600 transition-colors p-1 -ml-1 rounded-lg hover:bg-gray-100"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {other?.profilePic ? (
          <img
            src={other.profilePic}
            alt={other.name}
            className="w-9 h-9 rounded-full object-cover shrink-0"
          />
        ) : (
          <div
            className={`w-9 h-9 rounded-full bg-linear-to-br ${colors[colorIdx]} flex items-center justify-center shrink-0 shadow-sm`}
          >
            <span className="text-white text-xs font-semibold">{initials}</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-gray-900 text-sm font-semibold truncate">
            {other?.name}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            <p className="text-gray-400 text-xs">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
              <svg
                className="w-6 h-6 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-sm">No messages yet. Say hi! 👋</p>
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble key={m._id} message={m} user={user} />
        ))}
        <div ref={bottomRef} />
      </div>

      <ChatInput selected={selected} user={user} setMessages={setMessages} />
    </div>
  );
}
