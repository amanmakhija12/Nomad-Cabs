import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import MainCar from "../../assets/hero/main-car.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      const role = user.role?.toUpperCase();
      
      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "DRIVER") {
        navigate("/driver");
      } else if (role === "RIDER") {
        navigate("/rider");
      } else {
        console.warn("Unknown role:", user.role);
        navigate("/");
      }
    }
  }, [user, navigate]);

  return (
    <div
      id="Hero"
      className="flex md:flex-row flex-col text-center md:text-start cont items-center w-full h-[100vh] relative overflow-hidden border"
    >
      <div
        className={`absolute left-0 top-0 w-full md:w-1/2 h-full flex flex-col justify-center items-center transition-all duration-700 ease-in-out z-10 ${
          mode === "login"
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <h1 className="font-bold text-[2.5rem] md:text-[3.5rem] leading-15 mb-5 animate-fade-in">
          Login
        </h1>
        <div className="mb-4 text-lg text-[#ff4d31] font-semibold animate-words">
          "Welcome back! Your journey starts here."
        </div>
        <LoginForm />
        <p className="text-white mt-4">
          Don't have an account?
          <span
            onClick={() => setMode("signup")}
            className="primary-text ml-1 underline cursor-pointer animate-link"
          >
            Register
          </span>
        </p>
      </div>
      
      <div
        className={`absolute right-0 top-0 w-full md:w-1/2 h-full flex flex-col justify-center items-center transition-all duration-700 ease-in-out z-10 ${
          mode === "signup"
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <h1 className="font-bold text-[2.5rem] md:text-[3.5rem] leading-15 mb-4 animate-fade-in">
          Sign Up
        </h1>
        <div className="mb-4 text-lg text-[#ff4d31] font-semibold animate-words">
          "Create your account and ride the future!"
        </div>
        <SignupForm onSuccess={() => setMode("login")} />
        <p className="text-white mt-4">
          Already have an account?
          <span
            onClick={() => setMode("login")}
            className="primary-text ml-1 underline cursor-pointer animate-link"
          >
            Login
          </span>
        </p>
      </div>
      
      <div
        className={`w-full h-full flex items-center justify-center z-0 pointer-events-none ${
          mode === "signup"
            ? "absolute -left-90 top-0"
            : "absolute left-90 top-0"
        }`}
      >
        <div className={mode === "signup" ? "transform scale-x-[-1]" : ""}>
          <img
            src={MainCar}
            className={`max-w-[600px] w-full h-auto object-contain opacity-100 transition-transform duration-1000 ease-in-out ${
              mode === "signup"
                ? "animate-bg-slide-left"
                : "animate-bg-slide-right"
            }`}
            alt="Car"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;