import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await API.get("/users/me");
      setUser(res.data.data);
    } catch (err) {
      console.log("Auth error:", err.message);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);

    await fetchUser();
  };

  const signup = async (name, email, password, role) => {
    const res = await API.post("/auth/signup", {
      name,
      email,
      password,
      role,
    });

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        refreshUser: fetchUser,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
