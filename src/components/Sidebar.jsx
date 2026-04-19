import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  MessageSquare,
  BarChart2,
  GraduationCap,
  Map,
  Video,
  X,
  LogOut,
  Settings,
} from "lucide-react";

const menuGroups = [
  {
    label: "Learn",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/" },
      { name: "Courses", icon: BookOpen, path: "/courses" },
      { name: "Roadmap", icon: Map, path: "/roadmap" },
      { name: "Videos", icon: Video, path: "/videos" },
    ],
  },
  {
    label: "Practice",
    items: [
      { name: "Quizzes", icon: FileText, path: "/quizzes" },
      { name: "Blogs", icon: BookOpen, path: "/blogs" },
    ],
  },
  {
    label: "Insights",
    items: [
      { name: "Messages", icon: MessageSquare, path: "/messages" },
      { name: "Analytics", icon: BarChart2, path: "/analytics" },
    ],
  },
];

const groupAccent = {
  Learn: {
    label: "text-blue-500",
    icon: "bg-blue-50 text-blue-500",
    active: "bg-blue-50 text-blue-700",
    bar: "bg-blue-500",
  },
  Practice: {
    label: "text-emerald-600",
    icon: "bg-emerald-50 text-emerald-600",
    active: "bg-emerald-50 text-emerald-700",
    bar: "bg-emerald-500",
  },
  Insights: {
    label: "text-amber-600",
    icon: "bg-amber-50 text-amber-600",
    active: "bg-amber-50 text-amber-700",
    bar: "bg-amber-500",
  },
};

function getAccentForPath(path) {
  for (const group of menuGroups) {
    if (group.items.some((i) => i.path === path))
      return groupAccent[group.label];
  }
  return groupAccent.Learn;
}

export default function Sidebar({ isSidebar, setIsSidebar }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const initials = user?.name?.slice(0, 2).toUpperCase() || "AC";

  const go = (path) => {
    navigate(path);
    setIsSidebar(false);
  };

  return (
    <>
      {isSidebar && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebar(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 z-50 flex flex-col
          bg-white border-r border-gray-100
          transform transition-transform duration-300 ease-in-out
          ${isSidebar ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:h-screen
        `}
      >
        <div className="flex items-center justify-between px-5 py-4.5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-gray-900">
              Smart<span className="text-blue-500">LMS</span>
            </span>
          </div>
          <button
            onClick={() => setIsSidebar(false)}
            className="md:hidden w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={13} className="text-gray-500" />
          </button>
        </div>

        <div className="px-4 py-3.5 border-b border-gray-100">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-gray-50 border border-gray-100">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-9 h-9 rounded-xl object-cover shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs bg-linear-to-br from-blue-500 to-indigo-600 text-white shrink-0 shadow-md shadow-blue-200">
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 leading-tight truncate">
                {user?.name || "You"}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                {user?.role || "Student"}
              </p>
            </div>
            <button className="shrink-0 w-6 h-6 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors">
              <Settings
                size={13}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              />
            </button>
          </div>
        </div>

        <nav
          className="flex-1 py-3 px-3 space-y-4 overflow-y-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`nav::-webkit-scrollbar { display: none; }`}</style>

          {menuGroups.map((group) => {
            const accent = groupAccent[group.label];
            return (
              <div key={group.label}>
                <p
                  className={`text-[10px] font-bold uppercase tracking-widest px-3 mb-1.5 ${accent.label}`}
                >
                  {group.label}
                </p>

                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <button
                        key={item.name}
                        onClick={() => go(item.path)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                          transition-all duration-150 text-left relative group
                          ${
                            isActive
                              ? accent.active
                              : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                          }
                        `}
                      >
                        {isActive && (
                          <span
                            className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-5 rounded-r-full ${accent.bar}`}
                          />
                        )}

                        <span
                          className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                            isActive
                              ? accent.icon
                              : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600"
                          }`}
                        >
                          <Icon size={14} />
                        </span>

                        <span className="flex-1">{item.name}</span>

                        {item.name === "Messages" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150 group">
            <span className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-red-100 flex items-center justify-center transition-colors shrink-0">
              <LogOut size={13} />
            </span>
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
