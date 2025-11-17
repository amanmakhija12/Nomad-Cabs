import { formatDateSafe } from "../../../../utils/DateUtil";

const getVehicleIcon = (type) => {
  switch (type?.toLowerCase()) {
    case "sedan":
      return "🚗";
    case "suv":
      return "🚙";
    case "bike":
      return "🏍️";
    case "auto":
      return "🛺";
    default:
      return "🚗";
  }
};

const asBool = (v) => {
  if (typeof v === "string") return v === "1" || v.toLowerCase() === "true";
  if (typeof v === "number") return v === 1;
  return !!v;
};

const VehicleCard = ({ vehicle, onClick }) => {
  const pill =
    "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border";
  const verifiedCls = "bg-emerald-900/40 text-emerald-300 border-emerald-700";

  const rcOk = asBool(vehicle?.rcVerified);
  const pucOk = asBool(vehicle?.pucVerified);
  const insOk = asBool(vehicle?.insuranceVerified);

  
  const verifs = [
    { abbr: "RC", ok: rcOk, dotTitle: "RC" },
    { abbr: "PUC", ok: pucOk, dotTitle: "PUC" },
    { abbr: "INS", ok: insOk, dotTitle: "Insurance" },
  ];

  const infoRows = [
    { label: "PUC Expires", value: formatDateSafe(vehicle.puc_expiry) },
    {
      label: "Insurance Expires",
      value: formatDateSafe(vehicle.insuranceExpiry),
    },
  ];

  return (
    <div
      onClick={() => onClick(vehicle)}
      className="group relative bg-[#141414] rounded-2xl p-6 border border-white/10 hover:border-white/20 hover:bg-[#181818] transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/[0.05] to-transparent rounded-2xl transition-opacity" />

      <div className="relative z-10 flex items-start justify-between mb-6 gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-b from-white to-white/70 text-black flex items-center justify-center shadow ring-1 ring-white/10">
            <span className="text-2xl leading-none">
              {getVehicleIcon(vehicle.vehicleType)}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white/90 capitalize tracking-tight truncate">
              {vehicle.vehicleType}
            </h3>
            <p className="text-[11px] text-white/40 font-mono mt-1 truncate">
              {vehicle.rcNumber}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-end">
          {verifs
            .filter((v) => v.ok)
            .map((v) => (
              <span key={v.abbr} className={`${pill} ${verifiedCls}`}>
                {v.abbr} VERIFIED
              </span>
            ))}
        </div>
      </div>

      <div className="relative z-10 space-y-4 mb-6 text-sm">
        {infoRows.map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <span className="text-white/40 uppercase tracking-wide text-[10px]">
              {r.label}
            </span>
            <span className="text-white/80 font-medium">{r.value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between">
          <span className="text-white/40 uppercase tracking-wide text-[10px]">
            Verification
          </span>
          <div className="flex gap-1.5">
            {verifs.map((v) => (
              <div
                key={v.abbr}
                className={`w-3 h-3 rounded-full ${
                  v.ok ? "bg-emerald-500" : "bg-red-500"
                } shadow-sm`}
                title={v.dotTitle}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 pt-5 border-t border-white/10">
        <button className="w-full flex items-center justify-center gap-2 text-white/70 hover:text-white text-xs font-medium tracking-wide transition">
          <span>View Full Details</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;
