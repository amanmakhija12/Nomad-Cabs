import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { driverService } from "../../../services/driverService";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { getVehicleIcon } from "../Vehicles/Vehicles";

const CardInput = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-gray-400 mb-1.5">
      {label}
      {props.required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      {...props}
      className="w-full h-10 px-3 rounded-lg bg-[#1a1a1a] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
    />
  </div>
);

const VerifyStatus = ({ label, isVerified }) => (
  <div
    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
      isVerified
        ? "bg-green-500/20 text-green-300 border-green-500/30"
        : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
    }`}
  >
    {isVerified ? <CheckCircle size={14} /> : <Clock size={14} />}
    {label}
  </div>
);

export const VehicleEditorCard = ({ vehicle, onRefresh }) => {
  const [formData, setFormData] = useState({
    pucNumber: "",
    pucExpiry: "",
    insurancePolicyNumber: "",
    insuranceExpiry: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData({
      pucNumber: vehicle.pucNumber || "",
      pucExpiry: vehicle.pucExpiry || "",
      insurancePolicyNumber: vehicle.insurancePolicyNumber || "",
      insuranceExpiry: vehicle.insuranceExpiry || "",
    });
  }, [vehicle]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        pucNumber: formData.pucNumber,
        pucExpiry: formData.pucExpiry,
        insurancePolicyNumber: formData.insurancePolicyNumber,
        insuranceExpiry: formData.insuranceExpiry,
      };
      await driverService.updateVehicle(vehicle.id, payload);
      toast.success("Vehicle updated successfully!");
      onRefresh();
    } catch (error) {
      toast.error(error.message || "Failed to update vehicle");
    } finally {
      setSaving(false);
    }
  };

  const Icon = getVehicleIcon(vehicle.vehicleType);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1f1f1f] rounded-xl border border-white/10 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        {}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] border border-white/10 flex items-center justify-center">
            {Icon && <Icon size={22} className="text-white" />}
          </div>
          <div>
            <h4 className="font-semibold text-white capitalize">
              {vehicle.vehicleType.toLowerCase()}
            </h4>
            <p className="text-xs text-white/50 font-mono">
              {vehicle.rcNumber}
            </p>
          </div>
        </div>
        {}
        <div className="flex gap-2">
          <VerifyStatus label={"RC"} isVerified={vehicle.rcVerified} />
          <VerifyStatus label={"PUC"} isVerified={vehicle.pucVerified} />
          <VerifyStatus label={"INS"} isVerified={vehicle.insuranceVerified} />
        </div>
      </div>

      {}
      <div className="text-xs text-blue-300 bg-blue-500/10 border border-blue-500/30 p-2 rounded-md mb-4">
        <AlertCircle size={14} className="inline mr-2" />
        The RC Number is permanent and cannot be changed.
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardInput
          label="PUC Number"
          name="pucNumber"
          value={formData.pucNumber}
          onChange={handleChange}
        />
        <CardInput
          label="PUC Expiry Date"
          name="pucExpiry"
          type="date"
          value={formData.pucExpiry}
          onChange={handleChange}
          required
        />
        <CardInput
          label="Insurance Policy Number"
          name="insurancePolicyNumber"
          value={formData.insurancePolicyNumber}
          onChange={handleChange}
        />
        <CardInput
          label="Insurance Expiry Date"
          name="insuranceExpiry"
          type="date"
          value={formData.insuranceExpiry}
          onChange={handleChange}
          required
        />
      </div>

      {}
      <div className="flex justify-end pt-4 mt-4 border-t border-white/10">
        <button
          type="submit"
          disabled={saving}
          className="h-10 px-6 rounded-lg bg-white text-black text-sm font-medium transition hover:bg-gray-200 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};
