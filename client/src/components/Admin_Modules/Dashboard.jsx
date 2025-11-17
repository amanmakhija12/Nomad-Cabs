import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  DollarSign,
  Percent,
  Users,
  Car,
  CreditCard,
  ShieldCheck,
  IndianRupee,
} from "lucide-react";
import { adminStatsService } from "../../services/adminService";
import { formatDateSafe } from "../../utils/DateUtil";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div
    className={`bg-[#141414] rounded-2xl border border-white/10 p-6 flex items-start gap-4 ${color}`}
  >
    <div className="w-12 h-12 rounded-lg bg-white/10 flex-shrink-0 flex items-center justify-center">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-white/60 mb-1">{title}</p>
      <p className="text-3xl font-bold tracking-tight text-white">{value}</p>
    </div>
  </div>
);

const QuickActions = ({ setActiveSection }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <p
      onClick={() => setActiveSection("verification")}
      className="cursor-pointer text-center bg-[#141414] p-6 rounded-2xl border border-white/10 hover:bg-white/5 transition"
    >
      <ShieldCheck className="w-8 h-8 text-yellow-300 mx-auto" />
      <p className="mt-3 text-sm font-medium text-white">
        Manage Verifications
      </p>
    </p>
    <p
      onClick={() => setActiveSection("fareBoard")}
      className="cursor-pointer text-center bg-[#141414] p-6 rounded-2xl border border-white/10 hover:bg-white/5 transition"
    >
      <IndianRupee className="w-8 h-8 text-emerald-300 mx-auto" />
      <p className="mt-3 text-sm font-medium text-white">Manage Fares</p>
    </p>
    <p
      onClick={() => setActiveSection("driverBoard")}
      className="cursor-pointer text-center bg-[#141414] p-6 rounded-2xl border border-white/10 hover:bg-white/5 transition"
    >
      <Car className="w-8 h-8 text-blue-300 mx-auto" />
      <p className="mt-3 text-sm font-medium text-white">View All Drivers</p>
    </p>
    <p
      onClick={() => setActiveSection("riderBoard")}
      className="cursor-pointer text-center bg-[#141414] p-6 rounded-2xl border border-white/10 hover:bg-white/5 transition"
    >
      <Users className="w-8 h-8 text-indigo-300 mx-auto" />
      <p className="mt-3 text-sm font-medium text-white">View All Riders</p>
    </p>
  </div>
);

const Dashboard = ({ setActiveSection }) => {
  const [platformStats, setPlatformStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("30d");

  const fetchData = useCallback(async (filter) => {
    try {
      setLoading(true);
      const response = await adminStatsService.getPlatformStats();
      setPlatformStats(response);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error(error.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

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

    if (prefix === "₹") {
      return `${prefix}${num.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }

    return `${prefix}${num.toLocaleString("en-IN")}`;
  };

  return (
    <div className="p-6 space-y-10 text-white">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          Admin Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Net Revenue"
          value={formatValue(platformStats?.companyWalletBalance, "₹")}
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
          value={formatValue(platformStats?.successfulTrips)}
          icon={CreditCard}
          color="text-white"
        />
        <StatCard
          title="Avg. Commission / Trip"
          value={formatValue(
            platformStats?.successfulTrips > 0
              ? platformStats?.companyWalletBalance /
                  platformStats?.successfulTrips
              : 0,
            "₹"
          )}
          icon={Percent}
          color="text-white"
        />
      </div>

      <QuickActions setActiveSection={setActiveSection} />

      <div className="bg-[#141414] rounded-2xl border border-white/10 p-8 shadow-lg">
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-8">
          Recent Activity
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-white/60 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left font-semibold px-5 py-4">
                  Booking ID
                </th>
                <th className="text-left font-semibold px-5 py-4">Rider</th>
                <th className="text-left font-semibold px-5 py-4">Driver</th>
                <th className="text-left font-semibold px-5 py-4">
                  Total Fare
                </th>
                <th className="text-left font-semibold px-5 py-4">
                  Commission
                </th>
                <th className="text-left font-semibold px-5 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-white/40">
                    Loading...
                  </td>
                </tr>
              ) : platformStats.latestTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-white/40">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                platformStats.latestTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5">
                    <td className="px-5 py-4 font-mono text-xs text-white/70">
                      {tx.id?.split("-")[0]}...
                    </td>
                    <td className="px-5 py-4 text-white/90">{tx.riderName}</td>
                    <td className="px-5 py-4 text-white/90">{tx.driverName}</td>
                    <td className="px-5 py-4 text-white font-medium">
                      ₹{tx.totalFare.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-blue-300 font-medium">
                      ₹{tx.commissionFee.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-white/60">
                      {formatDateSafe(tx.timestamp, { variant: "date" })}
                    </td>
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
