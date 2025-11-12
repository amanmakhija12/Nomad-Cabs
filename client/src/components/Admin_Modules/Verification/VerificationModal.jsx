import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { X, Check, ShieldCheck, ShieldAlert } from "lucide-react";
// Make sure this path is correct for your project structure
import { driverService, vehicleService } from "../../../services/adminService";

// Reusable spinner
const Spinner = () => <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />;

// Reusable verification row
const VerificationRow = ({ label, value, isVerified, onApprove, onReject, loading }) => {
  const getStatus = () => {
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

  return (
    <tr className="border-t border-white/5">
      <td className="px-5 py-4 align-top">
        <div className="text-white/85 font-medium">{label}</div>
        <div className="text-white/40 text-[11px] mt-1 truncate max-w-xs">{value || "Not Submitted"}</div>
      </td>
      <td className="px-5 py-4 align-top">{getStatus()}</td>
      <td className="px-5 py-4 align-top">
        {!isVerified && (
          <div className="flex gap-2">
            {value ? (
              <>
                <button onClick={onApprove} disabled={loading.approve} title="Approve" className="h-9 w-9 flex items-center justify-center rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 disabled:opacity-50">
                  {loading.approve ? <Spinner /> : <Check size={16} />}
                </button>
                <button onClick={onReject} disabled={loading.reject} title="Reject" className="h-9 w-9 flex items-center justify-center rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 disabled:opacity-50">
                  {loading.reject ? <Spinner /> : <X size={16} />}
                </button>
              </>
            ) : (
              <span className="text-white/40 text-xs">Documents not provided yet</span>
            )}
          </div>
        )}
      </td>
    </tr>
  );
};

// The Main Modal
export const VerificationModal = ({ driver, onClose, onRefresh }) => {
  const [saving, setSaving] = useState(null); // Tracks "id-docType-action"
  
  // 3. Renamed 'loading' to 'vehicleLoading' to avoid conflicts
  const [vehicles, setVehicles] = useState(null); // Start as null to show loader
  const [vehicleLoading, setVehicleLoading] = useState(true);

  // 4. Your fetchVehicles function is perfect.
  const fetchVehicles = useCallback(async () => {
    try {
      setVehicleLoading(true);
      // We use driver.userId, which comes from the DTO
      const response = await vehicleService.getVehiclesByDriver(driver.userId);
      setVehicles(response || []); // Axios response is in .data
      return response || []; 
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error(error.message || "Failed to fetch vehicles");
      return [];
    } finally {
      setVehicleLoading(false);
    }
  }, [driver.userId]);
 
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleDriverVerify = async (docType, isApproved) => {
    if((docType === "AADHAAR" && !driver.aadharNumber) || (docType === "LICENSE" && !driver.licenseNumber)) {
      toast.error(`Cannot ${isApproved ? 'approve' : 'reject'} unsubmitted document`);
      return;
    }
    const savingKey = `${driver.id}-${docType}-${isApproved ? 'approve' : 'reject'}`;
    setSaving(savingKey);
    try {
      // We use driver.driverId, which is the Driver's primary key
      await driverService.verifyDriverDoc(driver.driverId, docType, isApproved);
      toast.success(`Driver ${docType} ${isApproved ? 'approved' : 'rejected'}`);
      onRefresh(); // Refresh the list in the parent
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setSaving(null);
    }
  };

  const handleVehicleVerify = async (vehicleId, docType, isApproved) => {
    const savingKey = `${vehicleId}-${docType}-${isApproved ? 'approve' : 'reject'}`;
    setSaving(savingKey);
    try {
      await vehicleService.verifyVehicle(vehicleId);
      toast.success(`Vehicle ${isApproved ? 'approved' : 'rejected'}`);
      // 5. Instead of onRefresh, we just refetch the vehicles for this modal
      fetchVehicles(); 
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
            <p className="text-sm text-white/50">Driver ID: {driver.userId}</p>
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
                  onApprove={() => handleDriverVerify("AADHAAR", true)}
                  onReject={() => handleDriverVerify("AADHAAR", false)}
                  loading={{
                    approve: saving === `${driver.id}-AADHAAR-approve`,
                    reject: saving === `${driver.id}-AADHAAR-reject`,
                  }}
                />
                <VerificationRow
                  label="License"
                  value={driver.licenseNumber}
                  isVerified={driver.driverLicenseVerified}
                  onApprove={() => handleDriverVerify("LICENSE", true)}
                  onReject={() => handleDriverVerify("LICENSE", false)}
                  loading={{
                    approve: saving === `${driver.id}-LICENSE-approve`,
                    reject: saving === `${driver.id}-LICENSE-reject`,
                  }}
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
              vehicles.map(vehicle => (
                <div key={vehicle.id} className="mb-6 bg-[#1f1f1f] rounded-xl border border-white/10 overflow-hidden">
                  <h4 className="text-md font-semibold text-white p-4 bg-black/20">
                    {vehicle.registrationNumber} ({vehicle.vehicleType})
                  </h4>
                  <table className="w-full text-sm">
                    <tbody>
                      <VerificationRow
                        label="RC"
                        value={vehicle.rcNumber}
                        isVerified={vehicle.rcVerified}
                        onApprove={() => handleVehicleVerify(vehicle.id, "RC", true)}
                        onReject={() => handleVehicleVerify(vehicle.id, "RC", false)}
                        loading={{
                          approve: saving === `${vehicle.id}-RC-approve`,
                          reject: saving === `${vehicle.id}-RC-reject`,
                        }}
                      />
                      <VerificationRow
                        label="PUC"
                        value={vehicle.pucNumber}
                        isVerified={vehicle.pucVerified}
                        onApprove={() => handleVehicleVerify(vehicle.id, "PUC", true)}
                        onReject={() => handleVehicleVerify(vehicle.id, "PUC", false)}
                        loading={{
                          approve: saving === `${vehicle.id}-PUC-approve`,
                          reject: saving === `${vehicle.id}-PUC-reject`,
                        }}
                      />
                      <VerificationRow
                        label="Insurance"
                        value={vehicle.insurancePolicyNumber}
                        isVerified={vehicle.insuranceVerified}
                        onApprove={() => handleVehicleVerify(vehicle.id, "INSURANCE", true)}
                        onReject={() => handleVehicleVerify(vehicle.id, "INSURANCE", false)}
                        loading={{
                          approve: saving === `${vehicle.id}-INSURANCE-approve`,
                          reject: saving === `${vehicle.id}-INSURANCE-reject`,
                        }}
                      />
                    </tbody>
                  </table>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};