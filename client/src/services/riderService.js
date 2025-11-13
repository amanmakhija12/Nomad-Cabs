import api from "../utils/api";

export const riderService = {
    async getBookingHistory(filters = {}) {
        const params = new URLSearchParams();
        params.append("page", filters.page || 0);
        params.append("size", filters.size || 10);
        if (filters.filterType && filters.searchTerm) {
            params.append('filterType', filters.filterType);
            params.append('searchTerm', filters.searchTerm);
        }
        const response = await api.get(`/bookings/me/history?${params}`);
        return response.data;
    },
}