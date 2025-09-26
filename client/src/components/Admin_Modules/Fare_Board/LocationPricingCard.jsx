import { useState } from "react";
import { toast, Bounce } from "react-toastify";

const LocationPricingCard = ({ locationPricing, setLocationPricing }) => {
  const [editingLocation, setEditingLocation] = useState(null);
  const [newLocation, setNewLocation] = useState({
    city: "",
    state: "",
    price_per_km: "",
  });

  const inputBase =
    "h-11 w-full rounded-lg bg-[#1b1b1b] border border-white/10 text-sm px-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/15";

  const handleLocationEdit = (location) => {
    setEditingLocation({ ...location });
  };

  const handleLocationSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:3008/location_pricing/${editingLocation.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...editingLocation,
            city: editingLocation.city.toLowerCase(),
            state: editingLocation.state.toLowerCase(),
            updated_at: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        setLocationPricing((prev) =>
          prev.map((loc) =>
            loc.id === editingLocation.id
              ? {
                  ...editingLocation,
                  city: editingLocation.city.toLowerCase(),
                  state: editingLocation.state.toLowerCase(),
                }
              : loc
          )
        );
        setEditingLocation(null);
        toast.success("Location updated", {
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("Failed to update location", {
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const handleLocationCancel = () => {
    setEditingLocation(null);
  };

  const handleLocationDelete = async (id) => {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 z-[9998]";
    overlay.style.pointerEvents = "auto";
    overlay.style.backgroundColor = "transparent";
    document.body.appendChild(overlay);

    const confirmDelete = new Promise((resolve) => {
      toast.warn(
        ({ closeToast }) => (
          <div className="text-white text-sm space-y-5">
            <p className="font-medium text-white/80">Delete this location?</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  closeToast();
                  document.body.removeChild(overlay);
                  resolve(true);
                }}
                className="h-9 px-5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold tracking-wide"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  closeToast();
                  document.body.removeChild(overlay);
                  resolve(false);
                }}
                className="h-9 px-5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold tracking-wide border border-white/15"
              >
                Cancel
              </button>
            </div>
          </div>
        ),
        {
          position: "top-center",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: false,
          draggable: false,
          theme: "dark",
          transition: Bounce,
          className: "!z-[9999]",
          style: { zIndex: 9999 },
        }
      );
    });

    const shouldDelete = await confirmDelete;
    if (!shouldDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3008/location_pricing/${id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setLocationPricing((prev) => prev.filter((loc) => loc.id !== id));
        toast.success("Location deleted", {
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error("Failed to delete location", {
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const handleAddLocation = async () => {
    if (!newLocation.city || !newLocation.state || !newLocation.price_per_km) {
      toast.error("Fill all fields", {
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3008/location_pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: newLocation.city.toLowerCase(),
          state: newLocation.state.toLowerCase(),
          price_per_km: parseFloat(newLocation.price_per_km),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const newLocationData = await response.json();
        setLocationPricing((prev) => [...prev, newLocationData]);
        setNewLocation({ city: "", state: "", price_per_km: "" });
        toast.success("Location added", {
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Error adding location:", error);
      toast.error("Failed to add location", {
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="bg-[#141414] rounded-2xl border border-white/10 p-8 shadow-lg">
      <h2 className="text-2xl font-semibold tracking-tight text-white mb-8">
        Location Pricing
      </h2>

      <div className="mb-10 bg-[#1b1b1b] border border-white/10 rounded-xl p-6">
        <h3 className="text-sm font-semibold tracking-wide text-white/70 mb-5 uppercase">
          Add New Location
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="City"
            value={newLocation.city}
            onChange={(e) =>
              setNewLocation((prev) => ({ ...prev, city: e.target.value }))
            }
            className={inputBase}
          />
          <input
            type="text"
            placeholder="State"
            value={newLocation.state}
            onChange={(e) =>
              setNewLocation((prev) => ({ ...prev, state: e.target.value }))
            }
            className={inputBase}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price per KM"
            value={newLocation.price_per_km}
            onChange={(e) =>
              setNewLocation((prev) => ({
                ...prev,
                price_per_km: e.target.value,
              }))
            }
            className={inputBase}
          />
          <button
            onClick={handleAddLocation}
            className="h-11 rounded-lg bg-white text-black text-sm font-medium px-6 hover:shadow-lg transition"
          >
            Add Location
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1f1f1f] text-white/70 text-xs uppercase tracking-wide">
              <th className="text-left font-semibold px-5 py-4">City</th>
              <th className="text-left font-semibold px-5 py-4">State</th>
              <th className="text-left font-semibold px-5 py-4">Price / KM (₹)</th>
              <th className="text-left font-semibold px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {locationPricing.map((location) => (
              <tr
                key={location.id}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                <td className="px-5 py-3 align-middle">
                  {editingLocation?.id === location.id ? (
                    <input
                      type="text"
                      value={editingLocation.city}
                      onChange={(e) =>
                        setEditingLocation((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      className={inputBase}
                    />
                  ) : (
                    <span className="capitalize text-white/85 font-medium">
                      {location.city}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 align-middle">
                  {editingLocation?.id === location.id ? (
                    <input
                      type="text"
                      value={editingLocation.state}
                      onChange={(e) =>
                        setEditingLocation((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      className={inputBase}
                    />
                  ) : (
                    <span className="capitalize text-white/85 font-medium">
                      {location.state}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 align-middle">
                  {editingLocation?.id === location.id ? (
                    <input
                      type="number"
                      step="0.01"
                      value={editingLocation.price_per_km}
                      onChange={(e) =>
                        setEditingLocation((prev) => ({
                          ...prev,
                          price_per_km: parseFloat(e.target.value),
                        }))
                      }
                      className={inputBase}
                    />
                  ) : (
                    <span className="text-white font-medium">
                      ₹{location.price_per_km}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 align-middle">
                  {editingLocation?.id === location.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleLocationSave}
                        className="h-9 px-4 rounded-lg bg-white text-black text-xs font-semibold hover:shadow-lg transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleLocationCancel}
                        className="h-9 px-4 rounded-lg bg-white/10 text-white text-xs font-semibold border border-white/15 hover:bg-white/15 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLocationEdit(location)}
                        className="h-9 px-4 rounded-lg bg-white/10 text-white text-xs font-semibold border border-white/15 hover:bg-white/15 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleLocationDelete(location.id)}
                        className="h-9 px-4 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationPricingCard;
