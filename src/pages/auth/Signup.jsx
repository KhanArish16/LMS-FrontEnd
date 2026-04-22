import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  GraduationCap,
  Presentation,
} from "lucide-react";
import Left from "./Left";

const roles = [
  {
    value: "STUDENT",
    label: "Student",
    sub: "Learn new skills",
    icon: GraduationCap,
    color: "border-blue-500 bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    value: "INSTRUCTOR",
    label: "Instructor",
    sub: "Teach courses",
    icon: Presentation,
    color: "border-indigo-500 bg-indigo-50",
    iconColor: "text-indigo-600",
  },
];

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = useCallback(async () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword)
      return setError("All fields are required");
    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters");

    setError("");
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password, form.role);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [form, signup, navigate]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter") handleSignup();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSignup]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row ">
      <div className="hidden md:flex md:w-1/2">
        <Left />
      </div>

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 min-h-screen md:min-h-0 bg-gray-50 px-6 md:px-10 py-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8 md:hidden">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            Create account
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            Start your learning journey today
          </p>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}

          <div className="mb-5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
              I am a
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map(
                ({ value, label, sub, icon: Icon, color, iconColor }) => {
                  const isActive = form.role === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm({ ...form, role: value })}
                      className={`flex items-center gap-3 p-3.5 border-2 rounded-2xl text-left transition-all ${
                        isActive
                          ? color
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive ? "bg-white/70" : "bg-gray-100"
                        }`}
                      >
                        <Icon
                          size={15}
                          className={isActive ? iconColor : "text-gray-400"}
                        />
                      </span>
                      <div>
                        <p
                          className={`text-sm font-bold leading-tight ${isActive ? "text-gray-900" : "text-gray-600"}`}
                        >
                          {label}
                        </p>
                        <p
                          className={`text-[10px] mt-0.5 ${isActive ? "text-gray-500" : "text-gray-400"}`}
                        >
                          {sub}
                        </p>
                      </div>
                    </button>
                  );
                },
              )}
            </div>
          </div>

          <div className="mb-3.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
              Full Name
            </label>
            <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl px-3 py-3 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
              <User size={14} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="John Doe"
                className="bg-transparent outline-none text-sm text-gray-800 w-full placeholder:text-gray-400 font-medium"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoComplete="name"
              />
            </div>
          </div>

          <div className="mb-3.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
              Email Address
            </label>
            <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl px-3 py-3 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
              <Mail size={14} className="text-gray-400 shrink-0" />
              <input
                type="email"
                placeholder="you@example.com"
                className="bg-transparent outline-none text-sm text-gray-800 w-full placeholder:text-gray-400 font-medium"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="mb-3.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
              Password
            </label>
            <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl px-3 py-3 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
              <Lock size={14} className="text-gray-400 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                className="bg-transparent outline-none text-sm text-gray-800 w-full placeholder:text-gray-400 font-medium"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
              Confirm Password
            </label>
            <div
              className={`flex items-center gap-2.5 bg-white border rounded-xl px-3 py-3 focus-within:ring-2 transition-all ${
                form.confirmPassword && form.password !== form.confirmPassword
                  ? "border-red-300 focus-within:ring-red-50"
                  : "border-gray-200 focus-within:border-blue-300 focus-within:ring-blue-50"
              }`}
            >
              <Lock size={14} className="text-gray-400 shrink-0" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-transparent outline-none text-sm text-gray-800 w-full placeholder:text-gray-400 font-medium"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              >
                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {form.confirmPassword && (
              <p
                className={`text-[10px] mt-1 font-semibold ${
                  form.password === form.confirmPassword
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >
                {form.password === form.confirmPassword
                  ? "✔ Passwords match"
                  : "✘ Passwords don't match"}
              </p>
            )}
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-blue-200"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Create Account <ArrowRight size={14} />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 mt-3">
            <span className="text-[10px] text-gray-400">Press</span>
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-bold text-gray-500">
              Enter ↵
            </kbd>
            <span className="text-[10px] text-gray-400">to create account</span>
          </div>

          <p className="text-center text-xs text-gray-500 mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
