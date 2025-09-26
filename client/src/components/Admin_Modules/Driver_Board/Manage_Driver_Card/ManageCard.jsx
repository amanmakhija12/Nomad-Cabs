import DriverAvatar from "./DriverAvatar";
import VerificationStatus from "./VerificationStatus";
import DocumentInfo from "./DocumentInfo";
import ContactInfo from "./ContactInfo";

const ManageCard = ({ driver, onClick }) => (
  <div
    onClick={() => onClick(driver)}
    className="group relative bg-[#141414] p-6 border border-white/10 rounded-2xl shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden min-h-[200px] flex flex-col"
  >
    {/* subtle overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

    <div className="relative z-10">
      <div className="flex items-start gap-4 mb-4">
        <DriverAvatar driver={driver} />
        <div className="flex-grow min-w-0">
          <h3 className="text-base font-semibold text-white/90 group-hover:text-white truncate tracking-tight">
            {driver.full_name}
          </h3>
          <VerificationStatus driver={driver} />
        </div>
      </div>

      <DocumentInfo driver={driver} />
      <ContactInfo driver={driver} />
    </div>

    <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-white to-white/0 group-hover:w-full transition-all duration-500" />
  </div>
);

export default ManageCard;
