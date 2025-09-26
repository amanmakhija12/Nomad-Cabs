const DriverHeader = ({ driver, user, userLoading, userError }) => {
  return (
    <>
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-white to-white/70 mx-auto mb-5 flex items-center justify-center shadow-lg ring-1 ring-white/10">
          <span className="text-3xl font-bold text-black">
            {driver?.full_name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "D"}
          </span>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          {driver?.full_name || "Driver"}
        </h2>
        <p className="text-white/50 mt-2 text-sm">{user?.email || "Loading..."}</p>
      </div>

      {/* Loading / Error banners */}
      {userLoading && (
        <div className="mb-6 rounded-xl bg-[#1b1b1b] border border-white/10 text-white/70 px-4 py-3 text-sm font-medium">
          Loading user information...
        </div>
      )}
      {userError && (
        <div className="mb-6 rounded-xl bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 text-sm font-medium">
          {userError}
        </div>
      )}
    </>
  );
};

export default DriverHeader;
