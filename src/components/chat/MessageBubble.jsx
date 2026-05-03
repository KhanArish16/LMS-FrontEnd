export default function MessageBubble({ message, user }) {
  const isMe = message.sender._id === user._id;

  return (
    <div
      className={`max-w-xs p-2 rounded text-sm ${
        isMe ? "bg-blue-500 text-white ml-auto" : "bg-gray-200"
      }`}
    >
      {message.text}
    </div>
  );
}
