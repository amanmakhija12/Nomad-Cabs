import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { X, Check, ShieldCheck, ShieldAlert, CheckCircle2 } from "lucide-react";
// Make sure this path is correct for your project structure
import { driverService, vehicleService } from "../../../services/adminService";

// Reusable spinner
const Spinner = () => <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />;

// Gets a simple status icon and text
const getStatusDisplay = (isVerified) => {
  if (isVerified) {
    return (
      <div className="flex items-center gap-2 text-green-300">
        <ShieldCheck className="w-4 h-4" />
        <span className="text-xs font-medium">Verified</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-yellow-300">
      <ShieldAlert className="w-4 h-4" />
      <span className="text-xs font-medium">Pending</span>
    </div>
  );
};

// 1. SIMPLIFIED ROW (for Driver docs)
// This component now only handles a single approval action
const VerificationRow = ({ label, value, isVerified, onApprove, loading }) => {
  return (
    <tr className="border-t border-white/5">
      {/* Document Info */}
      <td className="px-5 py-4 align-top">
        <div className="text-white/85 font-medium">{label}</div>
        <div className="text-white/40 text-[11px] mt-1 truncate max-w-xs">{value || "Not Submitted"}</div>
      </td>
      
      {/* Status */}
      <td className="px-5 py-4 align-top">{getStatusDisplay(isVerified)}</td>
      
      {/* Actions */}
      <td className="px-5 py-4 align-top">
        {!isVerified && (
          <div className="flex gap-2">
            {value ? (
              <button 
                onClick={onApprove} 
                disabled={loading} 
                title="Approve" 
                className="h-9 px-4 flex items-center justify-center rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 disabled:opacity-50 gap-2"
              >
                {loading ? <Spinner /> : <Check size={16} />}
                <span className="text-sm">Approve</span>
              </button>
            ) : (
              <span className="text-white/40 text-xs">Documents not provided</span>
            )}
          </div>
        )}
      </td>
    </tr>
  );
};


// 2. NEW VEHICLE CARD
// This component displays vehicle info and has ONE approve button
const VehicleVerificationCard = ({ vehicle, onApprove, loading }) => {
  
  const StatusBadge = ({ label, isVerified, value }) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-white/50">{label} : {value}</span>
      {value ? getStatusDisplay(isVerified) : (
        <span className="text-xs text-white/40">Not Submitted</span>
      )}
    </div>
  );

  const canApprove = 
    (vehicle.registrationNumber && 
    vehicle.pucNumber && 
    vehicle.insurancePolicyNumber);

    const isApproved = (!vehicle.rcVerified && !vehicle.pucVerified && !vehicle.insuranceVerified);

  return (
    <div className="bg-[#1f1f1f] rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <h4 className="text-md font-semibold text-white p-4 bg-black/20">
        {vehicle.registrationNumber} ({vehicle.vehicleType})
      </h4>
      
      {/* Document Statuses */}
      <div className="p-4 grid grid-cols-3 gap-4 border-b border-white/10">
        <StatusBadge label="RC" isVerified={vehicle.rcVerified} value={vehicle.registrationNumber} />
        <StatusBadge label="PUC" isVerified={vehicle.pucVerified} value={vehicle.pucNumber} />
        <StatusBadge label="Insurance" isVerified={vehicle.insuranceVerified} value={vehicle.insurancePolicyNumber} />
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-black/10">
        {vehicle.isVerified ? (
          <div className="flex items-center gap-2 text-green-300">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Vehicle is Approved</span>
          </div>
        ) : (
          <div>
            {canApprove && isApproved ? (
              <button
                onClick={onApprove}
                disabled={loading}
                className="h-9 px-4 flex items-center justify-center rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 disabled:opacity-50 gap-2"
              >
                {loading ? <Spinner /> : <Check size={16} />}
                <span className="text-sm">Approve Vehicle</span>
              </button>
            ) : (
              isApproved && (
                <span className="text-sm text-yellow-300/80">
                  Driver must submit all vehicle documents before approval.
                </span>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};


// 3. MAIN MODAL
// Updated to use the new components and simplified logic
export const VerificationModal = ({ driver, onClose, onRefresh }) => {
  const [saving, setSaving] = useState(null); // Tracks "type-id-action"
  const [vehicles, setVehicles] = useState([]);
  const [vehicleLoading, setVehicleLoading] = useState(true);

  const fetchVehicles = useCallback(async () => {
    try {
      setVehicleLoading(true);
      console.log(driver);
      const response = await vehicleService.getVehiclesByDriver(driver.userId);
      setVehicles(response || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error(error.message || "Failed to fetch vehicles");
    } finally {
      setVehicleLoading(false);
    }
  }, [driver.driverId]);
  
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Simplified handler
  const handleDriverVerify = async (docType) => {
    if((docType === "AADHAAR" && !driver.aadharNumber) || (docType === "LICENSE" && !driver.licenseNumber)) {
      toast.error(`Cannot approve unsubmitted document`);
      return;
    }
    const savingKey = `driver-${docType}-approve`;
    setSaving(savingKey);
    try {
      await driverService.verifyDriverDoc(driver.driverId, docType, true); // Always true
      toast.success(`Driver ${docType} approved`);
      onRefresh(); 
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setSaving(null);
    }
  };

  // Simplified handler
  const handleVehicleVerify = async (vehicleId) => {
    const savingKey = `vehicle-${vehicleId}-approve`;
    setSaving(savingKey);
    try {
      // This is the single API call you mentioned
      await vehicleService.verifyVehicle(vehicleId); 
      toast.success(`Vehicle approved`);
      fetchVehicles(); // Refetch vehicles for this modal
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141414] rounded-2xl border border-white/10 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-white">Verification Details</h2>
            <p className="text-sm text-white/50">Driver ID: {driver.driverId}</p>
          </div>
          <button onClick={onClose} className="h-9 w-9 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition">
            <X size={20} />
          </button>
        </div>

        {/* Modal Content (Scrollable) */}
        <div className="p-8 space-y-8 overflow-y-auto">
          
          {/* Driver Documents */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Driver Documents</h3>
            <table className="w-full text-sm">
              <thead className="bg-[#1f1f1f] text-white/60 text-xs uppercase">
                <tr>
                  <th className="text-left font-semibold px-5 py-3">Document</th>
                  <th className="text-left font-semibold px-5 py-3">Status</th>
                  <th className="text-left font-semibold px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <VerificationRow
                  label="Aadhaar"
                  value={driver.aadharNumber}
                  isVerified={driver.aadhaarVerified}
                  onApprove={() => handleDriverVerify("AADHAAR")}
                  loading={saving === `driver-AADHAAR-approve`}
                />
                <VerificationRow
                  label="License"
                  value={driver.licenseNumber}
                  isVerified={driver.driverLicenseVerified}
                  onApprove={() => handleDriverVerify("LICENSE")}
                  loading={saving === `driver-LICENSE-approve`}
                />
              </tbody>
            </table>
          </div>

          {/* Vehicle Documents */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Vehicle Documents</h3>
            {vehicleLoading ? (
              <p className="text-white/50">Loading vehicles...</p>
            ) : vehicles.length === 0 ? (
              <p className="text-sm text-white/40">This driver has not added any vehicles yet.</p>
            ) : (
              <div className="space-y-4">
                {vehicles.map(vehicle => (
                  <VehicleVerificationCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onApprove={() => handleVehicleVerify(vehicle.id)}
                    loading={saving === `vehicle-${vehicle.id}-approve`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};