import { Link } from "react-router-dom";
import logo from "/logo-dark.png";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-toastify";

const Navbar = () => {
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);

  return (
    <header className="w-full bg-[#0f0f0f] text-white fixed top-0 z-50 shadow-md">
      <nav className="flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Nomad"
            className="m-3 h-15 w-20 object-contain brightness-125 contrast-125 saturate-150 mix-blend-lighten"
          />
          <span className="sr-only">Home</span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={
                  user.role === "rider"
                    ? "/rider"
                    : user.role === "driver"
                    ? "/driver"
                    : "/admin"
                }
              >
                <button className="cursor-pointer px-6 py-2 bg-[#0f0f0f] text-white rounded shadow-sm transition-all duration-200 ease-out transform-gpu hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 hover:ring-2 hover:ring-red-600">
                  Dashboard
                </button>
              </Link>
              <span className="text-sm font-medium text-white/90">
                {user.firstName}
                {user.lastName ? ` ${user.lastName}` : ""}
              </span>

              <button
                onClick={() => {
                  clearUser();
                  toast.info("Logged out");
                }}
                className="primary-btn-nav"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="primary-text">
                Log In
              </Link>
              <Link to="/auth" className="primary-btn-nav">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
