import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  MessageSquare,
  BarChart,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },

  {
    name: "Courses",
    icon: BookOpen,
    path: "/courses",
  },
  {
    name: "Roadmap",
    icon: LayoutDashboard,
    path: "/roadmap",
  },
  {
    name: "Videos",
    icon: LayoutDashboard,
    path: "/videos",
  },
  {
    name: "Quizzes",
    icon: FileText,
    path: "/quizzes",
  },
  {
    name: "Blogs",
    icon: BarChart,
    path: "/blogs",
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

export default function Sidebar({ isSidebar, setIsSidebar }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-300 flex flex-col z-50 transform transition-transform duration-300
  ${isSidebar ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0 md:static`}
    >
      <div className="flex items-center gap-3 p-4 border-b border-gray-300 ">
        <div className="bg-black text-white p-2 rounded-xl">
          <GraduationCap size={25} />
        </div>
        <h1 className="text-xl font-bold">Smart LMS</h1>
        <X
          className="cursor-pointer md:hidden"
          onClick={() => setIsSidebar(false)}
        />
      </div>

      <div className="p-6 border-b border-gray-300">
        <div className="flex items-center gap-3">
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full flex items-center justify-center font-semibold bg-gray-300">
              {user?.name?.slice(0, 2).toUpperCase() || "AC"}
            </div>
          )}

          <div>
            <p className="font-semibold">{user?.name || "You"}</p>
            <p className="text-sm text-gray-500">{user?.role || "Student"}</p>
          </div>
        </div>
      </div>

      <div className="p-3 ">
        <div className="text-sm">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <div
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebar(false);
                }}
                className={`flex items-center mb-1 gap-3 px-3 py-3 rounded-lg cursor-pointer transition ${
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
