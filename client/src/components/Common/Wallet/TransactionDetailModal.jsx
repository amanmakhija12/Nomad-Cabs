import { X } from "lucide-react";
import { formatDateSafe } from "../../../utils/DateUtil";

// Helper component for rows
const InfoRow = ({ label, value, isMono = false }) => (
  <div className="flex justify-between items-center py-3 border-b border-white/5 last:border-b-0">
    <span className="text-sm text-white/50">{label}</span>
    <span className={`text-sm font-medium text-white/90 ${isMono ? 'font-mono' : ''}`}>
      {value}
    </span>
  </div>
);

// Helper component for fare rows
const FareRow = ({ label, value, isTotal = false }) => (
  <div className={`flex justify-between items-center py-2 ${isTotal ? 'text-lg font-bold border-t border-white/10 pt-3 mt-2' : 'text-sm'}`}>
    <span className={isTotal ? 'text-white' : 'text-white/60'}>{label}</span>
    <span className={isTotal ? 'text-white' : 'text-white/90'}>
      ₹{Math.abs(value).toFixed(2)}
    </span>
  </div>
);

const TransactionDetailModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-[#141414] rounded-2xl shadow-2xl border border-white/10 w-full max-w-lg max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-white">Transaction Details</h2>
            <p className="text-sm text-white/50 font-mono">{transaction.id}</p>
          </div>
          <button onClick={onClose} className="h-9 w-9 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Fare Breakdown */}
          <div className="bg-[#1f1f1f] rounded-xl border border-white/10 p-5">
            <h3 className="text-md font-semibold text-white mb-3">Fare Breakdown</h3>
            <div className="space-y-1">
              <FareRow label="Base Fare" value={transaction.baseFare} />
              <FareRow label="Surcharge" value={transaction.surchargeFees} />
              <FareRow label="Taxes (GST)" value={transaction.taxes} />
              <FareRow label="Discount" value={-transaction.discount} />
              <FareRow label="Total Fare" value={transaction.totalFare} isTotal />
            </div>
          </div>

          {/* Ride Details */}
          <div className="bg-[#1f1f1f] rounded-xl border border-white/10 p-5">
            <h3 className="text-md font-semibold text-white mb-2">Ride Details</h3>
            <div className="space-y-1">
              <InfoRow label="Booking ID" value={transaction.bookingId} isMono />
              <InfoRow label="Rider" value={transaction.riderName} />
              <InfoRow label="Driver" value={transaction.driverName} />
              <InfoRow label="Pickup" value={transaction.pickupAddress} />
              <InfoRow label="Dropoff" value={transaction.dropoffAddress} />
              <InfoRow label="Date" value={formatDateSafe(transaction.createdAt)} />
              <InfoRow label="Payment Status" value={transaction.paymentStatus} />
              <InfoRow label="Booking Status" value={transaction.bookingStatus} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;