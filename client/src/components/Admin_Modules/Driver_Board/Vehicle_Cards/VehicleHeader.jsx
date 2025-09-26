const VehicleHeader = ({ onClose }) => {
  return (
    <div className="flex justify-between items-start md:items-center mb-10 flex-col md:flex-row gap-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-b from-white to-white/70 text-black flex items-center justify-center shadow ring-1 ring-white/10">
          <span className="text-2xl">🚗</span>
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Driver Vehicles
          </h2>
          <p className="text-white/50 text-sm mt-1">
            Manage vehicle information and verification status
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        title="Close"
        className="h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/15 transition"
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
  );
};

export default VehicleHeader;
