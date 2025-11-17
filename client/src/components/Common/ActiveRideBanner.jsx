import { ArrowRight, Car } from "lucide-react";

const ActiveRideBanner = ({ setActiveSection }) => {
  const handleClick = () => {
    
    setActiveSection();
  };

  return (
    <button
      onClick={handleClick}
      
      className="fixed bottom-0 left-0 right-0 z-40 w-full bg-[#1f1f1f] border-t border-white/10 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.3)] p-4 cursor-pointer hover:bg-[#2a2a2a] transition-colors"
    >
      <div className="max-w-screen-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center">
            <Car size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-left">You have an active ride</h4>
            <p className="text-sm text-white/60 text-left">Click here to view its status.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-blue-300">
          <span className="text-sm font-medium hidden sm:block">View Ride</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </button>
  );
};

export default ActiveRideBanner;