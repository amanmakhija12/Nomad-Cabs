import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DollarSign, Percent, Users, Car, CreditCard, ShieldCheck, IndianRupee } from "lucide-react";
import { adminStatsService } from "../../services/adminService";
import { formatDateSafe } from "../../utils/DateUtil";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Helper component for the stat cards
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`bg-[#141414] rounded-2xl border border-white/10 p-6 flex items-start gap-4 ${color}`}>
    <div className="w-12 h-12 rounded-lg bg-white/10 flex-shrink-0 flex items-center justify-center">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-white/60 mb-1">{title}</p>
      <p className="text-3xl font-bold tracking-tight text-white">{value}</p>
    </div>
  </div>
);

const DateFilterButtons = ({ activeFilter, setFilter }) => {
  const filters = [
    { label: "7 Days", value: "7d" },
    { label: "15 Days", value: "15d" },
    { label: "30 Days", value: "30d" },
    { label: "Lifetime", value: "lifetime" },
  ];
  return (
    <div className="flex items-center gap-2 rounded-full bg-[#141414] border border-white/10 p-2">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => setFilter(f.value)}
          className={`h-9 px-6 rounded-full text-sm font-medium transition ${
            activeFilter === f.value
              ? "bg-white text-black shadow"
              : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};

const QuickActions = ({ setActiveSection }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <p onClick={() => setActiveSection("verification")} className="cursor-pointer text-center bg-[#141414] p-6 rounded-2xl border border-white/10 hover:bg-white/5 transition">
      <ShieldCheck className="w-8 h-8 text-yellow-300 mx-auto" />
      <p className="mt-3 text-sm font-medium text-white">Manage Verifications</p>
    </p>
    <p onClick={() => setActiveSection("fareBoard")} className="cursor-pointer text-center bg-[#141414] p-6 rounded-2xl border border-white/10 hover:bg-white/5 transition">
      <IndianRupee className="w-8 h-8 text-emerald-300 mx-auto" />
      <p className="mt-3 text-sm font-medium text-white">Manage Fares</p>
    </p>
    <p onClick={() => setActiveSection("driverBoard")} className="cursor-pointer text-center bg-[#141414] p-6 rounded-2xl border border-white/10 hover:bg-white/5 transition">
      <Car className="w-8 h-8 text-blue-300 mx-auto" />
      <p className="mt-3 text-sm font-medium text-white">View All Drivers</p>
    </p>
    <p onClick={() => setActiveSection("riderBoard")} className="cursor-pointer text-center bg-[#141414] p-6 rounded-2xl border border-white/10 hover:bg-white/5 transition">
      <Users className="w-8 h-8 text-indigo-300 mx-auto" />
      <p className="mt-3 text-sm font-medium text-white">View All Riders</p>
    </p>
  </div>
);

// Main Dashboard Component
const Dashboard = ({ setActiveSection }) => {
  const [revenueStats, setRevenueStats] = useState(null);
  const [platformStats, setPlatformStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("30d");

  const fetchData = useCallback(async (filter) => {
    try {
      setLoading(true);
      // Fetch all dashboard data in parallel
      const [revenueRes, platformRes, chartRes, txRes] = await Promise.all([
        adminStatsService.getRevenueStats(filter),
        adminStatsService.getPlatformStats(),
        adminStatsService.getRevenueChartData(filter),
        adminStatsService.getRecentTransactions(),
      ]);
      
      setRevenueStats(revenueRes);
      setPlatformStats(platformRes);
      setChartData(chartRes);
      setTransactions(txRes.content || []);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error(error.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []); // Empty array, fetchData is stable

  // This effect runs when the 'dateFilter' state changes
  useEffect(() => {
    fetchData(dateFilter);
  }, [dateFilter, fetchData]);

  const formatValue = (val, prefix = "") => {
    if (val === null || val === undefined) {
      return `${prefix}0`;
    }
    const num = parseFloat(val);
    if (isNaN(num)) {
      return `${prefix}0`;
    }
    
    // Check if the prefix is currency, and add .toFixed(2)
    if (prefix === "₹") {
      return `${prefix}${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    // Otherwise, just format as a whole number
    return `${prefix}${num.toLocaleString('en-IN')}`;
  };

  return (
    <div className="p-6 space-y-10 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          Admin Dashboard
        </h1>
        <DateFilterButtons activeFilter={dateFilter} setFilter={setDateFilter} />
      </div>
      
      {/* Stat Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Net Revenue" 
          value={formatValue(revenueStats?.totalGrossRevenue, "₹")} 
          icon={DollarSign} 
          color="text-emerald-300"
        />
        <StatCard 
          title="Total Riders" 
          value={formatValue(platformStats?.totalRiders)} 
          icon={Users} 
          color="text-indigo-300"
        />
        <StatCard 
          title="Total Drivers" 
          value={formatValue(platformStats?.totalDrivers)} 
          icon={Car} 
          color="text-blue-300"
        />
        <StatCard 
          title="Total Vehicles" 
          value={formatValue(platformStats?.totalVehicles)} 
          icon={Car} 
          color="text-white"
        />
        <StatCard 
          title="Successful Trips" 
          value={formatValue(revenueStats?.totalSuccessfulTransactions)} 
          icon={CreditCard} 
          color="text-white"
        />
        <StatCard 
          title="Avg. Commission / Trip" 
          value={formatValue(
            // Calculate the average: Total Commission / Total Trips
            revenueStats?.totalSuccessfulTransactions > 0
              ? revenueStats?.totalCommissionFees / revenueStats?.totalSuccessfulTransactions
              : 0,
            "₹" // The prefix is Rupees
          )} 
          icon={Percent} 
          color="text-white"
        />
      </div>

      {/* Revenue Chart */}
      <div className="bg-[#141414] rounded-2xl border border-white/10 p-8 shadow-lg h-[400px]">
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-8">
          Net Revenue ({dateFilter})
        </h2>
        {loading ? (
          <div className="flex items-center justify-center h-64">Loading chart...</div>
        ) : (
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f1f1f", border: "1px solid #ffffff20", borderRadius: "12px" }}
                labelStyle={{ color: "#ffffff" }}
                itemStyle={{ color: "#10b981" }}
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      
      {/* Quick Actions */}
      <QuickActions setActiveSection={setActiveSection} />

      {/* Recent Transactions List */}
      <div className="bg-[#141414] rounded-2xl border border-white/10 p-8 shadow-lg">
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-8">
          Recent Activity
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-white/60 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left font-semibold px-5 py-4">Booking ID</th>
                <th className="text-left font-semibold px-5 py-4">Rider</th>
                <th className="text-left font-semibold px-5 py-4">Driver</th>
                <th className="text-left font-semibold px-5 py-4">Total Fare</th>
                <th className="text-left font-semibold px-5 py-4">Commission</th>
                <th className="text-left font-semibold px-5 py-4">Platform Fee</th>
                <th className="text-left font-semibold px-5 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-white/40">Loading...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-white/40">No transactions found.</td></tr>
              ) : (
                transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-white/5">
                    <td className="px-5 py-4 font-mono text-xs text-white/70">{tx.bookingId?.split('-')[0]}...</td>
                    <td className="px-5 py-4 text-white/90">{tx.riderName}</td>
                    <td className="px-5 py-4 text-white/90">{tx.driverName}</td>
                    <td className="px-5 py-4 text-white font-medium">₹{tx.totalFare.toFixed(2)}</td>
                    <td className="px-5 py-4 text-blue-300 font-medium">₹{tx.commissionFee.toFixed(2)}</td>
                    <td className="px-5 py-4 text-indigo-300 font-medium">₹{tx.platformFee.toFixed(2)}</td>
                    <td className="px-5 py-4 text-white/60">{formatDateSafe(tx.createdAt, { variant: 'date' })}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;