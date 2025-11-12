export const riderService = {

    async getBookingHistory(filters = {}) {
        const params = new URLSearchParams();
        if(filters.filterType) params.append("filterType", filterType);
        if(filters.searchTerm) params.append("searchTerm", searchTerm);
        params.append("page", filters.page || 0);
        params.append("size", filters.size || 10);
        const response = await api.get(`/bookings/me/history?${params}`);
        return response.data;
    }
}