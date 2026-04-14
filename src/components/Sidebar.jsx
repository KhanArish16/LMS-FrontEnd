import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  MessageSquare,
  BarChart,
  GraduationCap,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    name: "My Courses",
    icon: BookOpen,
    path: "/courses",
  },
  {
    name: "Quizzes",
    icon: FileText,
    path: "/quizzes",
  },
  {
    name: "Messages",
    icon: MessageSquare,
    path: "/messages",
  },
  {
    name: "Analytics",
    icon: BarChart,
    path: "/analytics",
  },
];

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-300 flex flex-col">
      <div className="flex items-center gap-3 p-6 border-b border-gray-300 ">
        <div className="bg-black text-white p-2 rounded-xl">
          <GraduationCap size={25} />
        </div>
        <h1 className="text-xl font-bold">Smart LMS</h1>
      </div>

      <div className="p-6 border-b border-gray-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-semibold bg-gray-300">
            {user?.name?.slice(0, 2).toUpperCase() || "AC"}
          </div>

          <div>
            <p className="font-semibold">{user?.name || "You"}</p>
            <p className="text-sm text-gray-500">{user?.role || "Student"}</p>
          </div>
        </div>
      </div>

      <div className="p-3 flex-1">
        <div className="text-s">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <div
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
