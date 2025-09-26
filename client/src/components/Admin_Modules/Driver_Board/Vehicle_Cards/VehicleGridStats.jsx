const VehicleGridStats = ({ vehiclesCount }) => {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div className="flex items-center gap-3 text-sm">
        <span className="font-medium text-white/70">
          Found {vehiclesCount} vehicle{vehiclesCount !== 1 ? "s" : ""}
        </span>
        <span className="w-1 h-1 rounded-full bg-white/25" />
        <span className="text-white/40">Click any card for details</span>
      </div>
    </div>
  );
};

export default VehicleGridStats;
