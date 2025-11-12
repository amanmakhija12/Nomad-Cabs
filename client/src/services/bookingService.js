import api from "../utils/api";

export const bookingService = {
  async createBooking(bookingData) {
    const response = await api.post("/booking/request", bookingData);
    return response.data;
  },
  async getMyBookings(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    params.append("page", filters.page || 0);
    params.append("size", filters.size || 10);

    const response = await api.get(`/booking/history/rider?${params}`);
    return response.data;
  },
  async getBookingDetails(bookingId) {
    const response = await api.get(`/booking/${bookingId}`);
    return response.data;
  },
  async cancelBooking(bookingId, reason) {
    const response = await api.post(`/booking/cancel/${bookingId}`, {
      cancellationReason: reason,
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
  },
  async getActiveRideForRider() {
    const response = await api.get("/booking/active-ride/rider");
    return response.data;
  },
  async rateRide(bookingId, payload) {
    const response = await api.post(`/booking/rate/${bookingId}`, payload);
    return response.data;
  },
};

export const driverBookingService = {
  async getAvailableBookings(vehicleType) {
    const params = { category: vehicleType.toUpperCase() };
    const response = await api.get("/booking/available", { params });
    return response.data;
  },
  async getMyBookings(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    params.append("page", filters.page || 0);
    params.append("size", filters.size || 10);

    const response = await api.get(`/booking/history/driver?${params}`);
    return response.data;
  },
  async getActiveRideForDriver() {
    const response = await api.get("/booking/active-ride/driver");
    return response.data;
  },
  async acceptBooking(bookingId, vehicleId) {
    const response = await api.post(
      `/booking/accept/${bookingId}/${vehicleId}`
    );
    return response.data;
  },
  async startRide(bookingId) {
    const response = await api.post(`/booking/start/${bookingId}`);
    return response.data;
  },
  async completeRide(bookingId) {
    const response = await api.post(`/booking/complete/${bookingId}`);
    return response.data;
  },
  async rateRider(bookingId, rating, feedback) {
    const response = await api.post(`/booking/rate/rider/${bookingId}`, {
      riderRating: rating,
      riderFeedback: feedback,
    });
    return response.data;
  },
};
