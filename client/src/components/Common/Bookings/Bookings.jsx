import { useState, useEffect } from "react";
import SearchFilter from "./SearchFilter";
import BookingCard from "./BookingCard";
import Pagination from "../Pagination";
import BookingCards from "./BookingCards";
import { useAuthStore } from "../../../store/authStore";
import { bookingService, driverBookingService } from "../../../services/bookingService";
import { toast } from "react-toastify";

const Bookings = ({ isRider = false }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // Backend uses 0-based
  const [filterType, setFilterType] = useState("pickup");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingsData, setBookingsData] = useState({
    content: [],
    totalPages: 0,
    totalElements: 0,
  });

  const user = useAuthStore((s) => s.user);

  const openBooking = (booking) => setSelectedBooking(booking);
  const closeBooking = () => setSelectedBooking(null);

  // Fetch bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        
        const filters = {
          filterType: filterType !== "status" ? filterType : undefined,
          searchTerm: filterType !== "status" ? searchTerm : undefined,
          status: filterType === "status" ? searchTerm : statusFilter,
          page: currentPage,
          size: 10,
        };

        let data;
        if (isRider || user?.role === "RIDER") {
          data = await bookingService.getMyBookings(filters);
        } else if (user?.role === "DRIVER") {
          data = await driverBookingService.getMyBookings(filters);
        }

        setBookingsData(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error(error.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user, isRider, filterType, searchTerm, statusFilter, currentPage]);

  useEffect(() => {
    if (selectedBooking) {
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = "auto");
    }
  }, [selectedBooking]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/10 border-t-white" />
          <div className="absolute inset-0 flex items-center justify-center text-white/70 text-lg">
            🚗
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151212] text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-white mb-3">
          {`Good Morning${user?.first_name ? ", " + user.first_name : ""}!`}
        </h1>
        <p className="text-gray-300">Manage your ride bookings efficiently</p>
      </div>

      <SearchFilter
        filterType={filterType}
        setFilterType={setFilterType}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <ul className="space-y-4 flex-grow pb-24">
        {bookingsData.content.length === 0 ? (
          <div className="bg-[#141414] rounded-2xl p-12 text-center border border-white/10">
            <p className="text-gray-400 text-lg">No bookings found</p>
          </div>
        ) : (
          bookingsData.content.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              isRider={isRider}
              onBookingClick={openBooking}
            />
          ))
        )}
      </ul>

      <Pagination
        currentPage={currentPage + 1} // Display as 1-based
        totalPages={bookingsData.totalPages || 1}
        onPageChange={(page) => setCurrentPage(page - 1)} // Convert to 0-based
        position="relative"
        showLabels={false}
        variant="dark"
      />

      {selectedBooking && (
        <BookingCards
          booking={selectedBooking}
          user={user}
          isRider={isRider}
          onClose={closeBooking}
        />
      )}
    </div>
  );
};

export default Bookings;