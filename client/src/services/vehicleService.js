import api from "../utils/api";

export const vehicleService = {
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
    `/drivers/me/vehicles/${vehicleId}`, vehicleData);
    return response.data;
  },

  async deleteVehicle(vehicleId) {
    const response = await api.delete(`/drivers/me/vehicles/${vehicleId}`);
    return response.data;
  },
};