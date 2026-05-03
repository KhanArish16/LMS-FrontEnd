import { useState } from "react";
import NewChatModal from "./NewChatModal";

export default function ChatSidebar({
  conversations,
  setSelected,
  user,
  refresh,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-80 border-r p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold">Messages</h2>

        <button
          onClick={() => setOpen(true)}
          className="bg-black text-white px-3 py-1 rounded"
        >
          +
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {conversations.map((c) => {
          const other = c.members.find((m) => m._id !== user._id);

          return (
            <div
              key={c._id}
              onClick={() => setSelected(c)}
              className="p-3 rounded cursor-pointer hover:bg-gray-100"
            >
              <p className="font-semibold">{other?.name}</p>
              <p className="text-xs text-gray-500 truncate">{c.lastMessage}</p>
            </div>
          );
        })}
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
