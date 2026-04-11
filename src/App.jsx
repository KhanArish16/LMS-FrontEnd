import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// 1. Changed the import name to AuthPage to match your usage below
import AuthPage from "./pages/Auth/AuthPage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 2. Fixed Navigate path to match the route path "/auth" */}
        <Route path="/" element={<Navigate to="/auth" replace />} />

        {/* 3. Now AuthPage is correctly defined */}
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-white text-zinc-900 font-medium">
              404 | Page Not Found
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
