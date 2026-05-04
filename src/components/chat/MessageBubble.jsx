export default function MessageBubble({ message, user }) {
  const isMe = message.sender._id === user._id;

  return (
    <div
      className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
    >
      {!isMe && (
        <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0 mb-0.5 shadow-sm">
          <span className="text-white text-[10px] font-semibold">
            {message.sender?.name?.slice(0, 2).toUpperCase() || "?"}
          </span>
        </div>
      )}

      <div
        className={`
          max-w-[72%] sm:max-w-sm px-4 py-2.5 rounded-2xl text-sm leading-relaxed
          ${
            isMe
              ? "bg-blue-600 text-white rounded-br-sm shadow-sm shadow-blue-200"
              : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"
          }
        `}
      >
        {message.text}
      </div>
    </div>
  );
}
