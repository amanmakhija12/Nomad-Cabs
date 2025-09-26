import { useState, useEffect, useCallback, useRef } from "react";
import { toast, Bounce } from "react-toastify";
import LocationPricingCard from "./LocationPricingCard";
import CommissionCard from "./CommissionCard";

const ManageFare = () => {
  const [locationPricing, setLocationPricing] = useState([]);
  const [commissionStructure, setCommissionStructure] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasShownErrorRef = useRef(false);

  const fetchFareData = useCallback(async (silent = false) => {
    try {
      setLoading(true);
      const locationResponse = await fetch(
        "http://localhost:3008/location_pricing"
      );
      const locationData = await locationResponse.json();
      const commissionResponse = await fetch(
        "http://localhost:3008/commission_structure"
      );
      const commissionData = await commissionResponse.json();
      setLocationPricing(locationData || []);
      setCommissionStructure(commissionData || []);
    } catch (error) {
      console.error("Error fetching fare data:", error);
      if (!silent && !hasShownErrorRef.current) {
        toast.error("Failed to fetch fare data", {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          Manage location pricing & commission structure
        </p>
        <div className="mt-6 flex items-center gap-4 text-[11px] uppercase tracking-wider text-white/35">
          <span>
            Locations:{" "}
            <strong className="text-white/70">{locationPricing.length}</strong>
          </span>
          <span>
            Commission Tiers:{" "}
            <strong className="text-white/70">
              {commissionStructure.length}
            </strong>
          </span>
        </div>
      </div>

      <LocationPricingCard
        locationPricing={locationPricing}
        setLocationPricing={setLocationPricing}
      />

      <CommissionCard
        commissionStructure={commissionStructure}
        setCommissionStructure={setCommissionStructure}
      />
    </div>
  );
};

export default ManageFare;
