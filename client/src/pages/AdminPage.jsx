import { useState } from "react";
import ManageRiders from "../components/Admin_Modules/Rider_Board/ManageRiders";
import ManageDrivers from "../components/Admin_Modules/Driver_Board/ManageDrivers";
import ManageFare from "../components/Admin_Modules/Fare_Board/ManageFare";
import ManageTransactions from "../components/Admin_Modules/Transaction_Board/ManageTransactions";
import Sidebar from "../components/Sidebar/Sidebar";
import ManageVerification from "../components/Admin_Modules/Verification/ManageVerifications";
import Dashboard from "../components/Admin_Modules/Dashboard";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "riderBoard", label: "Rider Board" },
  { id: "driverBoard", label: "Driver Board"},
  { id: "verification", label: "Verification" },
  { id: "fare", label: "Fare Board" },
  { id: "transaction", label: "Transactions"},
];

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (

        <Sidebar activeSection={activeSection} navItems={NAV_ITEMS} setActiveSection={setActiveSection}>
        <main className="bg-[#151212] flex-1 p-4 min-[940px]:p-6 overflow-y-auto">
          {activeSection === "dashboard" && <Dashboard />}
          {activeSection === "riderBoard" && <ManageRiders />}
          {activeSection === "driverBoard" && <ManageDrivers />}
          {activeSection === "fare" && <ManageFare />}
          {activeSection === "transaction" && <ManageTransactions />}
          {activeSection === "verification" && <ManageVerification />}
        </main>
      </Sidebar>
  );
};

export default AdminPage;
