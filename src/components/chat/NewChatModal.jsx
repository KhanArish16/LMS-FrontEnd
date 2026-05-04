import { useEffect, useState } from "react";
import API from "../../services/api";

const MAX_VISIBLE = 15;

export default function NewChatModal({ onClose, user, refresh, setSelected }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [starting, setStarting] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [usersRes, convRes] = await Promise.all([
        API.get("/users"),
        API.get("/messages/conversations"),
      ]);

      const allUsers = usersRes.data.data || [];
      const conversations = convRes.data.data || [];

      const existingUserIds = conversations.map((c) => {
        const other = c.members.find((m) => String(m._id) !== String(user._id));
        return String(other?._id);
      });

      const filtered = allUsers.filter(
        (u) =>
          String(u._id) !== String(user._id) &&
          !existingUserIds.includes(String(u._id)),
      );

      setUsers(filtered);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const startChat = async (otherUser) => {
    try {
      setStarting(otherUser._id);
      await API.post("/messages", { receiverId: otherUser._id, text: "Hi 👋" });
      await refresh();
      const convRes = await API.get("/messages/conversations");
      const conv = convRes.data.data.find((c) =>
        c.members.some((m) => m._id === otherUser._id),
      );
      setSelected(conv);
      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      setStarting(null);
    }
  };

  const needsSearch = users.length > MAX_VISIBLE;

  const displayedUsers = needsSearch
    ? users.filter(
        (u) =>
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase()),
      )
    : users;

  const colors = [
    "from-blue-400 to-blue-600",
    "from-violet-400 to-violet-600",
    "from-emerald-400 to-emerald-600",
    "from-rose-400 to-rose-600",
    "from-amber-400 to-amber-600",
    "from-cyan-400 to-cyan-600",
  ];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl shadow-gray-200/80 flex flex-col max-h-[85vh] overflow-hidden border border-gray-100">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-gray-900 font-semibold text-base">
              New Conversation
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">
              {users.length} {users.length === 1 ? "person" : "people"}{" "}
              available
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {needsSearch && (
          <div className="px-5 pt-4 pb-2">
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
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 text-sm rounded-lg pl-9 pr-3 py-2.5 outline-none border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto py-2 px-3">
          {loading ? (
            <div className="flex items-center justify-center h-36">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : displayedUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-36 gap-2">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-400">
                {needsSearch && search
                  ? "No users match your search"
                  : "No new users available"}
              </p>
            </div>
          ) : (
            displayedUsers.map((u) => {
              const initials = u.name?.slice(0, 2).toUpperCase() || "?";
              const colorIdx = (u.name?.charCodeAt(0) || 0) % colors.length;
              const isStarting = starting === u._id;

              return (
                <button
                  key={u._id}
                  onClick={() => startChat(u)}
                  disabled={!!starting}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60 text-left group"
                >
                  {u.profilePic ? (
                    <img
                      src={u.profilePic}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-full bg-linear-to-br ${colors[colorIdx]} flex items-center justify-center shrink-0 shadow-sm`}
                    >
                      <span className="text-white text-xs font-semibold">
                        {initials}
                      </span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-sm font-semibold truncate">
                      {u.name}
                    </p>
                    <p className="text-gray-400 text-xs truncate">{u.email}</p>
                  </div>

                  <div className="shrink-0">
                    {isStarting ? (
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Message
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="px-5 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
