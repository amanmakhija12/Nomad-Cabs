import api from "../utils/api"; // This is: http://localhost:8080/api/v1

// ============================================
// USER & RIDER MANAGEMENT
// ============================================
export const riderService = {
  async getAllRiders(filters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page);
    if (filters.size) params.append("size", filters.size);
    // Note: Our backend controller for this is at /users/admin/riders
    const response = await api.get("/users/admin/riders", { params });
    return response.data;
  },
  async updateRider(riderId, data) {
    const response = await api.put(`/users/admin/${riderId}`, data);
    return response.data;
  },
  async deleteRider(riderId) {
    const response = await api.delete(`/users/admin/${riderId}`);
    return response.data;
  },
};

// ============================================
// DRIVER MANAGEMENT
// ============================================
export const driverService = {
  async getAllDrivers(filters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page);
    if (filters.size) params.append("size", filters.size);
    const response = await api.get("/drivers/admin/all", { params });
    return response.data;
  },
  async getDriverById(driverId) {
    const response = await api.get(`/drivers/admin/${driverId}`);
    return response.data;
  },
  async getVerificationQueue(page = 0, size = 10) {
    const params = { page, size };
    const response = await api.get("/drivers/admin/verification-queue", {
      params,
    });
    return response.data;
  },
  async verifyDriverDoc(driverId, docType, approved) {
    // docType must be "AADHAAR", or "LICENSE"
    if (approved) {
      const response = await api.post(
        `/drivers/admin/approve/${driverId}/${docType.toUpperCase()}`
      );
      return response.data;
    }
    // We would need a /reject endpoint if 'approved' is false
    return null;
  },
};

// ============================================
// VEHICLE MANAGEMENT
// ============================================
export const vehicleService = {
  async getVehiclesByDriver(driverId) {
    const response = await api.get(`/admin/drivers/${driverId}/vehicles`);
    return response.data;
  },
  async verifyVehicle(vehicleId) {
    const response = await api.post(`/drivers/admin/vehicles/${vehicleId}/approve`);
    return response.data;
  },
};

// ============================================
// BOOKING MANAGEMENT
// ============================================
export const bookingService = {
  async getAllBookings(page = 0, size = 10) {
    const response = await api.get(
      `/admin/bookings/all?page=${page}&size=${size}`
    );
    return response.data;
  },
  async getBookingById(bookingId) {
    const response = await api.get(`/admin/bookings/${bookingId}`);
    return response.data;
  },
};

// ============================================
// USER MANAGEMENT (Generic)
// ============================================
export const userService = {
  async getUserById(userId) {
    const response = await api.get(`/users/admin/${userId}`);
    return response.data;
  },
  async updateUser(userId, data) {
    const response = await api.put(`/users/admin/${userId}`, data);
    return response.data;
  },
  async updateUserStatus(userId, status) {
    const response = await api.put(`/users/admin/${userId}/status`, {
      status: status.toUpperCase(),
    });
    return response.data;
  },
  async deleteUser(userId) {
    const response = await api.delete(`/users/admin/${userId}`);
    return response.data;
  },
};

// ============================================
// FARE
// ============================================
export const fareConfigService = {
  async getAllFares() {
    const response = await api.get("/admin/fares");
    return response.data;
  },
  async updateFare(id, fareData) {
    const response = await api.put(`/admin/fares/${id}`, fareData);
    return response.data;
  },
  async addFare(fareData) {
    const response = await api.post(`/admin/fares`, fareData);
    return response.data;
  },
  async deleteFare(id) {
    const response = await api.delete(`/admin/fares/${id}`);
    return response.data;
  },
};

// ============================================
// TRANSACTION MANAGEMENT
// ============================================
export const transactionService = {
  async fetchTransactions(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/admin/wallets/ride-transactions?${params.toString()}`);
    return response.data;
  },
};

// ============================================
// DASHBOARD
// ============================================
export const adminStatsService = {
  async getPlatformStats() {
    const response = await api.get("/admin/dashboard");
    return response.data;
  },
  // ... (other stats calls are now part of the main dashboard call) ...
};
