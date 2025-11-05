import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  StepsProgress,
  StepRideDetails,
  StepVehicle,
  StepPayment,
} from "./BookingSteps";
import { bookingService } from "../../../services/bookingService";
import { toast } from "react-toastify";

// --- MOCK GEOCODING ---
// In a real app, you would replace this with an async call
// to a service like Google Maps Geocoding API.
const getCoordinatesFromAddress = async (address, type) => {
  if (type === 'pickup') {
    return { lat: 13.0827, lng: 80.2707 };
  } else {
    return { lat: 13.0674, lng: 80.2376 };
  }
};

const BookCab = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Use camelCase here to match the backend DTO from the start
  const [bookingData, setBookingData] = useState({
    pickupAddress: "",
    dropoffAddress: "",
    scheduledDate: "", // Note: Our backend doesn't support this yet
    scheduledTime: "", // Note: Our backend doesn't support this yet
    vehicleCategory: "",
    paymentMethod: "cash",
  });

  const updateField = (field, value) =>
    setBookingData((prev) => ({ ...prev, [field]: value }));
  
  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // 1. Get coordinates from addresses
      const pickupCoords = await getCoordinatesFromAddress(bookingData.pickupAddress, "pickup");
      const dropoffCoords = await getCoordinatesFromAddress(bookingData.dropoffAddress, "dropoff");
      
      // 2. Prepare payload for backend (MUST match RideRequestDTO.java)
      const payload = {
        pickupLat: pickupCoords.lat,
        pickupLng: pickupCoords.lng,
        pickupAddress: bookingData.pickupAddress,
        dropoffLat: dropoffCoords.lat,
        dropoffLng: dropoffCoords.lng,
        dropoffAddress: bookingData.dropoffAddress,
        vehicleCategory: bookingData.vehicleCategory.toUpperCase(),
      };
      
      // 3. Call backend API (Axios handles errors in catch block)
      const result = await bookingService.createBooking(payload);
      
      // 'result' is the RideResponseDTO from the backend
      toast.success("Booking created! Finding drivers...", {
        theme: "dark",
        autoClose: 3000,
      });
      
      // Reset form
      setBookingData({
        pickupAddress: "",
        dropoffAddress: "",
        scheduledDate: "",
        scheduledTime: "",
        vehicleCategory: "",
        paymentMethod: "cash",
      });
      setStep(1);
      
      // Navigate to bookings page
      setTimeout(() => {
        navigate("/rider");
      }, 2000);

    } catch (error) {
      // 4. Handle errors from Axios
      console.error('Booking error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create booking';
      toast.error(`${errorMessage}`, {
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