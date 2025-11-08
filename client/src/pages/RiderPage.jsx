import { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Bookings from "../components/Common/Bookings/Bookings";
import ManageAccount from "../components/Common/ManageAccount/ManageAccount";
import BookCab from "../components/Rider_Modules/BookACab/BookCab";
import PlaceHolder from "../components/Common/PlaceHolder";

const riderNavItems = [
  { id: "bookCab", label: "Book a Cab" },
  { id: "myBooking", label: "My Bookings" },
  { id: "account", label: "Manage Account" },
];
const RiderPage = () => {
  const [activeSection, setActiveSection] = useState("bookCab");
  return (
    <Sidebar
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      navItems={riderNavItems}
    >
      {activeSection === "myBooking" && <Bookings isRider={true} />}
      {activeSection === "grievances" && (
        <PlaceHolder moduleName="Grivenances" />
      )}
      {activeSection === "account" && <ManageAccount />}
      {activeSection === "bookCab" && <BookCab />}
    </Sidebar>
  );
};
export default RiderPage;
