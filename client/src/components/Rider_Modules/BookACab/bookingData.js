export const vehicleTypes = [
  {
    type: "bike",
    name: "Bike",
    description: "Quick & economical",
    capacity: "1",
    icon: "🏍️",
    baseFare: 20,
    perKm: 8,
  },
  {
    type: "auto",
    name: "Auto Rickshaw",
    description: "Affordable short trips",
    capacity: "3",
    icon: "🛺",
    baseFare: 30,
    perKm: 12,
  },
  {
    type: "sedan",
    name: "Sedan",
    description: "Premium comfort",
    capacity: "4",
    icon: "🚙",
    baseFare: 50,
    perKm: 15,
  },
  {
    type: "suv",
    name: "SUV",
    description: "Spacious family ride",
    capacity: "6-7",
    icon: "🚐",
    baseFare: 70,
    perKm: 20,
  },
];

export const paymentMethods = [
  { id: "cash", label: "Cash" },
  { id: "upi", label: "UPI" },
  { id: "card", label: "Card" },
  { id: "wallet", label: "Wallet" },
];


export const calculateFare = (distanceKm, vehicleType) => {
  const v = vehicleTypes.find((v) => v.type === vehicleType);
  if (!v) return null;
  
  const base = v.baseFare;
  const distanceFare = distanceKm * v.perKm;
  const platformFee = Math.round((base + distanceFare) * 0.05);
  const total = base + distanceFare + platformFee;
  
  return {
    distanceKm,
    baseFare: base,
    distanceFare,
    platformFee,
    total,
  };
};

/**
 * Create booking via backend API
 */
export const createBooking = async (bookingData, token) => {
  try {
    const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080/api/v1';
    
    const response = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Booking creation error:', error);
    return { success: false, error: error.message };
  }
};


 //TODO: Get coordinates from address using geocoding API

export const getCoordinatesFromAddress = async (address) => {
 
  const mockCoordinates = {
    'marine drive': { lat: 18.9432, lng: 72.8234 },
    'gateway of india': { lat: 18.9220, lng: 72.8347 },
    'bandra': { lat: 19.0596, lng: 72.8295 },
    'andheri': { lat: 19.1136, lng: 72.8697 },
    'default': { lat: 19.0760, lng: 72.8777 },
  };
  
  const key = address.toLowerCase().split(',')[0].trim();
  return mockCoordinates[key] || mockCoordinates.default;
};