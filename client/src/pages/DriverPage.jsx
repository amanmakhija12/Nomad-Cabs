import { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Bookings from "../components/Common/Bookings/Bookings";
import ManageAccount from "../components/Common/ManageAccount/ManageAccount";
import VehicleCards from "../components/Driver_Modules/Vehicles/VehicleCards";
import Verification from "../components/Driver_Modules/Verification/Verification";
import LiveBooking from "../components/Driver_Modules/LiveBooking/LiveBooking";
import Wallet from "../components/Common/Wallet/Wallet";

const driverNavItems = [
  { id: "liveBookings", label: "Live Bookings" },
  { id: "bookings", label: "My Bookings" },
  { id: "vehicles", label: "Manage Vehicles" },
  { id: "verification", label: "Verification" },
  { id: "wallet", label: "Wallet" },
  { id: "account", label: "Manage Account" },
];

const DriverPage = () => {
  const [activeSection, setActiveSection] = useState("liveBookings");

  return (
    <Sidebar
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      navItems={driverNavItems}
    >
      {activeSection === "liveBookings" && <LiveBooking />}
      {activeSection === "bookings" && <Bookings />}
      {activeSection === "vehicles" && <VehicleCards />}
      {activeSection === "verification" && <Verification />}
      {activeSection === "wallet" && <Wallet />}
      {activeSection === "account" && <ManageAccount />}
    </Sidebar>
  );
};

export default DriverPage;