import { getVehicleIcon } from "./Vehicles";
import { formatDateSafe } from "../../../utils/DateUtil";
import { X } from "lucide-react";

const VehicleDetailModal = ({ vehicle, onClose }) => {
  if (!vehicle) return null;
  const Icon = getVehicleIcon(vehicle.vehicle_type);
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141414] rounded-2xl shadow-2xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar relative">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#181818] via-[#151515] to-[#121212] p-6 rounded-t-2xl border-b border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#1f1f1f] border border-white/10 flex items-center justify-center">
                {Icon && <Icon size={28} className="text-white" />}
              </div>
              <div>
                <h2 className="text-xl font-semibold capitalize tracking-wide text-white/90">
                  {vehicle.vehicle_type} Details
                </h2>
                <p className="text-xs text-white/50 font-mono mt-1">
                  {vehicle.rc_number}
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/15 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-10">
          {/* Verification */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white/70 uppercase mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Verification Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <VerifyCard
                label="Registration Certificate"
                ok={vehicle.is_rc_verified}
              />
              <VerifyCard
                label="Pollution Under Control"
                ok={vehicle.is_puc_verified}
              />
              <VerifyCard
                label="Vehicle Insurance"
                ok={vehicle.is_insurance_verified}
              />
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InfoPanel title="Vehicle Information">
              <InfoRow label="Vehicle Type" value={vehicle.vehicle_type} cap />
              <InfoRow mono label="RC Number" value={vehicle.rc_number} />
              <InfoRow mono label="PUC Number" value={vehicle.puc_number} />
              <InfoRow
                mono
                label="Insurance Policy"
                value={vehicle.insurance_policy_number}
              />
            </InfoPanel>
            <InfoPanel title="Important Dates">
              <InfoRow
                label="PUC Expiry"
                value={formatDateSafe(vehicle.puc_expiry)}
              />
              <InfoRow
                label="Insurance Expiry"
                value={formatDateSafe(vehicle.insurance_expiry)}
              />
              <InfoRow
                label="Created At"
                value={formatDateSafe(vehicle.createdAt)}
              />
              <InfoRow
                label="Last Updated"
                value={formatDateSafe(vehicle.updatedAt)}
              />
            </InfoPanel>
          </div>
        </div>
      </div>
    </div>
  );
};

const VerifyCard = ({ label, ok }) => (
  <div
    className={`p-4 rounded-xl border text-center space-y-3 transition relative overflow-hidden ${
      ok
        ? "border-emerald-400/30 bg-emerald-500/10"
        : "border-red-400/30 bg-red-500/10"
    }`}
  >
    <div
      className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white text-sm font-semibold ${
        ok ? "bg-emerald-500" : "bg-red-500"
      }`}
    >
      {ok ? "✓" : "✕"}
    </div>
    <h4 className="text-[11px] font-medium tracking-wide text-white/70 uppercase leading-snug px-1">
      {label}
    </h4>
    <p
      className={`text-[11px] font-semibold tracking-wide ${
        ok ? "text-emerald-300" : "text-red-300"
      }`}
    >
      {ok ? "Verified" : "Not Verified"}
    </p>
  </div>
);

const InfoPanel = ({ title, children }) => (
  <div className="bg-[#181818] rounded-xl p-5 border border-white/10">
    <h3 className="text-xs font-semibold tracking-wide text-white/60 uppercase mb-4 flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-white/30" /> {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const InfoRow = ({ label, value, mono, cap }) => (
  <div className="flex justify-between items-center pb-2 border-b border-white/5 last:border-none last:pb-0">
    <span className="text-[11px] tracking-wide text-white/40 uppercase">
      {label}
    </span>
    <span
      className={`text-[12px] font-medium text-white/90 ${
        mono ? "font-mono" : ""
      } ${cap ? "capitalize" : ""}`}
    >
      {value}
    </span>
  </div>
);

export default VehicleDetailModal;
