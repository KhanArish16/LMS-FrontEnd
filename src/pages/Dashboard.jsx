import React from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import InstructorDashboard from "./InstructorDashboard";
import StudentDashboard from "./StudentDashboard";

function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;

  return user.role === "INSTRUCTOR" ? (
    <InstructorDashboard />
  ) : (
    <StudentDashboard />
  );
}

export default Dashboard;
