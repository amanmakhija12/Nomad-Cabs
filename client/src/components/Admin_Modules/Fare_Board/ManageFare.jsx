import { useState, useEffect, useCallback, useRef } from "react";
import { toast, Bounce } from "react-toastify";
import VehicleCategoryPricingCard from "./VehicleCategoryPricingCard";
import CommissionCard from "./CommissionCard";
import { fareConfigService, commissionService } from "../../../services/adminService";

const ManageFare = () => {
  const [fareConfigs, setFareConfigs] = useState([]);
  const [commissionStructure, setCommissionStructure] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasShownErrorRef = useRef(false);

  const fetchFareData = useCallback(async (silent = false) => {
    try {
      setLoading(true);
      
      // Use Promise.all to fetch both in parallel
      const [fareResponse, commissionResponse] = await Promise.all([
        fareConfigService.getAllFares(),
        commissionService.getAllCommission()
      ]);
      
      // Axios response is in .data
      setFareConfigs(fareResponse || []); 
      setCommissionStructure(commissionResponse || []);
      
    } catch (error) {
      console.error("Error fetching fare data:", error);
      if (!silent && !hasShownErrorRef.current) {
        toast.error(error.message || "Failed to fetch fare data", {
          theme: "dark",
          transition: Bounce,
          position: "top-right",
        });
        hasShownErrorRef.current = true;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFareData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px] bg-[#0f0f0f] rounded-2xl border border-white/10">
        <div className="text-sm font-medium text-white/60 tracking-wide">
          Loading fare data...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10 pb-24 text-white rounded-2xl min-h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#181818] via-[#151515] to-[#121212] rounded-2xl p-8 border border-white/10 shadow-lg">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          Fare Board
        </h1>
        <p className="text-white/50 mt-3 text-sm md:text-base">
          Manage vehicle category pricing & commission structure
        </p>
        <div className="mt-6 flex items-center gap-4 text-[11px] uppercase tracking-wider text-white/35">
          <span>
            Vehicle Category:{" "}
            <strong className="text-white/70">{fareConfigs.length}</strong>
          </span>
          <span>
            Commission Tiers:{" "}
            <strong className="text-white/70">
              {commissionStructure.length}
            </strong>
          </span>
        </div>
      </div>

      <VehicleCategoryPricingCard
        fareConfigs={fareConfigs}
        setFareConfigs={setFareConfigs}
        fareConfigService={fareConfigService}
      />

      <CommissionCard
        commissionStructure={commissionStructure}
        setCommissionStructure={setCommissionStructure}
        commissionService={commissionService}
      />
    </div>
  );
};

export default ManageFare;
