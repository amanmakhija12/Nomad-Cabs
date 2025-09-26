import {
  IndianRupee,
  Check,
  CircleDashed,
  X,
  TriangleAlert,
  Calendar,
} from "lucide-react";
import { formatDateSafe } from "../../../utils/DateUtil";

const BookingCard = ({ booking, isRider, onBookingClick }) => {
  return (
    <li
      onClick={() => onBookingClick(booking)}
      className="group relative bg-[#141414] p-6 border border-white/10 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/0 transition-all" />

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex items-start space-x-4 flex-grow">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
              {isRider ? (
                <span className="text-sm font-bold">R</span>
              ) : (
                <span className="text-sm font-bold">D</span>
              )}
            </div>
          </div>

          <div className="flex-grow min-w-0">
            <h3 className="text-lg font-semibold text-white group-hover:text-white mb-1">
              {booking.pickup_address} → {booking.dropoff_address}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDateSafe(booking.created_at, {
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

        <div className="flex-shrink-0 flex flex-col items-end space-y-2">
          {booking.fare_amount && (
            <span className="inline-flex items-center gap-1 text-green-400 font-semibold">
              <IndianRupee className="w-4 h-4" /> {booking.fare_amount}
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
              booking.booking_status === "completed"
                ? "bg-green-900/40 text-green-300 border-green-700"
                : booking.booking_status === "cancelled"
                ? "bg-red-900/40 text-red-300 border-red-700"
                : booking.booking_status === "in_progress"
                ? "bg-blue-900/40 text-blue-300 border-blue-700"
                : "bg-yellow-900/40 text-yellow-300 border-yellow-700"
            }`}
          >
            {booking.booking_status === "completed" && (
              <Check className="w-3 h-3" />
            )}
            {booking.booking_status === "in_progress" && (
              <CircleDashed className="w-3 h-3" />
            )}
            {booking.booking_status === "cancelled" && (
              <X className="w-3 h-3" />
            )}
            {booking.booking_status === "requested" && (
              <TriangleAlert className="w-3 h-3" />
            )}
            {booking.booking_status.replace("_", " ").toUpperCase()}
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-0 h-1 bg-white/60 group-hover:w-full transition-all duration-300 rounded-b-2xl"></div>
    </li>
  );
};

export default BookingCard;
