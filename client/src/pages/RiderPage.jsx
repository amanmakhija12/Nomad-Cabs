import { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Bookings from "../components/Common/Bookings/Bookings";
import ManageAccount from "../components/Common/ManageAccount/ManageAccount";
import BookCab from "../components/Rider_Modules/BookACab/BookCab";
import Wallet from "../components/Common/Wallet/Wallet";

const riderNavItems = [
  { id: "bookCab", label: "Book a Cab" },
  { id: "myBooking", label: "My Bookings" },
  { id: "account", label: "Manage Account" },
  { id: "wallet", label: "Wallet" },
];
const RiderPage = () => {
  const [activeSection, setActiveSection] = useState("bookCab");
  return (
    <Sidebar
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      navItems={riderNavItems}
    >
      {activeSection === "bookCab" && <BookCab />}
      {activeSection === "myBooking" && <Bookings isRider={true} />}
      {activeSection === "wallet" && <Wallet />}
      {activeSection === "account" && <ManageAccount />}
    </Sidebar>
  );
};
export default RiderPage;
