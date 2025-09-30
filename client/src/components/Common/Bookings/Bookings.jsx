import { useState, useEffect } from "react";
import SearchFilter from "./SearchFilter";
import BookingCard from "./BookingCard";
import Pagination from "../Pagination";
import BookingCards from "./BookingCards";
import { useAuthStore } from "../../../store/authStore";

const Bookings = ({ isRider = false }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [allBookings, setAllBookings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filterType, setFilterType] = useState("pickup");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const bookingsPerPage = 10;

  const user = useAuthStore((s) => s.user);

  const openBooking = (booking) => setSelectedBooking(booking);
  const closeBooking = () => setSelectedBooking(null);

  const normalize = (v) => (v ?? "").toString().trim().toLowerCase();


  const normalizeDateKey = (input) => {
    if (!input) return "";
    const raw = input.toString().trim();
    if (raw.includes("T") && raw.length >= 10) return raw.slice(0, 10);
    const d = new Date(raw);
    if (!isNaN(d.getTime())) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }
    return raw.toLowerCase();
  };

  const getFieldValue = (booking, type) => {
    switch (type) {
      case "pickup":
        return booking?.pickup_address ?? "";
      case "dropoff":
        return booking?.dropoff_address ?? "";
      case "travel_date":
        return booking?.created_at ?? "";
      case "status":
        return booking?.booking_status ?? "";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/bookings`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.bookings)
          ? data.bookings
          : [];
        setAllBookings(list);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    let base = allBookings;
    if (user) {
      const role = user.role;
      if (isRider || role === "rider") {
        base = base.filter((b) => b.rider_id === user.id);
      } else if (role === "driver") {
        base = base.filter((b) => b.driver_id === user.id);
      }
    }


    if (searchTerm.trim() === "") {
      setBookings(base);
      setCurrentPage(1);
      return;
    }

    const term = normalize(searchTerm);
    
    const filtered = base.filter((b) => {
      const value = getFieldValue(b, filterType);
      if (filterType === "travel_date") {
        const valueKey = normalizeDateKey(value);
        const termKey = normalizeDateKey(searchTerm);
        return valueKey.includes(termKey);
      }
      return normalize(value).includes(term);
    });

    setBookings(filtered);
    setCurrentPage(1);
  }, [allBookings, user, isRider, filterType, searchTerm]);

  useEffect(() => {
    if (selectedBooking) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [selectedBooking]);

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

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
        {currentBookings.length === 0 ? (
          <div className="bg-[#141414] rounded-2xl p-12 text-center border border-white/10">
            <p className="text-gray-400 text-lg">No bookings found</p>
          </div>
        ) : (
          currentBookings.map((booking) => (
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
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
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
