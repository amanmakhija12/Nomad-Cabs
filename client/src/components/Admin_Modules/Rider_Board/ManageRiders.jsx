import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Mail,
  Phone,
  MapPin,
  Shield,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  RefreshCcw
} from "lucide-react";
import RiderCards from "./RiderCards";

const filterOptions = [
  { label: "Email", value: "email" },
  { label: "Phone Number", value: "phone_number" }
];

const ManageRiders = () => {

  const [selectedRider, setSelectedRider] = useState(null);
  const [allRiders, setAllRiders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [filterType, setFilterType] = useState(filterOptions[0].value);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const ridersPerPage = 8;

  const openRider = (r) => setSelectedRider(r);
  const closeRider = () => setSelectedRider(null);

  useEffect(() => {
    if (selectedRider) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [selectedRider]);

  const fetchRiders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3005/riders");
      if (!response.ok) throw new Error("Failed to load riders");
      const data = await response.json();
      setAllRiders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setAllRiders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRiders();
  }, [fetchRiders]);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setRiders(allRiders);
    } else {
      setRiders(
        allRiders.filter((r) =>
          (r[filterType] || "").toString().toLowerCase().includes(term)
        )
      );
    }
    setCurrentPage(1);
  }, [allRiders, filterType, searchTerm]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(riders.length / ridersPerPage));
  const start = (currentPage - 1) * ridersPerPage;
  const currentRiders = riders.slice(start, start + ridersPerPage);

  const statusClass = (s = "") => {
    const v = s.toLowerCase();
    if (v === "active")
      return "bg-emerald-900/40 text-emerald-300 border-emerald-700";
    if (v === "suspended")
      return "bg-amber-900/40 text-amber-300 border-amber-700";
    return "bg-gray-800 text-gray-300 border-gray-700";
  };

  return (
    <div className="p-6 flex flex-col min-h-[500px] pb-10 bg-[#151212] text-white rounded-3xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
          Rider Management
        </h1>
        <p className="text-white/50 text-sm md:text-base">
          View and manage registered riders
        </p>
      </div>

      {/* Filter Panel */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex flex-wrap gap-6">
          {/* Filter type */}
            <div className="flex flex-col min-w-[160px]">
              <label className="text-[11px] font-semibold tracking-wider uppercase text-white/50 mb-2">
                Filter By
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="h-12 rounded-xl bg-[#1d1d1d] text-white/90 text-sm px-4 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/15"
              >
                {filterOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

          {/* Search */}
          <div className="flex flex-col flex-grow min-w-[260px]">
            <label className="text-[11px] font-semibold tracking-wider uppercase text-white/50 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search by ${
                  filterOptions.find((f) => f.value === filterType)?.label
                }`}
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#1d1d1d] text-white/90 text-sm border border-white/10 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/15"
              />
            </div>
          </div>

          {/* Refresh */}
          <div className="flex flex-col justify-end">
            <button
              onClick={fetchRiders}
              disabled={loading}
              className="h-12 px-6 rounded-xl bg-white text-black text-sm font-medium shadow hover:shadow-lg transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      {/* Counts */}
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm text-white/60">
          {riders.length
            ? `Found ${riders.length} rider${riders.length !== 1 ? "s" : ""}`
            : "No riders found"}
        </div>
        <div className="text-xs text-white/40 tracking-wider uppercase">
          Page {currentPage} / {totalPages}
        </div>
      </div>

      {/* List */}
      <ul className="space-y-4 flex-grow">
        {loading && (
          <li className="flex items-center justify-center h-40">
            <div className="loader-circle border-white/20" />
          </li>
        )}

        {!loading && currentRiders.length === 0 && (
          <li className="h-40 flex items-center justify-center rounded-2xl bg-[#141414] border border-white/10 text-white/40 text-sm">
            No riders match your search
          </li>
        )}

        {!loading &&
          currentRiders.map((rider) => (
            <li
              key={rider.id}
              onClick={() => openRider(rider)}
              className="group relative bg-[#141414] p-6 border border-white/10 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/0 transition-all" />

              <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="flex items-start space-x-4 flex-grow">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-b from-white to-white/80 text-black font-bold flex items-center justify-center shadow-md group-hover:shadow-lg transition">
                      {(rider.first_name?.[0] || "").toUpperCase()}
                      {(rider.last_name?.[0] || "").toUpperCase()}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white tracking-tight truncate group-hover:text-white/90">
                        {rider.first_name} {rider.last_name}
                      </h3>
                      {rider.status && (
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide border ${statusClass(
                            rider.status
                          )}`}
                        >
                          {rider.status.toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2 text-white/60">
                        <Mail className="w-3.5 h-3.5 text-white/40" />
                        <span className="font-medium truncate">
                          {rider.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60">
                        <Phone className="w-3.5 h-3.5 text-white/40" />
                        <span className="font-medium">{rider.phone_number}</span>
                      </div>
                      {rider.city && (
                        <div className="flex items-center gap-2 text-white/60">
                          <MapPin className="w-3.5 h-3.5 text-white/40" />
                          <span className="font-medium truncate">
                            {rider.city}
                            {rider.state ? `, ${rider.state}` : ""}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-white/60">
                        <Shield className="w-3.5 h-3.5 text-white/40" />
                        <span className="font-medium capitalize">
                          {rider.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 text-white/30 group-hover:text-white/70 transition">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-0 h-1 bg-white/50 group-hover:w-full transition-all duration-300 rounded-b-2xl" />
            </li>
          ))}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <div className="flex items-center gap-2 bg-[#141414] border border-white/10 rounded-full px-3 py-2 shadow-lg">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-9 w-9 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => {
                if (totalPages <= 7) return true;
                if (n === 1 || n === totalPages) return true;
                if (Math.abs(n - currentPage) <= 1) return true;
                if (currentPage <= 3 && n <= 5) return true;
                if (currentPage >= totalPages - 2 && n >= totalPages - 4)
                  return true;
                return false;
              })
              .map((n, idx, arr) => {
                const prev = arr[idx - 1];
                const showDots = prev && n - prev > 1;
                return (
                  <div key={n} className="flex">
                    {showDots && (
                      <span className="h-9 w-9 flex items-center justify-center text-white/30">
                        …
                      </span>
                    )}
                    <button
                      onClick={() => setCurrentPage(n)}
                      className={`h-9 w-9 rounded-full text-sm font-medium transition ${
                        currentPage === n
                          ? "bg-white text-black shadow"
                          : "text-white/60 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {n}
                    </button>
                  </div>
                );
              })}

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="h-9 w-9 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {selectedRider && (
        <RiderCards
          rider={selectedRider}
          onClose={closeRider}
          onRefresh={fetchRiders}
        />
      )}
    </div>
  );
};

export default ManageRiders;