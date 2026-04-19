import React from "react";
import { useAuth } from "../context/AuthContext";
import InstructorAnalytics from "./InstructorAnalytics";
import StudentAnalytics from "./StudentAnalytics";

function Analytics() {
  const { user } = useAuth();
  return user.role === "INSTRUCTOR" ? (
    <InstructorAnalytics />
  ) : (
    <StudentAnalytics />
  );
}

export default Analytics;
