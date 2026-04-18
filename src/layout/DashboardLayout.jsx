import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }) {
  const [isSidebar, setIsSidebar] = useState(false);
  return (
    <div className="flex relative">
      <Sidebar isSidebar={isSidebar} setIsSidebar={setIsSidebar} />

      <div className="flex-1 bg-gray-50 min-h-screen">
        <div className="md:hidden fixed top-4 left-4 z-50">
          <div
            className={`p-2 bg-white/80 backdrop-blur-md rounded-lg border border-gray-200 shadow-sm  ${isSidebar ? "hidden" : "block"}`}
          >
            <Menu
              size={24}
              className="cursor-pointer text-gray-700"
              onClick={() => setIsSidebar(true)}
            />
          </div>
        </div>

        <div className="p-2.5 pt-16 md:p-4 lg:p-6">{children}</div>
      </div>
    </div>
  );
}
