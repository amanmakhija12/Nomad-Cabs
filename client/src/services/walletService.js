import api from "../utils/api";

export const walletService = {
  async getWallet() {
    const response = await api.get("/wallets/me");
    return response.data;
  },
  async addFunds(amount) {
    const payload = { amount };
    const response = await api.post("/wallets/me/deposit", payload);
    return response.data;
  },
  async withdrawFunds(amount) {
    const payload = { amount };
    const response = await api.post("/wallets/me/withdraw", payload);
    return response.data;
  },
  async getMyTransactions(page = 0, size = 10) {
    const params = new URLSearchParams({ page, size });
    const response = await api.get("/wallets/me/transactions", { params });
    return response.data;
  },
};