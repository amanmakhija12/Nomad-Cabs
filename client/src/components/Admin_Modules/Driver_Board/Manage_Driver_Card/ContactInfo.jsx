// Contact Information Component
const ContactInfo = ({ driver }) => {
  if (!driver.email && !driver.phoneNumber) return null;

  return (
    <div className="border-t border-white/10 pt-4 mt-4 space-y-2 text-xs">
      {driver.email && (
        <div className="flex items-center gap-2">
          <span className="text-white/40 uppercase tracking-wide text-[10px] w-16">
            Email
          </span>
          <span className="text-white/80 truncate font-medium flex-1">
            {driver.email}
          </span>
        </div>
      )}
      {driver.phoneNumber && (
        <div className="flex items-center gap-2">
          <span className="text-white/40 uppercase tracking-wide text-[10px] w-16">
            Phone
          </span>
          <span className="text-white/80 font-medium">
            {driver.phoneNumber}
          </span>
        </div>
      )}
    </div>
  );
};

export default ContactInfo;
