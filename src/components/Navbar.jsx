import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <div className="flex justify-between items-center p-4 bg-white border-b border-gray-300">
      <h2 className="text-lg font-semibold">Dashboard</h2>

      <div className="flex items-center gap-3">
        <img
          src={user?.profilePic || "https://via.placeholder.com/40"}
          className="w-10 h-10 rounded-full"
        />
        <span>{user?.name}</span>
      </div>
    </div>
  );
}
