import { useState } from "react";
import { toast } from "react-toastify";
import { Plus, Save, X, Edit, Trash2 } from "lucide-react";

const CommissionCard = ({ commissionStructure, setCommissionStructure, commissionService }) => {
  const [editingCommission, setEditingCommission] = useState(null);
  const [newTier, setNewTier] = useState({
    description: "",
    minValue: "",
    maxValue: "",
    commissionPercentage: "",
  });

  const inputBase =
    "h-11 w-full rounded-lg bg-[#1b1b1b] border border-white/10 text-sm px-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/15";

  const handleCommissionEdit = (commission) => {
    setEditingCommission({ ...commission });
  };

  const handleCommissionSave = async () => {
    const payload = {
      description: editingCommission.description,
      minValue: parseFloat(editingCommission.min_value),
      maxValue: parseFloat(editingCommission.max_value),
      commissionPercentage: parseFloat(editingCommission.commission_percentage),
    };

    try {
      const updatedTier = await commissionService.updateCommission(editingCommission.id, payload);

      setCommissionStructure((prev) =>
        prev.map((comm) =>
          comm.id === updatedTier.id ? updatedTier : comm
        )
      );
      setEditingCommission(null);
      toast.success("Commission updated", { theme: "dark" });
    } catch (error) {
      console.error("Error updating commission:", error);
      toast.error(error.message || "Failed to update commission", { theme: "dark" });
    }
  };
  
  const handleCommissionDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tier?")) return;
    
    try {
      await commissionService.deleteCommission(id);
      setCommissionStructure((prev) => prev.filter((comm) => comm.id !== id));
      toast.success("Commission tier deleted", { theme: "dark" });
    } catch (error) {
      console.error("Error deleting commission:", error);
      toast.error(error.message || "Failed to delete commission", { theme: "dark" });
    }
  };

  const handleCommissionAdd = async (e) => {
    e.preventDefault();
    const payload = {
      description: newTier.description,
      minValue: parseFloat(newTier.minValue),
      maxValue: parseFloat(newTier.maxValue),
      commissionPercentage: parseFloat(newTier.commissionPercentage),
    };

    try {
      const addedTier = await commissionService.addCommission(payload);
      setCommissionStructure((prev) => [...prev, addedTier]);
      setNewTier({ description: "", minValue: "", maxValue: "", commissionPercentage: "" });
      toast.success("New commission tier added", { theme: "dark" });
    } catch (error) {
      console.error("Error adding commission:", error);
      toast.error(error.message || "Failed to add commission", { theme: "dark" });
    }
  };

  const handleCommissionCancel = () => {
    setEditingCommission(null);
  };

  const calculateCommission = (fareAmount) => {
    for (let tier of commissionStructure) {
      if (fareAmount >= tier.minValue && fareAmount <= tier.maxValue) {
        return {
          percentage: tier.commissionPercentage,
          amount: (fareAmount * tier.commissionPercentage) / 100,
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
                      value={editingCommission.minValue}
                      onChange={(e) =>
                        setEditingCommission((prev) => ({
                          ...prev,
                          min_value: e.target.value,
                        }))
                      }
                      className={inputBase}
                    />
                  ) : (
                    <span className="text-white font-medium">
                      ₹{commission.minValue.toFixed(2)}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 align-middle">
                  {editingCommission?.id === commission.id ? (
                    <input
                      type="number"
                      value={editingCommission.maxValue}
                      onChange={(e) =>
                        setEditingCommission((prev) => ({
                          ...prev,
                          max_value: e.target.value,
                        }))
                      }
                      className={inputBase}
                    />
                  ) : (
                    <span className="text-white font-medium">
                      ₹{commission.maxValue.toFixed(2)}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 align-middle">
                  {editingCommission?.id === commission.id ? (
                    <input
                      type="number"
                      step="0.1"
                      value={editingCommission.commissionPercentage}
                      onChange={(e) =>
                        setEditingCommission((prev) => ({
                          ...prev,
                          commission_percentage: e.target.value,
                        }))
                      }
                      className={inputBase}
                    />
                  ) : (
                    <span className="text-white font-medium">
                      {commission.commissionPercentage}%
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 align-middle">
                  {editingCommission?.id === commission.id ? (
                    <div className="flex gap-2">
                      <button onClick={handleCommissionSave} className="h-9 w-9 flex items-center justify-center rounded-lg bg-white text-black hover:shadow-lg transition">
                        <Save size={16} />
                      </button>
                      <button onClick={handleCommissionCancel} className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/10 text-white border border-white/15 hover:bg-white/15 transition">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => handleCommissionEdit(commission)} className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/10 text-white border border-white/15 hover:bg-white/15 transition">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleCommissionDelete(commission.id)} className="h-9 w-9 flex items-center justify-center rounded-lg bg-red-900/40 text-red-300 border border-red-700 hover:bg-red-900/60 transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            
            <tr className="border-t-2 border-white/10 bg-[#1f1f1f]">
              <td className="px-5 py-3">
                <input type="text" placeholder="New Tier (e.g., 0-500)" value={newTier.description} onChange={(e) => setNewTier(prev => ({...prev, description: e.target.value}))} className={inputBase} />
              </td>
              <td className="px-5 py-3">
                <input type="number" placeholder="0" value={newTier.minValue} onChange={(e) => setNewTier(prev => ({...prev, minValue: e.target.value}))} className={inputBase} />
              </td>
              <td className="px-5 py-3">
                <input type="number" placeholder="500" value={newTier.maxValue} onChange={(e) => setNewTier(prev => ({...prev, maxValue: e.target.value}))} className={inputBase} />
              </td>
              <td className="px-5 py-3">
                <input type="number" step="0.1" placeholder="15.0" value={newTier.commissionPercentage} onChange={(e) => setNewTier(prev => ({...prev, commissionPercentage: e.target.value}))} className={inputBase} />
              </td>
              <td className="px-5 py-3">
                <button onClick={handleCommissionAdd} className="h-9 w-full px-4 rounded-lg bg-emerald-500 text-black text-xs font-semibold hover:bg-emerald-400 transition flex items-center justify-center gap-2">
                  <Plus size={16} /> Add Tier
                </button>
              </td>
            </tr>
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
