import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { ShieldAlert, ArrowRight } from "lucide-react";
import { driverService } from "../../../services/adminService";
import { VerificationModal } from "./VerificationModal";
import Pagination from "../../Common/Pagination";

const ManageVerifications = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [pageData, setPageData] = useState({ number: 0, totalPages: 0 });
  const [currentPage, setCurrentPage] = useState(0);

  const fetchVerificationQueue = useCallback(async (page = 0) => {
    try {
      setLoading(true);
      const params = { page, size: 10 };
      
      // Use the correct service call
      const response = await driverService.getVerificationQueue(params);
      
      setDrivers(response.content || []);
      setPageData({
        number: response.number,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
      });
      return response.content || []; // Return the new list
    } catch (error) {
      console.error("Error fetching verification queue:", error);
      toast.error(error.message || "Failed to fetch data");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVerificationQueue(currentPage);
  }, [fetchVerificationQueue]);

  const handleRefresh = async () => {
    const freshDrivers = await fetchVerificationQueue(pageData.number);
    
    if (selectedDriver) {
      const freshDriverData = freshDrivers.find(d => d.userId === selectedDriver.userId);
      
      if (freshDriverData) {
        setSelectedDriver(freshDriverData);
      } else {
        setSelectedDriver(null);
      }
    }
  };

  if (loading && drivers.length === 0) {
    return <div className="p-6 text-white/60">Loading verification queue...</div>;
  }

  return (
    <div className="p-6 space-y-10 pb-24 text-white rounded-2xl min-h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#181818] via-[#151515] to-[#121212] rounded-2xl p-8 border border-white/10 shadow-lg">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
          Verification Center
        </h1>
        <p className="text-white/50 mt-3 text-sm md:text-base">
          Approve or reject all pending driver and vehicle documents in one place.
        </p>
      </div>

      {/* Driver List */}
      <div className="bg-[#141414] rounded-2xl border border-white/10 p-8 shadow-lg">
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-8">
          Pending Verification Queue ( {drivers.length} )
        </h2>
        <div className="space-y-4">
          {drivers.length === 0 ? (
            <p className="p-8 text-center text-white/40">No pending verifications! 🎉</p>
          ) : (
            drivers.map(driver => (
              <DriverRow
                key={driver.userId}
                driver={driver}
                onClick={() => setSelectedDriver(driver)}
              />
            ))
          )}
        </div>
      </div>
      
      <Pagination
        currentPage={pageData.number + 1}
        totalPages={pageData.totalPages || 1}
        onPageChange={(page) => setCurrentPage(page - 1)}
        position="relative"
        variant="dark"
      />

      {/* The Modal */}
      {selectedDriver && (
        <VerificationModal
          driver={selectedDriver}
          onClose={() => setSelectedDriver(null)}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
};

// --- Child Component: DriverRow ---
const DriverRow = ({ driver, onClick }) => {
  // Check for any unverified doc
  const hasPendingDocs = !driver.isAadhaarVerified || 
                         !driver.isDriverLicenseVerified;
  return (
    <div
      onClick={onClick}
      className="group relative bg-[#1a1a1a] p-5 border border-white/10 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:bg-white/5 overflow-hidden"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-b from-white to-white/80 text-black font-bold flex items-center justify-center shadow-md">
            {(driver.firstName || "I").substring(0, 1).toUpperCase()}{(driver.lastName || "D").substring(0, 1).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {driver.firstName || "Driver ID : "} {driver.lastName || driver.userId}
            </h3>
            <div className="flex items-center gap-4 mt-2">
              {hasPendingDocs && (
                <div className="flex items-center gap-2 text-yellow-300">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-xs font-medium">Documents Pending</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 text-white/30 group-hover:text-white/70 transition">
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default ManageVerifications;