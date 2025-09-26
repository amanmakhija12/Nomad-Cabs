const DriverAvatar = ({ driver }) => {
  if (driver.profile_photo) {
    return (
      <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:scale-105 ring-1 ring-white/10">
        <img
          src={driver.profile_photo}
          alt={driver.full_name}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:scale-105 bg-gradient-to-b from-white to-white/70 text-black font-semibold ring-1 ring-white/10">
      <span className="text-sm tracking-wide">
        {driver.full_name
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "D"}
      </span>
    </div>
  );
};

export default DriverAvatar;
