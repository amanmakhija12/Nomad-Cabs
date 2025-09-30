import { useEffect, useState } from "react";
import DriverCards from "./Driver_Cards/DriverCards";
import ManageCard from "./Manage_Driver_Card/ManageCard";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const filterOptions = [
  { label: "PAN", value: "pan_card" },
  { label: "Aadhaar", value: "aadhar_card" },
  { label: "Driver License", value: "driver_license" },
];

const ManageDrivers = () => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const openDriver = (driver) => setSelectedDriver(driver);
  const closeDriver = () => setSelectedDriver("");
  const [drivers, setDrivers] = useState([]);
  const [filterType, setFilterType] = useState(filterOptions[0].value);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const driversPerPage = 9;

  useEffect(() => {
    if (selectedDriver) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [selectedDriver]);

  const fetchData = async () => {
    const driversRes = await fetch("http://localhost:3006/drivers");
    const driversData = await driversRes.json();

    const enrichedDrivers = await Promise.all(
      driversData.map(async (driver) => {
        const userRes = await fetch(
          `http://localhost:3006/users/${driver.user_id}`
        );
        const userData = await userRes.json();

        return {
          ...driver,
          full_name: `${userData.first_name}  ${
            userData.last_name
          }`.trim(),
          email: userData.email,
          phone_number: userData.phone_number || "",
        };
      })
    );

    const filteredDrivers =
      searchTerm.trim() === ""
        ? enrichedDrivers
        : enrichedDrivers.filter((driver) =>
            driver[filterType]?.toLowerCase().includes(searchTerm.toLowerCase())
          );

    setDrivers(filteredDrivers);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, filterType]);

  const indexOfLastDriver = currentPage * driversPerPage;
  const indexOfFirstDriver = indexOfLastDriver - driversPerPage;
  const currentDrivers = drivers.slice(indexOfFirstDriver, indexOfLastDriver);
  const totalPages = Math.ceil(drivers.length / driversPerPage) || 1;

  return (
    <div className="p-6 flex flex-col min-h-[500px] pb-10 bg-[#151212] text-white rounded-3xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          Driver Management
        </h1>
        <p className="text-white/50 mt-3 text-sm md:text-base">
          Manage and monitor all registered drivers
        </p>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-r from-[#181818] via-[#151515] to-[#121212] rounded-2xl p-8 border border-white/10 shadow-lg">
        <div className=" grid gap-6 md:grid-cols-3">
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
          {drivers.length > 0
            ? `Found ${drivers.length} driver${drivers.length !== 1 ? "s" : ""}`
            : "No drivers found"}
        </span>
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {currentDrivers.map((driver) => (
          <ManageCard key={driver.id} driver={driver} onClick={openDriver} />
        ))}
      </div>

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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-9 w-9 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
