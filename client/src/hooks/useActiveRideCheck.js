import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { bookingService, driverBookingService } from '../services/bookingService';

export const useActiveRideCheck = () => {
  const user = useAuthStore((state) => state.user);
  // This state now holds the booking object or null
  const [booking, setBooking] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const checkActiveRide = async () => {
      try {
        let response;
        if (user.role.toUpperCase() === 'RIDER') {
          response = await bookingService.getActiveRideForRider();
        } else if (user.role.toUpperCase() === 'DRIVER') {
          response = await driverBookingService.getActiveRideForDriver();
        }

        if (isMounted && response && response.data) {
          setBooking(response.data); // <-- Set the booking object
        } else if (isMounted) {
          setBooking(null); // <-- Explicitly set to null
        }
        
      } catch (error) {
        if (isMounted) {
          if (error.response?.status !== 404) {
            console.error("Error checking for active ride:", error);
          }
          setBooking(null); // <-- Set to null on 404 or other errors
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkActiveRide();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Return the booking and a loading state
  return { booking, isLoading }; 
};