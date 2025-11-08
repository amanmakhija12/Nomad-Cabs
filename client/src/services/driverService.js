import api from '../utils/api'; // Your main Axios instance

export const driverService = {
  
  async getDriverProfile() {
    const response = await api.get('/driver/profile/me');
    return response.data;
  },

  async updateDriverProfile(profileData) {
    const payload = {
      aadharNumber: profileData.aadhaarNumber,
      licenseNumber: profileData.dlNumber,
      driverLicenseExpiry: profileData.dlExpiryDate,
    };
    const response = await api.put('/driver/profile/me', payload);
    return response.data;
  },

  async getMyVehicles() {
    const response = await api.get('/driver/vehicles');
    return response.data;
  },

  async updateVehicle(vehicleId, vehicleData) {
    const response = await api.put(`/driver/vehicles/${vehicleId}`, vehicleData);
    return response.data;
  },
  
  async addVehicle(vehicleData) {
    const response = await api.post('/driver/vehicles', vehicleData);
    return response.data;
  }
};