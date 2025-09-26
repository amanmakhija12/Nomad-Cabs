import { Bike, Car, CarFront, CarTaxiFront } from "lucide-react";

export const getVehicleIcon = (type) => {
  const AutoEmoji = ({ size = 20, className = "" }) => (
    <span
      role="img"
      aria-label="auto"
      style={{ fontSize: size, lineHeight: 1 }}
      className={className}
    >
      🛺
    </span>
  );

  const map = {
    sedan: CarFront,
    suv: CarTaxiFront,
    bike: Bike,
    auto: AutoEmoji,
    default: Car,
  };

  return map[type?.toLowerCase()] || map.default;
};
