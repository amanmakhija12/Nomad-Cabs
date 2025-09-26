import { useState, useEffect, useCallback, useRef } from "react";
import { toast, Bounce } from "react-toastify";
import { formatDateSafe } from "../../../utils/DateUtil";
import TransactionCards from "./TransactionCards";
import {ChevronLeft,ChevronRight} from 'lucide-react'

const ManageTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const hasShownErrorRef = useRef(false);
  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fareFilter, setFareFilter] = useState("all");
  const [fareValue, setFareValue] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const fetchTransactions = useCallback(async (silent = false) => {
    try {
      setLoading(true);
      hasShownErrorRef.current = false;
      const response = await fetch("http://localhost:4001/bookings");
      const bookingsData = await response.json();
      const usersResponse = await fetch("http://localhost:4001/users");
      const usersData = await usersResponse.json();
      const driversResponse = await fetch("http://localhost:4001/drivers");
      const driversData = await driversResponse.json();

      const usersMap = usersData.reduce((acc, u) => { acc[u.id] = u; return acc; }, {});
      const driversMap = driversData.reduce((acc, d) => { acc[d.id] = d; return acc; }, {});

      const filteredBookings = bookingsData.filter(
        (b) => b.booking_status === "completed" || b.booking_status === "cancelled"
      );

      const enriched = filteredBookings.map((b) => {
        const rider = usersMap[b.rider_id];
        const driver = driversMap[b.driver_id];
        const driverUser = driver ? usersMap[driver.user_id] : null;
        return {
          ...b,
          rider_name: rider ? `${rider.first_name} ${rider.last_name}` : "Unknown Rider",
          rider_phone: rider ? rider.phone_number : "N/A",
          driver_name: driverUser ? `${driverUser.first_name} ${driverUser.last_name}` : "Unknown Driver",
          driver_phone: driverUser ? driverUser.phone_number : "N/A",
        };
      });

      const sorted = enriched.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      setTransactions(sorted);
      setFilteredTransactions(sorted.slice(0, 10));
    } catch (e) {
      console.error("Error fetching transactions:", e);
      if (!silent && !hasShownErrorRef.current) {
        toast.error("Failed to fetch transactions", { theme: "dark", transition: Bounce });
        hasShownErrorRef.current = true;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);
  const handleRefresh = useCallback(() => fetchTransactions(true), [fetchTransactions]);

  useEffect(() => {
    const active = searchTerm || statusFilter !== "all" || (fareFilter !== "all" && fareValue) || dateFilter;
    if (!active) {
      setFilteredTransactions(transactions.slice(0, 10));
      setIsFiltered(false);
    } else {
      let f = [...transactions];
      if (searchTerm) f = f.filter(t => t.id.toLowerCase().includes(searchTerm.toLowerCase()));
      if (statusFilter !== "all") f = f.filter(t => t.booking_status === statusFilter);
      if (fareFilter !== "all" && fareValue) {
        const val = parseFloat(fareValue);
        f = f.filter(t => {
          if (fareFilter === "equal") return t.fare === val;
          if (fareFilter === "greater") return t.fare >= val;
            return t.fare <= val; // less
        });
      }
      if (dateFilter) {
        f = f.filter(t => new Date(t.updated_at).toISOString().split('T')[0] === dateFilter);
      }
      setFilteredTransactions(f);
      setIsFiltered(true);
    }
    setCurrentPage(1);
  }, [transactions, searchTerm, statusFilter, fareFilter, fareValue, dateFilter]);

  const openTransaction = (t) => setSelectedTransaction(t);
  const closeTransaction = () => setSelectedTransaction(null);

  const indexOfLast = currentPage * recordsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfLast - recordsPerPage, indexOfLast);
  const totalPages = Math.ceil(filteredTransactions.length / recordsPerPage) || 1;

  const getTableHeight = () => 64 + 80 * Math.min(currentTransactions.length, recordsPerPage);

  const statusBadge = (s) => ({
    completed: "bg-emerald-900/40 text-emerald-300 border-emerald-700",
    cancelled: "bg-red-900/40 text-red-300 border-red-700",
    ongoing: "bg-blue-900/40 text-blue-300 border-blue-700",
    pending: "bg-amber-900/40 text-amber-300 border-amber-700",
  }[s] || "bg-[#222] text-white/60 border-white/10");

  const paymentBadge = (p) => ({
    paid: "bg-emerald-900/40 text-emerald-300 border-emerald-700",
    cancelled: "bg-red-900/40 text-red-300 border-red-700",
    pending: "bg-amber-900/40 text-amber-300 border-amber-700",
    failed: "bg-red-900/40 text-red-300 border-red-700",
  }[p] || "bg-[#222] text-white/60 border-white/10");

  const inputBase = "h-11 w-full rounded-lg bg-[#1b1b1b] border border-white/10 text-sm px-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/15";
  const selectBase = inputBase;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px] bg-[#0f0f0f] rounded-2xl border border-white/10">
        <div className="text-sm font-medium text-white/60">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col min-h-[500px] pb-10 bg-[#151212] text-white rounded-3xl">
      {/* Header */}
      <div className="mb-10">
        <div className="bg-gradient-to-r from-[#181818] via-[#151515] to-[#121212] rounded-2xl p-8 border border-white/10 shadow-lg">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Transaction Logs</h1>
          <p className="text-white/50 mt-3 text-sm md:text-base">Manage and view all booking transactions</p>
          <div className="mt-6 flex items-center gap-4 text-[11px] uppercase tracking-wider text-white/35">
            <span>Total: <strong className="text-white/70">{transactions.length}</strong></span>
            <span>Showing: <strong className="text-white/70">{filteredTransactions.length}</strong></span>
            {isFiltered && <span className="text-amber-300">Filtered</span>}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#141414] rounded-2xl border border-white/10 p-8 mb-12">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-white/50 mb-8">Filter Transactions</h3>
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div>
            <label className="text-[11px] font-medium tracking-wide uppercase text-white/40 block mb-2">Search Booking ID</label>
            <input
              type="text"
              placeholder="Enter booking ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={inputBase}
            />
          </div>
          <div>
            <label className="text-[11px] font-medium tracking-wide uppercase text-white/40 block mb-2">Booking Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={selectBase}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-medium tracking-wide uppercase text-white/40 block mb-2">Updated Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={inputBase}
            />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <div>
            <label className="text-[11px] font-medium tracking-wide uppercase text-white/40 block mb-2">Fare Condition</label>
            <select
              value={fareFilter}
              onChange={(e) => setFareFilter(e.target.value)}
              className={selectBase}
            >
              <option value="all">All Fares</option>
              <option value="equal">Equal (=)</option>
              <option value="greater">Greater (≥)</option>
              <option value="less">Less (≤)</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-medium tracking-wide uppercase text-white/40 block mb-2">Fare Amount (₹)</label>
            <input
              type="number"
              placeholder="Enter amount"
              step="0.01"
              value={fareValue}
              onChange={(e) => setFareValue(e.target.value)}
              disabled={fareFilter === "all"}
              className={`${inputBase} ${fareFilter === 'all' ? 'opacity-40 cursor-not-allowed' : ''}`}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setFareFilter("all");
                setFareValue("");
                setDateFilter("");
                setFilteredTransactions(transactions.slice(0, 10));
                setIsFiltered(false);
                setCurrentPage(1);
              }}
              className="h-11 w-full rounded-lg bg-white/10 text-white text-sm font-medium border border-white/15 hover:bg-white/15 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
        <div className="pt-6 border-t border-white/10 text-xs text-white/40">
          {isFiltered ? `Showing ${filteredTransactions.length} of ${transactions.length} (filtered)` : `Showing latest ${Math.min(10, transactions.length)} of ${transactions.length}`}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#141414] rounded-2xl border border-white/10 overflow-hidden mb-12">
        <div className="overflow-x-auto" style={{ height: `${getTableHeight()}px` }}>
          <table className="w-full h-full text-sm">
            <thead className="bg-[#1f1f1f] text-white/60 text-xs uppercase tracking-wide sticky top-0 z-10">
              <tr>
                <th className="px-5 py-4 text-left font-semibold min-w-[120px]">Booking ID</th>
                <th className="px-5 py-4 text-left font-semibold min-w-[150px]">Rider</th>
                <th className="px-5 py-4 text-left font-semibold min-w-[150px]">Driver</th>
                <th className="px-5 py-4 text-left font-semibold min-w-[220px]">Route</th>
                <th className="px-5 py-4 text-left font-semibold min-w-[100px]">Fare (₹)</th>
                <th className="px-5 py-4 text-left font-semibold min-w-[100px]">Status</th>
                <th className="px-5 py-4 text-left font-semibold min-w-[100px]">Payment</th>
                <th className="px-5 py-4 text-left font-semibold min-w-[120px]">Updated</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((t, idx) => (
                <tr
                  key={t.id}
                  onClick={() => openTransaction(t)}
                  className={`h-20 border-t border-white/5 hover:bg-white/5 transition cursor-pointer ${idx === currentTransactions.length - 1 ? 'border-b border-white/5' : ''}`}
                >
                  <td className="px-5 py-4 font-medium text-white/90">{t.id}</td>
                  <td className="px-5 py-4">
                    <div className="text-white/85 font-medium">{t.rider_name}</div>
                    <div className="text-white/40 text-[11px] mt-1">{t.rider_phone}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-white/85 font-medium">{t.driver_name}</div>
                    <div className="text-white/40 text-[11px] mt-1">{t.driver_phone}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-white/85 font-medium truncate max-w-56" title={t.pickup_address}>From: {t.pickup_address}</div>
                    <div className="text-white/40 text-[11px] truncate max-w-56 mt-1" title={t.drop_address}>To: {t.drop_address}</div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-white">₹{t.fare}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold border ${statusBadge(t.booking_status)}`}>{t.booking_status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold border ${paymentBadge(t.payment_status)}`}>{t.payment_status}</span>
                  </td>
                  <td className="px-5 py-4 text-white/70">
                    {formatDateSafe(t.updated_at, { locale: 'en-IN', timeZone: 'Asia/Kolkata', variant: 'date', fallback: '—', assumeUTCForMySQL: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {currentTransactions.length === 0 && (
          <div className="p-10 text-center text-white/40 text-sm">No transactions found.</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <div className="flex items-center gap-2 bg-[#141414] border border-white/10 rounded-full px-3 py-2 shadow-lg">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-9 w-9 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => {
                if (totalPages <= 7) return true;
                if (n === 1 || n === totalPages) return true;
                if (Math.abs(n - currentPage) <= 1) return true;
                if (currentPage <= 3 && n <= 5) return true;
                if (currentPage >= totalPages - 2 && n >= totalPages - 4)
                  return true;
                return false;
              })
              .map((n, idx, arr) => {
                const prev = arr[idx - 1];
                const showDots = prev && n - prev > 1;
                return (
                  <div key={n} className="flex">
                    {showDots && (
                      <span className="h-9 w-9 flex items-center justify-center text-white/30">
                        …
                      </span>
                    )}
                    <button
                      onClick={() => setCurrentPage(n)}
                      className={`h-9 w-9 rounded-full text-sm font-medium transition ${
                        currentPage === n
                          ? "bg-white text-black shadow"
                          : "text-white/60 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {n}
                    </button>
                  </div>
                );
              })}

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="h-9 w-9 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {selectedTransaction && (
        <TransactionCards transaction={selectedTransaction} onClose={closeTransaction} onRefresh={handleRefresh} />
      )}
    </div>
  );
};

export default ManageTransactions;
