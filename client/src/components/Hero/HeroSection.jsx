import { useState } from "react";
import HeroBg from "../../assets/hero/hero-bg.png"
import MainCar from "../../assets/hero/main-car.png"
import { Link } from "react-router-dom";
const HeroSection = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  
  localStorage.setItem("trip:from", source);
  localStorage.setItem("trip:to", destination);

  return (
    <>
      <div
        id="Hero"
        className="flex md:flex-row flex-col text-center
        md:text-start cont justify-center items-center mt-30"
      >
        <div className="flex flex-col gap-2 max-w-150">
          <h4 className="text-[1.5rem] font-semibold">Plan your trip now</h4>
          <h1 className="font-bold text-[3rem] md:text-[3.5rem] leading-15">
            Save with our car Services
          </h1>
          <form className="w-full max-w-xl mt-8">
            <div className="relative mb-4 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <input
                type="text"
                placeholder="Enter location"
                className="w-full pl-5 pr-7 py-4 bg-[#151212] backdrop-blur-sm text-white rounded-lg
                         border-0 focus:ring-2 focus:ring-white/25 transition-all duration-300
                         hover:bg-gray-700/80 focus:outline-none md:w-[85%]"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>

            <div className="relative mb-6 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
              </div>
              <input
                type="text"
                placeholder="Enter destination"
                className="w-full pl-5 pr-7 py-4 bg-[#151212] backdrop-blur-sm text-white rounded-lg
                         border-0 focus:ring-2 focus:ring-white/25 transition-all duration-300
                         hover:bg-gray-700/80 focus:outline-none md:w-[85%]"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
             <Link to={`/booking?from=${encodeURIComponent(source)}&to=${encodeURIComponent(destination)}`}> <button
                type="button"
                className="bg-[#ff4d30] text-white py-4 px-8 rounded-lg font-medium
                         transform transition-all duration-300 cursor-pointer hover:bg-red-700
                         hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] "
              >
                Book A Cab
              </button>
              </Link>
            </div>
          </form>
          
        </div>

        <div className="hidden md:flex">
          <img
            src={HeroBg}
            className="absolute top-0 right-0 z-[-1] opacity-40"
          />

          <img
            src={MainCar}
            wrapperProps={{
              
              style: { transitionDelay: '1s' },
            }}
            className="relative right-10"
            effect="blur"
          />
        </div>
      </div>
    </>
  );
}

export default HeroSection;
