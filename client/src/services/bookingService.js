import api from '../utils/api';

// Rider APIs
export const bookingService = {
  // Create booking
  async createBooking(bookingData) {
    // This now sends 'bookingData' as the JSON body directly
    // It calls POST /api/v1/booking/request
    const response = await api.post('/booking/request', bookingData);
    return response.data;
  },

  // Get my bookings (with filters)
  async getMyBookings(filters = {}) {
    const params = new URLSearchParams();
    if (filters.filterType) params.append('filterType', filters.filterType);
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters.status) params.append('status', filters.status);
    params.append('page', filters.page || 0);
    params.append('size', filters.size || 10);
    
    // This was already correct and calls GET /api/v1/booking/history/rider
    const response = await api.get(`/booking/history/rider?${params}`);
    return response.data; // Returns the Page object { content: [], ... }
  },

  // Get booking details (NEW ENDPOINT)
  async getBookingDetails(bookingId) {
    // Calls GET /api/v1/booking/{bookingId}
    const response = await api.get(`/booking/${bookingId}`);
    return response.data;
  },

  // Cancel booking (NEW ENDPOINT)
  async cancelBooking(bookingId, reason) {
    // Calls POST /api/v1/booking/cancel/{bookingId}
    const response = await api.post(`/booking/cancel/${bookingId}`, { 
      cancellationReason: reason 
    });
    return response.data;
  },

  // Rate driver (NEW ENDPOINT)
  async rateDriver(bookingId, rating, feedback) {
    // Calls POST /api/v1/booking/rate/driver/{bookingId}
    const response = await api.post(`/booking/rate/driver/${bookingId}`, {
      driverRating: rating,
      driverFeedback: feedback,
    });
    return response.data;
  },

  async calculateEstimatedFare(bookingData) {
    const response = await api.post("/booking/estimate", bookingData);
    return response.data;
  },

  async getVehicleTypesWithCounts() {
    const response = await api.get("/booking/vehicle-types");
    return response.data;
  }
};

// Driver APIs
export const driverBookingService = {
  // Get available bookings (NEW ENDPOINT)
  async getAvailableBookings(vehicleType = null) {
    const params = new URLSearchParams();
    if (vehicleType) params.append('vehicleType', vehicleType);
    
    // Calls GET /api/v1/booking/available
    const response = await api.get(`/booking/available?${params.toString()}`);
    return response.data;
  },

  // Get my bookings
  async getMyBookings(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    params.append('page', filters.page || 0);
    params.append('size', filters.size || 10);
    
    // This calls GET /api/v1/booking/history/driver
    const response = await api.get(`/booking/history/driver?${params}`);
    return response.data;
  },

  // Get active booking (NEW ENDPOINT)
  async getActiveBooking() {
    // Calls GET /api/v1/booking/active/driver
    const response = await api.get('/booking/active/driver');
    return response.data; // Will be null or the booking
  },

  // Accept booking
  async acceptBooking(bookingId, vehicleId) {
    // Calls POST /api/v1/booking/accept/{bookingId}
    const response = await api.post(`/booking/accept/${bookingId}`, { 
      vehicleId: vehicleId 
    });
    return response.data;
  },

  // Start ride
  async startRide(bookingId) {
    // Calls POST /api/v1/booking/start/{bookingId}
    const response = await api.post(`/booking/start/${bookingId}`);
    return response.data;
  },

  // Complete ride
  async completeRide(bookingId) {
    // Calls POST /api/v1/booking/complete/{bookingId}
    const response = await api.post(`/booking/complete/${bookingId}`);
    return response.data;
  },

  // Cancel booking
  async cancelBooking(bookingId, reason) {
    // Calls POST /api/v1/booking/cancel/{bookingId}
    const response = await api.post(`/booking/cancel/${bookingId}`, { 
      cancellationReason: reason 
    });
    return response.data;
  },

  // Rate rider (NEW ENDPOINT)
  async rateRider(bookingId, rating, feedback) {
    // Calls POST /api/v1/booking/rate/rider/{bookingId}
    const response = await api.post(`/booking/rate/rider/${bookingId}`, {
      riderRating: rating,
      riderFeedback: feedback,
    });
    return response.data;
  },
};

// Add this to your existing bookingService.js file (at the end)

// ============================================
// VEHICLE SERVICE
// ============================================
export const vehicleService = {
  // Get driver's vehicles
  async getMyVehicles() {
    // Calls GET /api/v1/auth/driver/vehicles
    const response = await api.get('/driver/vehicles');
    return response.data;
  },

  // Get single vehicle (NEW ENDPOINT)
  async getVehicle(vehicleId) {
    // Calls GET /api/v1/auth/driver/vehicles/{id}
    const response = await api.get(`/driver/vehicles/${vehicleId}`);
    return response.data;
  },

  // Add new vehicle
  async addVehicle(vehicleData) {
    // Calls POST /api/v1/auth/driver/vehicles
    const response = await api.post('/driver/vehicles', vehicleData);
    return response.data;
  },

  // Update vehicle (NEW ENDPOINT)
  async updateVehicle(vehicleId, vehicleData) {
    // You'll need to create a similar payload mapping for updates
    const payload = { ...vehicleData }; // Simplified for now
    
    // Calls PUT /api/v1/auth/driver/vehicles/{id}
    const response = await api.put(`/driver/vehicles/${vehicleId}`, payload);
    return response.data;
  },

  // Delete vehicle
  async deleteVehicle(vehicleId) {
    // Calls DELETE /api/v1/auth/driver/vehicles/{id}
    const response = await api.delete(`/driver/vehicles/${vehicleId}`);
    return response.data;
  },
};