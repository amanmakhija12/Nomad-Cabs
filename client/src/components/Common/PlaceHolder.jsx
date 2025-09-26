const avatar = {
  path: "/src/assets/testimonials/kickButtowski.avif",
  name: "Administrator",
};

const PlaceHolder = ({ moduleName = "Feature", onBack }) => {
  return (
    <div className="flex items-center justify-center min-h-[80vh]  px-6">
      <div className="text-center relative w-full">
        {/* Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <img
            src={avatar.path}
            alt="Watermark"
            className="w-[26rem] h-[26rem] object-cover rounded-full"
          />
        </div>
        {/* Main Content */}
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="mb-10">
            <div className="w-36 h-36 mx-auto rounded-2xl overflow-hidden bg-[#141414] border border-white/10 shadow-xl flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-5xl select-none">🚧</span>
            </div>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white mb-3">
            Cooking Something Up!
          </h1>
          <h2 className="text-xl font-medium text-white/70 mb-6 uppercase tracking-wide">
            {moduleName} Under Construction
          </h2>
          <p className="text-base md:text-lg text-white/50 mb-10 max-w-lg mx-auto leading-relaxed">
            This feature will be available soon!
          </p>
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow hover:shadow-lg border border-red-500/30"
              title="Back to Dashboard"
            >
              <span className="mr-2">←</span>
              Back to Dashboard
            </button>
          )}
          <div className="mt-14 text-white/30 text-xs tracking-wide">
            <p className="uppercase">Nomad Cabs</p>
            <p className="mt-1">Stay tuned for exciting new features</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceHolder;
