import { useState, useEffect, useCallback, useRef } from "react";
import { toast, Bounce } from "react-toastify";
import { formatDateSafe } from "../../../utils/DateUtil";
import TransactionCards from "./TransactionCards";
import { transactionService } from "../../../services/adminService";
import { useDebounce } from "../../../hooks/useDebounce";
import Pagination from "../../Common/Pagination";

const ManageTransactions = () => {
  const [transactionsData, setTransactionsData] = useState({ content: [], totalPages: 0, totalElements: 0, number: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fareFilter, setFareFilter] = useState("all");
  const [fareValue, setFareValue] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  
  // --- 2. DEBOUNCE inputs to prevent API spam ---
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const debouncedFareValue = useDebounce(fareValue, 500);
  const hasShownErrorRef = useRef(false);

  // --- 3. REFACTORED fetchTransactions ---
  const fetchTransactions = useCallback(async (silent = false) => {
    try {
      setLoading(true);
      if(!silent) hasShownErrorRef.current = false;

      // 1. Build filters object
      const filters = {
        page: transactionsData.number - 1,
        size: 10,
        searchTerm: debouncedSearchTerm || null,
        status: statusFilter === "all" ? null : statusFilter,
        fareFilter: fareFilter === "all" ? null : fareFilter,
        fareValue: debouncedFareValue || null,
        dateFilter: dateFilter || null,
      };

      // 4. SINGLE, POWERFUL API CALL
      // This function must be in your adminService.js and call GET /api/v1/admin/bookings
      const data = await transactionService.fetchTransactions(filters);
      
      setTransactionsData(data);
    } catch (e) {
      console.error("Error fetching transactions:", e);
      if (!silent && !hasShownErrorRef.current) {
        toast.error(e.message || "Failed to fetch transactions", { theme: "dark", transition: Bounce });
        hasShownErrorRef.current = true;
      }
    } finally {
      setLoading(false);
    }
    // 5. Update dependency array
  }, [debouncedSearchTerm, statusFilter, fareFilter, debouncedFareValue, dateFilter]);

  // This useEffect now triggers on any filter change
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleRefresh = useCallback(() => fetchTransactions(true), [fetchTransactions]);

  const openTransaction = (t) => setSelectedTransaction(t);
  const closeTransaction = () => setSelectedTransaction(null);

  // --- 7. PAGINATION is now driven by backend data ---
  const currentTransactions = transactionsData.content || [];
  const totalPages = transactionsData.totalPages || 1;

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

  return (
    <div className="p-6 flex flex-col min-h-[500px] pb-10 bg-[#151212] text-white rounded-3xl">
      {/* Header */}
      <div className="mb-10">
        <div className="bg-gradient-to-r from-[#181818] via-[#151515] to-[#121212] rounded-2xl p-8 border border-white/10 shadow-lg">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Transaction Logs</h1>
          <p className="text-white/50 mt-3 text-sm md:text-base">Manage and view all booking transactions</p>
          <div className="mt-6 flex items-center gap-4 text-[11px] uppercase tracking-wider text-white/35">
            <span>Total: <strong className="text-white/70">{transactionsData.totalElements}</strong></span>
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
              <option value="REQUESTED">Requested</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="STARTED">Started</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
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
              }}
              className="h-11 w-full rounded-lg bg-white/10 text-white text-sm font-medium border border-white/15 hover:bg-white/15 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-6 flex items-center justify-center min-h-[400px] bg-[#0f0f0f] rounded-2xl border border-white/10">
          <div className="text-sm font-medium text-white/60">Loading transactions...</div>
        </div>
      ) : (
        <div className="bg-[#141414] rounded-2xl border border-white/10 overflow-hidden mb-12">
          <div className="overflow-x-auto h-full">
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
                      <div className="text-white/85 font-medium">{t.riderName || "-"}</div>
                      <div className="text-white/40 text-[11px] mt-1">{t.riderPhone}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-white/85 font-medium">{t.driverName || t.driverId}</div>
                      <div className="text-white/40 text-[11px] mt-1">{t.driverPhone}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-white/85 font-medium truncate max-w-56" title={t.pickupAddress}>From: {t.pickupAddress}</div>
                      <div className="text-white/40 text-[11px] truncate max-w-56 mt-1" title={t.dropoffAddress}>To: {t.dropoffAddress}</div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-white">₹{t.totalFare}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold border ${statusBadge(t.bookingStatus)}`}>{t.bookingStatus}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold border ${paymentBadge(t.paymentStatus)}`}>{t.paymentStatus}</span>
                    </td>
                    <td className="px-5 py-4 text-white/70">
                      {formatDateSafe(t.updatedAt, { locale: 'en-IN', timeZone: 'Asia/Kolkata', variant: 'date', fallback: '—', assumeUTCForMySQL: true })}
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
      )}

      {/* Pagination */}
      <Pagination
        currentPage={transactionsData.number + 1}
        totalPages={transactionsData.totalPages || 1}
        onPageChange={(page) => setTransactionsData({ ...transactionsData, number: page - 1 })}
        position="relative"
        variant="dark"
      />

      {selectedTransaction && (
        <TransactionCards transaction={selectedTransaction} onClose={closeTransaction} onRefresh={handleRefresh} />
      )}
    </div>
  );
};

export default ManageTransactions;
