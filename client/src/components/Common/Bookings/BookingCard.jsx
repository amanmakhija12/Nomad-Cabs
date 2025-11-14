import {
  IndianRupee,
  Check,
  CircleDashed,
  X,
  TriangleAlert,
  Calendar,
} from "lucide-react";
import { formatDateSafe } from "../../../utils/DateUtil";
import { getInitial } from "../../../utils/getInitial";

const BookingCard = ({ booking, isRider, onBookingClick }) => {
  return (
    <li
      onClick={() => onBookingClick(booking)}
      className="group relative bg-[#141414] p-4 sm:p-6 border border-white/10 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/0 transition-all" />

      <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3 sm:space-x-4 flex-grow">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white text-black rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
              <span className="text-xs sm:text-sm font-bold">{getInitial(isRider ? booking.driverName : booking.riderName)}</span>
            </div>
          </div>

          <div className="flex-grow min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-white mb-1 leading-tight break-words">
              {booking.pickupLocationName} → {booking.dropoffLocationName}
            </h3>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-400">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="truncate">
                {formatDateSafe(booking.requestTime, {
                  locale: "en-IN",
                  timeZone: "Asia/Kolkata",
                  variant: "datetime",
                  fallback: "—",
                  assumeUTCForMySQL: true,
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-row sm:flex-col items-start sm:items-end gap-2 sm:space-y-2">
          {booking.fare && (
            <span className="inline-flex items-center gap-1 text-green-400 font-semibold text-sm">
              <IndianRupee className="w-4 h-4" /> {booking.fare.toFixed(2)}
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold border ${
              booking.status === "COMPLETED"
                ? "bg-green-900/40 text-green-300 border-green-700"
                : booking.status === "CANCELLED"
                ? "bg-red-900/40 text-red-300 border-red-700"
                : booking.status === "IN_PROGRESS"
                ? "bg-blue-900/40 text-blue-300 border-blue-700"
                : "bg-yellow-900/40 text-yellow-300 border-yellow-700"
            }`}
          >
            {booking.status === "COMPLETED" && (
              <Check className="w-3 h-3" />
            )}
            {booking.status === "IN_PROGRESS" && (
              <CircleDashed className="w-3 h-3" />
            )}
            {booking.status === "CANCELLED" && (
              <X className="w-3 h-3" />
            )}
            {booking.status === "PENDING" && (
              <TriangleAlert className="w-3 h-3" />
            )}
            {booking.status.replace("_", " ")}
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-0 h-1 bg-white/60 group-hover:w-full transition-all duration-300 rounded-b-2xl"></div>
    </li>
  );
};

export default BookingCard;
