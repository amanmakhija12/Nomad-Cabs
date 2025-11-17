import { useState, useEffect } from "react"; 
import Sidebar from "../components/Sidebar/Sidebar";
import Bookings from "../components/Common/Bookings/Bookings";
import ManageAccount from "../components/Common/ManageAccount/ManageAccount";
import VehicleCards from "../components/Driver_Modules/Vehicles/VehicleCards";
import Verification from "../components/Driver_Modules/Verification/Verification";
import LiveBooking from "../components/Driver_Modules/LiveBooking/LiveBooking";
import Wallet from "../components/Common/Wallet/Wallet";
import ActiveRide from "../components/Common/Ride/ActiveRide";
import { useAuthStore } from "../store/authStore"; 
import { driverBookingService } from "../services/bookingService"; 
import ActiveRideBanner from "../components/Common/ActiveRideBanner";

const DriverPage = () => {
  const [activeSection, setActiveSection] = useState("liveBookings");

  
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
        const response = await driverBookingService.getActiveRideForDriver();
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

  const driverNavItems = [
    { id: "liveBookings", label: booking ? "Active Ride" : "Live Bookings" },
    { id: "bookings", label: "My Bookings" },
    { id: "vehicles", label: "Manage Vehicles" },
    { id: "verification", label: "Verification" },
    { id: "wallet", label: "Wallet" },
    { id: "account", label: "Manage Account" },
  ];

  const switchActiveRideSection = () => setActiveSection("liveBookings");

  return (
    <Sidebar
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      navItems={driverNavItems}
    >
      {activeSection === "liveBookings" &&
        (booking ? (
          <ActiveRide onRideEnd={() => setBooking(null)} />
        ) : (
          <LiveBooking onBookingAccepted={setBooking} />
        ))
      }
      
      {activeSection === "bookings" && (<Bookings />)}
      {activeSection === "vehicles" && <VehicleCards />}
      {activeSection === "verification" && <Verification />}
      {activeSection === "wallet" && <Wallet />}
      {activeSection === "account" && <ManageAccount />}

      {booking && activeSection !== "liveBookings" && (
        <ActiveRideBanner setActiveSection={switchActiveRideSection} />
      )}
      
    </Sidebar>
  );
};

export default DriverPage;