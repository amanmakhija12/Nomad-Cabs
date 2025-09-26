import { useState } from "react";
import { toast, Bounce } from "react-toastify";

const CommissionCard = ({ commissionStructure, setCommissionStructure }) => {
  const [editingCommission, setEditingCommission] = useState(null);

  const inputBase =
    "h-11 w-full rounded-lg bg-[#1b1b1b] border border-white/10 text-sm px-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/15";

  const handleCommissionEdit = (commission) => {
    setEditingCommission({ ...commission });
  };

  const handleCommissionSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:3008/commission_structure/${editingCommission.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...editingCommission,
            updated_at: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        setCommissionStructure((prev) =>
          prev.map((comm) =>
            comm.id === editingCommission.id ? editingCommission : comm
          )
        );
        setEditingCommission(null);
        toast.success("Commission updated", {
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Error updating commission:", error);
      toast.error("Failed to update commission", {
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const handleCommissionCancel = () => {
    setEditingCommission(null);
  };

  const calculateCommission = (fareAmount) => {
    for (let tier of commissionStructure) {
      if (fareAmount >= tier.min_value && fareAmount <= tier.max_value) {
        return {
          percentage: tier.commission_percentage,
          amount: (fareAmount * tier.commission_percentage) / 100,
          tier: tier.description,
        };
      }
    }
    return { percentage: 0, amount: 0, tier: "No applicable tier" };
  };

  return (
    <div className="bg-[#141414] rounded-2xl border border-white/10 p-8 shadow-lg">
      <h2 className="text-2xl font-semibold tracking-tight text-white mb-8">
        Commission Structure
      </h2>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1f1f1f] text-white/70 text-xs uppercase tracking-wide">
              <th className="text-left font-semibold px-5 py-4">
                Range Description
              </th>
              <th className="text-left font-semibold px-5 py-4">
                Min Value (₹)
              </th>
              <th className="text-left font-semibold px-5 py-4">
                Max Value (₹)
              </th>
              <th className="text-left font-semibold px-5 py-4">
                Commission (%)
              </th>
              <th className="text-left font-semibold px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {commissionStructure.map((commission) => (
              <tr
                key={commission.id}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                <td className="px-5 py-3 align-middle">
                  {editingCommission?.id === commission.id ? (
                    <input
                      type="text"
                      value={editingCommission.description}
                      onChange={(e) =>
                        setEditingCommission((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className={inputBase}
                    />
                  ) : (
                    <span className="text-white/85 font-medium">
                      {commission.description}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 align-middle">
                  {editingCommission?.id === commission.id ? (
                    <input
                      type="number"
                      value={editingCommission.min_value}
                      onChange={(e) =>
                        setEditingCommission((prev) => ({
                          ...prev,
                          min_value: parseFloat(e.target.value),
                        }))
                      }
                      className={inputBase}
                    />
                  ) : (
                    <span className="text-white font-medium">
                      ₹{commission.min_value}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 align-middle">
                  {editingCommission?.id === commission.id ? (
                    <input
                      type="number"
                      value={editingCommission.max_value}
                      onChange={(e) =>
                        setEditingCommission((prev) => ({
                          ...prev,
                          max_value: parseFloat(e.target.value),
                        }))
                      }
                      className={inputBase}
                    />
                  ) : (
                    <span className="text-white font-medium">
                      ₹{commission.max_value}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 align-middle">
                  {editingCommission?.id === commission.id ? (
                    <input
                      type="number"
                      step="0.01"
                      value={editingCommission.commission_percentage}
                      onChange={(e) =>
                        setEditingCommission((prev) => ({
                          ...prev,
                          commission_percentage: parseFloat(e.target.value),
                        }))
                      }
                      className={inputBase}
                    />
                  ) : (
                    <span className="text-white font-medium">
                      {commission.commission_percentage}%
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 align-middle">
                  {editingCommission?.id === commission.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCommissionSave}
                        className="h-9 px-4 rounded-lg bg-white text-black text-xs font-semibold hover:shadow-lg transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCommissionCancel}
                        className="h-9 px-4 rounded-lg bg-white/10 text-white text-xs font-semibold border border-white/15 hover:bg-white/15 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCommissionEdit(commission)}
                      className="h-9 px-4 rounded-lg bg-white/10 text-white text-xs font-semibold border border-white/15 hover:bg-white/15 transition"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 bg-[#1b1b1b] border border-white/10 rounded-xl p-6">
        <h3 className="text-sm font-semibold tracking-wide text-white/70 mb-5 uppercase">
          Commission Calculator
        </h3>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-72">
            <label className="text-[11px] font-medium tracking-wide uppercase text-white/40 block mb-2">
              Fare Amount (₹)
            </label>
            <input
              type="number"
              placeholder="Enter fare amount"
              className={inputBase}
              onChange={(e) => {
                const amount = parseFloat(e.target.value);
                const el = document.getElementById("commissionResult");
                if (amount && amount > 0) {
                  const result = calculateCommission(amount);
                  el.innerHTML = `Tier: <strong>${result.tier}</strong><br>Rate: <strong>${result.percentage}%</strong><br>Amount: <strong>₹${result.amount.toFixed(
                    2
                  )}</strong>`;
                } else {
                  el.innerHTML = "";
                }
              }}
            />
          </div>
          <div className="flex-1">
            <div
              id="commissionResult"
              className="text-sm text-white/70 leading-relaxed space-y-1"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionCard;
