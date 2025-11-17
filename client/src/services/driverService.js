import api from "../utils/api"; 


export const driverService = {
  
  async getDriverProfile() {
    
    const response = await api.get("/drivers/me");
    return response.data;
  },

  
  async updateDriverProfile(profileData) {
    
    const payload = {
      aadharNumber: profileData.aadhaarNumber,
      panNumber: profileData.panNumber, 
      licenseNumber: profileData.dlNumber,
      driverLicenseExpiry: profileData.dlExpiryDate,
    };
    
    const response = await api.put("/drivers/me/verification", payload);
    return response.data;
  },

  
  async getMyVehicles() {
    const response = await api.get("/drivers/me/vehicles");
    return response.data;
  },

  
  async addVehicle(vehicleData) {
    
    
    const response = await api.post("/drivers/me/vehicles", vehicleData);
    return response.data;
  },

  
  async updateVehicle(vehicleId, vehicleData) {
    const response = await api.put(
      `/drivers/me/vehicles/${vehicleId}`,
      vehicleData
    );
    return response.data;
  },

  
  async deleteVehicle(vehicleId) {
    const response = await api.delete(`/drivers/me/vehicles/${vehicleId}`);
    return response.data; 
  },

  
  async setDriverStatus(available, city) {
    const payload = {
      available: available,
      currentCity: city,
    };
    const response = await api.post("/drivers/me/status", payload);
    return response.data;
  },

  
  async getPendingOffers() {
    const response = await api.get("/drivers/me/offers");
    return response.data;
  },

  
  async acceptOffer(offerId, vehicleId) {
    const response = await api.post(`/drivers/me/offers/${offerId}/accept`, { vehicleId });
    return response.data;
  },

  
  async getBookingHistory(filters = {}) {
    const params = new URLSearchParams();
    params.append("page", filters.page || 0);
    params.append("size", filters.size || 10);
    if (filters.filterType && filters.searchTerm) {
      params.append('filterType', filters.filterType);
      params.append('searchTerm', filters.searchTerm);
    }
    const response = await api.get(`/driver/bookings/me/history?${params}`);
    return response.data;
  },

  
  async completeRide(bookingId) {
    const response = await api.post(`/driver/bookings/${bookingId}/complete`);
    return response.data;
  },
};
