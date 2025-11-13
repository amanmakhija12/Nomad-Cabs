import { useState } from "react";
import { Wallet, DollarSign, MapPin, Check, ArrowRight } from "lucide-react";

// Reusable spinner
const Spinner = () => <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />;

/**
 * A beautiful post-ride payment screen.
 *
 * @param {object} props
 * @param {'RIDER' | 'DRIVER'} props.userRole - The role of the person viewing the screen.
 * @param {object} props.booking - The booking object (must have 'fare', 'pickupLocationName', 'dropoffLocationName').
 * @param {function} props.onPayWithWallet - Async function to call when rider pays.
 * @param {function} props.onConfirmCash - Async function to call when driver confirms.
 * @returns 
 */
export const PaymentScreen = ({ userRole, booking, onPayWithWallet, onConfirmCash }) => {
  const [loading, setLoading] = useState(false);

  // --- Fare Breakdown Logic ---
  // Replicating the backend's logic for display purposes.
  // Assumes booking.fare is the total fare.
  const totalFare = booking.fare || 0;
  const taxes = totalFare * 0.05;          // 5% Tax
  const distanceFare = totalFare * 0.75; // 75% Distance
  const baseFare = totalFare - (taxes + distanceFare);

  const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;

  // --- Handlers ---
  const handleWalletPay = async () => {
    setLoading(true);
    try {
      await onPayWithWallet();
      // On success, this component will likely be unmounted by a parent.
    } catch (error) {
      console.error("Payment failed", error);
      // You can show a toast message here
      setLoading(false);
    }
  };

  const handleCashConfirm = async () => {
    setLoading(true);
    try {
      await onConfirmCash();
    } catch (error) {
      console.error("Cash confirmation failed", error);
      // You can show a toast message here
      setLoading(false);
    }
  };

  // --- Sub-Components ---
  const FareRow = ({ label, value, isTotal = false }) => (
    <div className={`flex justify-between items-center py-4 ${isTotal ? 'text-white font-semibold text-lg border-t border-dashed border-white/20' : 'text-white/60'}`}>
      <span>{label}</span>
      <span className={isTotal ? 'text-green-300' : 'text-white/80'}>{value}</span>
    </div>
  );

  const LocationRow = ({ location, isPickup }) => (
    <div className="flex items-start gap-3">
      <MapPin className={`w-5 h-5 mt-1 ${isPickup ? 'text-green-300' : 'text-red-300'}`} />
      <div>
        <span className="text-xs text-white/50">{isPickup ? "From" : "To"}</span>
        <p className="text-sm font-medium text-white/90">{location}</p>
      </div>
    </div>
  );

  const ActionButton = () => {
    if (userRole === 'RIDER') {
      return (
        <button
          onClick={handleWalletPay}
          disabled={loading}
          className="w-full h-14 flex items-center justify-center gap-3 rounded-xl bg-green-500 text-black font-bold text-lg hover:bg-green-400 transition disabled:opacity-50"
        >
          {loading ? (
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

    if (userRole === 'DRIVER') {
      return (
        <button
          onClick={handleCashConfirm}
          disabled={loading}
          className="w-full h-14 flex items-center justify-center gap-3 rounded-xl bg-blue-500 text-white font-bold text-lg hover:bg-blue-400 transition disabled:opacity-50"
        >
          {loading ? (
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
        
        {/* Header */}
        <div className="p-6 text-center border-b border-white/10">
          <h1 className="text-2xl font-semibold text-white">Ride Completed!</h1>
          <p className="text-white/50 text-sm mt-1">
            {userRole === 'RIDER' ? "Please complete your payment." : "Please collect payment from rider."}
          </p>
        </div>
        
        {/* Total Fare */}
        <div className="p-8 text-center">
          <span className="text-sm text-white/60">Total Fare</span>
          <h2 className="text-5xl font-bold text-green-300 mt-2">
            {formatCurrency(totalFare)}
          </h2>
        </div>

        {/* Ride & Fare Details */}
        <div className="px-8 space-y-6">
          {/* Ride Details */}
          <div className="space-y-4">
            <LocationRow location={booking.pickupLocationName} isPickup={true} />
            <LocationRow location={booking.dropoffLocationName} isPickup={false} />
          </div>

          {/* Fare Details */}
          <div className="border-t border-white/10 pt-2">
            <FareRow label="Base Fare" value={formatCurrency(baseFare)} />
            <FareRow label="Distance Fare" value={formatCurrency(distanceFare)} />
            <FareRow label="Taxes & Fees" value={formatCurrency(taxes)} />
            <FareRow label="Total" value={formatCurrency(totalFare)} isTotal={true} />
          </div>
        </div>
        
        {/* Action Button */}
        <div className="p-8">
          <ActionButton />
        </div>
        
      </div>
    </div>
  );
};

// Example of how to use it in a parent component
/*
export const ParentComponent = ()S => {
  const [booking, setBooking] = useState({
    id: "b-123",
    fare: 185.00,
    pickupLocationName: "123 Main St, Downtown",
    dropoffLocationName: "456 Oak Ave, Suburbs",
    status: "AWAITING_PAYMENT"
  });

  // Example role - 'RIDER' or 'DRIVER'
  const userRole = 'RIDER'; 

  const handlePay = async () => {
    // Simulating API call
    console.log("Processing payment...");
    await new Promise(res => setTimeout(res, 2000));
    console.log("Payment successful!");
    // Here you would refetch the booking, which would change its status
    // and this component would unmount.
  };

  const handleConfirm = async () => {
    // Simulating API call
    console.log("Confirming cash...");
    await new Promise(res => setTimeout(res, 2000));
    console.log("Cash confirmed!");
  };

  if (booking.status !== 'AWAITING_PAYMENT') {
    return <div>Ride is not awaiting payment.</div>;
  }

  return (
    <PaymentScreen
      userRole={userRole}
      booking={booking}
      onPayWithWallet={handlePay}
      onConfirmCash={handleConfirm}
    />
  );
};
*/