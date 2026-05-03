import { useEffect, useState } from "react";
import API from "../../services/api";
import { socket } from "../../services/socket";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

export default function ChatWindow({ selected, user }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!selected) return;
    fetchMessages();
  }, [selected]);

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
      <div className="flex-1 flex items-center justify-center">
        Select a conversation
      </div>
    );
  }

  const other = selected.members.find((m) => m._id !== user._id);

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b font-semibold">{other?.name}</div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <MessageBubble key={m._id} message={m} user={user} />
        ))}
      </div>

      <ChatInput selected={selected} user={user} setMessages={setMessages} />
    </div>
  );
}
