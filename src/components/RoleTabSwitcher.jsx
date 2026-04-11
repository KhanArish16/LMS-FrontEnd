import React from "react";

const RoleTabSwitcher = () => {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Role Switcher UI (No logic yet) */}
      <div className="fixed top-4 right-4 z-50">
        <button className="px-4 py-2 bg-white border border-zinc-300 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2">
          Switch Role
        </button>
      </div>

      <div className="p-6 space-y-6">
        <Auth />
        <StudentDashboard />
        <InstructorDashboard />
      </div>
    </div>
  );
};

export default RoleTabSwitcher;
