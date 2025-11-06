import { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Bookings from "../components/Common/Bookings/Bookings";
import ManageAccount from "../components/Common/ManageAccount/ManageAccount";
import VehicleCards from "../components/Driver_Modules/Vehicles/VehicleCards";
import Live from "../components/Driver_Modules/LiveBooking/Live";
import Verification from "../components/Driver_Modules/Verification/Verification";
import PlaceHolder from "../components/Common/PlaceHolder";
import { useAuthStore } from "../store/authStore";

const driverNavItems = [
  { id: "liveBookings", label: "Live Bookings" },
  { id: "bookings", label: "My Bookings" },
  { id: "vehicles", label: "Manage Vehicles" },
  { id: "verification", label: "Verification" },
  { id: "account", label: "Manage Account" },
];

const DriverPage = () => {
  const [activeSection, setActiveSection] = useState("liveBookings");
  const user = useAuthStore((s) => s.user);

  return (
    <Sidebar
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      navItems={driverNavItems}
    >
      {activeSection === "liveBookings" && <Live />}
      {activeSection === "bookings" && <Bookings userRole="driver" />}
      {activeSection === "vehicles" && <VehicleCards ownerId={user?.id} />}
      {activeSection === "verification" && <Verification />}
      {activeSection === "account" && <ManageAccount />}
    </Sidebar>
  );
};

export default DriverPage;