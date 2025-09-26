const VehicleEmptyState = () => {
  return (
    <div className="text-center py-20 bg-[#1b1b1b] rounded-xl border border-dashed border-white/15">
      <div className="text-6xl mb-4 opacity-80">🚗</div>
      <h3 className="text-xl font-semibold text-white mb-2">
        No Vehicles Found
      </h3>
      <p className="text-white/50 text-sm">
        This driver has not registered any vehicles yet.
      </p>
    </div>
  );
};

export default VehicleEmptyState;
