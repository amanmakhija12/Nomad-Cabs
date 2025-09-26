import { getVehicleIcon } from "./VehicleUtils";

const VehicleVerificationCard = ({ verified, title }) => {
  return (
    <div
      className={`p-4 rounded-xl bg-[#1b1b1b] border transition-all ${
        verified ? "border-emerald-500/30" : "border-red-500/30"
      }`}
    >
      <div className="text-center">
        <div
          className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-3 ring-1 ${
            verified
              ? "bg-emerald-500/15 text-emerald-400 ring-emerald-500/40"
              : "bg-red-500/15 text-red-400 ring-red-500/40"
          }`}
        >
          {verified ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>
        <h4 className="font-medium text-[11px] text-white/60 mb-1 leading-tight px-1">
          {title}
        </h4>
        <p
          className={`text-[11px] font-semibold tracking-wide ${
            verified ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {verified ? "VERIFIED" : "NOT VERIFIED"}
        </p>
      </div>
    </div>
  );
};

const VehicleInfoSection = ({ vehicle }) => {
  return (
    <div className="rounded-xl bg-[#1b1b1b] border border-white/10 p-5">
      <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-white/40" /> Vehicle
        Information
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center py-2 border-b border-white/5">
          <span className="text-white/50">Vehicle Type</span>
          <div className="flex items-center gap-2">
            <span className="text-lg">{getVehicleIcon(vehicle.vehicle_type)}</span>
            <span className="font-semibold text-white capitalize">
              {vehicle.vehicle_type}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/5">
          <span className="text-white/50">RC Number</span>
          <span className="font-mono font-semibold text-white bg-white/5 px-2 py-1 rounded border border-white/10">
            {vehicle.rc_number}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/5">
          <span className="text-white/50">PUC Number</span>
          <span className="font-mono font-semibold text-white bg-white/5 px-2 py-1 rounded border border-white/10">
            {vehicle.puc_number}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-white/50">Insurance Policy</span>
          <span className="font-mono font-semibold text-white bg-white/5 px-2 py-1 rounded border border-white/10">
            {vehicle.insurance_policy_number}
          </span>
        </div>
      </div>
    </div>
  );
};

const VehicleDatesSection = ({ vehicle, formatDateSafe }) => {
  return (
    <div className="rounded-xl bg-[#1b1b1b] border border-white/10 p-5">
      <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-white/40" /> Important Dates
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center py-2 border-b border-white/5">
          <span className="text-white/50">PUC Expiry</span>
          <span className="font-semibold text-white bg-white/5 px-2 py-1 rounded border border-white/10">
            {formatDateSafe(vehicle.puc_expiry)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/5">
          <span className="text-white/50">Insurance Expiry</span>
          <span className="font-semibold text-white bg-white/5 px-2 py-1 rounded border border-white/10">
            {formatDateSafe(vehicle.insurance_expiry)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/5">
          <span className="text-white/50">Created At</span>
          <span className="font-semibold text-white bg-white/5 px-2 py-1 rounded border border-white/10">
            {formatDateSafe(vehicle.created_at)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-white/50">Last Updated</span>
          <span className="font-semibold text-white bg-white/5 px-2 py-1 rounded border border-white/10">
            {formatDateSafe(vehicle.updated_at)}
          </span>
        </div>
      </div>
    </div>
  );
};

const VehicleDetailModal = ({ vehicle, onClose, formatDateSafe }) => {
  if (!vehicle) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-[70] p-4 py-10 overflow-y-auto no-scrollbar"
      onClick={onClose}
    >
      <div
        className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-5xl my-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-b from-[#181818] to-[#121212] px-6 py-5 rounded-t-2xl border-b border-white/10">
          <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center ring-1 ring-white/15">
                <span className="text-2xl">
                  {getVehicleIcon(vehicle.vehicle_type)}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-white capitalize">
                  {vehicle.vehicle_type} Details
                </h2>
                <p className="text-xs font-mono text-white/40 mt-1">
                  {vehicle.rc_number}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/15 transition"
              title="Close"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Content */}
        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 animate-pulse" />
              Verification Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <VehicleVerificationCard
                verified={vehicle.is_rc_verified}
                title="Registration Certificate"
              />
              <VehicleVerificationCard
                verified={vehicle.is_puc_verified}
                title="Pollution Under Control"
              />
              <VehicleVerificationCard
                verified={vehicle.is_insurance_verified}
                title="Vehicle Insurance"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VehicleInfoSection vehicle={vehicle} />
            <VehicleDatesSection
              vehicle={vehicle}
              formatDateSafe={formatDateSafe}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailModal;
