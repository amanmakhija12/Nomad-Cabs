import { useEffect, useState } from "react";
import { toast, Bounce } from "react-toastify";
import { formatDateSafe } from "../../../../utils/DateUtil";
import VehicleCard from "./VehicleCard";

const VehicleCards = ({ ownerId }) => {
  // State
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Fetch vehicles (simple for beginners)
  useEffect(() => {
    if (!ownerId) return;

    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3007/vehicles?owner_id=${ownerId}`
        );
        if (!response.ok) throw new Error("Failed to fetch vehicles");
        const data = await response.json();
        setVehicles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        toast.error("Failed to fetch vehicles", {
          theme: "dark",
          transition: Bounce,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [ownerId]);

  // Inline UI pieces to avoid extra files
  const Header = () => (
    <div className="flex justify-between items-start md:items-center mb-10 flex-col md:flex-row gap-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-b from-white to-white/70 text-black flex items-center justify-center shadow ring-1 ring-white/10">
          <span className="text-2xl">🚗</span>
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Driver Vehicles
          </h2>
          <p className="text-white/50 text-sm mt-1">
            Manage vehicle information and verification status
          </p>
        </div>
      </div>
    </div>
  );

  const Loading = () => (
    <div className="flex justify-center items-center py-20">
      <div className="relative">
        <div className="animate-spin h-12 w-12 rounded-full border-2 border-white/10 border-t-white/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/70 text-lg">🚗</span>
        </div>
      </div>
      <span className="ml-5 text-white/60 font-medium">
        Loading vehicles...
      </span>
    </div>
  );

  const Empty = () => (
    <div className="text-center py-20 bg-[#1b1b1b] rounded-xl border border-dashed border-white/15">
      <div className="text-6xl mb-4 opacity-80">🚗</div>
      <h3 className="text-xl font-semibold text-white mb-2">
        No Vehicles Found
      </h3>
      <p className="text-white/50 text-sm">
        This driver has not registered any vehicles yet.
      </p>
    </div>
  );

  const Stats = ({ count }) => (
    <div className="mb-5 flex items-center justify-between">
      <div className="flex items-center gap-3 text-sm">
        <span className="font-medium text-white/70">
          Found {count} vehicle{count !== 1 ? "s" : ""}
        </span>
        <span className="w-1 h-1 rounded-full bg-white/25" />
        <span className="text-white/40">Click any card for details</span>
      </div>
    </div>
  );

  const DetailModal = ({ vehicle, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-[#141414] border border-white/10 rounded-2xl shadow-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-white to-white/70 text-black flex items-center justify-center ring-1 ring-white/10">
              <span className="text-xl">🚗</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white capitalize">
                {vehicle?.vehicle_type}
              </h3>
              <p className="text-xs text-white/50 font-mono">
                {vehicle?.rc_number}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white flex items-center justify-center"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: "RC", ok: !!vehicle?.is_rc_verified },
            { label: "PUC", ok: !!vehicle?.is_puc_verified },
            { label: "INS", ok: !!vehicle?.is_insurance_verified },
          ].map(({ label, ok }) => (
            <div
              key={label}
              className={`p-4 rounded-xl border ${
                ok
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-red-500/10 border-red-500/30"
              }`}
            >
              <div className="text-center">
                <div
                  className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center mb-2 ring-1 ${
                    ok
                      ? "bg-emerald-500/15 text-emerald-400 ring-emerald-500/40"
                      : "bg-red-500/15 text-red-400 ring-red-500/40"
                  }`}
                >
                  {ok ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>
                <p
                  className={`text-[11px] font-semibold tracking-wide ${
                    ok ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {label} {ok ? "VERIFIED" : "NOT VERIFIED"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#1b1b1b] p-4 rounded-xl border border-white/10">
            <p className="text-[10px] font-semibold text-white/40 uppercase mb-2">
              Vehicle Type
            </p>
            <p className="text-sm text-white/85 font-medium capitalize">
              {vehicle?.vehicle_type || "—"}
            </p>
          </div>
          <div className="bg-[#1b1b1b] p-4 rounded-xl border border-white/10">
            <p className="text-[10px] font-semibold text-white/40 uppercase mb-2">
              RC Number
            </p>
            <p className="text-sm text-white/85 font-medium">
              {vehicle?.rc_number || "—"}
            </p>
          </div>
          <div className="bg-[#1b1b1b] p-4 rounded-xl border border-white/10">
            <p className="text-[10px] font-semibold text-white/40 uppercase mb-2">
              PUC Number
            </p>
            <p className="text-sm text-white/85 font-medium">
              {vehicle?.puc_number || "—"}
            </p>
          </div>
          <div className="bg-[#1b1b1b] p-4 rounded-xl border border-white/10">
            <p className="text-[10px] font-semibold text-white/40 uppercase mb-2">
              PUC Expiry
            </p>
            <p className="text-sm text-white/85 font-medium">
              {formatDateSafe(vehicle?.puc_expiry)}
            </p>
          </div>
          <div className="bg-[#1b1b1b] p-4 rounded-xl border border-white/10">
            <p className="text-[10px] font-semibold text-white/40 uppercase mb-2">
              Insurance Expiry
            </p>
            <p className="text-sm text-white/85 font-medium">
              {formatDateSafe(vehicle?.insurance_expiry)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className=" p-8">
        <Header />

        {loading ? (
          <Loading />
        ) : vehicles.length === 0 ? (
          <Empty />
        ) : (
          <>
            <Stats count={vehicles.length} />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onClick={setSelectedVehicle}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {selectedVehicle && (
        <DetailModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </>
  );
};

export default VehicleCards;
