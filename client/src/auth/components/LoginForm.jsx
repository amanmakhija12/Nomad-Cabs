import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-toastify";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8080/api/v1";

  const validate = () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("Email and password required", { theme: "dark" });
      return false;
    }
    const emailOk = /.+@.+\..+/.test(formData.email.trim());
    if (!emailOk) {
      toast.error("Invalid email format", { theme: "dark" });
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 chars", { theme: "dark" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      setLoading(true);
    
      const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const loginData = await loginRes.json();
      
      if (!loginRes.ok) {
        throw new Error(loginData.message || "Login failed");
      }
      
      const token = loginData.token;
      
      if (!token) {
        throw new Error("No token received");
      }
      

      const userRes = await fetch(`${BASE_URL}/users/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      const userData = await userRes.json();
      
      if (!userRes.ok) {
        throw new Error(userData.message || "Failed to fetch user data");
      }
      
      setAuth(userData, token);
      
      toast.success("Login successful", { theme: "dark" });
      
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message, { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form
      className="flex gap-3 flex-col mt-5 min-w-100"
      onSubmit={handleSubmit}
      noValidate
    >
      <input
        type="email"
        placeholder="Enter email"
        className="w-full p-2 border text-white rounded-md mb-2 bg-transparent"
        value={formData.email}
        name="email"
        onChange={handleChange}
      />
      <input
        type="password"
        placeholder="Enter password"
        className="w-full p-2 border text-white rounded-md bg-transparent"
        value={formData.password}
        name="password"
        onChange={handleChange}
      />
      <button
        type="submit"
        disabled={loading}
        className="primary-btn-nav mt-5 flex justify-center items-center w-50 disabled:opacity-60"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;