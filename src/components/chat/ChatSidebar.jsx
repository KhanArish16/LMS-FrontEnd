import { useState } from "react";
import NewChatModal from "./NewChatModal";

export default function ChatSidebar({
  conversations,
  setSelected,
  user,
  refresh,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) => {
    const other = c.members.find((m) => m._id !== user._id);
    return other?.name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900 font-semibold text-lg">Messages</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {conversations.length} conversations
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition-colors shadow-sm shadow-blue-200"
            title="New chat"
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
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>New</span>
          </button>
        </div>

        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages..."
            className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 text-sm rounded-lg pl-9 pr-3 py-2.5 outline-none border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-400">
            <svg
              className="w-8 h-8 text-gray-200"
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
            <p className="text-xs text-gray-400">No conversations yet</p>
            <button
              onClick={() => setOpen(true)}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Start one →
            </button>
          </div>
        ) : (
          filtered.map((c) => {
            const other = c.members.find((m) => m._id !== user._id);
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
              <button
                key={c._id}
                onClick={() => setSelected(c)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
              >
                <div className="relative shrink-0">
                  {other?.profilePic ? (
                    <img
                      src={other.profilePic}
                      alt={other.name}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-11 h-11 rounded-full bg-linear-to-br ${colors[colorIdx]} flex items-center justify-center shadow-sm`}
                    >
                      <span className="text-white text-xs font-semibold">
                        {initials}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-sm font-semibold truncate">
                    {other?.name}
                  </p>
                  <p className="text-gray-400 text-xs truncate mt-0.5">
                    {c.lastMessage || "No messages yet"}
                  </p>
                </div>

                <svg
                  className="w-4 h-4 text-gray-300 group-hover:text-gray-400 shrink-0 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            );
          })
        )}
      </div>

      {open && (
        <NewChatModal
          onClose={() => setOpen(false)}
          user={user}
          refresh={refresh}
          setSelected={setSelected}
        />
      )}
    </div>
  );
}
