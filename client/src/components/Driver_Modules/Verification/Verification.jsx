import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { CheckCircle, Clock, PlusCircle } from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
import { driverService } from "../../../services/driverService"; // <-- Use your new service
import AddVehicleModal from "../Vehicles/AddVehicleModal"; // <-- Import the Add modal
import { VehicleEditorCard } from "./VehicleEditorCard"; // <-- Import the new Card
import ActiveRideBanner from "../../Common/ActiveRideBanner";

const ManageVerification = ({ activeBooking, setActiveSection }) => {
  const user = useAuthStore((s) => s.user);
  
  const [driverData, setDriverData] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    aadhaarNumber: "",
    dlNumber: "",
    dlExpiryDate: "",
  });

  // Fetches ALL data for this page
  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch in parallel
      const [profile, vehicles] = await Promise.all([
        driverService.getDriverProfile(),
        driverService.getMyVehicles(),
      ]);

      setDriverData(profile);
      setVehicles(vehicles || []);
      
      setFormData({
        aadhaarNumber: profile.aadharNumber || "",
        dlNumber: profile.licenseNumber || "",
        dlExpiryDate: profile.driverLicenseExpiry || "",
      });

    } catch (error) {
      console.error('Error fetching driver data:', error);
      if (error.response?.status !== 404) {
        toast.error(error.message || 'Failed to fetch data', { theme: "dark" });
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handles *only* the driver document (Aadhaar/DL) form
  const handleSubmitDriverDocs = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await driverService.updateDriverProfile(formData);
      setDriverData(response); // Update state with fresh data
      toast.success("Driver details submitted!", { theme: 'dark' });
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error.message || 'Failed to submit details', { theme: 'dark' });
    } finally {
      setSaving(false);
    }
  };

  // Callback for when a new vehicle is added
  const onVehicleAdded = () => {
    setShowAddModal(false);
    fetchData(); // Refresh the whole page
  };

  const getStatusBadge = (status) => {
    // ... (Your getStatusBadge function is fine, but it needs to check
    // driverData.isAadhaarVerified and driverData.isDriverLicenseVerified
    // to show a "Partial" or "Full" status. I'll simplify for now.)
    const isVerified = driverData?.aadhaarVerified && driverData?.driverLicenseVerified;
    const Icon = isVerified ? CheckCircle : Clock;
    const color = isVerified 
      ? 'bg-green-500/20 text-green-300 border-green-500/30' 
      : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    
    return (
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${color}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{isVerified ? "Verified" : "Pending"}</span>
      </div>
    );
  };
  
  if (loading && !driverData) {
    return <div className="p-6 text-white/60">Loading your profile...</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-[#151212] text-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-semibold mb-2">Driver Verification</h1>
              <p className="text-gray-400">Submit your documents for verification</p>
            </div>
            {driverData && getStatusBadge(driverData.verificationStatus)}
          </div>

          {/* Form 1: Driver Documents */}
          <div className="bg-[#141414] rounded-2xl border border-white/10 p-8 mb-10">
            <h3 className="text-lg font-semibold text-white mb-6">Your Documents (Aadhaar & License)</h3>
            <form onSubmit={handleSubmitDriverDocs} className="space-y-6">
              {/* Aadhaar Number */}
              <InputField
                label="Aadhaar Number"
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012"
                maxLength="12"
                required
                disabled={driverData?.isAadhaarVerified || saving}
              />
              
              {/* DL Number */}
              <InputField
                label="Driving License Number"
                name="dlNumber"
                value={formData.dlNumber}
                onChange={handleChange}
                placeholder="MH01 20230012345"
                required
                disabled={driverData?.isDriverLicenseVerified || saving}
              />

              {/* DL Expiry */}
              <InputField
                label="License Expiry Date"
                name="dlExpiryDate"
                type="date"
                value={formData.dlExpiryDate}
                onChange={handleChange}
                required
                disabled={driverData?.isDriverLicenseVerified || saving}
                min={new Date().toISOString().split('T')[0]}
              />

              {driverData && !(driverData.isAadhaarVerified && driverData.isDriverLicenseVerified) && (
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full h-12 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? "Submitting..." : "Submit Driver Documents"}
                </button>
              )}
            </form>
          </div>

          {/* Section 2: Vehicle Documents */}
          <div className="bg-[#141414] rounded-2xl border border-white/10 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Your Vehicles</h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 transition"
              >
                <PlusCircle size={18} />
                Add Vehicle
              </button>
            </div>
            
            <div className="space-y-6">
              {loading && <p className="text-white/50">Loading vehicles...</p>}
              {!loading && vehicles.length === 0 && (
                <p className="text-center text-white/50 py-10">You have not added any vehicles yet.</p>
              )}
              {vehicles.map(vehicle => (
                <VehicleEditorCard 
                  key={vehicle.id} 
                  vehicle={vehicle} 
                  onRefresh={fetchData} 
                />
              ))}
            </div>
          </div>

        </div>
      </div>
      
      {/* Add Vehicle Modal */}
      {showAddModal && (
        <AddVehicleModal
          onClose={() => setShowAddModal(false)}
          onSubmit={onVehicleAdded}
        />
      )}

      {activeBooking && (
        <ActiveRideBanner setActiveSection={setActiveSection} />
      )}
    </>
  );
};

// Reusable Input Field
const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-2">
      {label}
      {props.required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      {...props}
      className="w-full h-12 px-4 rounded-xl bg-[#1a1a1a] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
    />
  </div>
);

export default ManageVerification;