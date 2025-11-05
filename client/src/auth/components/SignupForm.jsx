import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api";

const SignupForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!formData.firstName.trim()) {
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
    if (!formData.phoneNumber.trim()) {
      toast.error("Phone number required", { theme: "dark" });
      return false;
    }
    if (formData.phoneNumber.length<10) {
      toast.error("Invalid phone number", { theme: "dark" });
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
    
    setLoading(true);
    
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      role: formData.role.toUpperCase(),
    };

    try {
      await api.post("/auth/register", payload);
      
      toast.success("Account created! Please login.", { theme: "dark" });
      onSuccess?.();
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || "Signup failed";
      toast.error(errorMessage, { theme: "dark" });
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
        name="firstName"
        placeholder="First name"
        className="w-full p-2 border text-white rounded-md mb-2 bg-transparent"
        value={formData.firstName}
        onChange={handleChange}
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last name"
        className="w-full p-2 border text-white rounded-md mb-2 bg-transparent"
        value={formData.lastName}
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
        type="tel"
        name="phoneNumber"
        placeholder="Phone number"
        className="w-full p-2 border text-white rounded-md mb-2 bg-transparent"
        value={formData.phoneNumber}
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