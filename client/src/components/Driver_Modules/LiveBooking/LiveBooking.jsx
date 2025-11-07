import { useState, useEffect, useRef } from "react";
import { driverBookingService, vehicleService } from "../../../services/bookingService";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "react-toastify";
import { 
  MapPin, 
  Navigation, 
  IndianRupee, 
  Clock, 
  Car,
  RefreshCw,
  AlertCircle,
} from "lucide-react"; // Removed unused 'Divide' import

const LiveBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [vehiclesLoading, setVehiclesLoading] = useState(false); 
  const [previousCount, setPreviousCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [isPollingActive, setIsPollingActive] = useState(true);
  const [isActive, setIsActive] = useState(false); // This will track if a ride is active
  
  const user = useAuthStore((s) => s.user);
  const intervalRef = useRef(null);

  // Fetch driver's vehicles on mount
  useEffect(() => {
    if (!user) return;

    const loadVehicles = async () => {
      setVehiclesLoading(true);
      try {
        console.log('🚗 Fetching driver vehicles...');
        const vehicleData = await vehicleService.getMyVehicles();
        console.log('✅ Vehicles fetched:', vehicleData);
        
        console.log(`✅ Found ${vehicleData.length} vehicles`);
        setVehicles(vehicleData);

        const approvedVehicle = vehicleData.find(v => v.pucVerified && v.rcVerified && v.insuranceVerified);
        if (approvedVehicle && !selectedVehicle) {
          setSelectedVehicle(approvedVehicle.id);
          console.log('✅ Auto-selected vehicle:', approvedVehicle.id);
        }

        if (!approvedVehicle) {
          toast.warning('No approved vehicles found. Please add and verify a vehicle first.', {
            theme: 'dark',
            autoClose: 5000,
          });
        }
      } catch (error) {
        console.error('❌ Error fetching vehicles:', error);
        toast.error(error.message || 'Failed to load your vehicles', { theme: 'dark' });
      } finally {
        setVehiclesLoading(false);
      }
    };

    loadVehicles();
  }, [user]);

  // Fetch available bookings
 // Add this at the top of fetchAvailableBookings function

const fetchAvailableBookings = async () => {
  try {
    console.log('🔄 Fetching available bookings...');
    const data = await driverBookingService.getAvailableBookings();
    
    // ✅ Check if response has error message (409 conflict)
    if (data && data.message && data.message.includes('active booking')) {
      console.log('⚠️ Active booking detected');
      setIsActive(true);
      setBookings([]);
      setPreviousCount(0);
      setIsPollingActive(false); // Stop polling
      
      toast.warning('You have an active ride. Complete it before accepting new ones.', {
        theme: 'dark',
        autoClose: 5000,
      });
      return;
    }
    
    // ✅ Normal flow - no active booking
    setIsActive(false);
    
    console.log(`✅ Found ${data.length} available bookings`);
    
    if (previousCount > 0 && data.length > previousCount) {
      const newCount = data.length - previousCount;
      toast.info(`🚗 ${newCount} new ride${newCount > 1 ? 's' : ''} available!`, {
        theme: 'dark',
        autoClose: 5000,
        position: 'top-right',
      });
      
      playNotificationSound();
    }

    console.log(`✅ Updating bookings state with: `, data);
    
    setBookings(data);
    setPreviousCount(data.length);
    setLastFetchTime(new Date());
  } catch (error) {
    console.error('❌ Error fetching available bookings:', error);
    
    // Check if error message indicates active booking
    if (error.message && error.message.includes('active booking')) {
      setIsActive(true);
      setBookings([]);
      setIsPollingActive(false);
    }
    
    if (bookings.length === 0 && !loading) {
      toast.error(error.message || 'Failed to fetch available rides', { theme: 'dark' });
    }
  }
};

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Audio play failed:', e));
    } catch (e) {
      console.log('Notification sound not available');
    }
  };

  // ✅ CORRECTION 3: Corrected Start/Stop polling logic
  useEffect(() => {
    if (!user) return;

    // 1. Always clear any previous interval when dependencies change
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // 2. Fetch data immediately on load or when dependencies change
    // We wrap fetch in a function to use it in setTimeout
    const fetchData = () => {
      setLoading(true);
      fetchAvailableBookings().finally(() => setLoading(false));
    };
    
    fetchData(); // Run immediately

    // 3. Start a new interval ONLY if polling is active AND no ride is active
    if (isPollingActive && !isActive) {
      console.log('✅ Polling started...');
      intervalRef.current = setInterval(fetchData, 5000); // Use 5000ms from your original code
    } else if (isActive) {
      // If a ride is active, stop polling and set UI to 'Paused'
      console.log('🔴 Active ride detected. Polling stopped.');
      setIsPollingActive(false); // This updates the UI to "Paused"
    } else if (!isPollingActive) {
      console.log('⏸️ Polling is manually paused.');
    }

    // 4. Cleanup: This runs on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        console.log('🧹 Clearing interval...');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPollingActive, user, isActive]); // ✅ ADDED `isActive` to dependencies

  // Pause polling when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPollingActive(false);
      } else {
        // Only resume if there isn't an active ride
        if (!isActive) { 
          setIsPollingActive(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive]); // ✅ ADDED `isActive` dependency here too

  // Accept booking with error handling
  const handleAccept = async (bookingId) => {
    if (!selectedVehicle) {
      toast.error('Please select a vehicle first', { theme: 'dark' });
      return;
    }

    try {
      console.log(`🚗 Accepting booking ${bookingId} with vehicle ${selectedVehicle}`);
      await driverBookingService.acceptBooking(bookingId, selectedVehicle);
      
      toast.success('✅ Booking accepted successfully!', { 
        theme: 'dark',
        autoClose: 3000,
      });
      
      // After accepting, we will have an active ride.
      // fetchAvailableBookings() will now detect it and set isActive=true
      fetchAvailableBookings();
    } catch (error) {
      console.error('❌ Error accepting booking:', error);
      toast.error(error.message || 'Failed to accept booking', { 
        theme: 'dark',
        autoClose: 5000,
      });
    }
  };

  // Format time ago
  const getTimeAgo = (date) => {
    if (!date) return '';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  // Get vehicle display name
  const getVehicleDisplay = (vehicle) => {
    const parts = [];
    if (vehicle.manufacturer) parts.push(vehicle.manufacturer);
    if (vehicle.model) parts.push(vehicle.model);
    parts.push(vehicle.rcNumber);
    return parts.join(' - ');
  };


  return (
    <div className="min-h-screen bg-[#151212] text-white p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-semibold mb-2">Live Bookings</h1>
          <p className="text-gray-400">
            {isActive ? "You have an active ride." : "Accept rides near you"}
          </p>
        </div>

        {/* ✅ CORRECTION 4: Inverted logic to show controls when NOT active */}
        {!isActive ? (
          <div className="flex items-center gap-4 flex-wrap">
            {/* Vehicle Selection with real data */}
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              disabled={vehiclesLoading || vehicles.length === 0}
              className="px-4 py-2 rounded-xl bg-[#1a1a1a] border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[250px]"
            >
            {vehiclesLoading ? (
              <option>Loading vehicles...</option>
            ) : vehicles.length === 0 ? (
              <option>No vehicles available</option>
            ) : (
              <>
                <option value="">Select Vehicle</option>
                {vehicles
                  .filter(v => v.pucVerified && v.rcVerified && v.insuranceVerified)
                  .map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {getVehicleDisplay(vehicle)}
                    </option>
                  ))}
              </>
            )}
            </select>

            {/* Live indicator */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
              isPollingActive 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-gray-500/10 border-gray-500/30'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isPollingActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
              }`} />
              <span className={`text-sm font-medium ${
                isPollingActive ? 'text-green-300' : 'text-gray-300'
              }`}>
                {isPollingActive ? 'Live Updates' : 'Paused'}
              </span>
            </div>

            {/* Manual refresh */}
            <button
              onClick={() => {
                setLoading(true);
                fetchAvailableBookings().finally(() => setLoading(false));
              }}
              disabled={loading}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition disabled:opacity-50"
              title="Refresh now"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        ) : (
          // This now shows when a ride IS active
          <div className="bg-red-600/20 text-red-400 px-4 py-2 rounded-xl border border-red-400/30">
            You have an active booking. Please complete or cancel it before accepting new bookings.
          </div>
        )}
      </div>

      {/* Stats Bar */}
      {/* This will still show stats, which is fine */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#141414] p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Car className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Available Rides</p>
              <p className="text-2xl font-bold">{bookings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#141414] p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Last Updated</p>
              <p className="text-sm font-medium">
                {lastFetchTime ? getTimeAgo(lastFetchTime) : 'Never'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#141414] p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Status</p>
              <p className="text-sm font-medium">
                {isActive 
                  ? 'Active Ride' 
                  : (selectedVehicle ? 'Ready to Accept' : 'Select Vehicle')
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Grid */}
      {/* Show "No rides" only if polling is active and no bookings are found */}
      {bookings.length === 0 && !isActive ? (
        <div className="bg-[#141414] rounded-2xl p-12 text-center border border-white/10">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400 text-lg mb-2">No available rides at the moment</p>
          <p className="text-gray-500 text-sm">
            {isPollingActive 
              ? "We'll notify you when new rides appear" 
              : "Polling is paused. Switch to this tab to resume."}
          </p>
        </div>
      ) : (
        // Show the active ride message if active, otherwise show the grid
        isActive ? (
          <div className="bg-[#141414] rounded-2xl p-12 text-center border border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Navigation className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-gray-400 text-lg mb-2">Active ride in progress</p>
            <p className="text-gray-500 text-sm">
              Please go to your 'My Bookings' page to manage your current ride.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-[#141414] p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1 hover:shadow-2xl group"
              >
                {/* Rider Info */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-bold">
                    {booking.riderName?.[0]?.toUpperCase() || 'R'}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {booking.riderName || 'Rider'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {booking.riderPhone || 'Phone not available'}
                    </p>
                  </div>
                </div>

                {/* Locations */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Pickup</p>
                      <p className="text-sm text-white font-medium line-clamp-2">
                        {booking.pickupAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Navigation className="w-4 h-4 text-red-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Dropoff</p>
                      <p className="text-sm text-white font-medium line-clamp-2">
                        {booking.dropoffAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Distance</p>
                    <p className="text-sm font-semibold">
                      {booking.tripDistanceKm.toFixed(2)} km
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                    <p className="text-sm font-semibold">
                      {booking.tripDurationMinutes.toFixed(2)} min
                    </p>
                  </div>
                </div>

                {/* Fare */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400 text-sm">Estimated Fare</span>
                  <span className="text-green-400 font-bold text-2xl flex items-center gap-1">
                    <IndianRupee className="w-5 h-5" />
                    {booking.fareAmount.toFixed(2)}
                  </span>
                </div>

                {/* Vehicle Type */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                    {booking.vehicleType?.toUpperCase()}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {getTimeAgo(booking.createdAt)}
                  </span>
                </div>

                {/* Accept Button */}
                <button
                  onClick={() => handleAccept(booking.id)}
                  disabled={!selectedVehicle}
                  className="w-full bg-white text-black py-3 rounded-xl font-medium hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed group-hover:shadow-lg"
                >
                  {selectedVehicle ? 'Accept Ride' : 'Select Vehicle First'}
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default LiveBooking;