const DocumentInfo = ({ driver }) => (
  <div className="space-y-2 flex-grow text-xs">
    <div className="flex items-center gap-2">
      <span className="text-white/40 uppercase tracking-wide text-[10px] w-16">
        License
      </span>
      <span className="text-white/80 font-medium truncate flex-1">
        {driver.driver_license || "—"}
      </span>
      <span
        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
          driver.is_driver_license_verified
            ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
            : "bg-red-900/40 text-red-300 border-red-700"
        }`}
      >
        {driver.is_driver_license_verified ? "OK" : "NO"}
      </span>
    </div>

    <div className="flex items-center gap-2">
      <span className="text-white/40 uppercase tracking-wide text-[10px] w-16">
        Expiry
      </span>
      <span className="text-white/80 font-medium flex-1">
        {driver.driver_license_expiry || "—"}
      </span>
    </div>

    <div className="flex items-center gap-2">
      <span className="text-white/40 uppercase tracking-wide text-[10px] w-16">
        PAN
      </span>
      <span className="text-white/80 font-medium truncate flex-1">
        {driver.pan_card || "—"}
      </span>
      <span
        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
          driver.is_pan_verified
            ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
            : "bg-red-900/40 text-red-300 border-red-700"
        }`}
      >
        {driver.is_pan_verified ? "OK" : "NO"}
      </span>
    </div>

    <div className="flex items-center gap-2">
      <span className="text-white/40 uppercase tracking-wide text-[10px] w-16">
        Aadhaar
      </span>
      <span className="text-white/80 font-medium truncate flex-1">
        {driver.aadhar_card || "—"}
      </span>
      <span
        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
          driver.is_aadhaar_verified
            ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
            : "bg-red-900/40 text-red-300 border-red-700"
        }`}
      >
        {driver.is_aadhaar_verified ? "OK" : "NO"}
      </span>
    </div>
  </div>
);

export default DocumentInfo;
