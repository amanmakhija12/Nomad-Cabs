import { Search } from "lucide-react";

const filterOptions = [
  { label: "Pickup Address", value: "pickup" },
  { label: "Dropoff Address", value: "dropoff" },
  { label: "Date of Travelling", value: "travel_date" },
  { label: "Booking Status", value: "status" },
];

const SearchFilter = ({
  filterType,
  setFilterType,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="bg-[#141414] rounded-2xl shadow-lg p-6 mb-8 border border-white/10 text-white">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex flex-col min-w-[160px]">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
            Filter by
          </label>
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setSearchTerm("");
            }}
            className="px-4 py-3 rounded-xl bg-[#1a1a1a] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-200"
          >
            {filterOptions.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-[#0f0f0f]"
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col flex-grow min-w-[280px]">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
            Search
          </label>
          <div className="relative">
            {filterType === "status" ? (
              <select
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 pl-12 rounded-xl bg-[#1a1a1a] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-200"
              >
                <option value="" className="bg-[#0f0f0f]">
                  All statuses
                </option>
                <option value="requested" className="bg-[#0f0f0f]">
                  Requested
                </option>
                <option value="in_progress" className="bg-[#0f0f0f]">
                  In Progress
                </option>
                <option value="completed" className="bg-[#0f0f0f]">
                  Completed
                </option>
                <option value="cancelled" className="bg-[#0f0f0f]">
                  Cancelled
                </option>
              </select>
            ) : (
              <input
                type={filterType === "travel_date" ? "date" : "text"}
                placeholder={`Search by ${
                  filterOptions.find((opt) => opt.value === filterType)
                    ?.label || ""
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 pl-12 rounded-xl bg-[#1a1a1a] text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-200"
              />
            )}

            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
