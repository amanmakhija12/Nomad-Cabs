import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { bookingService, driverBookingService } from '../services/bookingService';

export const useActiveRideCheck = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) return; // Not logged in, do nothing

    const checkActiveRide = async () => {
      try {
        let response;
        if (user.role.toUpperCase() === 'RIDER') {
          response = await bookingService.getActiveRideForRider();
        } else if (user.role.toUpperCase() === 'DRIVER') {
          response = await driverBookingService.getActiveRideForDriver();
        }

        // If we get a 200 OK, a ride exists!
        if (response && response.data) {
          console.log("Active ride found, redirecting...", response.data);
          navigate('/ride'); // Redirect to the common ride page
        }
        
      } catch (error) {
        // A 404 error is *expected*. It just means no active ride.
        // We only care about non-404 errors.
        if (error.response?.status !== 404) {
          console.error("Error checking for active ride:", error);
        } else {
          console.log("No active ride found. Staying on dashboard.");
        }
      }
    };

    checkActiveRide();
  }, [user, navigate]);
};