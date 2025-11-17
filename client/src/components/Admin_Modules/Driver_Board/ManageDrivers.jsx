import { useCallback, useEffect, useState } from "react";
import DriverCards from "./Driver_Cards/DriverCards";
import ManageCard from "./Manage_Driver_Card/ManageCard";
import { Search } from "lucide-react";
import { driverService } from "../../../services/adminService";
import { toast, Bounce } from "react-toastify";
import { useDebounce } from "../../../hooks/useDebounce";
import { useAuthStore } from "../../../store/authStore";
import Pagination from "../../Common/Pagination";

const filterOptions = [
  { label: "Aadhaar", value: "AADHAR" },
  { label: "DL Number", value: "LICENSE" },
];

const ManageDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const openDriver = (driver) => setSelectedDriver(driver);
  const closeDriver = () => setSelectedDriver(null);

  const [filterType, setFilterType] = useState(filterOptions[0].value);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (selectedDriver) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [selectedDriver]);

  const fetchData = useCallback(async () => {
    if (!user) return; 

    setLoading(true);
    try {
      const params = {
        page: currentPage - 1,
        size: 10,
        filterType: debouncedSearchTerm ? filterType : null,
        searchTerm: debouncedSearchTerm ? debouncedSearchTerm : null,
      };

      const driversData = await driverService.getAllDrivers(params);

      setDrivers(driversData.content);
      setTotalPages(driversData.totalPages);
      setTotalItems(driversData.totalElements);
      setCurrentPage(driversData.number + 1);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast.error(error.message || "Failed to fetch drivers", {
        theme: "dark",
        transition: Bounce,
      });
      setDrivers([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
    
  }, [user, currentPage, debouncedSearchTerm, filterType]);

  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-6 flex flex-col min-h-[500px] pb-10 bg-[#151212] text-white rounded-3xl">
      {}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          Driver Management
        </h1>
        <p className="text-white/50 mt-3 text-sm md:text-base">
          Manage and monitor all registered drivers
        </p>
      </div>

      {}
      <div className="bg-gradient-to-r from-[#181818] via-[#151515] to-[#121212] rounded-2xl p-8 border border-white/10 shadow-lg">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-medium tracking-wide uppercase text-white/40">
              Filter By
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-11 rounded-xl bg-[#1b1b1b] border border-white/10 text-sm px-3 text-white focus:outline-none focus:ring-2 focus:ring-white/15"
            >
              {filterOptions.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="bg-[#1b1b1b]"
                >
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[11px] font-medium tracking-wide uppercase text-white/40">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={`Search by ${
                  filterOptions.find((o) => o.value === filterType)?.label
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 w-full rounded-xl bg-[#1b1b1b] border border-white/10 text-sm px-11 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/15"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 mb-4 flex items-center justify-between text-sm text-white">
        <span>
          {loading
            ? "Loading..."
            : totalItems > 0
            ? `Found ${totalItems} driver${totalItems !== 1 ? "s" : ""}`
            : "No drivers found"}
        </span>
        <span>
          Page {totalItems === 0 ? 0 : currentPage} of {totalPages}
        </span>
      </div>

      {}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-12 w-12 rounded-full border-2 border-white/10 border-t-white" />
        </div>
      ) : drivers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {drivers.map((driver) => (
            <ManageCard key={driver.userId} driver={driver} onClick={openDriver} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-20 text-white/50">
          No drivers found
        </div>
      )}

      {}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages || 1}
        onPageChange={setCurrentPage}
        position="relative"
        variant="dark"
      />

      {selectedDriver && (
        <DriverCards
          Driver={selectedDriver}
          onClose={closeDriver}
          onRefresh={fetchData}
        />
      )}
    </div>
  );
};

export default ManageDrivers;