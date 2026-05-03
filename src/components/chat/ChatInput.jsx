import { useState } from "react";
import { socket } from "../../services/socket";

export default function ChatInput({ selected, user }) {
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text) return;

    const receiver = selected.members.find((m) => m._id !== user._id);

    socket.emit("sendMessage", {
      senderId: user._id,
      receiverId: receiver._id,
      text,
    });

    setText("");
  };

  return (
    <div className="p-4 border-t flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border px-3 py-2 rounded"
        placeholder="Type a message..."
      />

      <button
        onClick={sendMessage}
        className="bg-black text-white px-4 rounded"
      >
        Send
      </button>
    </div>
  );
}
