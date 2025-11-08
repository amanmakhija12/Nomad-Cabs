const avatar = {
  path: "/src/assets/testimonials/kickButtowski.avif",
  name: "Administrator",
};

const Navigator = ({ onSelect }) => {
  return (
    <div className="flex items-center justify-center min-h-[80vh] ">
      <div className="text-center relative w-full px-6">
        {/* Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <img
            src={avatar.path}
            alt="Watermark"
            className="w-[28rem] h-[28rem] object-cover rounded-full"
          />
        </div>
        {/* Main Content */}
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="mb-10">
            <div className="w-36 h-36 mx-auto rounded-2xl overflow-hidden ring-2 ring-white/10 shadow-xl relative group">
              <img
                src={avatar.path}
                alt={avatar.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40" />
            </div>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white mb-4">
            Welcome, {avatar.name}
          </h1>
          <p className="text-base md:text-lg text-white/50 mb-12 max-w-xl mx-auto leading-relaxed">
            Select a board below to manage core areas of your platform
          </p>
          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto text-sm">
            {/* Rider Board */}
            <div
              onClick={() => onSelect?.("riderBoard")}
              className="group relative rounded-xl p-5 bg-[#141414] border border-white/10 hover:border-white/30 hover:bg-[#181818] transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/[0.06] to-transparent transition-opacity" />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 ring-1 ring-white/15 flex items-center justify-center text-[13px] font-semibold tracking-wide text-white/80 group-hover:text-white">
                  R
                </div>
                <span className="text-white/60 group-hover:text-white font-medium tracking-wide text-xs uppercase">
                  Rider Board
                </span>
              </div>
            </div>
            {/* Driver Board */}
            <div
              onClick={() => onSelect?.("driverBoard")}
              className="group relative rounded-xl p-5 bg-[#141414] border border-white/10 hover:border-white/30 hover:bg-[#181818] transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/[0.06] to-transparent transition-opacity" />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 ring-1 ring-white/15 flex items-center justify-center text-[13px] font-semibold tracking-wide text-white/80 group-hover:text-white">
                  D
                </div>
                <span className="text-white/60 group-hover:text-white font-medium tracking-wide text-xs uppercase">
                  Driver Board
                </span>
              </div>
            </div>
            {/* Fare Board */}
            <div
              onClick={() => onSelect?.("fare")}
              className="group relative rounded-xl p-5 bg-[#141414] border border-white/10 hover:border-white/30 hover:bg-[#181818] transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/[0.06] to-transparent transition-opacity" />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 ring-1 ring-white/15 flex items-center justify-center text-[13px] font-semibold tracking-wide text-white/80 group-hover:text-white">
                  ₹
                </div>
                <span className="text-white/60 group-hover:text-white font-medium tracking-wide text-xs uppercase">
                  Fare Board
                </span>
              </div>
            </div>
            {/* Transactions */}
            <div
              onClick={() => onSelect?.("transaction")}
              className="group relative rounded-xl p-5 bg-[#141414] border border-white/10 hover:border-white/30 hover:bg-[#181818] transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/[0.06] to-transparent transition-opacity" />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 ring-1 ring-white/15 flex items-center justify-center text-[13px] font-semibold tracking-wide text-white/80 group-hover:text-white">
                  T
                </div>
                <span className="text-white/60 group-hover:text-white font-medium tracking-wide text-xs uppercase">
                  Transactions
                </span>
              </div>
            </div>
          </div>
          <div className="mt-14 text-white/30 text-xs tracking-wide">
            <p className="uppercase">NomadCabs Admin Dashboard</p>
            <p className="mt-1">Unified Management Interface</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigator;
