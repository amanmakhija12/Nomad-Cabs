import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RideStatusHeader } from "./RideStatusHeader";
import { RideInfoPanel } from "./RideInfoPanel";
import { RideActionFooter } from "./RideActionFooter";
import { MapPlaceholder } from "./MapPlaceholder";
import { Loader } from "lucide-react";
import { bookingService, driverBookingService } from "../../../services/bookingService";
import { useAuthStore } from "../../../store/authStore";
import { RideRating } from "./RideRating";
import { PaymentScreen } from "./PaymentScreen";

const ActiveRide = ({ onRideEnd }) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  // --- Core Data Fetching ---
  const fetchActiveRide = useCallback(async () => {
    if (!user) return; // Wait for user to be loaded

    try {
      let response;
      if (user.role === "RIDER") {
        response = await bookingService.getActiveRideForRider();
      } else {
        response = await driverBookingService.getActiveRideForDriver();
      }
      
      setBooking(response);
    } catch (error) {
      if (error.response?.status === 404) {
        // This is an expected "error": no active ride.
        toast.info("No active ride found. Redirecting...");
        navigate(user.role === "RIDER" ? "/rider" : "/driver");
      } else {
        console.error("Error fetching active ride:", error);
        toast.error(error.message || "Failed to fetch ride data");
      }
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  // --- Initial Load ---
  useEffect(() => {
    fetchActiveRide();
  }, [fetchActiveRide]); // Runs once on load

  // --- Polling for Real-Time Updates ---
  useEffect(() => {
    if (loading || !booking) return; // Don't poll until we have the first ride

    const interval = setInterval(() => {
      console.log("Polling for ride updates...");
      fetchActiveRide();
    }, 5000); // Poll every 10 seconds

    // Cleanup function
    return () => clearInterval(interval);
  }, [booking, loading, fetchActiveRide]);

  // --- Action Handlers (for buttons) ---

  const handleAction = async (actionFn, successMsg, redirectOnSuccess = false) => {
    setIsUpdating(true);
    try {
      const response = await actionFn();
      setBooking(response); // Update state immediately
      toast.success(successMsg);
      if (redirectOnSuccess) {
        navigate(user.role === "RIDER" ? "/rider" : "/driver");
      }
    } catch (error) {
      toast.error(error.message || "Action failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const onStartRide = () => handleAction(
    () => driverBookingService.startRide(booking.id),
    "Ride Started!"
  );
  
  const onCancelRide = () => handleAction(
    () => {
      bookingService.cancelRide(booking.id, "Cancelled by user")
      onRideEnd();
    },
    "Ride Cancelled!",
    true
  );

  const onCompleteRide = () => handleAction(
    () => driverBookingService.completeRide(booking.id),
    user.role === "RIDER" ? "Please complete the payment" : "Waiting for payment!",
    false
  );

  const handlePay = () => handleAction(
    () => bookingService.confirmPayment(booking.id),
    "Payment completed successfully!",
    false
  );

  const handleConfirm = () => handleAction(
    () => {
      driverBookingService.confirmCashPayment(booking.id)
      onRideEnd();
    },
    "Ride completed!",
    true
  );

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#151212]">
        <Loader className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  if (!booking) {
    // This state is usually only seen for a split second before redirect
    return <div className="p-6 text-white/60">No active ride found...</div>;
  }

  if (booking.status === 'AWAITING_PAYMENT') {
    return (
      <PaymentScreen
        userRole={user.role}
        booking={booking}
        onPayWithWallet={handlePay}
        onConfirmCash={handleConfirm}
      />
    );
  }

  if (booking.status === 'PAID') {
    return (
      <RideRating
        booking={booking}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white">
      {/* 1. Status Header */}
      <RideStatusHeader isRider={user.role === "RIDER"} status={booking.status} />
      
      {/* 2. (Mock) Map */}
      <MapPlaceholder />
      
      {/* 3. Info Panel (Who you're riding with) */}
      <RideInfoPanel 
        role={user.role} 
        driverName={booking.driverName} 
        riderName={booking.riderName} 
        driverPhone={booking.driverPhoneNumber}
        riderPhone={booking.riderPhoneNumber}
        driverRating={booking.driverRating}
        driverTotalRatings={booking.totalTrips}
        driverMemberSince={booking.driverCreatedAt}
      />
      
      {/* 4. Action Footer (Buttons) */}
      <RideActionFooter
        role={user.role}
        status={booking.status}
        isUpdating={isUpdating}
        onStartRide={onStartRide}
        onCompleteRide={onCompleteRide}
        onCancelRide={onCancelRide}
      />
    </div>
  );
};

export default ActiveRide;