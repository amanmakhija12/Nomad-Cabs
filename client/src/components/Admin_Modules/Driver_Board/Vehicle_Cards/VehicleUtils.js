export const getVehicleIcon = (type) => {
  switch (type?.toLowerCase()) {
    case "sedan":
      return "🚗";
    case "suv":
      return "🚙";
    case "bike":
      return "🏍️";
    case "auto":
      return "🛺";
    default:
      return "🚗";
  }
};
