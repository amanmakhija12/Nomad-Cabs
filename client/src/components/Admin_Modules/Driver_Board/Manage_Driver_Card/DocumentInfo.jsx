const DocumentInfo = ({ driver }) => (
  <div className="space-y-2 flex-grow text-xs">
    <div className="flex items-center gap-2">
      <span className="text-white/40 uppercase tracking-wide text-[10px] w-16">
        License
      </span>
      <span className="text-white/80 font-medium truncate flex-1">
        {driver.licenseNumber || "—"}
      </span>
      <span
        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
          driver.driverLicenseVerified
            ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
            : "bg-red-900/40 text-red-300 border-red-700"
        }`}
      >
        {driver.driverLicenseVerified ? "OK" : "NO"}
      </span>
    </div>

    <div className="flex items-center gap-2">
      <span className="text-white/40 uppercase tracking-wide text-[10px] w-16">
        Expiry
      </span>
      <span className="text-white/80 font-medium flex-1">
        {driver.driverLicenseExpiry || "—"}
      </span>
    </div>

    <div className="flex items-center gap-2">
      <span className="text-white/40 uppercase tracking-wide text-[10px] w-16">
        PAN
      </span>
      <span className="text-white/80 font-medium truncate flex-1">
        {driver.panCard || "—"}
      </span>
      <span
        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
          driver.panVerified
            ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
            : "bg-red-900/40 text-red-300 border-red-700"
        }`}
      >
        {driver.panVerified ? "OK" : "NO"}
      </span>
    </div>

    <div className="flex items-center gap-2">
      <span className="text-white/40 uppercase tracking-wide text-[10px] w-16">
        Aadhaar
      </span>
      <span className="text-white/80 font-medium truncate flex-1">
        {driver.aadharNumber || "—"}
      </span>
      <span
        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
          driver.aadhaarVerified
            ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
            : "bg-red-900/40 text-red-300 border-red-700"
        }`}
      >
        {driver.aadhaarVerified ? "OK" : "NO"}
      </span>
    </div>
  </div>
);

export default DocumentInfo;
