import { useAuthStore } from '../store/authStore';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080/api/v1';

// Get token from store
const getToken = () => useAuthStore.getState().token;

// Rider APIs
export const bookingService = {
  // Create booking
  async createBooking(bookingData) {
    const response = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create booking');
    }
    
    return response.json();
  },

  // Get my bookings (with filters)
  async getMyBookings(filters = {}) {
    const params = new URLSearchParams();
    if (filters.filterType) params.append('filterType', filters.filterType);
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters.status) params.append('status', filters.status);
    params.append('page', filters.page || 0);
    params.append('size', filters.size || 10);
    
    const response = await fetch(`${BASE_URL}/bookings/me?${params}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch bookings');
    const data = await response.json();
    console.log('Rider bookings data:', data);
    return data;
  },

  // Get booking details
  async getBookingDetails(bookingId) {
    const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    
    if (!response.ok) throw new Error('Booking not found');
    return response.json();
  },

  // Cancel booking
  async cancelBooking(bookingId, reason) {
    const response = await fetch(`${BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cancellationReason: reason }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel booking');
    }
    
    return response.json();
  },

  // Rate driver
  async rateDriver(bookingId, rating, feedback) {
    const response = await fetch(`${BASE_URL}/bookings/${bookingId}/rate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        driverRating: rating,
        driverFeedback: feedback,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to rate driver');
    }
    
    return response.json();
  },
};

// Driver APIs
export const driverBookingService = {
  // Get available bookings
  async getAvailableBookings(vehicleType = null) {
    const params = vehicleType ? `?vehicleType=${vehicleType}` : '';
    
    const response = await fetch(`${BASE_URL}/driver/bookings/available${params}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });

    console.log('Available bookings response status:', response);

    if(response.status === 409){
      return response.json()
    }
    
    if (!response.ok) throw new Error('Failed to fetch available bookings');
    return response.json();
  },

  // Get my bookings
  async getMyBookings(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    params.append('page', filters.page || 0);
    params.append('size', filters.size || 10);
    
    const response = await fetch(`${BASE_URL}/driver/bookings/me?${params}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch bookings');
    const data = await response.json();
    console.log('Driver bookings data:', data);
    return data;
  },

  // Get active booking
  async getActiveBooking() {
    const response = await fetch(`${BASE_URL}/driver/bookings/active`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    
    if (response.status === 204) return null; // No active booking
    if (!response.ok) throw new Error('Failed to fetch active booking');
    return response.json();
  },

  // Accept booking
  async acceptBooking(bookingId, vehicleId) {
    const response = await fetch(`${BASE_URL}/driver/bookings/${bookingId}/accept`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vehicleId }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to accept booking');
    }
    
    return response.json();
  },

  // Start ride
  async startRide(bookingId) {
    const response = await fetch(`${BASE_URL}/driver/bookings/${bookingId}/start`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to start ride');
    }
    
    return response.json();
  },

  // Complete ride
  async completeRide(bookingId, data) {
    const response = await fetch(`${BASE_URL}/driver/bookings/${bookingId}/complete`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to complete ride');
    }
    
    return response.json();
  },

  // Cancel booking
  async cancelBooking(bookingId, reason) {
    const response = await fetch(`${BASE_URL}/driver/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cancellationReason: reason }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel booking');
    }
    
    return response.json();
  },

  // Rate rider
  async rateRider(bookingId, rating, feedback) {
    const response = await fetch(`${BASE_URL}/driver/bookings/${bookingId}/rate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        riderRating: rating,
        riderFeedback: feedback,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to rate rider');
    }
    
    return response.json();
  },
};

// Add this to your existing bookingService.js file (at the end)

// ============================================
// VEHICLE SERVICE
// ============================================
export const vehicleService = {
  // Get driver's vehicles
  async getMyVehicles() {
    const response = await fetch(`${BASE_URL}/vehicles`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch vehicles');
    return response.json();
  },

  // Get single vehicle
  async getVehicle(vehicleId) {
    const response = await fetch(`${BASE_URL}/vehicles/${vehicleId}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    
    if (!response.ok) throw new Error('Vehicle not found');
    return response.json();
  },

  // Add new vehicle
  async addVehicle(vehicleData) {
    const payload = {
      registrationNumber: vehicleData.rc_number,
      vehicleType: vehicleData.vehicle_type.toUpperCase(),
      manufacturer: vehicleData.manufacturer || '',
      model: vehicleData.model || '',
      year: vehicleData.year ? parseInt(vehicleData.year) : null,
      color: vehicleData.color || '',
      insuranceNumber: vehicleData.insurance_policy_number,
      insuranceExpiryDate: vehicleData.insurance_expiry,
      rcNumber: vehicleData.rc_number,
      rcExpiryDate: vehicleData.rc_expiry || null,
      pucNumber: vehicleData.puc_number,
      pucExpiryDate: vehicleData.puc_expiry,
    };

    const response = await fetch(`${BASE_URL}/vehicles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add vehicle');
    }
    
    return response.json();
  },

  // Update vehicle
  async updateVehicle(vehicleId, vehicleData) {
    const payload = {
      manufacturer: vehicleData.manufacturer,
      model: vehicleData.model,
      year: vehicleData.year ? parseInt(vehicleData.year) : null,
      color: vehicleData.color,
      insuranceNumber: vehicleData.insurance_policy_number,
      insuranceExpiryDate: vehicleData.insurance_expiry,
      rcNumber: vehicleData.rc_number,
      rcExpiryDate: vehicleData.rc_expiry,
      pucNumber: vehicleData.puc_number,
      pucExpiryDate: vehicleData.puc_expiry,
    };

    const response = await fetch(`${BASE_URL}/vehicles/${vehicleId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update vehicle');
    }
    
    return response.json();
  },

  // Delete vehicle
  async deleteVehicle(vehicleId) {
    const response = await fetch(`${BASE_URL}/vehicles/${vehicleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete vehicle');
    }
    
    return response.status === 204 ? null : response.json();
  },
};