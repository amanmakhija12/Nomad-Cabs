import api from "../utils/api";

export const walletService = {
  async getWallet() {
    const response = await api.get("/wallet/me");
    return response.data;
  },
  async addFunds(amount) {
    const payload = { amount };
    const response = await api.post("/wallet/load", payload);
    return response.data;
  },
  async withdrawFunds(amount) {
    const payload = { amount };
    const response = await api.post("/wallet/withdraw", payload);
    return response.data;
  },
  async getMyTransactions(page = 0, size = 10) {
    const params = new URLSearchParams({ page, size });
    const response = await api.get("/wallet/me/transactions", { params });
    return response.data;
  },
};
