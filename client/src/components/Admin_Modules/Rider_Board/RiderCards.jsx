import { useState, useEffect } from "react";
import { formatDateSafe, toMySQLFromDate } from "../../../utils/DateUtil";
import { toast, Bounce } from "react-toastify";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Shield,
  Pencil,
  Save,
  Trash2,
  CalendarClock,
  UserCheck,
} from "lucide-react";

const RiderCards = ({ rider, onClose, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    phone_number: "",
    city: "",
    state: "",
    role_description: "",
    status: "active",
    created_at: "",
    updated_at: "",
    is_email_verified: false,
    is_phone_verified: false,
  });

  useEffect(() => {
    if (rider) {
      setFormData({
        phone_number: rider.phone_number || "",
        city: rider.city || "",
        state: rider.state || "",
        role_description: rider.role_description || "",
        status: rider.status || "active",
        created_at: rider.created_at || "",
        updated_at: rider.updated_at || "",
        is_email_verified: rider.is_email_verified || false,
        is_phone_verified: rider.is_phone_verified || false,
      });
    }
  }, [rider]);

  if (!rider) return null;

  const stop = (e) => e.stopPropagation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const updatedAtMySQL = toMySQLFromDate(new Date(), {
        asUTC: true,
        withMs: true,
      });

      const response = await fetch(`http://localhost:3005/riders/${rider.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...rider,
          phone_number: formData.phone_number,
          city: formData.city,
          state: formData.state,
          role_description: formData.role_description,
          status: formData.status,
          created_at: formData.created_at,
          updated_at: updatedAtMySQL,
        }),
      });

      if (!response.ok) throw new Error("Update failed");
      toast.success("Rider updated", { transition: Bounce, theme: "dark" });
      setIsEditing(false);
      setFormData((p) => ({ ...p, updated_at: updatedAtMySQL }));
      onRefresh && onRefresh();
    } catch (e) {
      console.error(e);
      toast.error("Error updating rider", { transition: Bounce, theme: "dark" });
    }
  };

  const confirmDelete = () =>
    new Promise((resolve) => {
      toast.warn(
        ({ closeToast }) => (
          <div className="text-white text-sm space-y-5">
            <p className="font-medium text-white/80">
              Delete this rider permanently?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  closeToast();
                  resolve(true);
                }}
                className="h-9 px-5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold tracking-wide"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  closeToast();
                  resolve(false);
                }}
                className="h-9 px-5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold tracking-wide border border-white/15"
              >
                Cancel
              </button>
            </div>
          </div>
        ),
        {
          position: "top-center",
          autoClose: false,
          theme: "dark",
          closeOnClick: false,
          draggable: false,
          hideProgressBar: true,
          transition: Bounce,
        }
      );
    });

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    const ok = await confirmDelete();
    if (!ok) {
      setIsDeleting(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:3005/riders/${rider.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Rider deleted", { transition: Bounce, theme: "dark" });
      onRefresh && onRefresh();
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Error deleting rider", { transition: Bounce, theme: "dark" });
    } finally {
      setIsDeleting(false);
    }
  };

  const badgeClass = (ok) =>
    `inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold border ${
      ok
        ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
        : "bg-red-900/40 text-red-300 border-red-700"
    }`;

  const statusTheme =
    formData.status === "active"
      ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
      : formData.status === "suspended"
      ? "bg-amber-900/40 text-amber-300 border-amber-700"
      : formData.status === "deleted"
      ? "bg-red-900/40 text-red-300 border-red-700"
      : "bg-gray-800 text-gray-300 border-gray-600";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={isDeleting ? undefined : onClose}
    >
      <div
        className="bg-[#141414] rounded-2xl shadow-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar relative"
        onClick={stop}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#181818] via-[#151515] to-[#121212] p-8 rounded-t-2xl border-b border-white/10">
          <button
            aria-label="Close"
            disabled={isDeleting}
            onClick={onClose}
            className="absolute top-5 right-5 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/15 transition disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pr-14">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-white to-white/80 text-black flex items-center justify-center text-4xl font-bold shadow-lg">
                {(rider.first_name?.[0] || "").toUpperCase()}
                {(rider.last_name?.[0] || "").toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  {rider.first_name} {rider.last_name}
                </h2>
                <div className="mt-2 flex flex-wrap gap-3 text-[11px]">
                  <span className={badgeClass(formData.is_email_verified)}>
                    Email {formData.is_email_verified ? "Verified" : "Unverified"}
                  </span>
                  <span className={badgeClass(formData.is_phone_verified)}>
                    Phone {formData.is_phone_verified ? "Verified" : "Unverified"}
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold bg-white text-black border border-white">
                    {rider.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={isDeleting}
                  className="h-11 px-6 rounded-xl bg-white text-black text-sm font-medium flex items-center gap-2 shadow hover:shadow-lg transition disabled:opacity-40"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
              )}
              {isEditing && (
                <button
                  onClick={handleUpdate}
                  disabled={isDeleting}
                  className="h-11 px-6 rounded-xl bg-white text-black text-sm font-medium flex items-center gap-2 shadow hover:shadow-lg transition disabled:opacity-40"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
              )}
              {isEditing && (
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isDeleting}
                  className="h-11 px-6 rounded-xl bg-white/10 text-white text-sm font-medium flex items-center gap-2 border border-white/15 hover:bg-white/15 transition disabled:opacity-40"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              )}
              {!isEditing && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="h-11 px-6 rounded-xl bg-red-600 text-white text-sm font-medium flex items-center gap-2 shadow hover:bg-red-700 transition disabled:opacity-40"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? "Deleting…" : "Delete"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-10">
          {/* Top status panels */}
            <div className="grid md:grid-cols-3 gap-6">
              <StatusPanel
                label="Status"
                icon={<Shield className="w-3.5 h-3.5" />}
                editing={isEditing}
                value={formData.status}
                onChange={(v) =>
                  setFormData((p) => ({ ...p, status: v }))
                }
                statusTheme={statusTheme}
              />
              <SimplePanel
                label="Email Verified"
                icon={<UserCheck className="w-3.5 h-3.5" />}
                badge={formData.is_email_verified}
              />
              <SimplePanel
                label="Phone Verified"
                icon={<Phone className="w-3.5 h-3.5" />}
                badge={formData.is_phone_verified}
              />
            </div>

          {/* Editable / Static sections */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <FieldBlock
                label="Phone Number"
                icon={<Phone className="w-4 h-4 text-white/40" />}
                name="phone_number"
                value={formData.phone_number}
                editing={isEditing}
                onChange={handleInputChange}
              />
              <FieldBlock
                label="City"
                icon={<MapPin className="w-4 h-4 text-white/40" />}
                name="city"
                value={formData.city}
                editing={isEditing}
                onChange={handleInputChange}
              />
              <FieldBlock
                label="State"
                icon={<MapPin className="w-4 h-4 text-white/40" />}
                name="state"
                value={formData.state}
                editing={isEditing}
                onChange={handleInputChange}
              />
              <FieldBlock
                label="Role Description"
                icon={<Shield className="w-4 h-4 text-white/40" />}
                name="role_description"
                value={formData.role_description}
                editing={isEditing}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-6">
              <StaticBlock
                label="Email"
                icon={<Mail className="w-4 h-4 text-white/40" />}
                value={rider.email}
              />
              <StaticBlock
                label="Role"
                icon={<Shield className="w-4 h-4 text-white/40" />}
                value={rider.role}
                badge
              />
              <StaticBlock
                label="Created At"
                icon={<CalendarClock className="w-4 h-4 text-white/40" />}
                value={formatDateSafe(formData.created_at, {
                  locale: "en-IN",
                  timeZone: "Asia/Kolkata",
                  variant: "datetime",
                  fallback: "—",
                  assumeUTCForMySQL: true,
                })}
              />
              <StaticBlock
                label="Updated At"
                icon={<CalendarClock className="w-4 h-4 text-white/40" />}
                value={formatDateSafe(formData.updated_at, {
                  locale: "en-IN",
                  timeZone: "Asia/Kolkata",
                  variant: "datetime",
                  fallback: "—",
                  assumeUTCForMySQL: true,
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Sub Components */

const panelBase =
  "bg-[#1b1b1b] border border-white/10 rounded-xl p-5 flex flex-col gap-2";

const StatusPanel = ({ label, icon, editing, value, onChange, statusTheme }) => (
  <div className={panelBase}>
    <p className="text-[11px] uppercase tracking-wider text-white/40 flex items-center gap-2">
      {icon}
      {label}
    </p>
    {editing ? (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg bg-[#242424] text-white text-sm px-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/15"
      >
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
        <option value="deleted">Deleted</option>
      </select>
    ) : (
      <span
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${statusTheme}`}
      >
        {value.toUpperCase()}
      </span>
    )}
  </div>
);

const SimplePanel = ({ label, icon, badge }) => (
  <div className={panelBase}>
    <p className="text-[11px] uppercase tracking-wider text-white/40 flex items-center gap-2">
      {icon}
      {label}
    </p>
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${
        badge
          ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
          : "bg-red-900/40 text-red-300 border-red-700"
      }`}
    >
      {badge ? "VERIFIED" : "NOT VERIFIED"}
    </span>
  </div>
);

const FieldBlock = ({ label, icon, editing, name, value, onChange }) => (
  <div className="bg-[#1b1b1b] border border-white/10 rounded-xl p-5">
    <p className="text-[11px] uppercase tracking-wider text-white/40 mb-2 flex items-center gap-2">
      {icon}
      {label}
    </p>
    {editing ? (
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-lg bg-[#242424] text-white text-sm px-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/15"
      />
    ) : (
      <div className="text-white/90 text-sm font-medium break-words">
        {value || "—"}
      </div>
    )}
  </div>
);

const StaticBlock = ({ label, icon, value, badge }) => (
  <div className="bg-[#1b1b1b] border border-white/10 rounded-xl p-5">
    <p className="text-[11px] uppercase tracking-wider text-white/40 mb-2 flex items-center gap-2">
      {icon}
      {label}
    </p>
    {badge ? (
      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-black border border-white">
        {value}
      </span>
    ) : (
      <div className="text-white/90 text-sm font-medium break-words">
        {value || "—"}
      </div>
    )}
  </div>
);

export default RiderCards;
