import api from "../utils/api"; // Your main Axios instance from above

/**
 * This service file is now 100% in sync with our 8-service backend API.
 */
export const driverService = {
  /**
   * Fetches the combined driver profile (user data + driver data).
   * Calls: GET /drivers/me
   */
  async getDriverProfile() {
    // We use a relative path. Axios (api.js) adds the baseURL.
    const response = await api.get("/drivers/me");
    return response.data;
  },

  /**
   * Submits the driver's verification documents.
   * Calls: PUT /drivers/me/verification
   */
  async updateDriverProfile(profileData) {
    // We map your frontend's 'dlNumber' to our backend's 'licenseNumber'
    const payload = {
      aadharNumber: profileData.aadhaarNumber,
      panNumber: profileData.panNumber, // <-- ADDED THIS
      licenseNumber: profileData.dlNumber,
      driverLicenseExpiry: profileData.dlExpiryDate,
    };
    // This endpoint is for *verification*, not general profile updates
    const response = await api.put("/drivers/me/verification", payload);
    return response.data;
  },

  /**
   * Fetches the driver's list of vehicles.
   * Calls: GET /drivers/me/vehicles
   */
  async getMyVehicles() {
    const response = await api.get("/drivers/me/vehicles");
    return response.data;
  },

  /**
   * Adds a new vehicle to the driver's profile.
   * Calls: POST /drivers/me/vehicles
   */
  async addVehicle(vehicleData) {
    // The vehicleData object (in camelCase) should match our VehicleDto
    // e.g., { vehicleType: "SEDAN", registrationNumber: "...", model: "..." }
    const response = await api.post("/drivers/me/vehicles", vehicleData);
    return response.data;
  },

  /**
   * Updates an existing vehicle.
   * Calls: PUT /drivers/me/vehicles/{vehicleId}
   * This is the new endpoint we just added to the backend.
   */
  async updateVehicle(vehicleId, vehicleData) {
    const response = await api.put(
      `/drivers/me/vehicles/${vehicleId}`,
      vehicleData
    );
    return response.data;
  },

  /**
   * Deletes a vehicle.
   * Calls: DELETE /drivers/me/vehicles/{vehicleId}
   */
  async deleteVehicle(vehicleId) {
    const response = await api.delete(`/drivers/me/vehicles/${vehicleId}`);
    return response.data; // Will be empty on success
  },

  /**
   * Sets the driver to "Online" or "Offline".
   * Calls: POST /drivers/me/status
   */
  async setDriverStatus(available, city) {
    const payload = {
      available: available,
      currentCity: city,
    };
    const response = await api.post("/drivers/me/status", payload);
    return response.data;
  },

  /**
   * Polls for new ride offers.
   * Calls: GET /drivers/me/offers
   */
  async getPendingOffers() {
    const response = await api.get("/drivers/me/offers");
    return response.data;
  },

  /**
   * Accepts a specific ride offer.
   * Calls: POST /drivers/me/offers/{offerId}/accept
   */
  async acceptOffer(offerId) {
    const response = await api.post(`/drivers/me/offers/${offerId}/accept`);
    return response.data;
  },

  /**
   * Gets the driver's paginated booking history.
   * Calls: GET /driver/bookings/me/history
   */
  async getBookingHistory(page = 0, size = 10) {
    const response = await api.get(
      `/driver/bookings/me/history?page=${page}&size=${size}`
    );
    return response.data;
  },

  /**
   * Completes a ride.
   * Calls: POST /driver/bookings/{bookingId}/complete
   */
  async completeRide(bookingId) {
    const response = await api.post(`/driver/bookings/${bookingId}/complete`);
    return response.data;
  },
};
