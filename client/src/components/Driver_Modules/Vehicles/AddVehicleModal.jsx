import { X, UploadCloud } from "lucide-react";
import { useState } from "react";
import { getVehicleIcon } from "./Vehicles";

const AddVehicleModal = ({ onClose, onSubmit }) => {
  // --- 1. BUG FIX: Changed state to camelCase to match your Java entity ---
  const [formData, setFormData] = useState({
    vehicleType: "",
    rcNumber: "",
    pucNumber: "",
    insurancePolicyNumber: "",
    pucExpiry: "",
    insuranceExpiry: "",
    manufacturer: "",
    model: "",
    color: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields (using camelCase)
    if (!formData.vehicleType || !formData.rcNumber || !formData.pucExpiry || !formData.insuranceExpiry) {
      alert('Please fill all required fields');
      return;
    }

    onSubmit(formData);
  };

  // --- 2. THEME FIX: Changed getVehicleIcon to use camelCase state ---
  const Icon = getVehicleIcon(formData.vehicleType);
  const inputBase = "w-full p-3 text-base font-medium text-white bg-[#1a1a1a] border-2 border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-200";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        // --- 3. THEME FIX: Changed modal container to dark theme ---
        className="bg-[#141414] rounded-2xl shadow-2xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- 4. THEME FIX: Header and close button --- */}
        <div className="p-8 bg-gradient-to-r from-[#181818] to-[#151515] relative border-b border-white/10">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-5 right-5 z-50 inline-flex items-center justify-center
              h-11 w-11 rounded-full cursor-pointer bg-white/10 shadow-lg border border-white/15
              text-white/70 hover:text-white hover:bg-white/20
              ring-2 ring-transparent ring-offset-black
              transition-all duration-200 ease-out transform hover:scale-110"
          >
            <X />
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
              {Icon ? <Icon size={32} className="text-white" /> : "🚗"}
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Add New Vehicle
            </h2>
            <p className="text-white/60 mt-2 text-lg">
              Fill in the details below
            </p>
          </div>
        </div>
        {/* --- END OF THEME FIX --- */}

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Type */}
            {/* --- 5. THEME FIX: Form group styling --- */}
            <div className="group bg-[#1b1b1b] p-4 rounded-xl border border-white/10 hover:shadow-md transition-all duration-200 hover:border-white/20">
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-2 group-hover:text-white/70">
                Vehicle Type <span className="text-red-500">*</span>
              </label>
              <select
                className={inputBase}
                required
                name="vehicleType" // camelCase
                value={formData.vehicleType}
                onChange={handleChange}
              >
                <option value="" disabled>Select Vehicle Type</option>
                <option value="AUTO">Auto</option>
                <option value="BIKE">Bike</option>
                <option value="SEDAN">Sedan</option>
                <option value="SUV">SUV</option>
              </select>
            </div>
            {/* --- END OF THEME FIX --- */}

            {/* Required Fields */}
            {[
              { label: "RC Number", name: "rcNumber", required: true },
              { label: "PUC Number", name: "pucNumber", required: true },
              { label: "Insurance Policy Number", name: "insurancePolicyNumber", required: true },
              { label: "PUC Expiry", name: "pucExpiry", type: "date", required: true },
              { label: "Insurance Expiry", name: "insuranceExpiry", type: "date", required: true },
              { label: "Manufacturer", name: "manufacturer", required: true },
              { label: "Model", name: "model", required: true },
              { label: "Color", name: "color", required: true },
            ].map(({ label, name, type = "text", required }) => (
              <div
                key={name}
                className="group bg-[#1b1b1b] p-4 rounded-xl border border-white/10 hover:shadow-md transition-all duration-200 hover:border-white/20"
              >
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-2 group-hover:text-white/70">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={type}
                  name={name} // camelCase
                  value={formData[name]}
                  onChange={handleChange}
                  required={required}
                  className={inputBase}
                />
              </div>
            ))}
          </div>

          {/* --- 6. THEME FIX: Note box --- */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <p className="text-sm text-blue-300">
              <strong>Note:</strong> Document uploads will be added in the next version. 
              For now, please ensure you have RC, PUC, and Insurance documents ready for verification.
            </p>
          </div>

          {/* --- 7. THEME FIX: Buttons --- */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-6 py-3 rounded-xl font-semibold text-white/70 bg-white/10 hover:bg-white/20 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer bg-white hover:bg-gray-200 text-black px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all"
            >
              <UploadCloud size={18} />
              <span>Add Vehicle</span>
            </button>
          </div>
          {/* --- END OF THEME FIX --- */}

        </form>
      </div>
    </div>
  );
};

export default AddVehicleModal;