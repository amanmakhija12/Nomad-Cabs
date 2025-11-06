import { useState } from "react";
import ManageRiders from "../components/Admin_Modules/Rider_Board/ManageRiders";
import ManageDrivers from "../components/Admin_Modules/Driver_Board/ManageDrivers";
import ManageFare from "../components/Admin_Modules/Fare_Board/ManageFare";
import ManageTransactions from "../components/Admin_Modules/Transaction_Board/ManageTransactions";
import Navigator from "../components/Admin_Modules/Utils/Navigator";
import PlaceHolder from "../components/Common/PlaceHolder";
import Sidebar from "../components/Sidebar/Sidebar";

const NAV_ITEMS = [
  { id: "riderBoard", label: "Rider Board" },
  { id: "driverBoard", label: "Driver Board"},
  { id: "verification", label: "Verification" },
  { id: "fare", label: "Fare Board" },
  { id: "transaction", label: "Transactions"},
];

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState(null);

  return (

        <Sidebar activeSection={activeSection} navItems={NAV_ITEMS} setActiveSection={setActiveSection}>
        <main className="bg-[#151212] flex-1 p-4 min-[940px]:p-6 overflow-y-auto">
          {activeSection === "riderBoard" && <ManageRiders />}
          {activeSection === "driverBoard" && <ManageDrivers />}
          {activeSection === "fare" && <ManageFare />}
          {activeSection === "transaction" && <ManageTransactions />}
          {activeSection === "verification" && (
            <PlaceHolder
              moduleName="Document & Verification"
              onBack={() => setActiveSection(null)}
            />
          )}
          {!activeSection && <Navigator onSelect={setActiveSection} />}
        </main>
      </Sidebar>
  );
};

export default AdminPage;
