import { useState } from "react";
import { toast, Bounce } from "react-toastify";
import { Save, X, Edit, Plus, Trash2 } from "lucide-react";

// Vehicle categories constraint
const VEHICLE_CATEGORIES = ["BIKE", "AUTO", "SEDAN", "SUV"];

// Default state for a new fare config
const DEFAULT_NEW_FARE = {
  city: "",
  state: "",
  vehicleType: VEHICLE_CATEGORIES[0], // Default to first category
  baseFare: 0,
  ratePerKm: 0,
};

const VehicleCategoryPricingCard = ({
  fareConfigs,
  setFareConfigs,
  fareConfigService,
}) => {
  const [editingFareConfig, setEditingFareConfig] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newFareConfig, setNewFareConfig] = useState(DEFAULT_NEW_FARE);

  const inputBase =
    "h-11 w-full rounded-lg bg-[#1b1b1b] border border-white/10 text-sm px-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/15";

  // --- Edit Handlers ---

  const handleFareConfigEdit = (fare) => {
    setEditingFareConfig({ ...fare });
    setIsAdding(false); // Close "add" row if open
  };

  const handleFareConfigSave = async () => {
    try {
      const updatedData = await fareConfigService.updateFare(
        editingFareConfig.id,
        editingFareConfig
      );
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

  // --- Add New Handlers ---

  const handleAddNewToggle = () => {
    setIsAdding(true);
    setNewFareConfig(DEFAULT_NEW_FARE);
    setEditingFareConfig(null); // Close "edit" row if open
  };

  const handleAddNewCancel = () => {
    setIsAdding(false);
  };

  const handleAddNewSave = async () => {
    try {
      const createdData = await fareConfigService.addFare(newFareConfig);
      setFareConfigs((prev) => [...prev, createdData]);
      setIsAdding(false);
      toast.success("New fare created", {
        theme: "dark",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Error creating new fare:", error);
      toast.error(error.message || "Failed to create new fare", {
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  // --- Delete Handler ---

  const handleDeleteFare = async (fareId) => {
    if (!window.confirm("Are you sure you want to delete this fare?")) {
      return;
    }
    try {
      await fareConfigService.deleteFare(fareId);
      setFareConfigs((prev) => prev.filter((fare) => fare.id !== fareId));
      toast.success("Fare deleted", {
        theme: "dark",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Error deleting fare:", error);
      toast.error("Failed to delete fare", {
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  // --- Input Change Handlers ---

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingFareConfig((prev) => ({
      ...prev,
      [name]:
        name === "baseFare" || name === "ratePerKm"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewFareConfig((prev) => ({
      ...prev,
      [name]:
        name === "baseFare" || name === "ratePerKm"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  return (
    <div className="bg-[#141414] rounded-2xl border border-white/10 p-8 shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Vehicle Category Pricing
        </h2>
        {!isAdding && (
          <button
            onClick={handleAddNewToggle}
            className="flex items-center gap-2 h-10 px-4 rounded-lg bg-white text-black text-sm font-medium hover:shadow-lg transition"
          >
            <Plus size={16} />
            Add New Fare
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="bg-[#1f1f1f] text-white/70 text-xs uppercase tracking-wide">
              <th className="text-left font-semibold px-5 py-4">City</th>
              <th className="text-left font-semibold px-5 py-4">State</th>
              <th className="text-left font-semibold px-5 py-4">
                Vehicle Category
              </th>
              <th className="text-left font-semibold px-5 py-4">Base Fare</th>
              <th className="text-left font-semibold px-5 py-4">
                Price / KM (₹)
              </th>
              <th className="text-left font-semibold px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fareConfigs.map((fareConfig) =>
              editingFareConfig?.id === fareConfig.id ? (
                // --- Editing Row ---
                <tr
                  key={fareConfig.id}
                  className="border-t border-white/5 bg-white/5"
                >
                  <td className="px-5 py-3 align-middle">
                    <input
                      type="text"
                      name="city"
                      value={editingFareConfig.city}
                      onChange={handleEditChange}
                      className={inputBase}
                    />
                  </td>
                  <td className="px-5 py-3 align-middle">
                    <input
                      type="text"
                      name="state"
                      value={editingFareConfig.state}
                      onChange={handleEditChange}
                      className={inputBase}
                    />
                  </td>
                  <td className="px-5 py-3 align-middle">
                    <select
                      name="vehicleType"
                      value={editingFareConfig.vehicleType}
                      onChange={handleEditChange}
                      className={inputBase}
                    >
                      {VEHICLE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 align-middle">
                    <input
                      type="number"
                      step="0.01"
                      name="baseFare"
                      value={editingFareConfig.baseFare}
                      onChange={handleEditChange}
                      className={inputBase}
                    />
                  </td>
                  <td className="px-5 py-3 align-middle">
                    <input
                      type="number"
                      step="0.01"
                      name="ratePerKm"
                      value={editingFareConfig.ratePerKm}
                      onChange={handleEditChange}
                      className={inputBase}
                    />
                  </td>
                  <td className="px-5 py-3 align-middle">
                    <div className="flex gap-2">
                      <button
                        onClick={handleFareConfigSave}
                        className="h-9 w-9 flex items-center justify-center rounded-lg bg-white text-black hover:shadow-lg transition"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={handleFareConfigCancel}
                        className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/10 text-white border border-white/15 hover:bg-white/15 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                // --- Display Row ---
                <tr
                  key={fareConfig.id}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >
                  <td className="px-5 py-4 align-middle">
                    <span className="text-white font-medium">
                      {fareConfig.city}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <span className="text-white font-medium">
                      {fareConfig.state}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <span className="capitalize text-white/85 font-medium">
                      {fareConfig.vehicleType.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <span className="capitalize text-white/85 font-medium">
                      ₹{fareConfig.baseFare.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <span className="text-white font-medium">
                      ₹{fareConfig.ratePerKm.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleFareConfigEdit(fareConfig)}
                        className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/10 text-white border border-white/15 hover:bg-white/15 transition"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteFare(fareConfig.id)}
                        className="h-9 w-9 flex items-center justify-center rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
          {/* --- Add New Row --- */}
          {isAdding && (
            <tfoot className="border-t-2 border-white/10">
              <tr className="bg-white/5">
                <td className="px-5 py-3 align-middle">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={newFareConfig.city}
                    onChange={handleNewChange}
                    className={inputBase}
                  />
                </td>
                <td className="px-5 py-3 align-middle">
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={newFareConfig.state}
                    onChange={handleNewChange}
                    className={inputBase}
                  />
                </td>
                <td className="px-5 py-3 align-middle">
                  <select
                    name="vehicleType"
                    value={newFareConfig.vehicleType}
                    onChange={handleNewChange}
                    className={inputBase}
                  >
                    {VEHICLE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-3 align-middle">
                  <input
                    type="number"
                    step="0.01"
                    name="baseFare"
                    placeholder="0.00"
                    value={newFareConfig.baseFare || ""}
                    onChange={handleNewChange}
                    className={inputBase}
                  />
                </td>
                <td className="px-5 py-3 align-middle">
                  <input
                    type="number"
                    step="0.01"
                    name="ratePerKm"
                    placeholder="0.00"
                    value={newFareConfig.ratePerKm || ""}
                    onChange={handleNewChange}
                    className={inputBase}
                  />
                </td>
                <td className="px-5 py-3 align-middle">
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddNewSave}
                      className="h-9 w-9 flex items-center justify-center rounded-lg bg-white text-black hover:shadow-lg transition"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={handleAddNewCancel}
                      className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/10 text-white border border-white/15 hover:bg-white/15 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default VehicleCategoryPricingCard;