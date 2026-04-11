import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import AuthLayout from "./AuthLayout";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
  });

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-zinc-900 tracking-tight mb-2">
          {isLogin ? "Welcome back" : "Create account"}
        </h2>
        <p className="text-zinc-500">
          {isLogin
            ? "Sign in to access your dashboard"
            : "Start your learning journey today"}
        </p>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        {/* Role Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 ml-1">
            I am a
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "student" })}
              className={`p-4 rounded-xl border-2 transition-all text-center flex flex-col items-center justify-center ${
                formData.role === "student"
                  ? "border-zinc-900 bg-zinc-50 shadow-sm"
                  : "border-zinc-100 bg-white hover:border-zinc-200"
              }`}
            >
              <p className="font-bold text-zinc-900">Student</p>
              <p className="text-[11px] text-zinc-500 mt-1">Learn new skills</p>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "instructor" })}
              className={`p-4 rounded-xl border-2 transition-all text-center flex flex-col items-center justify-center ${
                formData.role === "instructor"
                  ? "border-zinc-900 bg-zinc-50 shadow-sm"
                  : "border-zinc-100 bg-white hover:border-zinc-200"
              }`}
            >
              <p className="font-bold text-zinc-900">Instructor</p>
              <p className="text-[11px] text-zinc-500 mt-1">Teach courses</p>
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700 ml-1">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold shadow-xl shadow-zinc-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {isLogin ? "Sign In" : "Create Account"}
          {isLogin ? (
            <ArrowRight className="w-5 h-5" />
          ) : (
            <UserPlus className="w-5 h-5" />
          )}
        </button>

        {/* Toggle Mode Link - Updated to match your request */}
        <p className="text-center text-zinc-500 text-sm pt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-black font-semibold hover:underline underline-offset-4"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}
