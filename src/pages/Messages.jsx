import { useEffect, useState, useCallback } from "react";
import { socket } from "../services/socket";
import { useAuth } from "../context/AuthContext";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import API from "../services/api";

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchConversations = useCallback(async () => {
    const res = await API.get("/messages/conversations");
    setConversations(res.data.data || []);
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    if (!socket.connected) socket.connect();
    socket.on("connect", () =>
      console.log("✅ Connected to socket:", socket.id),
    );
    socket.emit("join", user._id);
    fetchConversations();
    socket.on("conversationUpdated", fetchConversations);
    return () => socket.off("conversationUpdated", fetchConversations);
  }, [user?._id, fetchConversations]);

  const handleSelect = (conv) => {
    setSelected(conv);
  };

  const handleBack = () => {
    setSelected(null);
  };

  return (
    <div className="flex h-[calc(100vh-60px)] bg-gray-50 overflow-hidden">
      <div
        className={`
          ${selected ? "hidden" : "flex"} md:flex
          w-full md:w-80 lg:w-96
          flex-col shrink-0
          border-r border-gray-200 bg-white
        `}
      >
        <ChatSidebar
          conversations={conversations}
          setSelected={handleSelect}
          user={user}
          refresh={fetchConversations}
        />
      </div>

      <div
        className={`
          ${selected ? "flex" : "hidden"} md:flex
          flex-1 flex-col min-w-0
        `}
      >
        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-300"
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
            <p className="text-sm font-medium text-gray-500">
              Select a conversation
            </p>
          </div>
        ) : (
          <ChatWindow selected={selected} user={user} onBack={handleBack} />
        )}
      </div>
    </div>
  );
}
