import { useState } from "react";
import { toast } from "react-toastify";

const SignupForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);

  const BASE_URL =
    import.meta.env.VITE_BASE_URL || "http://localhost:8080/api/v1";

  const validate = () => {
    if (!formData.first_name.trim()) {
      toast.error("First name required", { theme: "dark" });
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email required", { theme: "dark" });
      return false;
    }
    const emailOk = /.+@.+\..+/.test(formData.email.trim());
    if (!emailOk) {
      toast.error("Invalid email format", { theme: "dark" });
      return false;
    }
    if (!formData.role) {
      toast.error("Select a role", { theme: "dark" });
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password min 6 chars", { theme: "dark" });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match", { theme: "dark" });
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;
  try {
    setLoading(true);
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        role: formData.role.toUpperCase(), 
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Signup failed");
    toast.success("Account created! Please login.", { theme: "dark" });
    onSuccess?.();
  } catch (err) {
    toast.error(err.message, { theme: "dark" });
  } finally {
    setLoading(false);
  }
};
  return (
    <form
      className="flex gap-3 flex-col mt-5 min-w-100"
      onSubmit={handleSubmit}
      noValidate
    >
      <input
        type="text"
        name="first_name"
        placeholder="First name"
        className="w-full p-2 border text-white rounded-md mb-2 bg-transparent"
        value={formData.first_name}
        onChange={handleChange}
      />
      <input
        type="text"
        name="last_name"
        placeholder="Last name"
        className="w-full p-2 border text-white rounded-md mb-2 bg-transparent"
        value={formData.last_name}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Enter email"
        className="w-full p-2 border text-white rounded-md mb-2 bg-transparent"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Enter password"
        className="w-full p-2 border text-white rounded-md bg-transparent"
        value={formData.password}
        onChange={handleChange}
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        className="w-full p-2 border text-white rounded-md bg-transparent"
        value={formData.confirmPassword}
        onChange={handleChange}
      />
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full p-2 border rounded-md bg-[#151212] text-white"
      >
        <option value="" disabled>
          -- Select Role --
        </option>
        <option value="rider">Rider</option>
        <option value="driver">Driver</option>
        <option value="admin">Admin</option>
      </select>
      <button
        type="submit"
        disabled={loading}
        className="primary-btn-nav mt-5 flex justify-center items-center w-50 disabled:opacity-60"
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
};
export default SignupForm;
