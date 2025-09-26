const DriverInfoCard = ({
  label,
  value,
  isEditing = false,
  name,
  type = "text",
  options = [],
  onChange,
  readOnly = false,
  icon = "",
  badge = null,
}) => {
  const renderValue = () => {
    if (badge) {
      return (
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold border ${badge.className}`}
        >
          {badge.text}
        </span>
      );
    }

    if (icon && value) {
      return `${value}`; // icons removed per design
    }

    return value || "—";
  };

  return (
    <div className="bg-[#1b1b1b] p-4 rounded-xl border border-white/10">
      <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-wide mb-2">
        {label}
      </label>

      {isEditing && !readOnly ? (
        type === "select" ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full h-11 text-sm text-white bg-[#242424] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/15"
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#242424]">
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full h-11 text-sm text-white bg-[#242424] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/15"
          />
        )
      ) : (
        <div className="text-white/85 text-sm font-medium break-words">
          {renderValue()}
        </div>
      )}
    </div>
  );
};

export default DriverInfoCard;
