import { useState, useEffect } from "react";
import SearchFilter from "./SearchFilter";
import BookingCard from "./BookingCard";
import Pagination from "../Pagination";
import BookingCards from "./BookingCards";

const Bookings = ({ isRider = false }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [allBookings, setAllBookings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [rider, setRider] = useState(null);
  const [filterType, setFilterType] = useState("pickup");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const bookingsPerPage = 10;

  const openBooking = (booking) => setSelectedBooking(booking);
  const closeBooking = () => setSelectedBooking(null);

  // Utility functions
  const normalize = (v) => (v ?? "").toString().trim().toLowerCase();

  const normalizeDateString = (input) => {
    if (!input) return "";
    const raw = input.toString().trim();

    const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) return raw;

    const dmy = raw.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})$/);
    if (dmy) {
      const [_, d, m, y] = dmy;
      const year = y.length === 2 ? `20${y}` : y;
      const mm = String(m).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      return `${year}-${mm}-${dd}`;
    }

    const parsed = new Date(raw);
    if (!isNaN(parsed.getTime())) {
      const year = parsed.getFullYear();
      const mm = String(parsed.getMonth() + 1).padStart(2, "0");
      const dd = String(parsed.getDate()).padStart(2, "0");
      return `${year}-${mm}-${dd}`;
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

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/bookings`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Support either array or { bookings: [] }
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

  // Fetch rider
  useEffect(() => {
    const fetchRider = async () => {
      try {
        const riderRes = await fetch(
          "http://localhost:3005/riders/a1b2c3d4-e5f6-7890-abcd-1234567890ab"
        );
        if (!riderRes.ok) return;
        const riderData = await riderRes.json();
        setRider(riderData);
      } catch (error) {
        console.error("Error fetching rider:", error);
      }
    };
    fetchRider();
  }, []);

  // Filter bookings
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setBookings(allBookings);
      setCurrentPage(1);
      return;
    }

    const term = normalize(searchTerm);
    const filtered = allBookings.filter((b) => {
      const value = getFieldValue(b, filterType);

      if (filterType === "travel_date") {
        const valueKey = normalizeDateString(value);
        const termKey = normalizeDateString(searchTerm);
        if (valueKey && termKey) {
          return valueKey.includes(termKey);
        }
        return normalize(value).includes(term);
      }

      return normalize(value).includes(term);
    });

    setBookings(filtered);
    setCurrentPage(1);
  }, [allBookings, filterType, searchTerm]);

  // Handle body scroll when modal is open
  useEffect(() => {
    if (selectedBooking) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [selectedBooking]);

  // Pagination calculations
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  // Loading and error states
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
      {/* Header with greeting */}
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-white mb-3">
          Good Morning!
        </h1>
        <p className="text-gray-300">Manage your ride bookings efficiently</p>
      </div>

      {/* Search and Filter */}
      <SearchFilter
        filterType={filterType}
        setFilterType={setFilterType}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Bookings List */}
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

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        position="relative"
        showLabels={false}
        variant="dark"
      />

      {/* Modal */}
      {selectedBooking && (
        <BookingCards
          booking={selectedBooking}
          user={rider}
          isRider={isRider}
          onClose={closeBooking}
        />
      )}
    </div>
  );
};

export default Bookings;
