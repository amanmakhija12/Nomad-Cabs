import { formatDateSafe } from "../../../utils/DateUtil";
import {
  Check,
  CircleDashed,
  IndianRupee,
  TriangleAlert,
  X,
} from "lucide-react";
import { getInitial } from "../../../utils/getInitial";

const BookingCards = ({ booking, isRider, onClose }) => {
  return (
    booking && (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-[#141414] text-white rounded-2xl shadow-2xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
          <div className="p-8">
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute top-4 right-4 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white text-black rounded-full mb-4">
                <span className="text-lg font-bold">
                  {getInitial(isRider ? booking.driverName : booking.riderName)}
                </span>
              </div>
              <p className="text-gray-300">
                {formatDateSafe(booking.requestTime, {
                  locale: "en-IN",
                  timeZone: "Asia/Kolkata",
                  variant: "datetime",
                  fallback: "—",
                  assumeUTCForMySQL: true,
                })}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10">
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Pickup
                </label>
                <div className="text-white/90 font-medium">
                  {booking.pickupLocationName}
                </div>
              </div>
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10">
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Dropoff
                </label>
                <div className="text-white/90 font-medium">
                  {booking.dropoffLocationName}
                </div>
              </div>
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10">
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
                  {isRider ? "Driver Name" : "Rider Name"}
                </label>
                <div className="text-white/90 font-medium">
                  {isRider ? (booking.acceptedTime ? booking.driverName : "-") : booking.riderName}
                </div>
              </div>
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10">
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
                  {isRider ? "Driver Mobile Number" : "Rider Mobile Number"}
                </label>
                <div className="text-white/90 font-medium">
                  {booking.driverPhoneNumber || "—"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10">
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Fare
                </label>
                <div className="text-green-400 font-semibold inline-flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />{" "}
                  {booking.fare.toFixed(2)}
                </div>
              </div>
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10">
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Status
                </label>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                    booking.status === "completed"
                      ? "bg-green-900/40 text-green-300 border-green-700"
                      : booking.status === "cancelled"
                      ? "bg-red-900/40 text-red-300 border-red-700"
                      : booking.status === "in_progress"
                      ? "bg-blue-900/40 text-blue-300 border-blue-700"
                      : "bg-yellow-900/40 text-yellow-300 border-yellow-700"
                  }`}
                >
                  {booking.status === "completed" && (
                    <Check className="w-3 h-3" />
                  )}
                  {booking.status === "in_progress" && (
                    <CircleDashed className="w-3 h-3" />
                  )}
                  {booking.status === "cancelled" && (
                    <X className="w-3 h-3" />
                  )}
                  {booking.status === "requested" && (
                    <TriangleAlert className="w-3 h-3" />
                  )}
                  {booking.status?.replace("_", " ").toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default BookingCards;
