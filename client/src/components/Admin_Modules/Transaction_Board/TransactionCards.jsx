import { X } from "lucide-react";
import { formatDateSafe } from "../../../utils/DateUtil";

const VerifyCard = ({ label, ok }) => (
  <div
    className={`p-4 rounded-xl border text-center space-y-3 transition relative overflow-hidden ${
      ok
        ? "border-emerald-400/30 bg-emerald-500/10"
        : "border-red-400/30 bg-red-500/10"
    }`}
  >
    <div
      className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white text-sm font-semibold ${
        ok ? "bg-emerald-500" : "bg-red-500"
      }`}
    >
      {ok ? "✓" : "✕"}
    </div>
    <h4 className="text-[11px] font-medium tracking-wide text-white/70 uppercase leading-snug px-1">
      {label}
    </h4>
    <p
      className={`text-[11px] font-semibold tracking-wide ${
        ok ? "text-emerald-300" : "text-red-300"
      }`}
    >
      {ok ? "Verified" : "Not Verified"}
    </p>
  </div>
);

const InfoPanel = ({ title, children }) => (
  <div className="bg-[#181818] rounded-xl p-5 border border-white/10">
    <h3 className="text-xs font-semibold tracking-wide text-white/60 uppercase mb-4 flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-white/30" /> {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const InfoRow = ({ label, value, mono, cap }) => (
  <div className="flex justify-between items-center pb-2 border-b border-white/5 last:border-none last:pb-0">
    <span className="text-[11px] tracking-wide text-white/40 uppercase">
      {label}
    </span>
    <span
      className={`text-[12px] font-medium text-white/90 ${
        mono ? "font-mono" : ""
      } ${cap ? "capitalize" : ""}`}
    >
      {value}
    </span>
  </div>
);

const TransactionCards = ({ transaction, onClose }) => {
  if (!transaction) return null;
  const stop = (e) => e.stopPropagation();

  const getStatusBadge = (status) => {
    const statusClasses = {
      COMPLETED: "bg-emerald-900/40 text-emerald-300 border-emerald-700",
      CANCELLED: "bg-red-900/40 text-red-300 border-red-700",
      IN_PROGRESS: "bg-blue-900/40 text-blue-300 border-blue-700",
      RATING: "bg-yellow-900/40 text-yellow-300 border-yellow-700",
      REQUESTED: "bg-gray-700 text-gray-300 border-gray-600",
    };
    return statusClasses[status] || "bg-gray-700 text-gray-300 border-gray-600";
  };

  const getPaymentBadge = (status) => {
    const statusClasses = {
      SUCCESSFUL: "bg-emerald-900/40 text-emerald-300 border-emerald-700",
      CANCELLED: "bg-red-900/40 text-red-300 border-red-700",
      PENDING: "bg-yellow-900/40 text-yellow-300 border-yellow-700",
      FAILED: "bg-red-900/40 text-red-300 border-red-700",
    };
    return statusClasses[status] || "bg-gray-700 text-gray-300 border-gray-600";
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#141414] rounded-2xl shadow-2xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar relative"
        onClick={stop}
      >
        <div className="p-8 bg-gradient-to-r from-[#181818] via-[#151515] to-[#141414] rounded-t-2xl border-b border-white/10 relative">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-5 right-5 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/15 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-red-700 rounded-full mb-4 mx-auto shadow-sm flex items-center justify-center">
              <span className="text-3xl text-white font-bold">📄</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Transaction Details
            </h2>
            <p className="text-white/60 mt-2 text-lg font-mono">
              {transaction.bookingId}
            </p>
            <div className="mt-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                  "COMPLETED"
                )}`}
              >
                COMPLETED
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InfoPanel title="User Details">
              <InfoRow label="Rider" value={transaction.riderName} />
              <InfoRow
                label="Rider Phone"
                value={transaction.riderPhone}
                mono
              />
              <InfoRow label="Driver" value={transaction.driverName} />
              <InfoRow
                label="Driver Phone"
                value={transaction.driverPhone}
                mono
              />
            </InfoPanel>

            <InfoPanel title="Trip Details">
              <InfoRow label="Pickup" value={transaction.pickupAddress} />
              <InfoRow label="Dropoff" value={transaction.dropoffAddress} />
              <InfoRow
                label="Created At"
                value={formatDateSafe(transaction.timestamp, {
                  variant: "datetime",
                })}
              />
            </InfoPanel>
          </div>

          <div className="bg-[#1f1f1f] rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Fare Breakdown
            </h3>
            <div className="space-y-2">
              <FareRow label="Base Fare" value={transaction.baseFare} />
              <FareRow label="Distance Fare" value={transaction.distanceFare} />
              <FareRow label="Taxes & Fees (GST)" value={transaction.taxes} />
              {transaction.discount > 0 && (
                <FareRow label="Discount" value={-transaction.discount} />
              )}
              <FareRow
                label="Total Fare"
                value={transaction.totalFare}
                isTotal
              />
              <FareRow
                label="Commission Fee"
                value={transaction.commissionFee}
              />
              <FareRow
                label="Driver Payout"
                value={transaction.totalFare - transaction.commissionFee}
                isTotal
              />
            </div>
          </div>

          <div className="text-center">
            <span
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getPaymentBadge(
                "SUCCESSFUL"
              )}`}
            >
              SUCCESSFUL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FareRow = ({ label, value, isTotal = false }) => (
  <div
    className={`flex justify-between items-center py-2 ${
      isTotal
        ? "text-lg font-bold border-t border-white/10 pt-3 mt-2"
        : "text-sm"
    }`}
  >
    <span className={isTotal ? "text-white" : "text-white/60"}>{label}</span>
    <span className={isTotal ? "text-white" : "text-white/90"}>
      {value < 0 ? "-" : ""}₹{Math.abs(value || 0).toFixed(2)}
    </span>
  </div>
);

export default TransactionCards;
