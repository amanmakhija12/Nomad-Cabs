import { useState } from "react";
import AdminSideBar from "../components/Admin_Modules/Sidebar";
import ManageRiders from "../components/Admin_Modules/Rider_Board/ManageRiders";
import ManageDrivers from "../components/Admin_Modules/Driver_Board/ManageDrivers";
import ManageFare from "../components/Admin_Modules/Fare_Board/ManageFare";
import ManageTransactions from "../components/Admin_Modules/Transaction_Board/ManageTransactions";
import Navigator from "../components/Admin_Modules/Utils/Navigator";
import PlaceHolder from "../components/Common/PlaceHolder";



const AdminPage = () => {
  const [selection, setSelection] = useState(null);

  return (
    <div className="font-sans min-h-screen h-[100vh] ">
      <div className="flex flex-col min-[940px]:flex-row h-full ">
        <AdminSideBar onSelect={setSelection} activeSelection={selection} />
        <main className="bg-[#151212] flex-1 p-4 min-[940px]:p-6 overflow-y-auto">
          {selection === "riderBoard" && <ManageRiders />}
          {selection === "driverBoard" && <ManageDrivers />}
          {selection === "fare" && <ManageFare />}
          {selection === "transaction" && <ManageTransactions />}
          {selection === "verification" && (
            <PlaceHolder
              moduleName="Document & Verification"
              onBack={() => setSelection(null)}
            />
          )}
          {selection === "feedback" && (
            <PlaceHolder
              moduleName="Feedback & Grievance"
              onBack={() => setSelection(null)}
            />
          )}
          {!selection && <Navigator onSelect={setSelection} />}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
