import { useState } from "react";
import { toast } from "react-toastify";
import { Star, User } from "lucide-react";
import { bookingService } from "../../../services/bookingService";


const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex justify-center gap-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={40}
          className={`cursor-pointer transition-all ${
            star <= rating ? "text-yellow-400" : "text-gray-600"
          }`}
          onClick={() => setRating(star)}
          onMouseEnter={() => setRating(star)} 
        />
      ))}
    </div>
  );
};

export const RideRating = ({ booking, onRideEnd }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await bookingService.rateRide(booking.id, { rating, feedback });
      toast.success("Thank you for your feedback!");
      onRideEnd();
    } catch (error) {
      toast.error(error.message || "Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    await bookingService.rateRide(booking.id);
    toast.success("Ride Completed!");
    onRideEnd();
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white p-6 justify-center items-center">
      <div className="w-full max-w-md text-center">
        
        <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
          <User className="w-12 h-12 text-white/80" />
        </div>
        
        <h1 className="text-3xl font-semibold text-white">
          How was your ride with {booking.driverName}?
        </h1>
        <p className="text-white/60 mt-2 mb-8">
          Your feedback helps us improve the experience.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <StarRating rating={rating} setRating={setRating} />
          
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Add a comment... (optional)"
            className="w-full h-24 p-4 rounded-xl bg-[#1a1a1a] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
          />

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="w-full h-12 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Rating"}
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="w-full h-12 text-white/50 hover:text-white transition"
            >
              Skip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};