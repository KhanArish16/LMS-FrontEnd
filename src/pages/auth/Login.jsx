import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Command } from "lucide-react";
import Left from "./Left";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleLogin = useCallback(async () => {
    if (!form.email || !form.password)
      return setError("Email and password are required");
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }, [form, login, navigate]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter") handleLogin();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleLogin]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row ">
      <div className="hidden md:flex md:w-1/2">
        <Left />
      </div>

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 min-h-screen md:min-h-0 bg-gray-50 px-6 md:px-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8 md:hidden">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-lg">🎓</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-gray-400 mb-7">
            Sign in to continue your learning journey
          </p>
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}
          <div className="mb-4">
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
          <div className="mb-4">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
              Password
            </label>
            <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl px-3 py-3 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
              <Lock size={14} className="text-gray-400 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-transparent outline-none text-sm text-gray-800 w-full placeholder:text-gray-400 font-medium"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="current-password"
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
          =
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setRemember((v) => !v)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  remember ? "bg-blue-600 border-blue-600" : "border-gray-300"
                }`}
              >
                {remember && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path
                      d="M1 3.5L3.5 6L8 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="text-xs text-gray-600 font-medium">
                Remember me
              </span>
            </label>
            <button className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              Forgot password?
            </button>
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-blue-200"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight size={14} />
              </>
            )}
          </button>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <span className="text-[10px] text-gray-400">Press</span>
            <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-bold text-gray-500">
              Enter ↵
            </kbd>
            <span className="text-[10px] text-gray-400">to sign in</span>
          </div>
          <p className="text-center text-xs text-gray-500 mt-5">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
