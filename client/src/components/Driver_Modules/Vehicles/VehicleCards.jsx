import { useEffect, useState, useCallback } from "react";
import { toast, Bounce } from "react-toastify";
import { formatDateSafe } from "../../../utils/DateUtil";
import VehicleDetailModal from "./VehicleDetailModal";
import { getVehicleIcon } from "./Vehicles";
import { PlusCircle } from 'lucide-react';
import AddVehicleModal from "./AddVehicleModal";
import { vehicleService } from "../../../services/vehicleService"; 

const VehicleCards = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await vehicleService.getMyVehicles();
      console.log(data);
      setVehicles(data);
    } catch (error) {
      console.error('❌ Error fetching vehicles:', error);
      toast.error(error.message || "Failed to fetch vehicles", {
        position: "top-right",
        autoClose: 4000,
        theme: "dark",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  
  const addVehicle = async (vehicleData) => {
    try {
      
      const response = await vehicleService.addVehicle(vehicleData);
      toast.success("Vehicle added successfully!", {
        theme: "dark",
        transition: Bounce,
      });
      setVehicles([...vehicles, response]);
      setShowCreateModal(false);
    } catch (error) {
      console.error("❌ Error adding vehicle:", error);
      toast.error(error.message || "Failed to add vehicle", {
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/10 border-t-white" />
          <div className="absolute inset-0 flex items-center justify-center text-white/70 text-lg">
            🚗
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {vehicles.length === 0 ? (
        <div className="text-center py-20 bg-[#141414] rounded-2xl border border-white/10 flex flex-col items-center justify-center space-y-5">
          <h3 className="text-xl font-semibold text-white">
            No Vehicles Found
          </h3>
          <p className="text-sm text-gray-400 max-w-sm">
            You have not registered any vehicles yet. Add one to get started.
          </p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="h-11 px-8 rounded-xl bg-white text-black font-medium text-sm tracking-wide shadow hover:shadow-lg transition"
          >
            + Add Vehicle
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative">
            {vehicles && vehicles.map((vehicle) => {
              const Icon = getVehicleIcon(vehicle.vehicleType);
              return (
                <div
                  key={vehicle.id}
                  className="group bg-[#141414] rounded-2xl p-6 border border-white/10 hover:border-white/20 hover:bg-[#181818] transition cursor-pointer relative overflow-hidden shadow-lg hover:shadow-xls"
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gradient-to-br from-white/5 to-transparent" />
                  <div className="flex items-start justify-between mb-5 relative">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-[#1d1d1d] border border-white/10 flex items-center justify-center">
                        {Icon && <Icon size={26} className="text-white" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white capitalize tracking-wide">
                          {vehicle.vehicleType}
                        </h3>
                        <p className="text-xs text-gray-400 font-mono mt-1">
                          {vehicle.rcNumber}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 min-h-[82px]">
                      {vehicle.rcVerified && (
                        <Pill label="RC" color="emerald" />
                      )}
                      {vehicle.pucVerified && (
                        <Pill label="PUC" color="blue" />
                      )}
                      {vehicle.insuranceVerified && (
                        <Pill label="INS" color="purple" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <Row
                      label="PUC Expires"
                      value={formatDateSafe(vehicle.pucExpiry)}
                    />
                    <Row
                      label="Insurance Expires"
                      value={formatDateSafe(vehicle.insuranceExpiry)}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 uppercase tracking-wide text-[11px]">
                        Verification
                      </span>
                      <div className="flex gap-1">
                        <Dot ok={vehicle.rcVerified} />
                        <Dot ok={vehicle.pucVerified} />
                        <Dot ok={vehicle.insuranceVerified} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-white/10">
                    <button className="w-full flex items-center justify-center gap-2 text-xs font-medium text-white/70 group-hover:text-white transition">
                      <span>View Full Details</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {}
          <div className="absolute bottom-8 right-8">
            <button
              className="group bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-base
                hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300
                shadow-lg hover:shadow-xl flex items-center space-x-3 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowCreateModal(true);
              }}
            >
              <PlusCircle className="group-hover:animate-pulse" size={20} />
              <span>Add Vehicle</span>
            </button>
          </div>
        </>
      )}

      {showCreateModal && (
        <AddVehicleModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={addVehicle}
        />
      )}

      {selectedVehicle && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </>
  );
};


const Row = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-500 text-[11px] uppercase tracking-wide">
      {label}
    </span>
    <span className="text-white/90 text-[11px]">{value}</span>
  </div>
);

const Pill = ({ label, color }) => {
  const map = {
    emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    blue: "bg-blue-500/15 text-blue-300 border-blue-400/30",
    purple: "bg-purple-500/15 text-purple-300 border-purple-400/30",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-[10px] font-medium tracking-wide border ${
        map[color] || ""
      }`}
    >
      {label}
    </span>
  );
};

const Dot = ({ ok }) => (
  <div
    className={`w-3 h-3 rounded-full ${ok ? "bg-emerald-500" : "bg-red-500"}`}
  />
);

export default VehicleCards;