import { formatDateSafe } from "../../../utils/DateUtil";
import { useState, useEffect } from "react";

const TransactionCards = ({ transaction, onClose }) => {
  const [riderEmail, setRiderEmail] = useState("Loading...");
  const [driverEmail, setDriverEmail] = useState("Loading...");

  useEffect(() => {
    if (transaction) {
      fetchUserEmails();
    }
  }, [transaction]);

  const fetchUserEmails = async () => {
    try {
      // Fetch rider email from users
      const riderResponse = await fetch(
        `http://localhost:4001/users/${transaction.rider_id}`
      );
      if (riderResponse.ok) {
        const riderData = await riderResponse.json();
        setRiderEmail(riderData.email || "No email found");
      } else {
        setRiderEmail("Email not found");
      }

      // Fetch driver data to get user_id, then fetch user email
      const driverResponse = await fetch(
        `http://localhost:4001/drivers/${transaction.driver_id}`
      );
      if (driverResponse.ok) {
        const driverData = await driverResponse.json();
        // Now fetch the user email using the driver's user_id
        const driverUserResponse = await fetch(
          `http://localhost:4001/users/${driverData.user_id}`
        );
        if (driverUserResponse.ok) {
          const driverUserData = await driverUserResponse.json();
          setDriverEmail(driverUserData.email || "No email found");
        } else {
          setDriverEmail("Email not found");
        }
      } else {
        setDriverEmail("Driver not found");
      }
    } catch (error) {
      console.error("Error fetching user emails:", error);
      setRiderEmail("Error loading email");
      setDriverEmail("Error loading email");
    }
  };

  if (!transaction) return null;

	const stop = (e) => e.stopPropagation();

  const getStatusBadge = (status) => {
    const statusClasses = {
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      ongoing: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return statusClasses[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentBadge = (status) => {
    const statusClasses = {
      paid: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };
    return statusClasses[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg border border-stone-200 w-full max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar relative"
        onClick={stop}
      >
        <div className="p-8 bg-stone-50">
          {/* Close Button */}
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-white shadow-sm border border-stone-200 
                     text-stone-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 
                     transition-all duration-200 flex items-center justify-center"
          >
            <span className="text-lg">✕</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-red-700 rounded-full mb-4 mx-auto shadow-sm flex items-center justify-center">
              <span className="text-3xl text-white font-bold">📄</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              Transaction Details
            </h2>
            <p className="text-stone-600 mt-2 text-lg">
              Booking ID: {transaction.id}
            </p>
            <div className="mt-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                  transaction.booking_status
                )}`}
              >
                {transaction.booking_status}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Trip Information */}
            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">
                Pickup Location
              </label>
              <div className="text-stone-900 font-medium">
                {transaction.pickup_address}
              </div>
              <div className="text-xs text-stone-500 mt-1">
                📍 {transaction.pickup_lat}, {transaction.pickup_lng}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">
                Drop Location
              </label>
              <div className="text-stone-900 font-medium">
                {transaction.drop_address}
              </div>
              <div className="text-xs text-stone-500 mt-1">
                📍 {transaction.drop_lat}, {transaction.drop_lng}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">
                Distance
              </label>
              <div className="text-stone-900 font-medium">
                🚗 {transaction.distance_km} km
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">
                Duration
              </label>
              <div className="text-stone-900 font-medium">
                ⏱️ {transaction.estimated_duration_min} min
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">
                Payment Status
              </label>
              <div className="text-stone-900 font-medium">
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${getPaymentBadge(
                    transaction.payment_status
                  )}`}
                >
                  {transaction.payment_status === "paid" && "✅ "}
                  {transaction.payment_status === "cancelled" && "❌ "}
                  {transaction.payment_status === "pending" && "⏳ "}
                  {transaction.payment_status === "failed" && "❌ "}
                  {`${transaction.payment_status
                    .charAt(0)
                    .toUpperCase()}${transaction.payment_status.slice(1)}`}
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">
                Rate per KM
              </label>
              <div className="text-stone-900 font-medium">
                💰 ₹
                {transaction.distance_km > 0
                  ? (transaction.fare / transaction.distance_km).toFixed(2)
                  : "0.00"}
                /km
              </div>
            </div>

            {/* Rider Information */}
            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">
                Rider Name
              </label>
              <div className="text-stone-900 font-medium">
                👤 {transaction.rider_name}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">
                Rider Email
              </label>
              <div className="text-stone-900 font-medium">📧 {riderEmail}</div>
            </div>

            {/* Driver Information */}
            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">
                Driver Name
              </label>
              <div className="text-stone-900 font-medium">
                🚗 {transaction.driver_name}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">
                Driver Email
              </label>
              <div className="text-stone-900 font-medium">📧 {driverEmail}</div>
            </div>

            {/* Timeline Information */}
            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">
                Created At
              </label>
              <div className="text-stone-900 font-medium">
                🗓️{" "}
                {formatDateSafe(transaction.created_at, {
                  locale: "en-IN",
                  timeZone: "Asia/Kolkata",
                  variant: "datetime",
                  fallback: "—",
                  assumeUTCForMySQL: true,
                })}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">
                Updated At
              </label>
              <div className="text-stone-900 font-medium">
                🔄{" "}
                {formatDateSafe(transaction.updated_at, {
                  locale: "en-IN",
                  timeZone: "Asia/Kolkata",
                  variant: "datetime",
                  fallback: "—",
                  assumeUTCForMySQL: true,
                })}
              </div>
            </div>
          </div>

          {/* Fare Amount - Full Width */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 mb-8">
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-3 text-center">
              Total Fare Amount
            </label>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600">
                ₹{transaction.fare}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCards;
