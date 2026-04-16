import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import Left from "./Left";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "STUDENT",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    await login(form.email, form.password);
    navigate("/");
  };

  return (
    <div className="h-screen flex">
      <Left />

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-gray-50">
        <div className="w-105">
          <h1 className="text-3xl font-bold text-center mb-2">Welcome back</h1>
          <p className="text-center text-gray-500 mb-6">
            Sign in to continue your learning journey
          </p>

          <div className="mb-4">
            <label className="text-sm">Email Address</label>
            <input
              className="w-full border p-3 rounded-lg mt-1"
              placeholder="you@example.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="text-sm">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border p-3 rounded-lg mt-1"
                placeholder="••••••••"
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />

              <span
                className="absolute right-3 top-4 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          <div className="flex justify-between text-sm mb-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember me
            </label>

            <button className="text-gray-600">Forgot password?</button>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90"
          >
            Sign In
          </button>

          <p className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <button onClick={() => navigate("/signup")}>
              <span className="font-semibold cursor-pointer">Sign up</span>
            </button>
          </p>

          <div className="flex items-center gap-2 my-6">
            <hr className="flex-1" />
            <span className="text-sm text-gray-400">Or continue with</span>
            <hr className="flex-1" />
          </div>

          <div className="flex gap-3">
            <button className="flex-1 border p-3 rounded-lg">Google</button>

            <button className="flex-1 border p-3 rounded-lg">GitHub</button>
          </div>
        </div>
      </div>
    </div>
  );
}
