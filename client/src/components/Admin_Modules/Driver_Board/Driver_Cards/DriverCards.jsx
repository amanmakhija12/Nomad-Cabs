import { useEffect, useState } from "react";
import { toast, Bounce } from "react-toastify";
import DriverDetailsView from "./DriverDetailsView";
import VehicleView from "./VehicleView";
import { userService, driverService } from "../../../../services/adminService";

const DriverCards = ({ Driver, onClose, onRefresh }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showVehicles, setShowVehicles] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    phone_number: "",
    city: "",
    state: "",
    role_description: "",
    status: "active",
    created_at: "",
    updated_at: "",
  });

  useEffect(() => {
    if (!Driver?.user_id) return;
    setLoading(true);
    
    userService
      .getUserById(Driver.user_id)
      .then((u) => {
        setUser(u);
        setFormData({
          phone_number: u.phoneNumber || "",
          city: u.city || "",
          state: u.state || "",
          role_description: u.roleDescription || "",
          status: u.status?.toLowerCase() || "active",
          created_at: u.createdAt || "",
          updated_at: u.updatedAt || "",
        });
      })
      .catch((err) => {
        console.error("Error loading user:", err);
        toast.error("Error loading user", { theme: "dark", transition: Bounce });
      })
      .finally(() => setLoading(false));
  }, [Driver?.user_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!user || !Driver?.user_id) return;
    try {
      // Transform to backend format
      const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: formData.phone_number,
        city: formData.city,
        state: formData.state,
        role: user.role,
      };

      await userService.updateUser(Driver.user_id, payload);
      
      // Update status if changed
      if (formData.status !== user.status?.toLowerCase()) {
        await userService.updateUserStatus(Driver.user_id, formData.status.toUpperCase());
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
      await userService.deleteUser(Driver.user_id);
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

  // Transform user data to match frontend format
  const transformedUser = user ? {
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    role: user.role?.toLowerCase(),
    is_email_verified: user.isEmailVerified,
    is_phone_verified: false, // Backend doesn't have this
  } : null;

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
            user={transformedUser}
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
            ownerId={Driver.id}
            onBack={() => setShowVehicles(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DriverCards;