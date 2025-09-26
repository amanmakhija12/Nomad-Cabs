import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-toastify";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);

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
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      setUser(data.user);
      toast.success("Login successful", { theme: "dark" });
    } catch (err) {
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
