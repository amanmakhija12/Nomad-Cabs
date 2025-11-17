import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Bookings from "../components/Common/Bookings/Bookings";
import ManageAccount from "../components/Common/ManageAccount/ManageAccount";
import BookCab from "../components/Rider_Modules/BookACab/BookCab";
import Wallet from "../components/Common/Wallet/Wallet";
import ActiveRide from "../components/Common/Ride/ActiveRide";
import { useAuthStore } from "../store/authStore";
import { bookingService } from "../services/bookingService";
import ActiveRideBanner from "../components/Common/ActiveRideBanner";

const RiderPage = () => {
  const [activeSection, setActiveSection] = useState("bookCab");
  
  
  const [booking, setBooking] = useState(null); 
  
  
  const [isLoading, setIsLoading] = useState(true);
  
  const user = useAuthStore((state) => state.user);

  
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const checkActiveRide = async () => {
      try {
        
        const response = await bookingService.getActiveRideForRider();
        if (isMounted && response) {
          setBooking(response);
        }
      } catch (error) {
        if (isMounted && error.response?.status !== 404) {
          console.error("Error checking for active ride:", error);
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
          
          <ActiveRide onRideEnd={() => setBooking(null)} />
        ) : (
          
          <BookCab onBookingSuccess={setBooking} />
        )
      )}
      
      {}
      {activeSection === "myBooking" && <Bookings />}
      {activeSection === "wallet" && <Wallet />}
      {activeSection === "account" && <ManageAccount />}

      {booking && activeSection !== "bookCab" && (
        <ActiveRideBanner setActiveSection={switchActiveRideSection} />
      )}
      
    </Sidebar>
  );
};
export default RiderPage;