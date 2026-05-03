import { useEffect, useState } from "react";
import API from "../../services/api";

export default function NewChatModal({ onClose, user, refresh, setSelected }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

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
      await API.post("/messages", {
        receiverId: otherUser._id,
        text: "Hi 👋",
      });

      await refresh();

      const convRes = await API.get("/messages/conversations");

      const conv = convRes.data.data.find((c) =>
        c.members.some((m) => m._id === otherUser._id),
      );

      setSelected(conv);
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-96 rounded-xl shadow-lg p-4">
        <h2 className="font-bold text-lg mb-4">Start New Chat</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-500">No new users available</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {users.map((u) => (
              <div
                key={u._id}
                onClick={() => startChat(u)}
                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                {u.profilePic ? (
                  <img
                    src={u.profilePic}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {u.name?.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}

                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-200 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}
