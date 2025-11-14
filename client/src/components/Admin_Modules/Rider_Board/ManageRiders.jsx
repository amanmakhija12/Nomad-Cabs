import { useEffect, useState } from "react";
import { Search, Mail, Phone, MapPin, Shield, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import RiderCards from "./RiderCards";
import { riderService } from "../../../services/adminService";
import { toast, Bounce } from "react-toastify";
import { useDebounce } from "../../../hooks/useDebounce";
import Pagination from "../../Common/Pagination";

const filterOptions = [
  { label: "Email", value: "EMAIL" },
  { label: "Phone Number", value: "PHONE" },
];

const ManageRiders = () => {
  const [selectedRider, setSelectedRider] = useState(null);
  
  const [riders, setRiders] = useState([]);

  const [filterType, setFilterType] = useState(filterOptions[0].value);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const openRider = (r) => setSelectedRider(r);
  const closeRider = () => setSelectedRider(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchRiders = async () => {
      setLoading(true);
      try {
        // Build query params
        const params = {
          page: currentPage - 1,
          size: 10,
          role: "RIDER",
          
          // Add search filters only if searchTerm exists
          filterType: debouncedSearchTerm ? filterType : null,
          searchTerm: debouncedSearchTerm ? debouncedSearchTerm : null,
        };

        // Call your admin service with the filters
        const data = await riderService.getAllRiders(params); 

        setRiders(data.content);
        setTotalPages(data.totalPages);
        setTotalItems(data.totalElements);
        setCurrentPage(data.number + 1);
      } catch (e) {
        console.error('Failed to fetch riders:', e);
        toast.error('Failed to fetch riders: ' + e.message, { theme: 'dark', transition: Bounce });
        setRiders([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRiders();
    
    // This hook re-runs whenever the user stops typing, changes filter, or changes page
  }, [currentPage, debouncedSearchTerm, filterType]);

  useEffect(() => {
    if (selectedRider) {
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = "auto");
    }
  }, [selectedRider]);

  const statusClass = (s = "") => {
    const v = s.toLowerCase();
    if (v === "active") return "bg-emerald-900/40 text-emerald-300 border-emerald-700";
    if (v === "suspended") return "bg-amber-900/40 text-amber-300 border-amber-700";
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

      {/* Filters */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex flex-wrap gap-6">
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
                placeholder={`Search by ${filterOptions.find((f) => f.value === filterType)?.label}`}
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#1d1d1d] text-white/90 text-sm border border-white/10 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/15"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <div className="text-sm text-white/60">
          {loading ? 'Loading...' : `Found ${totalItems} rider${totalItems !== 1 ? "s" : ""}`}
        </div>
        <div className="text-xs text-white/40 tracking-wider uppercase">
          Page {totalItems === 0 ? 0 : currentPage} of {totalPages}
        </div>
      </div>

      {/* List */}
      <ul className="space-y-4 flex-grow">
        {loading && (
          <li className="flex items-center justify-center h-40">
            <div className="animate-spin h-12 w-12 rounded-full border-2 border-white/10 border-t-white" />
          </li>
        )}

        {!loading && riders.length === 0 && (
          <li className="h-40 flex items-center justify-center ...">
            No riders match your search
          </li>
        )}

        {!loading && riders.map((rider) => (
          <li
            key={rider.id}
            onClick={() => openRider(rider)}
            className="group relative bg-[#141414] p-6 border border-white/10 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/0 transition-all" />

            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="flex items-start space-x-4 flex-grow">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-b from-white to-white/80 text-black font-bold flex items-center justify-center shadow-md group-hover:shadow-lg transition">
                    {(rider.firstName?.[0] || "").toUpperCase()}
                    {(rider.lastName?.[0] || "").toUpperCase()}
                  </div>
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white tracking-tight truncate group-hover:text-white/90">
                      {rider.firstName} {rider.lastName}
                    </h3>
                    {rider.status && (
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide border ${statusClass(rider.status)}`}>
                        {rider.status.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-white/60">
                      <Mail className="w-3.5 h-3.5 text-white/40" />
                      <span className="font-medium truncate">{rider.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <Phone className="w-3.5 h-3.5 text-white/40" />
                      <span className="font-medium">{rider.phoneNumber || 'N/A'}</span>
                    </div>
                    {rider.city && (
                      <div className="flex items-center gap-2 text-white/60">
                        <MapPin className="w-3.5 h-3.5 text-white/40" />
                        <span className="font-medium truncate">
                          {rider.city}{rider.state ? `, ${rider.state}` : ""}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-white/60">
                      <Shield className="w-3.5 h-3.5 text-white/40" />
                      <span className="font-medium capitalize">{rider.role}</span>
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages || 1}
        onPageChange={setCurrentPage}
        position="relative"
        variant="dark"
      />

      {selectedRider && (
        <RiderCards rider={selectedRider} onClose={closeRider} onRefresh={setCurrentPage} />
      )}
    </div>
  );
};

export default ManageRiders;