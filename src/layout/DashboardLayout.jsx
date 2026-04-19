import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }) {
  const [isSidebar, setIsSidebar] = useState(false);
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar isSidebar={isSidebar} setIsSidebar={setIsSidebar} />

      <div className="flex-1 flex flex-col bg-gray-50 relative">
        <div className="md:hidden fixed top-4 left-4 z-50 ">
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

        <div className="flex-1 overflow-y-auto p-2.5 pt-16 md:p-4 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
