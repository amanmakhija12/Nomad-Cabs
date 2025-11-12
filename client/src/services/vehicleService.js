import api from "../utils/api";

export const vehicleService = {
  async getMyVehicles() {
    const response = await api.get("/driver/vehicles");
    return response.data;
  },
  async getVehicle(vehicleId) {
    const response = await api.get(`/driver/vehicles/${vehicleId}`);
    return response.data;
  },
  async addVehicle(vehicleData) {
    const response = await api.post("/driver/vehicles", vehicleData);
    return response.data;
  },
  async updateVehicle(vehicleId, vehicleData) {
    const response = await api.put(
      `/driver/vehicles/${vehicleId}`,
      vehicleData
    );
    return response.data;
  },
  async deleteVehicle(vehicleId) {
    const response = await api.delete(`/driver/vehicles/${vehicleId}`);
    return response.data;
  },
};
