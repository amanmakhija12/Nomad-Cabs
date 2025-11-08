import { User, Phone } from "lucide-react";

export const RideInfoPanel = ({ role, driverName, riderName, driverPhone, riderPhone }) => {
  const isRider = role === "RIDER";
  const name = isRider ? driverName : riderName;
  const phone = isRider ? driverPhone : riderPhone;
  
  return (
    <div className="bg-[#141414] p-5 flex items-center justify-between border-t border-white/10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
          <User className="w-6 h-6 text-white/80" />
        </div>
        <div>
          <p className="text-sm text-white/60">{isRider ? "Your Driver" : "Your Rider"}</p>
          <h2 className="text-lg font-medium text-white">{name || "Loading..."}</h2>
        </div>
      </div>
      <a href={`tel:${phone}`} className="h-12 w-12 rounded-full bg-green-500/20 text-green-300 flex items-center justify-center">
        <Phone className="w-5 h-5" />
      </a>
    </div>
  );
};