import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Upload, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { useAuthStore } from "../../../store/authStore";

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080/api/v1';

const Verification = () => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  
  const [loading, setLoading] = useState(false);
  const [driverData, setDriverData] = useState(null);
  const [formData, setFormData] = useState({
    aadhaarNumber: "",
    dlNumber: "",
    dlExpiryDate: "",
  });

  // Fetch driver verification status
  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/drivers/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 404) {
          // Driver profile doesn't exist
          setDriverData(null);
          return;
        }

        if (!response.ok) throw new Error('Failed to fetch driver data');
        
        const data = await response.json();
        setDriverData(data);
        
        setFormData({
          aadhaarNumber: data.aadhaarNumber || "",
          dlNumber: data.dlNumber || "",
          dlExpiryDate: data.dlExpiryDate || "",
        });
      } catch (error) {
        console.error('Error fetching driver data:', error);
      }
    };

    if (user) {
      fetchDriverData();
    }
  }, [user, token]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        aadhaarNumber: formData.aadhaarNumber,
        dlNumber: formData.dlNumber,
        dlExpiryDate: formData.dlExpiryDate,
      };

      const url = driverData 
        ? `${BASE_URL}/drivers/me`  // Update existing
        : `${BASE_URL}/drivers/me`;  // Create new

      const method = driverData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit verification');
      }

      const data = await response.json();
      setDriverData(data);

      toast.success('Verification documents submitted! Awaiting admin approval.', {
        theme: 'dark',
      });
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error.message || 'Failed to submit verification', {
        theme: 'dark',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (!driverData) return null;

    const statusMap = {
      PENDING: { icon: Clock, color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', label: 'Pending Verification' },
      UNDER_REVIEW: { icon: Clock, color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', label: 'Under Review' },
      APPROVED: { icon: CheckCircle, color: 'bg-green-500/20 text-green-300 border-green-500/30', label: 'Verified' },
      REJECTED: { icon: XCircle, color: 'bg-red-500/20 text-red-300 border-red-500/30', label: 'Rejected' },
    };

    const status = statusMap[driverData.verificationStatus] || statusMap.PENDING;
    const Icon = status.icon;

    return (
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${status.color}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{status.label}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#151212] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold mb-2">Driver Verification</h1>
            <p className="text-gray-400">Submit your documents for verification</p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Warning if rejected */}
        {driverData?.verificationStatus === 'REJECTED' && (
          <div className="mb-8 bg-red-500/20 border-2 border-red-500/50 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-300 mb-2">Verification Rejected</h3>
                <p className="text-red-200/80 mb-3">
                  {driverData.rejectionReason || 'Your documents were rejected. Please update and resubmit.'}
                </p>
                <p className="text-sm text-red-200/60">
                  Update your information below and submit again for review.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info box if already verified */}
        {driverData?.verificationStatus === 'APPROVED' && (
          <div className="mb-8 bg-green-500/20 border-2 border-green-500/50 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-green-300 mb-2">Verification Approved!</h3>
                <p className="text-green-200/80">
                  Your documents have been verified. You can now accept ride requests.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-[#141414] rounded-2xl border border-white/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Aadhaar Number */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Aadhaar Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012"
                maxLength="12"
                required
                disabled={driverData?.verificationStatus === 'APPROVED'}
                className="w-full h-12 px-4 rounded-xl bg-[#1a1a1a] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
              />
            </div>

            {/* DL Number */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Driving License Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="dlNumber"
                value={formData.dlNumber}
                onChange={handleChange}
                placeholder="MH01 20230012345"
                required
                disabled={driverData?.verificationStatus === 'APPROVED'}
                className="w-full h-12 px-4 rounded-xl bg-[#1a1a1a] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
              />
            </div>

            {/* DL Expiry */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                License Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dlExpiryDate"
                value={formData.dlExpiryDate}
                onChange={handleChange}
                required
                disabled={driverData?.verificationStatus === 'APPROVED'}
                min={new Date().toISOString().split('T')[0]}
                className="w-full h-12 px-4 rounded-xl bg-[#1a1a1a] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
              />
            </div>

            {/* Info Note */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-300 mb-1">Note</h4>
                  <p className="text-xs text-blue-200/80">
                    Document upload feature coming soon. For now, please ensure your Aadhaar
                    and Driving License are valid. Admin will verify your details.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            {driverData?.verificationStatus !== 'APPROVED' && (
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    {driverData ? 'Update & Resubmit' : 'Submit for Verification'}
                  </>
                )}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Verification;