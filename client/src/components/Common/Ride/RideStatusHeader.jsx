import { Car, Clock, Navigation, XCircle } from "lucide-react";

export const RideStatusHeader = ({ isRider, status }) => {
  let Icon = Clock;
  let text = "Connecting to driver...";

  switch (status) {
    case "ACCEPTED":
      Icon = Navigation;
      text = isRider ? "Driver is on the way" : "Head to the pickup location";
      break;
    case "IN_PROGRESS":
      Icon = Car;
      text = "Ride in progress";
      break;
    case "CANCELLED":
      Icon = XCircle;
      text = "Ride Cancelled";
      break;
  }

  return (
    <div className="bg-[#141414] p-4 text-center border-b border-white/10 shadow-lg">
      <div className="flex items-center justify-center gap-3">
        <Icon className="h-5 w-5 text-white/80" />
        <h1 className="text-lg font-semibold text-white">{text}</h1>
      </div>
    </div>
  );
};