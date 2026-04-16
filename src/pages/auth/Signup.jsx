import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import Left from "./Left";

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
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return setError("All fields are required");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await signup(form.name, form.email, form.password, form.role);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="h-screen flex">
      <Left />

      <div className="flex justify-center items-center w-full md:w-1/2 bg-gray-50">
        <div className="w-105">
          <h1 className="text-3xl font-bold text-center mb-2">
            Create account
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Start your learning journey today
          </p>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <div className="mb-6">
            <p className="text-sm mb-2">I am a</p>

            <div className="flex gap-3">
              <button
                onClick={() => setForm({ ...form, role: "STUDENT" })}
                className={`flex-1 p-4 border rounded-xl ${
                  form.role === "STUDENT" ? "border-black" : "border-gray-300"
                }`}
              >
                <p className="font-semibold">Student</p>
                <p className="text-sm text-gray-500">Learn new skills</p>
              </button>

              <button
                onClick={() => setForm({ ...form, role: "INSTRUCTOR" })}
                className={`flex-1 p-4 border rounded-xl ${
                  form.role === "INSTRUCTOR"
                    ? "border-black"
                    : "border-gray-300"
                }`}
              >
                <p className="font-semibold">Instructor</p>
                <p className="text-sm text-gray-500">Teach courses</p>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm">Full Name</label>

            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />

              <input
                className="w-full border pl-10 p-3 rounded-lg mt-1"
                placeholder="John Doe"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm">Email Address</label>

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />

              <input
                className="w-full border pl-10 p-3 rounded-lg mt-1"
                placeholder="you@example.com"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm">Password</label>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

              <input
                type={showPassword ? "text" : "password"}
                className="w-full border pl-10 p-3 rounded-lg mt-1"
                placeholder="••••••••"
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />

              <span
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm">Confirm Password</label>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

              <input
                type="password"
                className="w-full border pl-10 p-3 rounded-lg mt-1"
                placeholder="••••••••"
                onChange={(e) =>
                  setForm({
                    ...form,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <button
            onClick={handleSignup}
            className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90"
          >
            Create Account
          </button>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
