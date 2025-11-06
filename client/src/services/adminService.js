import api from "../utils/api";

// ============================================
// RIDER MANAGEMENT
// ============================================
export const riderService = {
  async getAllRiders(filters = {}) {
    // We will build the query parameters from the filters object
    const params = new URLSearchParams();

    // Add all the keys from your filters object
    // (role, page, size, filterType, searchTerm)
    if (filters.role) params.append('role', filters.role);
    if (filters.page) params.append('page', filters.page);
    if (filters.size) params.append('size', filters.size);
    if (filters.filterType) params.append('filterType', filters.filterType);
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
    
    // Axios will automatically add the '?'
    const response = await api.get('/admin/users', { params });
    return response.data; // Returns the Page object
  },
  async getRiderById(riderId) {
    // Calls GET /api/v1/admin/users/{riderId}
    const response = await api.get(`/admin/users/${riderId}`);
    return response.data;
  },
  async updateRider(riderId, data) {
    // Calls PUT /api/v1/admin/users/{riderId}
    const response = await api.put(`/admin/users/${riderId}`, data);
    return response.data;
  },
  async deleteRider(riderId) {
    // Calls DELETE /api/v1/admin/users/{riderId}
    const response = await api.delete(`/admin/users/${riderId}`);
    return response.data;
  },
};

// ============================================
// DRIVER MANAGEMENT
// ============================================
export const driverService = {
  async getAllDrivers(page = 0, size = 10) {
    // Calls GET /api/v1/admin/drivers
    const response = await api.get(`/admin/drivers?page=${page}&size=${size}`);
    return response.data; // Returns Page object
  },
  async getDriverById(driverId) {
    // Calls GET /api/v1/admin/drivers/{driverId}
    const response = await api.get(`/admin/drivers/${driverId}`);
    return response.data;
  },
  async verifyDriver(driverId, action, reason = null) {
    // Calls PUT /api/v1/admin/drivers/{driverId}/verify
    const payload = { action: action.toUpperCase(), rejectionReason: reason };
    const response = await api.put(`/admin/drivers/${driverId}/verify`, payload);
    return response.data;
  },
};

// ============================================
// VEHICLE MANAGEMENT
// ============================================
export const vehicleService = {
  async getVehiclesByDriver(driverId) {
    // Calls GET /api/v1/admin/vehicles?driverId=...
    const response = await api.get(`/admin/vehicles?driverId=${driverId}`);
    return response.data;
  },
  async getVehiclesByStatus(status) {
    // Calls GET /api/v1/admin/vehicles?status=...
    const response = await api.get(`/admin/vehicles?status=${status.toUpperCase()}`);
    return response.data;
  },
  async verifyVehicle(vehicleId, action, reason = null) {
    // Calls PUT /api/v1/admin/vehicles/{vehicleId}/verify
    const payload = { action: action.toUpperCase(), rejectionReason: reason };
    const response = await api.put(`/admin/vehicles/${vehicleId}/verify`, payload);
    return response.data;
  },
};

// ============================================
// BOOKING MANAGEMENT
// ============================================
export const bookingService = {
  async getAllBookings(page = 0, size = 10) {
    // Calls GET /api/v1/admin/bookings
    const response = await api.get(`/admin/bookings?page=${page}&size=${size}`);
    return response.data; // Returns Page object
  },
  async getBookingById(bookingId) {
    // Calls GET /api/v1/admin/bookings/{bookingId}
    const response = await api.get(`/admin/bookings/${bookingId}`);
    return response.data;
  },
};

// ============================================
// USER MANAGEMENT
// ============================================
export const userService = {
  async getUserById(userId) {
    // Calls GET /api/v1/admin/users/{userId}
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },
  async updateUser(userId, data) {
    // Calls PUT /api/v1/admin/users/{userId}
    const response = await api.put(`/admin/users/${userId}`, data);
    return response.data;
  },
  async updateUserStatus(userId, status) {
    // Calls PUT /api/v1/admin/users/{userId}/status
    const response = await api.put(`/admin/users/${userId}/status`, { status: status.toUpperCase() });
    return response.data;
  },
  async deleteUser(userId) {
    // Calls DELETE /api/v1/admin/users/{userId}
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },
};

// ============================================
// FARE MANAGEMENT (Keep as mock)
// ============================================
export const fareConfigService = {
  async getAllFares() {
    // GET /api/v1/admin/finance/fares
    const response = await api.get("/admin/finance/fares");
    return response.data; // Axios returns data in .data
  },

  async updateFare(id, fareData) {
    // PUT /api/v1/admin/finance/fares/{id}
    const response = await api.put(`/admin/finance/fares/${id}`, fareData);
    return response.data;
  },

  async deleteFare(id) {
    // DELETE /api/v1/admin/finance/fares/{id}
    await api.delete(`/admin/finance/fares/${id}`);
    return null; // Delete usually returns no content
  },
};

// ============================================
// COMMISSION STRUCTURE
// ============================================
export const commissionService = {
  
  async getAllCommission() {
    // GET /api/v1/admin/finance/commission
    const response = await api.get("/admin/finance/commission");
    return response.data;
  },

  async addCommission(commissionData) {
    // POST /api/v1/admin/finance/commission
    const response = await api.post("/admin/finance/commission", commissionData);
    return response.data;
  },

  async updateCommission(id, commissionData) {
    // PUT /api/v1/admin/finance/commission/{id}
    const response = await api.put(`/admin/finance/commission/${id}`, commissionData);
    return response.data;
  },
  
  async deleteCommission(id) {
    // DELETE /api/v1/admin/finance/commission/{id}
    await api.delete(`/admin/finance/commission/${id}`);
    return null;
  }
};

// ============================================
// TRANSACTION MANAGEMENT
// ============================================
export const transactionService = {

  async fetchTransactions(page = 0, size = 10, filters = {}) {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    for (const key in filters) {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    }

    const response = await api.get(`/wallet/admin/transactions?${params.toString()}`);
    return response.data;
  },
  
  async getAllCommission() {
    // GET /api/v1/admin/finance/commission
    const response = await api.get("/admin/finance/commission");
    return response.data;
  },

  async addCommission(commissionData) {
    // POST /api/v1/admin/finance/commission
    const response = await api.post("/admin/finance/commission", commissionData);
    return response.data;
  },

  async updateCommission(id, commissionData) {
    // PUT /api/v1/admin/finance/commission/{id}
    const response = await api.put(`/admin/finance/commission/${id}`, commissionData);
    return response.data;
  },
  
  async deleteCommission(id) {
    // DELETE /api/v1/admin/finance/commission/{id}
    await api.delete(`/admin/finance/commission/${id}`);
    return null;
  }
};