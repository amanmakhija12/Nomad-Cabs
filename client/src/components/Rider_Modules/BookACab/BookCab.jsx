import { useState } from "react";
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
} from "./bookingData";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../store/authStore";


const BookCab = () => {
  const user =useAuthStore((s)=>s.user);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    pickupAddress: "",
    dropoffAddress: "",
    scheduledDate: "",
    scheduledTime: "",
    vehicleType: "",
    paymentMethod: "cash",
  });

  const updateField = (field, value) =>
    setBookingData((prev) => ({ ...prev, [field]: value }));
  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    setLoading(true);
    const fare = bookingData.vehicleType
      ? calculateFare(5, bookingData.vehicleType)
      : null; 
    const payload = {
      pickup_address: bookingData.pickupAddress,
      dropoff_address: bookingData.dropoffAddress,
      scheduled_date: bookingData.scheduledDate || null,
      scheduled_time: bookingData.scheduledTime || null,
      vehicle_type: bookingData.vehicleType,
      payment_method: bookingData.paymentMethod,
      rider_id: user.id,
      driver_id:null,
      fare_amount: fare?.total ?? null,
      trip_distance_km: fare?.distanceKm ?? null,
      trip_duration_minutes: null,
    };
    const res = await createBooking(payload);
    if (res.success) {
      setStep(1);
      setBookingData({
        pickupAddress: "",
        dropoffAddress: "",
        scheduledDate: "",
        scheduledTime: "",
        vehicleType: "",
        paymentMethod: "cash",
      });
      toast.success("Booking created");
    } else {
      alert(res.error || "Failed");
    }
    setLoading(false);
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

        <div className="hidden">
          {vehicleTypes.length} {paymentMethods.length}
        </div>
      </div>
    </div>
  );
};

export default BookCab;
