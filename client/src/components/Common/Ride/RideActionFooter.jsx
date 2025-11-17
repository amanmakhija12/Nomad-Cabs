import { Loader } from "lucide-react";


export const RideActionFooter = ({
  role,
  status,
  isUpdating,
  onStartRide,
  onCompleteRide,
  onCancelRide,
}) => {
  const getButtons = () => {
    if (role === "DRIVER") {
      if (status === "ACCEPTED") {
        return (
          <>
            <ActionButton onClick={onCancelRide} disabled={isUpdating} variant="danger">
              Cancel Ride
            </ActionButton>
            <ActionButton onClick={onStartRide} disabled={isUpdating} variant="primary">
              {isUpdating ? <Spinner /> : "Start Ride"}
            </ActionButton>
          </>
        );
      }
      if (status === "IN_PROGRESS") {
        return (
          <ActionButton onClick={onCompleteRide} disabled={isUpdating} variant="primary" fullWidth>
            {isUpdating ? <Spinner /> : "Complete Ride"}
          </ActionButton>
        );
      }
    }
    
    if (role === "RIDER") {
      if (status === "ACCEPTED" || status === "REQUESTED") {
        return (
          <ActionButton onClick={onCancelRide} disabled={isUpdating} variant="danger" fullWidth>
            {isUpdating ? <Spinner /> : "Cancel Ride"}
          </ActionButton>
        );
      }
    }
    
    
    return null;
  };

  return (
    <div className="p-4 bg-[#0a0a0a] border-t border-white/10 shadow-inner-top">
      <div className="flex items-center justify-center gap-4">
        {getButtons()}
      </div>
    </div>
  );
};


const ActionButton = ({ onClick, disabled, variant, children, fullWidth = false }) => {
  const colors = {
    primary: "bg-white text-black hover:bg-gray-200",
    danger: "bg-red-500/20 text-red-300 hover:bg-red-500/30",
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-12 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${colors[variant]} ${fullWidth ? "w-full" : "w-auto"} ${disabled ? "opacity-50" : ""}`}
    >
      {children}
    </button>
  );
};

const Spinner = () => <Loader className="w-5 h-5 animate-spin" />;