import { useState } from "react";
import { toast, Bounce } from "react-toastify";
import DriverDetailsView from "./DriverDetailsView";
import VehicleView from "./VehicleView";
import { userService } from "../../../../services/adminService";

const DriverCards = ({ Driver, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showVehicles, setShowVehicles] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  console.log(Driver);

  const [formData, setFormData] = useState({
    status: Driver?.status.toLowerCase() || "active",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!Driver?.userId) return;
    try {
      
      // Update status if changed
      if (formData.status) {
        await userService.updateUserStatus(Driver.userId, formData.status.toUpperCase());
      }

      setIsEditing(false);
      toast.success("Driver updated", { theme: "dark", transition: Bounce });
      onRefresh && onRefresh();
    } catch (error) {
      console.error(error);
      toast.error("Error updating driver", {
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const confirmDelete = () =>
    new Promise((resolve) => {
      toast.warn(
        ({ closeToast }) => (
          <div className="text-white text-sm space-y-5 text-center">
            <p className="font-medium text-white/80 text-center">
              Delete this driver permanently?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  closeToast();
                  resolve(true);
                }}
                className="h-9 px-5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold tracking-wide"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  closeToast();
                  resolve(false);
                }}
                className="h-9 px-5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold tracking-wide border border-white/15"
              >
                Close
              </button>
            </div>
          </div>
        ),
        {
          position: "top-center",
          autoClose: false,
          theme: "dark",
          closeOnClick: false,
          draggable: false,
          hideProgressBar: true,
          closeButton: false,
          transition: Bounce,
        }
      );
    });

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    const ok = await confirmDelete();
    setIsDeleting(false);
    if (!ok) return;
    
    try {
      // Delete user (which will cascade delete driver)
      await userService.deleteUser(Driver.userId);
      toast.success("Driver deleted", { theme: "dark", transition: Bounce });
      onRefresh && onRefresh();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting driver", {
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  if (!Driver) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={isDeleting ? undefined : onClose}
    >
      <div
        className="bg-[#141414] rounded-2xl shadow-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar relative"
        onClick={(e) => e.stopPropagation()}
      >
        {!showVehicles ? (
          <DriverDetailsView
            Driver={Driver}
            formData={formData}
            isEditing={isEditing}
            loading={loading}
            isDeleting={isDeleting}
            onChange={handleInputChange}
            onSave={handleUpdate}
            onEdit={() => setIsEditing(true)}
            onCancel={() => setIsEditing(false)}
            onDelete={handleDelete}
            onShowVehicles={() => setShowVehicles(true)}
            onClose={onClose}
          />
        ) : (
          <VehicleView
            ownerId={Driver.userId}
            onBack={() => setShowVehicles(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DriverCards;