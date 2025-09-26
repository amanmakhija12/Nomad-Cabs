import { useEffect, useState, useCallback } from "react";
import { toast, Bounce } from "react-toastify";
import { formatDateSafe } from "../../../../utils/DateUtil";
import {
  VehicleCard,
  VehicleHeader,
  VehicleLoadingState,
  VehicleEmptyState,
  VehicleGridStats,
  VehicleDetailModal,
} from ".";

const VehicleCards = ({ ownerId, onClose }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3007/vehicles?owner_id=${ownerId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }

      const data = await response.json();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to fetch vehicles", {
        theme: "dark",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  }, [ownerId]);

  useEffect(() => {
    if (ownerId) {
      fetchVehicles();
    }
  }, [ownerId, fetchVehicles]);

  return (
    <>
      <div className="bg-[#141414] rounded-2xl p-8 border border-white/10 shadow-lg">
        <VehicleHeader onClose={onClose} />

        {loading ? (
          <VehicleLoadingState />
        ) : vehicles.length === 0 ? (
          <VehicleEmptyState />
        ) : (
          <>
            <VehicleGridStats vehiclesCount={vehicles.length} />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onClick={setSelectedVehicle}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {selectedVehicle && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          formatDateSafe={formatDateSafe}
        />
      )}
    </>
  );
};

export default VehicleCards;
