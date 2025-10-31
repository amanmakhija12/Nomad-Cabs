import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  StepsProgress,
  StepRideDetails,
  StepVehicle,
  StepPayment,
} from "./BookingSteps";
import {
  vehicleTypes,
  paymentMethods,
  createBooking,
  calculateFare,
  getCoordinatesFromAddress,
} from "./bookingData";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../store/authStore";

const BookCab = () => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    pickup_address: "",
    dropoff_address: "",
    scheduled_date: "",
    scheduled_time: "",
    vehicle_type: "",
    payment_method: "cash",
  });

  const updateField = (field, value) =>
    setBookingData((prev) => ({ ...prev, [field]: value }));
  
  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Get coordinates from addresses
      const pickupCoords = await getCoordinatesFromAddress(bookingData.pickupAddress);
      const dropoffCoords = await getCoordinatesFromAddress(bookingData.dropoffAddress);
      
      // Prepare payload for backend
      const payload = {
        pickup_latitude: pickupCoords.lat,
        pickup_longitude: pickupCoords.lng,
        pickup_address: bookingData.pickupAddress,
        dropoff_latitude: dropoffCoords.lat,
        dropoff_longitude: dropoffCoords.lng,
        dropoff_address: bookingData.dropoffAddress,
        vehicle_type: bookingData.vehicleType.toUpperCase(), // Backend expects uppercase
      };
      
      console.log('Creating booking with payload:', payload);
      
      // Call backend API
      const result = await createBooking(payload, token);
      
      if (result.success) {
        toast.success("🎉 Booking created successfully! Finding nearby drivers...", {
          theme: "dark",
          autoClose: 3000,
        });
        
        // Reset form
        setBookingData({
          pickup_address: "",
          dropoff_address: "",
          scheduled_date: "",
          scheduled_time: "",
          vehicle_type: "",
          payment_method: "cash",
        });
        setStep(1);
        
        // Navigate to bookings page after 2 seconds
        setTimeout(() => {
          navigate("/rider/bookings");
        }, 2000);
      } else {
        toast.error(`❌ ${result.error}`, {
          theme: "dark",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(`❌ ${error.message || 'Failed to create booking'}`, {
        theme: "dark",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#151212] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-semibold mb-2">Book a Ride</h1>
          <p className="text-gray-400">Choose your ride and get moving</p>
        </header>

        <StepsProgress step={step} />

        <div className="bg-[#141414] p-8 rounded-2xl border border-white/10">
          {step === 1 && (
            <StepRideDetails
              data={bookingData}
              onChange={updateField}
              onNext={next}
            />
          )}
          {step === 2 && (
            <StepVehicle
              data={bookingData}
              onChange={updateField}
              onNext={next}
              onBack={back}
            />
          )}
          {step === 3 && (
            <StepPayment
              data={bookingData}
              onChange={updateField}
              onBack={back}
              onSubmit={handleSubmit}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCab;