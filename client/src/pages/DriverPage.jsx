import { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Bookings from "../components/Common/Bookings/Bookings";
import ManageAccount from "../components/Common/ManageAccount/ManageAccount";
import VehicleCards from "../components/Driver_Modules/Vehicles/VehicleCards";
import PlaceHolder from "../components/Common/PlaceHolder";

const driverNavItems = [
  { id: "bookings", label: "My Bookings" },
  { id: "vehicles", label: "Manage Vehicles" },
  { id: "liveBookings", label: "Live Bookings" },
  { id: "feedback", label: "Grievances" },
  { id: "verification", label: "Verification" },
  { id: "account", label: "Manage Account" },
];

const DriverPage = () => {
  const [activeSection, setActiveSection] = useState("bookings");

  return (
    <Sidebar
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      navItems={driverNavItems}
    >
      {activeSection === "bookings" && <Bookings />}
      {activeSection === "vehicles" && (
        <VehicleCards ownerId={"32c100bf-a90a-491f-97c4-3f5f87253822"} />
      )}
      {activeSection === "liveBookings" && (
        <PlaceHolder moduleName="Live Booking" />
      )}
      {activeSection === "feedback" && <PlaceHolder moduleName="Grievances" />}
      {activeSection === "verification" && (
        <PlaceHolder moduleName="Verification" />
      )}
      {activeSection === "account" && <ManageAccount />}
    </Sidebar>
  );
};
export default DriverPage;
