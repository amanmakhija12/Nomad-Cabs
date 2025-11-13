import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Bookings from "../components/Common/Bookings/Bookings";
import ManageAccount from "../components/Common/ManageAccount/ManageAccount";
import BookCab from "../components/Rider_Modules/BookACab/BookCab";
import Wallet from "../components/Common/Wallet/Wallet";
import ActiveRide from "../components/Common/Ride/ActiveRide";
import { useAuthStore } from "../store/authStore";
import { bookingService } from "../services/bookingService";

const RiderPage = () => {
  const [activeSection, setActiveSection] = useState("bookCab");
  
  // 4. The booking state now LIVES in RiderPage.
  const [booking, setBooking] = useState(null); 
  
  // 5. We still have the loading state.
  const [isLoading, setIsLoading] = useState(true);
  
  const user = useAuthStore((state) => state.user);

  // 6. We move the hook's logic into the page's useEffect
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const checkActiveRide = async () => {
      try {
        // Only checking for RIDER here
        const response = await bookingService.getActiveRideForRider();
        if (isMounted && response) {
          setBooking(response);
        }
      } catch (error) {
        if (isMounted && error.response?.status !== 404) {
          console.error("Error checking for active ride:", error);
        }
        // On 404 or any error, booking remains null (which is correct)
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

  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#151212]">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/10 border-t-white" />
      </div>
    );
  }

  const riderNavItems = [
    { id: "bookCab", label: booking ? "Active Ride" : "Book a Cab" },
    { id: "myBooking", label: "My Bookings" },
    { id: "account", label: "Manage Account" },
    { id: "wallet", label: "Wallet" },
  ];

  const switchActiveRideSection = () => setActiveSection("bookCab");
  
  return (
    <Sidebar
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      navItems={riderNavItems}
    >
      {activeSection === "bookCab" && (
        booking ? (
          // 7. Pass setBooking to ActiveRide
          <ActiveRide onRideEnd={() => setBooking(null)} />
        ) : (
          // 8. Pass setBooking to BookCab
          <BookCab onBookingSuccess={setBooking} />
        )
      )}
      
      {/* 9. The other pages still get the booking object for the banner */}
      {activeSection === "myBooking" && <Bookings activeBooking={booking} setActiveSection={switchActiveRideSection} />}
      {activeSection === "wallet" && <Wallet activeBooking={booking} setActiveSection={switchActiveRideSection} />}
      {activeSection === "account" && <ManageAccount activeBooking={booking} setActiveSection={switchActiveRideSection} />}
    </Sidebar>
  );
};
export default RiderPage;