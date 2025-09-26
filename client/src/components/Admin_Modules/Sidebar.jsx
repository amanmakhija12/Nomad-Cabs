import { useCallback } from "react";
import {
  Users,
  Car,
  ShieldCheck,
  MessageSquare,
  IndianRupee,
  CreditCard,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-toastify";


const avatar = {
  path: "/src/assets/testimonials/kickButtowski.avif",
  name: "Administrator",
};

const NAV_ITEMS = [
  { key: "riderBoard", label: "Rider Board", icon: Users },
  { key: "driverBoard", label: "Driver Board", icon: Car },
  { key: "verification", label: "Verification", icon: ShieldCheck },
  { key: "feedback", label: "Feedback", icon: MessageSquare },
  { key: "fare", label: "Fare Board", icon: IndianRupee },
  { key: "transaction", label: "Transactions", icon: CreditCard },
];

const AdminSiderBar = ({ onSelect, activeSelection }) => {
  const handleSelect = useCallback(
    (k) => {
      onSelect?.(k === activeSelection ? null : k);
    },
    [onSelect, activeSelection]
  );
const navigate = useNavigate();
  const clearUser = useAuthStore((s) => s.clearUser);
  const handleLogout = () => {
    clearUser();
    toast.success("Logged out");
    navigate("/auth");
  };
  return (
    <aside className="flex flex-col h-full bg-[#0a0a0a] w-full min-[940px]:w-64 rounded-r-3xl shadow-2xl shadow-black/50 overflow-hidden">
      {/* Header / Avatar */}
      <div className="p-6 flex items-center gap-4 border-b border-white/5">
        <img
          src={avatar.path}
          alt="user"
          className="w-12 h-12 rounded-full object-cover border border-white/10"
        />
        <div className="text-white font-semibold text-sm tracking-wide">
          {avatar.name}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="space-y-3">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const active = activeSelection === key;
            return (
              <li key={key}>
                <button
                  onClick={() => handleSelect(key)}
                  className={`group w-full flex items-center gap-3 px-4 h-12 rounded-full text-sm font-medium transition 
                    ${
                      active
                        ? "bg-white text-black shadow"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                >
                  <Icon
                    className={`w-5 h-5 transition ${
                      active ? "text-black" : "text-white/60 group-hover:text-white"
                    }`}
                  />
                  <span className="truncate">{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 pt-0">
        <button
          onClick={handleLogout}
          className="w-full h-12 flex items-center justify-center gap-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-200 transition shadow"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSiderBar;
