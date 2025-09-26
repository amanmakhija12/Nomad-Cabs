
export const vehicleTypes = [
  {
    type: "bike",
    name: "Bike",
    description: "Quick & economical",
    capacity: "1",
    icon: "🏍️",
    baseFare: 40,
    perKm: 8,
  },
  {
    type: "auto",
    name: "Auto Rickshaw",
    description: "Affordable short trips",
    capacity: "3",
    icon: "🛺",
    baseFare: 55,
    perKm: 10,
  },
  {
    type: "hatchback",
    name: "Hatchback",
    description: "Comfort everyday",
    capacity: "4",
    icon: "🚗",
    baseFare: 70,
    perKm: 12,
  },
  {
    type: "sedan",
    name: "Sedan",
    description: "Premium comfort",
    capacity: "4",
    icon: "🚙",
    baseFare: 90,
    perKm: 14,
  },
  {
    type: "suv",
    name: "SUV",
    description: "Spacious family ride",
    capacity: "6-7",
    icon: "🚐",
    baseFare: 120,
    perKm: 18,
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

export const createBooking = async (booking) => {
  try {
    const now = new Date().toISOString();
    const payload = {
      ...booking,
      booking_status: "requested",
      payment_status: "pending",
      request_time: now,
      created_at: now,
      updated_at: now,
    };
    const res = await fetch("http://localhost:4000/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e.message };
  }
};
