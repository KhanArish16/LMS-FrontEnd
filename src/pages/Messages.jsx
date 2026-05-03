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

    socket.on("connect", () => {
      console.log("✅ Connected to socket:", socket.id);
    });

    socket.emit("join", user._id);

    fetchConversations();

    socket.on("conversationUpdated", fetchConversations);

    return () => {
      socket.off("conversationUpdated", fetchConversations);
    };
  }, [user?._id, fetchConversations]);

  return (
    <div className="flex h-[calc(100vh-60px)]">
      <ChatSidebar
        conversations={conversations}
        setSelected={setSelected}
        user={user}
        refresh={fetchConversations}
      />

      {!selected ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Start a chat with someone
        </div>
      ) : (
        <ChatWindow selected={selected} user={user} />
      )}
    </div>
  );
}
