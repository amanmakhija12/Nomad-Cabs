const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080/api/v1';
import { useAuthStore } from '../store/authStore';

// Get token from store
const getToken = () => useAuthStore.getState().token;
const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return null;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// ============================================
// RIDER MANAGEMENT (NOW USES ADMIN ENDPOINTS)
// ============================================
export const riderService = {
  async getAllRiders() {
    // Use admin endpoint with role filter
    return apiCall('/admin/users?role=RIDER');
  },

  async getRiderById(riderId) {
    return apiCall(`/admin/users/${riderId}`);
  },

  async updateRider(riderId, data) {
    return apiCall(`/admin/users/${riderId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteRider(riderId) {
    return apiCall(`/admin/users/${riderId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// DRIVER MANAGEMENT (NO CHANGES NEEDED)
// ============================================
export const driverService = {
  async getAllDrivers() {
    return apiCall('/admin/drivers');
  },

  async getDriverById(driverId) {
    return apiCall(`/admin/drivers/${driverId}`);
  },

  async verifyDriver(driverId, action, reason = null) {
    return apiCall(`/admin/drivers/${driverId}/verify`, {
      method: 'PUT',
      body: JSON.stringify({
        action,
        rejectionReason: reason,
      }),
    });
  },
};

// ============================================
// VEHICLE MANAGEMENT (NO CHANGES NEEDED)
// ============================================
export const vehicleService = {
  async getVehiclesByDriver(driverId) {
    return apiCall(`/admin/vehicles?driverId=${driverId}`);
  },

  async getVehiclesByStatus(status) {
    return apiCall(`/admin/vehicles?status=${status}`);
  },

  async verifyVehicle(vehicleId, action, reason = null) {
    return apiCall(`/admin/vehicles/${vehicleId}/verify`, {
      method: 'PUT',
      body: JSON.stringify({
        action,
        rejectionReason: reason,
      }),
    });
  },
};

// ============================================
// BOOKING MANAGEMENT (NOW USES ADMIN ENDPOINTS)
// ============================================
export const bookingService = {
  async getAllBookings() {
    const response = await apiCall('/admin/bookings?page=0&size=1000');
    return response.content || response;
  },

  async getBookingById(bookingId) {
    return apiCall(`/admin/bookings/${bookingId}`);
  },
};

// ============================================
// USER MANAGEMENT (NOW USES ADMIN ENDPOINTS)
// ============================================
export const userService = {
  async getUserById(userId) {
    return apiCall(`/admin/users/${userId}`);
  },

  async updateUser(userId, data) {
    return apiCall(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async updateUserStatus(userId, status) {
    return apiCall(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async deleteUser(userId) {
    return apiCall(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// FARE MANAGEMENT (Keep as mock)
// ============================================
export const fareService = {
  baseUrl: 'http://localhost:3008',

  async getLocationPricing() {
    const res = await fetch(`${this.baseUrl}/location_pricing`);
    return res.json();
  },

  async addLocationPricing(data) {
    const res = await fetch(`${this.baseUrl}/location_pricing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateLocationPricing(id, data) {
    const res = await fetch(`${this.baseUrl}/location_pricing/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteLocationPricing(id) {
    await fetch(`${this.baseUrl}/location_pricing/${id}`, {
      method: 'DELETE',
    });
  },

  async getCommissionStructure() {
    const res = await fetch(`${this.baseUrl}/commission_structure`);
    return res.json();
  },

  async updateCommissionStructure(id, data) {
    const res = await fetch(`${this.baseUrl}/commission_structure/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};