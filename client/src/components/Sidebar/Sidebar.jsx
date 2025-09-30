import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Home,
  Car,
  Users,
  MessageSquare,
  ShieldCheck,
  HelpCircle,
  LogOut,
  IndianRupee,
  CreditCard,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const Sidebar = ({ children, activeSection, setActiveSection, navItems }) => {
  const avatar = {
    path: "/src/assets/testimonials/kickButtowski.avif",
    name: "Kick Buttowski",
  };
  const navigate = useNavigate();
  const clearUser = useAuthStore((s) => s.clearUser);
  const handleLogout = () => {
    clearUser();
    toast.success("Logged out");
    navigate("/auth");
  };

  const iconFor = (label = "") => {
    switch (label) {
      case "My Bookings":
        return Users;
      case "Book a Cab":
        return Car;
      case "Manage Vehicles":
        return Car;
      case "Grievances":
        return MessageSquare;
      case "Manage Account":
        return ShieldCheck;
      case "Rider Board":
        return Users;
      case "Driver Board":
        return Car;
      case "Verification":
        return ShieldCheck;
      case "Feedback":
        return MessageSquare;
      case "Fare Board":
        return IndianRupee;
      case "Transactions":
        return CreditCard;
      default:
        return HelpCircle;
    }
  };

  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <div className="font-sans flex flex-col md:flex-row h-[100vh] bg-[#0f0f0f]">
      {/* Sidebar */}
      <aside
        className={`flex flex-col h-[100vh] bg-gradient-to-b from-[#0a0a0a] to-[#0c0c0c] shadow-2xl shadow-black/40 fixed md:static inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out rounded-r-3xl 
           ${!openSidebar && "hidden md:flex"}`}
      >
        {/* Top Section */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <img
              src={avatar.path}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              alt="user"
            />
            <div
              className={`text-white font-medium text-sm transition-opacity duration-200 ${
                openSidebar ? "opacity-100" : "opacity-0 md:opacity-100"
              }`}
            >
              {avatar.name}
            </div>
          </div>
          <button
            onClick={() => setOpenSidebar(!openSidebar)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-200"
          >
            {openSidebar ? "" : "☰"}
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <nav className="py-4">
            <ul className="space-y-3">
              {navItems.map((item) => {
                const Icon = iconFor(item.label);
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveSection(item.id);
                        setOpenSidebar(false);
                      }}
                      className={`group flex items-center w-full gap-4 px-6 py-3 rounded-full text-sm transition-all duration-200 ${
                        isActive
                          ? "bg-white text-black shadow"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon />
                      <span
                        className={`tracking-wide whitespace-nowrap transition-opacity duration-200 ${
                          openSidebar
                            ? "opacity-100"
                            : "opacity-0 md:opacity-100"
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors duration-200 text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span
              className={`${
                openSidebar ? "opacity-100" : "opacity-0 md:opacity-100"
              } transition-opacity duration-200`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="bg-[#151212] flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="md:hidden flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-white">Nomad Cabs</h1>
          <button
            onClick={() => setOpenSidebar((prev) => !prev)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200"
          >
            {openSidebar ? "X" : "☰"}
          </button>
        </div>
        {children}
      </main>
    </div>
  );
};
export default Sidebar;
