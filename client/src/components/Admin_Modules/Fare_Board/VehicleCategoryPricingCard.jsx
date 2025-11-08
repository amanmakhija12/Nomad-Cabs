import { useState } from "react";
import { toast, Bounce } from "react-toastify";
import { Save, X, Edit } from "lucide-react";


const VehicleCategoryPricingCard = ({ fareConfigs, setFareConfigs, fareConfigService }) => {
  const [editingFareConfig, setEditingFareConfig] = useState(null);

  const inputBase =
    "h-11 w-full rounded-lg bg-[#1b1b1b] border border-white/10 text-sm px-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/15";

  const handleFareConfigEdit = (fare) => {
    setEditingFareConfig({ ...fare });
  };

  const handleFareConfigSave = async () => {
    try {
      const updatedData = await fareConfigService.updateFare(editingFareConfig.id, editingFareConfig);
      setFareConfigs((prev) =>
        prev.map((fare) =>
          fare.id === updatedData.id ? updatedData : fare
        )
      );
      setEditingFareConfig(null);
      toast.success("Fare details updated", {
        theme: "dark",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Error updating fare details:", error);
      toast.error("Failed to update fare details", {
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const handleFareConfigCancel = () => {
    setEditingFareConfig(null);
  };

  return (
    <div className="bg-[#141414] rounded-2xl border border-white/10 p-8 shadow-lg">
      <h2 className="text-2xl font-semibold tracking-tight text-white mb-8">
        Vehicle Category Pricing
      </h2>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1f1f1f] text-white/70 text-xs uppercase tracking-wide">
              <th className="text-left font-semibold px-5 py-4">Vehicle Category</th>
              <th className="text-left font-semibold px-5 py-4">Base Fare</th>
              <th className="text-left font-semibold px-5 py-4">Price / KM (₹)</th>
              <th className="text-left font-semibold px-5 py-4">Price / Minute (₹)</th>
              <th className="text-left font-semibold px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fareConfigs.map((fareConfig) => (
              <tr
                key={fareConfig.id}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                <td className="px-5 py-3 align-middle">
                  <span className="capitalize text-white/85 font-medium">
                    {fareConfig.vehicleCategory.toLowerCase()}
                  </span>
                </td>
                <td className="px-5 py-3 align-middle">
                  {editingFareConfig?.id === fareConfig.id ? (
                    <input
                      type="text"
                      value={editingFareConfig.baseFare}
                      onChange={(e) =>
                        setEditingFareConfig((prev) => ({
                          ...prev,
                          baseFare: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className={inputBase}
                    />
                  ) : (
                    <span className="capitalize text-white/85 font-medium">
                      ₹{fareConfig.baseFare.toFixed(2)}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 align-middle">
                  {editingFareConfig?.id === fareConfig.id ? (
                    <input
                      type="number"
                      step="0.01"
                      value={editingFareConfig.pricePerKm}
                      onChange={(e) =>
                        setEditingFareConfig((prev) => ({
                          ...prev,
                          pricePerKm: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className={inputBase}
                    />
                  ) : (
                    <span className="text-white font-medium">
                      ₹{fareConfig.pricePerKm.toFixed(2)}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 align-middle">
                  {editingFareConfig?.id === fareConfig.id ? (
                    <input
                      type="number"
                      step="0.01"
                      value={editingFareConfig.pricePerMinute}
                      onChange={(e) =>
                        setEditingFareConfig((prev) => ({
                          ...prev,
                          pricePerMinute: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className={inputBase}
                    />
                  ) : (
                    <span className="text-white font-medium">
                      ₹{fareConfig.pricePerMinute.toFixed(2)}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 align-middle">
                  {editingFareConfig?.id === fareConfig.id ? (
                    <div className="flex gap-2">
                      <button onClick={handleFareConfigSave} className="h-9 w-9 flex items-center justify-center rounded-lg bg-white text-black hover:shadow-lg transition">
                        <Save size={16} />
                      </button>
                      <button onClick={handleFareConfigCancel} className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/10 text-white border border-white/15 hover:bg-white/15 transition">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => handleFareConfigEdit(fareConfig)} className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/10 text-white border border-white/15 hover:bg-white/15 transition">
                      <Edit size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleCategoryPricingCard;
