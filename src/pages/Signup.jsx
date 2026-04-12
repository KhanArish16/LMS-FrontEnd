import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");

  const handleSignup = async () => {
    await signup(name, email, password, role);
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Signup</h1>

      <input
        className="border p-2 m-2"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-2 m-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 m-2"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <select
        className="border p-2 m-2"
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="STUDENT">Student</option>
        <option value="INSTRUCTOR">Instructor</option>
      </select>

      <button
        className="bg-green-500 text-white px-4 py-2"
        onClick={handleSignup}
      >
        Signup
      </button>
    </div>
  );
}
