import { useState, useEffect, useRef } from "react";
import { driverBookingService, bookingService } from "../../../services/bookingService";
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
import api from "../../../utils/api";
import { driverService } from "../../../services/driverService";

const LiveBooking = ({ onBookingAccepted }) => {
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [previousCount, setPreviousCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState({
    id: "",
    type: "",
  });
  const [isPollingActive, setIsPollingActive] = useState(true);
  
  const [isVerified, setIsVerified] = useState(false);

  const user = useAuthStore((s) => s.user);
  const intervalRef = useRef(null);

  // Fetch driver's vehicles on mount
  useEffect(() => {
    if (!user) return;

    const loadVehicles = async () => {
      setVehiclesLoading(true);
      try {
        console.log("🚗 Fetching driver vehicles...");
        const vehicleData = await driverService.getMyVehicles();
        const { data: currentDriver } = await api.get("/drivers/me");
        console.log(currentDriver);
        console.log("✅ Vehicles fetched:", vehicleData);

        console.log(`✅ Found ${vehicleData.length} vehicles`);
        setVehicles(vehicleData);

        const approvedVehicle = vehicleData.find(
          (v) => v.pucVerified && v.rcVerified && v.insuranceVerified
        );
        setIsVerified(
          currentDriver.aadhaarVerified && currentDriver.driverLicenseVerified
        );
        if (
          approvedVehicle &&
          !selectedVehicle.id &&
          currentDriver.aadhaarVerified &&
          currentDriver.driverLicenseVerified
        ) {
          setSelectedVehicle({
            id: approvedVehicle.id,
            type: approvedVehicle.vehicleType,
          });
          console.log("✅ Auto-selected vehicle:", approvedVehicle.id);
        }

        if (
          !currentDriver.aadhaarVerified ||
          !currentDriver.driverLicenseVerified
        ) {
          toast.info(
            "Please complete your driver verification to accept bookings.",
            {
              theme: "dark",
              autoClose: 5000,
            }
          );
        } else if (vehicleData.length === 0) {
          toast.info(
            "No vehicles found. Please add a vehicle to accept bookings.",
            {
              theme: "dark",
              autoClose: 5000,
            }
          );
        } else if (!approvedVehicle) {
          toast.warning(
            "No verified vehicles found. Please wait for a vehicle to verify first.",
            {
              theme: "dark",
              autoClose: 5000,
            }
          );
        }
      } catch (error) {
        console.error("❌ Error fetching vehicles:", error);
        toast.error(error.message || "Failed to load your vehicles", {
          theme: "dark",
        });
      } finally {
        setVehiclesLoading(false);
      }
    };

    loadVehicles();
  }, [user]);

  const fetchAvailableBookings = async () => {
    try {
      console.log("🔄 Fetching available bookings...");
      const data = await driverService.getPendingOffers();

      console.log(`✅ Found ${data.length} available bookings`);

      if (previousCount > 0 && data.length > previousCount) {
        const newCount = data.length - previousCount;
        toast.info(
          `🚗 ${newCount} new ride${newCount > 1 ? "s" : ""} available!`,
          {
            theme: "dark",
            autoClose: 5000,
            position: "top-right",
          }
        );

        playNotificationSound();
      }

      setBookings(data);
      setPreviousCount(data.length);
      setLastFetchTime(new Date());
    } catch (error) {
      console.error("❌ Error fetching available bookings:", error);

      if (bookings.length === 0 && !loading) {
        toast.error(error.message || "Failed to fetch available rides", {
          theme: "dark",
        });
      }
    }
  };

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio("/notification.mp3");
      audio.volume = 0.3;
      audio.play().catch((e) => console.log("Audio play failed:", e));
    } catch (e) {
      console.log("Notification sound not available");
    }
  };

  // ✅ CORRECTION 3: Corrected Start/Stop polling logic
  useEffect(() => {
    if (!user) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const fetchData = () => {
      setLoading(true);
      fetchAvailableBookings(selectedVehicle.type).finally(() =>
        setLoading(false)
      );
    };

    fetchData();

    // 7. Polling logic no longer checks for 'isActive'
    if (isPollingActive) {
      console.log("✅ Polling started...");
      intervalRef.current = setInterval(fetchData, 5000);
    } else if (!isPollingActive) {
      console.log("⏸️ Polling is manually paused.");
    }

    return () => {
      if (intervalRef.current) {
        console.log("🧹 Clearing interval...");
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPollingActive, user, selectedVehicle.type]); // 8. REMOVED 'isActive' from dependencies

  // 9. SIMPLIFIED visibility useEffect
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPollingActive(false);
      } else {
        setIsPollingActive(true); // Always resume
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Accept booking with error handling
  const handleAccept = async (bookingId, vehicleCategory) => {
    if (selectedVehicle.id === "") {
      toast.error("Please select a vehicle first", { theme: "dark" });
      return;
    }

    if(selectedVehicle.type !== vehicleCategory) {
      toast.error(`Please select a ${vehicleCategory} type vehicle`, { theme: "dark" });
      return;
    }

    try {
      console.log(
        `🚗 Accepting booking ${bookingId} with vehicle ${selectedVehicle.id}`
      );
      await driverService.acceptOffer(bookingId, selectedVehicle.id);

      toast.success("✅ Booking accepted successfully!", {
        theme: "dark",
        autoClose: 3000,
      });

      console.log("Fetching the newly active ride...");
      const activeRide = await driverBookingService.getActiveRideForDriver();

      onBookingAccepted(activeRide);

    } catch (error) {
      console.error("❌ Error accepting booking:", error);
      toast.error(error.message || "Failed to accept booking", {
        theme: "dark",
        autoClose: 5000,
      });
      fetchAvailableBookings();
    }
  };

  // Format time ago
  const getTimeAgo = (date) => {
    if (!date) return "";
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
    parts.push(vehicle.registrationNumber);
    return parts.join(" - ");
  };

  const handleVehicleSelect = (e) => {
    const vehicleId = e.target.value;
    const vehicle = vehicles.find((v) => v.id === vehicleId);

    if (vehicle) {
      setSelectedVehicle({
        id: vehicle.id,
        type: vehicle.vehicleType,
      });
    } else {
      setSelectedVehicle({ id: "", type: "" });
    }
  };

  return (
    <div className="min-h-screen bg-[#151212] text-white p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-semibold mb-2">Live Bookings</h1>
          <p className="text-gray-400">Accept rides near you</p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Vehicle Selection with real data */}
          <select
            value={selectedVehicle.id}
            onChange={handleVehicleSelect}
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
                {isVerified &&
                  vehicles
                    .filter(
                      (v) =>
                        v.pucVerified && v.rcVerified && v.insuranceVerified
                    )
                    .map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {getVehicleDisplay(vehicle)}
                      </option>
                    ))}
              </>
            )}
          </select>

          {/* Live indicator */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
              isPollingActive
                ? "bg-green-500/10 border-green-500/30"
                : "bg-gray-500/10 border-gray-500/30"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isPollingActive ? "bg-green-400 animate-pulse" : "bg-gray-400"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                isPollingActive ? "text-green-300" : "text-gray-300"
              }`}
            >
              {isPollingActive ? "Live Updates" : "Paused"}
            </span>
          </div>

          {/* Manual refresh */}
          <button
            onClick={() => {
              setLoading(true);
              fetchAvailableBookings(selectedVehicle.type).finally(() =>
                setLoading(false)
              );
            }}
            disabled={loading}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition disabled:opacity-50"
            title="Refresh now"
          >
            <RefreshCw
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
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
                {lastFetchTime ? getTimeAgo(lastFetchTime) : "Never"}
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
                {/* 18. SIMPLIFIED status text */}
                {selectedVehicle.id !== ""
                  ? "Ready to Accept"
                  : "Select Vehicle"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Grid */}
      {/* Show "No rides" only if polling is active and no bookings are found */}
      {bookings.length === 0 ? (
        <div className="bg-[#141414] rounded-2xl p-12 text-center border border-white/10">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400 text-lg mb-2">
            {selectedVehicle.type
              ? "No available rides at the moment"
              : "Please select a verified vehicle to see rides"}
          </p>
          <p className="text-gray-500 text-sm">
            {isPollingActive
              ? "We'll notify you when new rides appear"
              : "Polling is paused. Switch to this tab to resume."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.offerId}
              className="bg-[#141414] p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1 hover:shadow-2xl group"
            >
              {/* Rider Info */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-bold">
                  {booking.riderName?.[0]?.toUpperCase() || "R"}
                </div>
                <div>
                  <p className="font-medium text-white">
                    {booking.riderName || "Rider"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {booking.riderPhone || "Phone not available"}
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
                      {booking.pickupLocationName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Navigation className="w-4 h-4 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Dropoff</p>
                    <p className="text-sm text-white font-medium line-clamp-2">
                      {booking.dropoffLocationName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-white/5 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Distance</p>
                  <p className="text-sm font-semibold">
                    {booking.estimatedDistanceKm.toFixed(2)} km
                  </p>
                </div>
              </div>

              {/* Fare */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400 text-sm">Estimated Fare</span>
                <span className="text-green-400 font-bold text-2xl flex items-center gap-1">
                  <IndianRupee className="w-5 h-5" />
                  {booking.fare.toFixed(2)}
                </span>
              </div>

              {/* Vehicle Type */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                  {booking.vehicleCategory}
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  {getTimeAgo(booking.createdAt)}
                </span>
              </div>

              {/* Accept Button */}
              <button
                onClick={() => handleAccept(booking.offerId, booking.vehicleCategory)}
                disabled={selectedVehicle.id === ""}
                className="w-full bg-white text-black py-3 rounded-xl font-medium hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed group-hover:shadow-lg"
              >
                {selectedVehicle.id !== ""
                  ? "Accept Ride"
                  : "Select Vehicle First"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveBooking;
