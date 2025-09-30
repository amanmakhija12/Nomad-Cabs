const DriverDetailsView = ({
  user,
  Driver,
  formData,
  isEditing,
  loading,
  isDeleting,
  onChange,
  onSave,
  onEdit,
  onCancel,
  onDelete,
  onShowVehicles,
  onClose,
}) => {
  const initials = `${(user?.first_name?.[0] || "").toUpperCase()}${(
    user?.last_name?.[0] || ""
  ).toUpperCase()}`;
  const panelBase = "bg-[#1b1b1b] border border-white/10 rounded-xl p-5";

  const editableFields = [
    { label: "Phone Number", name: "phone_number" },
    { label: "City", name: "city" },
    { label: "State", name: "state" },
    { label: "Role Description", name: "role_description" },
  ];

  const staticFields = [
    { label: "Email", value: user?.email || "—", isBadge: false },
    { label: "Role", value: user?.role || "driver", isBadge: true },
    { label: "Created At", value: formData.created_at || "—", isBadge: false },
    { label: "Updated At", value: formData.updated_at || "—", isBadge: false },
  ];

  const docs = [
    { label: "PAN", value: Driver.pan_card },
    { label: "Aadhaar", value: Driver.aadhar_card },
    {
      label: "DL No. (Expiry)",
      value: `${Driver.driver_license || "—"}${
        Driver.driver_license_expiry ? ` (${Driver.driver_license_expiry})` : ""
      }`,
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="p-8 bg-gradient-to-b from-[#181818] via-[#151515] to-[#141414] rounded-t-2xl border-b border-white/10 relative">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          disabled={isDeleting}
          className={`absolute top-5 right-5 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/15 transition ${
            isDeleting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span className="text-sm font-medium">X</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pr-14">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-white to-white/80 text-black flex items-center justify-center text-4xl font-bold shadow-lg">
              {initials}
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                {user
                  ? `${user.first_name} ${user.last_name || ""}`.trim()
                  : "—"}
              </h2>
              <div className="mt-2 flex flex-wrap gap-3 text-[11px]">
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold border ${
                    user?.is_email_verified
                      ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
                      : "bg-red-900/40 text-red-300 border-red-700"
                  }`}
                >
                  Email {user?.is_email_verified ? "Verified" : "Unverified"}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold border ${
                    user?.is_phone_verified
                      ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
                      : "bg-red-900/40 text-red-300 border-red-700"
                  }`}
                >
                  Phone {user?.is_phone_verified ? "Verified" : "Unverified"}
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold bg-white text-black border border-white">
                  {user?.role || "driver"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {!isEditing && (
              <button
                onClick={onEdit}
                disabled={isDeleting || loading}
                className="h-11 px-6 rounded-xl bg-white text-black text-sm font-medium shadow hover:shadow-lg transition disabled:opacity-40"
              >
                Edit
              </button>
            )}
            {isEditing && (
              <button
                onClick={onSave}
                disabled={isDeleting}
                className="h-11 px-6 rounded-xl bg-white text-black text-sm font-medium shadow hover:shadow-lg transition disabled:opacity-40"
              >
                Save
              </button>
            )}
            {isEditing && (
              <button
                onClick={onCancel}
                disabled={isDeleting}
                className="h-11 px-6 rounded-xl bg-white/10 text-white text-sm font-medium border border-white/15 hover:bg-white/15 transition disabled:opacity-40"
              >
                Cancel
              </button>
            )}
            {!isEditing && (
              <button
                onClick={onDelete}
                disabled={isDeleting}
                className="h-11 px-6 rounded-xl bg-red-600 text-white text-sm font-medium shadow hover:bg-red-700 transition disabled:opacity-40"
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            )}
            <button
              onClick={onShowVehicles}
              className="h-11 px-6 rounded-xl bg-white/10 text-white text-sm font-medium border border-white/15 hover:bg-white/15 transition"
            >
              View Vehicles
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-10">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Status panel */}
          <div className={panelBase}>
            <p className="text-[11px] uppercase tracking-wider text-white/40">
              Status
            </p>
            {isEditing ? (
              <select
                value={formData.status}
                onChange={(e) =>
                  onChange({
                    target: { name: "status", value: e.target.value },
                  })
                }
                className="h-11 w-full rounded-lg bg-[#242424] text-white text-sm px-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/15"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            ) : (
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  formData.status === "active"
                    ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
                    : "bg-amber-900/40 text-amber-300 border-amber-700"
                }`}
              >
                {formData.status.toUpperCase()}
              </span>
            )}
          </div>

          {/* Verification panels (mapped) */}
          {[
            { label: "Email Verified", ok: user?.is_email_verified },
            { label: "Phone Verified", ok: user?.is_phone_verified },
          ].map((it) => (
            <div className={panelBase} key={it.label}>
              <p className="text-[11px] uppercase tracking-wider text-white/40">
                {it.label}
              </p>
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  it.ok
                    ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
                    : "bg-red-900/40 text-red-300 border-red-700"
                }`}
              >
                {it.ok ? "VERIFIED" : "NOT VERIFIED"}
              </span>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          <div className="space-y-6">
            {editableFields.map((f) => (
              <div className={panelBase} key={f.name}>
                <p className="text-[11px] uppercase tracking-wider text-white/40 mb-2">
                  {f.label}
                </p>
                {isEditing ? (
                  <input
                    name={f.name}
                    value={formData[f.name]}
                    onChange={onChange}
                    className="h-11 w-full rounded-lg bg-[#242424] text-white text-sm px-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/15"
                  />
                ) : (
                  <div className="text-white/90 text-sm font-medium break-words">
                    {formData[f.name] || "—"}
                  </div>
                )}
              </div>
            ))}
          </div>

      
          <div className="space-y-6">
            {staticFields.map((f) => (
              <div className={panelBase} key={f.label}>
                <p className="text-[11px] uppercase tracking-wider text-white/40 mb-2">
                  {f.label}
                </p>
                {f.isBadge ? (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-black border border-white">
                    {f.value}
                  </span>
                ) : (
                  <div className="text-white/90 text-sm font-medium break-words">
                    {f.value}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {docs.map((d) => (
            <div className={panelBase} key={d.label}>
              <p className="text-[11px] uppercase tracking-wider text-white/40">
                {d.label}
              </p>
              <div className="text-white/90 text-sm font-medium break-words">
                {d.value || "—"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DriverDetailsView;
