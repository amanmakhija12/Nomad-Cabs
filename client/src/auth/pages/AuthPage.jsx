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
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "driver") navigate("/driver");
      else navigate("/rider");
    }
  }, [user, navigate]);

  const handleLogin = async () => {};
  const handleSignup = () => {};

  return (
    <div
      id="Hero"
      className="flex md:flex-row flex-col text-center md:text-start cont items-center w-full h-[100vh] relative overflow-hidden border"
    >
      <div
        className={`absolute left-0 top-0 w-full md:w-1/2 h-full flex flex-col justify-center  items-center transition-all duration-700 ease-in-out z-10 ${
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
        <LoginForm onLogin={handleLogin} />
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
        <SignupForm
          onSignup={handleSignup}
          onSuccess={() => setMode("login")}
        />
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
        className={` w-full h-full flex items-center justify-center z-0 pointer-events-none ${
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
          />
        </div>
      </div>
      <style>{`
        @keyframes fade-in {0% {opacity:0;transform:translateY(20px);}100% {opacity:1;transform:translateY(0);} }
        .animate-fade-in {animation: fade-in 0.7s;}
        @keyframes link {0% {color:#fff;}50% {color:#ff4d31;}100% {color:#fff;}}
        .animate-link {animation: link 1.2s infinite;}
        @keyframes glow {0% {box-shadow:0 0 10px #ff4d31,0 0 20px #151212;}50% {box-shadow:0 0 20px #ff4d31,0 0 40px #151212;}100% {box-shadow:0 0 10px #ff4d31,0 0 20px #151212;}}
        .animate-glow {animation: glow 2s infinite alternate;}
        @keyframes words {0% {opacity:0;transform:translateY(-10px);}50% {opacity:1;transform:translateY(0);}100% {opacity:0;transform:translateY(10px);}}
        .animate-words {animation: words 3s infinite;}
        .primary-btn-nav,input,select {transition: box-shadow .3s,border-color .3s;}
        .primary-btn-nav:hover {box-shadow:0 0 10px #ff4d31;border-color:#ff4d31;}
        input:hover,select:hover {border-color:#ff4d31;box-shadow:0 0 5px #ff4d31;}
        @keyframes bg-slide-right {0% {transform:scale(1) translateX(-30px);}100% {transform:scale(1.05) translateX(0);}}
        .animate-bg-slide-right {animation:bg-slide-right 1s forwards;}
        @keyframes bg-slide-left {0% {transform:scale(1) translateX(30px);}100% {transform:scale(1.05) translateX(0);}}
        .animate-bg-slide-left {animation:bg-slide-left 1s forwards;}
      `}</style>
    </div>
  );
};

export default AuthPage;
