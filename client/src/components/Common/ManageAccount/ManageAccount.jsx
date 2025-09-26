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

const ManageAccount = () => {
  const [userDetails, setUserDetails] = useState({
    id: "",
    email: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    city: "",
    state: "",
    is_email_verified: false,
    is_phone_verified: false,
    role: "",
    status: "",
    created_at: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("http://localhost:3005/riders");
        if (!response.ok) throw new Error("Failed to load user");
        const data = await response.json();
        if (Array.isArray(data) && data.length) setUserDetails(data[0]);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = { ...userDetails, status: "Pending Verification" };
      const res = await fetch(
        `http://localhost:3005/riders/${userDetails.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        }
      );
      if (!res.ok) throw new Error("Update failed");
      const saved = await res.json();
      setUserDetails(saved);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
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

  const fullName = `${userDetails.first_name || ""} ${
    userDetails.last_name || ""
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
                  <Badge active={userDetails.is_email_verified} label="Email" />
                  <Badge active={userDetails.is_phone_verified} label="Phone" />
                  <RoleBadge role={user.role} />
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
                <Field label="Full Name" icon={User}>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      const parts = e.target.value.split(" ");
                      setUserDetails({
                        ...userDetails,
                        first_name: parts[0] || "",
                        last_name: parts.slice(1).join(" ") || "",
                      });
                    }}
                    disabled={!isEditing}
                    className={inputClass(isEditing)}
                  />
                </Field>
                <Field label="Email" icon={Mail}>
                  <input
                    type="email"
                    value={userDetails.email}
                    disabled
                    className={inputClass(false)}
                  />
                </Field>
              </div>
            </Section>

            {/* Contact & Role */}
            <Section title="Contact & Role" icon={Shield}>
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Phone Number" icon={Phone}>
                  <input
                    type="tel"
                    value={userDetails.phone_number}
                    disabled
                    className={inputClass(false)}
                  />
                </Field>
                <Field label="Role" icon={Shield}>
                  <input
                    type="text"
                    value={user.role}
                    disabled
                    className={`${inputClass(false)} capitalize`}
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
                    value={userDetails.city}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, city: e.target.value })
                    }
                    disabled={!isEditing}
                    className={inputClass(isEditing)}
                  />
                </Field>
                <Field label="State" icon={MapPin}>
                  <input
                    type="text"
                    value={userDetails.state}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, state: e.target.value })
                    }
                    disabled={!isEditing}
                    className={inputClass(isEditing)}
                  />
                </Field>
              </div>
            </Section>

            {/* Metadata */}
            <Section title="Membership" icon={Calendar}>
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Member Since" icon={Calendar}>
                  <input
                    type="text"
                    value={
                      userDetails.created_at
                        ? new Date(userDetails.created_at).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "long", day: "numeric" }
                          )
                        : ""
                    }
                    disabled
                    className={inputClass(false)}
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
              </div>
            </Section>

            {isEditing && (
              <div className="pt-4 flex justify-end border-t border-white/5">
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

// Reusable small components
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
  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] tracking-wide border bg-white/5 text-gray-300 border-white/10 capitalize">
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
