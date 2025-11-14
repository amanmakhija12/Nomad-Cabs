const VerificationStatus = ({ driver }) => {
  const base =
    "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium border tracking-wide";

  const allVerified =
    driver.aadhaarVerified &&
    driver.driverLicenseVerified;

  if (allVerified) {
    return (
      <span
        className={`${base} bg-emerald-900/40 text-emerald-300 border-emerald-700`}
      >
        VERIFIED
      </span>
    );
  }

  const someVerified =
    driver.aadhaarVerified ||
    driver.panVerified ||
    driver.driverLicenseVerified;

  if (someVerified) {
    return (
      <span
        className={`${base} bg-amber-900/40 text-amber-300 border-amber-700`}
      >
        PARTIAL
      </span>
    );
  }

  return (
    <span className={`${base} bg-red-900/40 text-red-300 border-red-700`}>
      NOT VERIFIED
    </span>
  );
};

export default VerificationStatus;
