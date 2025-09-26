import { getVehicleIcon } from "./VehicleUtils";
import { formatDateSafe } from "../../../../utils/DateUtil"

const VehicleCard = ({ vehicle, onClick }) => {
  const pill = "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border";
  const verifiedCls = "bg-emerald-900/40 text-emerald-300 border-emerald-700";
  return (
    <div
      onClick={() => onClick(vehicle)}
      className="group relative bg-[#141414] rounded-2xl p-6 border border-white/10 hover:border-white/20 hover:bg-[#181818] transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* subtle highlight */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/[0.05] to-transparent rounded-2xl transition-opacity" />

      <div className="relative z-10 flex items-start justify-between mb-6 gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-b from-white to-white/70 text-black flex items-center justify-center shadow ring-1 ring-white/10">
            <span className="text-2xl leading-none">
              {getVehicleIcon(vehicle.vehicle_type)}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white/90 capitalize tracking-tight truncate">
              {vehicle.vehicle_type}
            </h3>
            <p className="text-[11px] text-white/40 font-mono mt-1 truncate">
              {vehicle.rc_number}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-end">
          {vehicle.is_rc_verified && (
            <span className={`${pill} ${verifiedCls}`}>RC VERIFIED</span>
          )}
          {vehicle.is_puc_verified && (
            <span className={`${pill} ${verifiedCls}`}>PUC VERIFIED</span>
          )}
          {vehicle.is_insurance_verified && (
            <span className={`${pill} ${verifiedCls}`}>INS VERIFIED</span>
          )}
        </div>
      </div>

      <div className="relative z-10 space-y-4 mb-6 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-white/40 uppercase tracking-wide text-[10px]">PUC Expires</span>
          <span className="text-white/80 font-medium">{formatDateSafe(vehicle.puc_expiry)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/40 uppercase tracking-wide text-[10px]">Insurance Expires</span>
          <span className="text-white/80 font-medium">{formatDateSafe(vehicle.insurance_expiry)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/40 uppercase tracking-wide text-[10px]">Verification</span>
          <div className="flex gap-1.5">
            <div
              className={`w-3 h-3 rounded-full ${vehicle.is_rc_verified ? 'bg-emerald-500' : 'bg-red-500'} shadow-sm`}
              title="RC"
            />
            <div
              className={`w-3 h-3 rounded-full ${vehicle.is_puc_verified ? 'bg-emerald-500' : 'bg-red-500'} shadow-sm`}
              title="PUC"
            />
            <div
              className={`w-3 h-3 rounded-full ${vehicle.is_insurance_verified ? 'bg-emerald-500' : 'bg-red-500'} shadow-sm`}
              title="Insurance"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 pt-5 border-t border-white/10">
        <button className="w-full flex items-center justify-center gap-2 text-white/70 hover:text-white text-xs font-medium tracking-wide transition">
          <span>View Full Details</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;
