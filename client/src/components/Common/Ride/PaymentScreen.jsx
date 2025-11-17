import { Wallet, DollarSign, MapPin } from "lucide-react";

const Spinner = () => (
  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
);

export const PaymentScreen = ({
  userRole,
  booking,
  onPayWithWallet,
  onConfirmCash,
  isUpdating,
}) => {
  const totalFare = booking.fare || 0;
  const taxes = totalFare * 0.05;
  const distanceFare = totalFare * 0.75;
  const baseFare = totalFare - (taxes + distanceFare);

  const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;

  const handleWalletPay = async () => {
    await onPayWithWallet();
  };

  const handleCashConfirm = async () => {
    await onConfirmCash();
  };

  const FareRow = ({ label, value, isTotal = false }) => (
    <div
      className={`flex justify-between items-center py-4 ${
        isTotal
          ? "text-white font-semibold text-lg border-t border-dashed border-white/20"
          : "text-white/60"
      }`}
    >
      <span>{label}</span>
      <span className={isTotal ? "text-green-300" : "text-white/80"}>
        {value}
      </span>
    </div>
  );

  const LocationRow = ({ location, isPickup }) => (
    <div className="flex items-start gap-3">
      <MapPin
        className={`w-5 h-5 mt-1 ${
          isPickup ? "text-green-300" : "text-red-300"
        }`}
      />
      <div>
        <span className="text-xs text-white/50">
          {isPickup ? "From" : "To"}
        </span>
        <p className="text-sm font-medium text-white/90">{location}</p>
      </div>
    </div>
  );

  const ActionButton = () => {
    if (userRole === "RIDER") {
      return (
        <button
          onClick={handleWalletPay}
          disabled={isUpdating}
          className="w-full h-14 flex items-center justify-center gap-3 rounded-xl bg-green-500 text-black font-bold text-lg hover:bg-green-400 transition disabled:opacity-50"
        >
          {isUpdating ? (
            <Spinner />
          ) : (
            <>
              <Wallet className="w-6 h-6" />
              Pay {formatCurrency(totalFare)} with Wallet
            </>
          )}
        </button>
      );
    }

    if (userRole === "DRIVER") {
      return (
        <button
          onClick={handleCashConfirm}
          disabled={isUpdating}
          className="w-full h-14 flex items-center justify-center gap-3 rounded-xl bg-blue-500 text-white font-bold text-lg hover:bg-blue-400 transition disabled:opacity-50"
        >
          {isUpdating ? (
            <Spinner />
          ) : (
            <>
              <DollarSign className="w-6 h-6" />
              Confirm Cash Payment Received
            </>
          )}
        </button>
      );
    }
    return null;
  };

  return (
    <div className="w-full min-h-screen bg-[#111111] p-4 flex flex-col justify-center items-center">
      <div className="bg-[#1c1c1c] rounded-2xl border border-white/10 shadow-2xl max-w-md w-full">
        {}
        <div className="p-6 text-center border-b border-white/10">
          <h1 className="text-2xl font-semibold text-white">Ride Completed!</h1>
          <p className="text-white/50 text-sm mt-1">
            {userRole === "RIDER"
              ? "Please complete your payment."
              : "Please collect payment from rider."}
          </p>
        </div>

        {}
        <div className="p-8 text-center">
          <span className="text-sm text-white/60">Total Fare</span>
          <h2 className="text-5xl font-bold text-green-300 mt-2">
            {formatCurrency(totalFare)}
          </h2>
        </div>

        {}
        <div className="px-8 space-y-6">
          {}
          <div className="space-y-4">
            <LocationRow
              location={booking.pickupLocationName}
              isPickup={true}
            />
            <LocationRow
              location={booking.dropoffLocationName}
              isPickup={false}
            />
          </div>

          {}
          <div className="border-t border-white/10 pt-2">
            <FareRow label="Base Fare" value={formatCurrency(baseFare)} />
            <FareRow
              label="Distance Fare"
              value={formatCurrency(distanceFare)}
            />
            <FareRow label="Taxes & Fees" value={formatCurrency(taxes)} />
            <FareRow
              label="Total"
              value={formatCurrency(totalFare)}
              isTotal={true}
            />
          </div>
        </div>

        {}
        <div className="p-8">
          <ActionButton />
        </div>
      </div>
    </div>
  );
};
