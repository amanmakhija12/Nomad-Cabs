const VehicleLoadingState = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="relative">
        <div className="animate-spin h-12 w-12 rounded-full border-2 border-white/10 border-t-white/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/70 text-lg">🚗</span>
        </div>
      </div>
      <span className="ml-5 text-white/60 font-medium">Loading vehicles...</span>
    </div>
  );
};

export default VehicleLoadingState;
