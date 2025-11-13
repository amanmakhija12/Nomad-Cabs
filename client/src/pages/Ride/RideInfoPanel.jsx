import { User, Phone, Star, Award, Calendar } from "lucide-react";
import { formatDateSafe } from "../../utils/DateUtil";

export const RideInfoPanel = ({ role, 
  driverName, 
  riderName, 
  driverPhone,
  riderPhone,
  driverRating,
  driverTotalRatings,
  driverMemberSince
}) => {
  const isRider = role === "RIDER";
  
  const name = isRider ? driverName : riderName;
  const phone = isRider ? driverPhone : riderPhone;
  const title = isRider ? "Your Driver" : "Your Rider";
  
  return (
    <div className="bg-[#141414] p-5 border-t border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-white/80" />
          </div>
          <div>
            <p className="text-sm text-white/60">{title}</p>
            <h2 className="text-lg font-medium text-white">{name || "Loading..."}</h2>
          </div>
        </div>
        <a href={`tel:${phone}`} className="h-12 w-12 rounded-full bg-green-500/20 text-green-300 flex items-center justify-center flex-shrink-0">
          <Phone className="w-5 h-5" />
        </a>
      </div>

      {isRider && (
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-white/50 mb-1">Rating</p>
            <div className="flex items-center justify-center gap-1 text-white font-medium">
              <Star className="w-4 h-4 text-yellow-400" fill="#facc15" />
              <span>{driverRating !== null ? driverRating.toFixed(1) : 'N/A'}</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-white/50 mb-1">Total Trips</p>
            <div className="flex items-center justify-center gap-1 text-white font-medium">
              <Award className="w-4 h-4 text-white/80" />
              <span>{driverTotalRatings || 0}</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-white/50 mb-1">Member Since</p>
            <div className="flex items-center justify-center gap-1 text-white font-medium">
              <Calendar className="w-4 h-4 text-white/80" />
              <span>{formatDateSafe(driverMemberSince, { variant: 'month-year' }) || '...'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};