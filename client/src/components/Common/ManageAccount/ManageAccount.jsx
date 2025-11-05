import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit3,
  Save,
  X,
  Check,
} from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "react-toastify";
import api from "../../../utils/api";

const ManageAccount = () => {
  const [userDetails, setUserDetails] = useState({
    id: "",
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    city: "",
    state: "",
    is_email_verified: false,
    role: "",
    status: "",
    createdAt: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const { setUser } = useAuthStore();

  // Fetch user details on mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get("/auth/profile/me");
        const { data } = response;
        setUserDetails(data);
        
        // Update store if needed
        setUser(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to load account details", { theme: "dark" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [setUser]);

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Only send editable fields
      const updatePayload = {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        city: userDetails.city,
        state: userDetails.state,
      };

      const response = await api.put("/auth/profile", updatePayload);
      const {data} = response;
      setUserDetails(data);
      setUser(data);
      setIsEditing(false);
      
      toast.success("Profile updated successfully", { theme: "dark" });
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile", { theme: "dark" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="loader-circle" />
          <p className="text-sm text-white/60 tracking-wide">
            Loading account…
          </p>
        </div>
      </div>
    );
  }

  const fullName = `${userDetails.firstName || ""} ${
    userDetails.lastName || ""
  }`.trim();

  return (
    <div className="min-h-screen bg-[#151212] text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-semibold mb-2">Account Settings</h1>
          <p className="text-gray-400">
            Manage and keep your profile up to date
          </p>
        </div>

        <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          {/* Top bar inside card */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-8 border-b border-white/10 bg-gradient-to-r from-[#161616] to-[#1a1a1a]">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-[#1f1f1f] border border-white/10 flex items-center justify-center">
                <User className="w-10 h-10 text-white/80" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {fullName || "Unnamed User"}
                </h2>
                <div className="mt-2 flex flex-wrap gap-3 text-xs">
                  <Badge 
                    active={userDetails.is_email_verified} 
                    label="Email" 
                  />
                  <Badge 
                    active={userDetails.status === "ACTIVE"} 
                    label="Active" 
                  />
                  <RoleBadge role={userDetails.role} />
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing((v) => !v)}
              className="h-12 px-6 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-sm font-medium flex items-center gap-2 transition"
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" /> Cancel
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </>
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {/* Personal */}
            <Section title="Personal Information" icon={User}>
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="First Name" icon={User}>
                  <input
                    type="text"
                    value={userDetails.firstName || ""}
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        firstName: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    className={inputClass(isEditing)}
                    placeholder="Enter first name"
                  />
                </Field>
                <Field label="Last Name" icon={User}>
                  <input
                    type="text"
                    value={userDetails.lastName || ""}
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        lastName: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    className={inputClass(isEditing)}
                    placeholder="Enter last name"
                  />
                </Field>
                <Field label="Email" icon={Mail}>
                  <input
                    type="email"
                    value={userDetails.email || ""}
                    disabled
                    className={inputClass(false)}
                  />
                </Field>
                <Field label="Phone Number" icon={Phone}>
                  <input
                    type="tel"
                    value={userDetails.phoneNumber || "Not provided"}
                    disabled
                    className={inputClass(false)}
                  />
                </Field>
              </div>
            </Section>

            {/* Location */}
            <Section title="Location" icon={MapPin}>
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="City" icon={MapPin}>
                  <input
                    type="text"
                    value={userDetails.city || ""}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, city: e.target.value })
                    }
                    disabled={!isEditing}
                    className={inputClass(isEditing)}
                    placeholder="Enter city"
                  />
                </Field>
                <Field label="State" icon={MapPin}>
                  <input
                    type="text"
                    value={userDetails.state || ""}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, state: e.target.value })
                    }
                    disabled={!isEditing}
                    className={inputClass(isEditing)}
                    placeholder="Enter state"
                  />
                </Field>
              </div>
            </Section>

            {/* Metadata */}
            <Section title="Account Information" icon={Shield}>
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Role" icon={Shield}>
                  <input
                    type="text"
                    value={userDetails.role || ""}
                    disabled
                    className={`${inputClass(false)} capitalize`}
                  />
                </Field>
                <Field label="Status" icon={Shield}>
                  <input
                    type="text"
                    value={userDetails.status || "—"}
                    disabled
                    className={inputClass(false)}
                  />
                </Field>
                <Field label="Member Since" icon={Calendar}>
                  <input
                    type="text"
                    value={
                      userDetails.createdAt
                        ? new Date(userDetails.createdAt).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "long", day: "numeric" }
                          )
                        : "—"
                    }
                    disabled
                    className={inputClass(false)}
                  />
                </Field>
                <Field label="Last Updated" icon={Calendar}>
                  <input
                    type="text"
                    value={
                      userDetails.updatedAt
                        ? new Date(userDetails.updatedAt).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "long", day: "numeric" }
                          )
                        : "—"
                    }
                    disabled
                    className={inputClass(false)}
                  />
                </Field>
              </div>
            </Section>

            {isEditing && (
              <div className="pt-4 flex justify-end gap-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="h-12 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium flex items-center gap-2 transition"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="h-12 px-8 rounded-xl bg-white text-black font-semibold text-sm tracking-wide flex items-center gap-2 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    "Saving…"
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const Field = ({ label, icon: Icon, children }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-[11px] font-medium tracking-wide text-gray-400 uppercase">
      {Icon && <Icon className="w-4 h-4 text-white/60" />}
      <span>{label}</span>
    </label>
    <div>{children}</div>
  </div>
);

const Section = ({ title, icon: Icon, children }) => (
  <section className="space-y-6">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="w-5 h-5 text-white/70" />}
      <h3 className="text-sm font-semibold tracking-wide text-white/80 uppercase">
        {title}
      </h3>
    </div>
    {children}
  </section>
);

const Badge = ({ active, label }) => (
  <span
    className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] tracking-wide border ${
      active
        ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
        : "bg-white/5 text-gray-400 border-white/10"
    }`}
  >
    {active && <Check className="w-3 h-3" />}
    {label}
  </span>
);

const RoleBadge = ({ role }) => (
  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] tracking-wide border bg-blue-500/20 text-blue-300 border-blue-400/30 capitalize">
    {role || "role"}
  </span>
);

const inputClass = (editable) =>
  `w-full h-12 px-4 rounded-xl text-sm font-medium tracking-wide transition border ${
    editable
      ? "bg-[#1d1d1d] border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
      : "bg-[#1a1a1a] border-white/5 text-white/60 cursor-not-allowed"
  }`;

export default ManageAccount;