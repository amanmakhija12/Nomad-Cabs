import {
  MapPin,
  Navigation,
  Calendar,
  Clock,
  DollarSign,
  Phone,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { vehicleTypes, paymentMethods, calculateFare } from "./bookingData";

export const StepsProgress = ({ step }) => (
  <div className="bg-[#141414] p-6 rounded-2xl border border-white/10 mb-8">
    <div className="flex items-center justify-between flex-wrap gap-4">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all shadow-sm ${
              step >= n ? "bg-white text-black" : "bg-[#1d1d1d] text-gray-500"
            }`}
          >
            {n}
          </div>
          <span
            className={`ml-2 text-[11px] font-medium tracking-wide uppercase ${
              step >= n ? "text-white" : "text-gray-500"
            }`}
          >
            {n === 1 ? "Ride Details" : n === 2 ? "Vehicle" : "Review"}
          </span>
          {n < 3 && (
            <div
              className={`w-16 h-[2px] mx-4 rounded ${
                step > n ? "bg-white" : "bg-[#1d1d1d]"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export const StepRideDetails = ({ data, onChange, onNext }) => {
  const disabled = !data.pickupAddress || !data.dropoffAddress;
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold tracking-tight">Ride Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Pickup Location" icon={MapPin} iconClass="text-green-400">
          <input
            value={data.pickupAddress}
            onChange={(e) => onChange("pickupAddress", e.target.value)}
            placeholder="e.g., Marine Drive, Mumbai"
            className="input-dark w-full h-12 pl-11 pr-4 rounded-xl bg-[#1d1d1d] border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 placeholder:text-gray-500 text-sm"
          />
        </Field>
        
        <Field label="Drop-off Location" icon={Navigation} iconClass="text-red-400">
          <input
            value={data.dropoffAddress}
            onChange={(e) => onChange("dropoffAddress", e.target.value)}
            placeholder="e.g., Gateway of India, Mumbai"
            className="input-dark w-full h-12 pl-11 pr-4 rounded-xl bg-[#1d1d1d] border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 placeholder:text-gray-500 text-sm"
          />
        </Field>
      </div>
      
      {/* Optional: Schedule for later */}
      <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-white/90 mb-1">Schedule for Later (Optional)</h3>
            <p className="text-xs text-gray-400">Leave empty for immediate booking</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Date" icon={Calendar} iconClass="text-blue-400">
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={data.scheduledDate}
              onChange={(e) => onChange("scheduledDate", e.target.value)}
              className="input-dark w-full h-12 pl-11 pr-3 rounded-xl bg-[#1d1d1d] border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 text-sm"
            />
          </Field>
          
          <Field label="Time" icon={Clock} iconClass="text-purple-400">
            <input
              type="time"
              value={data.scheduledTime}
              onChange={(e) => onChange("scheduledTime", e.target.value)}
              className="input-dark w-full h-12 pl-11 pr-3 rounded-xl bg-[#1d1d1d] border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 text-sm"
            />
          </Field>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          disabled={disabled}
          onClick={onNext}
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed h-12 px-8 rounded-xl bg-white text-black font-medium text-sm tracking-wide shadow hover:shadow-lg transition"
        >
          Next: Select Vehicle
        </button>
      </div>
    </div>
  );
};

export const StepVehicle = ({ data, onChange, onNext, onBack }) => (
  <div className="space-y-8">
    <h2 className="text-2xl font-semibold tracking-tight">
      Select Vehicle Type
    </h2>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {vehicleTypes.map((v) => (
        <div
          key={v.type}
          onClick={() => onChange("vehicleType", v.type)}
          className={`group cursor-pointer rounded-2xl p-5 border border-white/10 bg-[#1a1a1a] shadow-sm transition relative overflow-hidden ${
            data.vehicleType === v.type
              ? "ring-2 ring-white bg-white/10"
              : "hover:border-white/20 hover:bg-white/5"
          }`}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gradient-to-br from-white/5 to-transparent"></div>
          
          <div className="text-center space-y-2 relative">
            <div className="text-4xl drop-shadow-sm">{v.icon}</div>
            <h3 className="font-semibold tracking-wide text-sm">{v.name}</h3>
            <p className="text-[11px] text-gray-400 leading-snug">
              {v.description}
            </p>
            <p className="text-[10px] text-gray-500">Capacity: {v.capacity}</p>
            <p className="text-xs font-semibold text-white/90">
              ₹{v.baseFare} base + ₹{v.perKm}/km
            </p>
          </div>
        </div>
      ))}
    </div>
    
    <div className="flex justify-between">
      <button
        onClick={onBack}
        className="btn-secondary h-11 px-6 rounded-xl bg-[#1d1d1d] border border-white/10 text-sm font-medium text-white/90 hover:bg-white/5 transition"
      >
        Back
      </button>
      <button
        disabled={!data.vehicleType}
        onClick={onNext}
        className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed h-11 px-8 rounded-xl bg-white text-black font-medium text-sm tracking-wide shadow hover:shadow-lg transition"
      >
        Next: Review & Confirm
      </button>
    </div>
  </div>
);

export const StepPayment = ({ data, onChange, onBack, onSubmit, loading }) => {
  // Frontend estimation (backend will recalculate based on actual coordinates)
  const estimatedFare = data.vehicleType ? calculateFare(5, data.vehicleType) : null;
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold tracking-tight">
        Review & Confirm Booking
      </h2>
      
      {/* Estimated Fare */}
      {estimatedFare && (
        <div className="bg-[#141414] p-6 rounded-2xl border border-white/10">
          <div className="flex items-start gap-3 mb-4">
            <DollarSign className="w-5 h-5 text-green-400" />
            <div className="flex-grow">
              <h3 className="font-semibold mb-1 text-sm tracking-wide uppercase text-white/80">
                Estimated Fare
              </h3>
              <p className="text-xs text-gray-400">
                Final fare will be calculated based on actual distance
              </p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <Row label="Base Fare" value={`₹${estimatedFare.baseFare}`} />
            <Row label="Distance Fare" value={`₹${estimatedFare.distanceFare} (${estimatedFare.distanceKm} km)`} />
            <Row label="Platform Fee" value={`₹${estimatedFare.platformFee}`} />
            <div className="pt-2 mt-2 border-t border-white/10 flex justify-between text-lg font-semibold">
              <span>Estimated Total</span>
              <span className="text-green-400">₹{estimatedFare.total}</span>
            </div>
          </div>
        </div>
      )}

      {/* Booking Summary */}
      <div className="bg-[#141414] p-6 rounded-2xl border border-white/10">
        <h3 className="font-semibold mb-4 text-sm tracking-wide uppercase text-white/80 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Booking Summary
        </h3>
        <div className="space-y-3 text-sm">
          <Row 
            label="From" 
            value={data.pickupAddress || "—"} 
            icon={<MapPin className="w-4 h-4 text-green-400" />}
          />
          <Row 
            label="To" 
            value={data.dropoffAddress || "—"} 
            icon={<Navigation className="w-4 h-4 text-red-400" />}
          />
          <Row 
            label="Vehicle" 
            value={vehicleTypes.find(v => v.type === data.vehicleType)?.name || "—"} 
          />
          {data.scheduledDate && (
            <Row 
              label="Scheduled" 
              value={`${data.scheduledDate} ${data.scheduledTime || ''}`} 
              icon={<Calendar className="w-4 h-4 text-blue-400" />}
            />
          )}
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-amber-300 mb-1">Important Notes</h4>
            <ul className="text-xs text-amber-200/80 space-y-1">
              <li>• Final fare will be calculated based on actual distance traveled</li>
              <li>• You can cancel free of charge before driver accepts</li>
              <li>• Driver will be assigned automatically</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          disabled={loading}
          className="btn-secondary h-11 px-6 rounded-xl bg-[#1d1d1d] border border-white/10 text-sm font-medium text-white/90 hover:bg-white/5 transition disabled:opacity-40"
        >
          Back
        </button>
        <button
          disabled={loading}
          onClick={onSubmit}
          className="btn-success disabled:opacity-40 disabled:cursor-not-allowed h-11 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-sm tracking-wide shadow flex items-center gap-2 transition"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
              Creating Booking...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" /> Confirm Booking
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// --- Small Reusable Pieces ---
const Field = ({ label, icon: Icon, iconClass = "", children }) => (
  <div>
    <label className="block text-[11px] font-medium mb-2 text-gray-400 tracking-wide uppercase">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon
          className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${iconClass}`}
        />
      )}
      {children}
    </div>
  </div>
);

const Row = ({ label, value, icon }) => (
  <div className="flex justify-between items-start text-sm gap-4">
    <span className="text-gray-400 text-xs uppercase tracking-wide flex items-center gap-2">
      {icon}
      {label}:
    </span>
    <span className="text-white/90 text-right font-medium flex-1">
      {value}
    </span>
  </div>
);