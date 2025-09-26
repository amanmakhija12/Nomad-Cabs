import { useEffect, useState } from "react";
import { toast, Bounce } from "react-toastify";
import { toMySQLFromDate } from "../../../../utils/DateUtil";
import VehicleCards from "../Vehicle_Cards/VehicleCards";
import {
  DriverInfoCard,
  DriverHeader,
  DriverActionButtons,
  createDriverFieldsConfig,
} from "./index";

const DriverCards = ({ Driver, onClose, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);
  const [showVehicles, setShowVehicles] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [driverMeta, setDriverMeta] = useState({
    id: "",
    user_id: "",
    aadhar_card: "",
    pan_card: "",
    driver_license: "",
    driver_license_expiry: "",
    is_aadhaar_verified: false,
    is_pan_verified: false,
    is_driver_license_verified: false,
    created_at: "",
    updated_at: "",
  });

  const [formData, setFormData] = useState({
    phone_number: "",
    city: "",
    state: "",
    role_description: "",
    status: "active",
    created_at: "",
    updated_at: "",
  });

  const s = (v) => (v == null ? "" : String(v));

  useEffect(() => {
    if (!Driver) return;

    setDriverMeta({
      id: s(Driver.id),
      user_id: s(Driver.user_id),
      aadhar_card: s(Driver.aadhar_card),
      pan_card: s(Driver.pan_card),
      driver_license: s(Driver.driver_license),
      driver_license_expiry: s(Driver.driver_license_expiry),
      is_aadhaar_verified: !!Driver.is_aadhaar_verified,
      is_pan_verified: !!Driver.is_pan_verified,
      is_driver_license_verified: !!Driver.is_driver_license_verified,
      created_at: s(Driver.created_at),
      updated_at: s(Driver.updated_at),
    });

    if (Driver.user_id) {
      setUserLoading(true);
      setUserError(null);

      fetch(`http://localhost:3006/users/${Driver.user_id}`)
        .then(async (res) => {
          if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`);
          return res.json();
        })
        .then((userData) => {
          setUser(userData);
          setFormData({
            phone_number: s(userData.phone_number),
            city: s(userData.city),
            state: s(userData.state),
            role_description: s(userData.role_description),
            status: s(userData.status) || "active",
            created_at: s(userData.created_at),
            updated_at: s(userData.updated_at),
          });
        })
        .catch((err) => setUserError(err.message))
        .finally(() => setUserLoading(false));
    }
  }, [Driver]);

  if (!Driver) return null;

  const stop = (e) => e.stopPropagation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!user || !Driver?.user_id) return;

    try {
      const updatedAtMySQL = toMySQLFromDate(new Date(), {
        asUTC: true,
        withMs: false,
      });

      const payload = {
        ...user,
        phone_number: formData.phone_number,
        city: formData.city,
        state: formData.state,
        role_description: formData.role_description,
        status: formData.status,
        created_at: formData.created_at,
        updated_at: updatedAtMySQL,
      };

      const res = await fetch(`http://localhost:3006/users/${Driver.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        toast.error("Failed to update user", {
          theme: "dark",
          transition: Bounce,
        });
        return;
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      setFormData((prev) => ({ ...prev, updated_at: updatedAtMySQL }));
      setIsEditing(false);

      toast.success("Driver updated", {
        theme: "dark",
        transition: Bounce,
      });

      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating driver", {
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    const confirmDelete = new Promise((resolve) => {
      toast.warn(
        ({ closeToast }) => (
          <div className="text-white text-sm space-y-5">
            <p className="font-medium text-white/80">Delete this driver?</p>
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
                Cancel
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
          transition: Bounce,
        }
      );
    });

    const shouldDelete = await confirmDelete;
    setIsDeleting(false);

    if (!shouldDelete) return;

    try {
      const res = await fetch(`http://localhost:3006/drivers/${Driver.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Failed to delete driver", {
          theme: "dark",
          transition: Bounce,
        });
        return;
      }

      toast.success("Driver deleted", {
        theme: "dark",
        transition: Bounce,
      });

      if (onRefresh) onRefresh();
      onClose();
    } catch (error) {
      console.error("Error deleting driver:", error);
      toast.error("Error deleting driver", {
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={isDeleting ? undefined : onClose}
    >
      <div
        className="bg-[#141414] rounded-2xl shadow-2xl border border-white/10 w-full max-w-4xl max-height-[90vh] max-h-[90vh] overflow-y-auto no-scrollbar relative"
        onClick={stop}
      >
        <div className="p-8 bg-gradient-to-b from-[#181818] via-[#151515] to-[#141414] rounded-t-2xl border-b border-white/10">
          {!showVehicles && (
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              disabled={isDeleting}
              className={`absolute top-5 right-5 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/15 transition ${
                {
                  true: "opacity-50 cursor-not-allowed",
                }[isDeleting] || ""
              }`}
            >
              <span className="text-sm font-medium">X</span>
            </button>
          )}

          <div className="relative h-full">
            <div className={showVehicles ? "hidden" : "block"}>
              <DriverHeader
                driver={Driver}
                user={user}
                userLoading={userLoading}
                userError={userError}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                {(() => {
                  const fieldsConfig = createDriverFieldsConfig(
                    user,
                    driverMeta,
                    formData
                  );
                  const allFields = [
                    ...fieldsConfig.personalInfo,
                    ...fieldsConfig.kycDocuments,
                    ...fieldsConfig.verificationStatus,
                    ...fieldsConfig.editableFields,
                    ...fieldsConfig.timestamps,
                  ];

                  return allFields.map((field, index) => (
                    <DriverInfoCard
                      key={field.label || index}
                      label={field.label}
                      value={field.value}
                      isEditing={isEditing}
                      name={field.name}
                      type={field.type}
                      options={field.options}
                      onChange={handleInputChange}
                      readOnly={field.readOnly}
                      icon={field.icon}
                      badge={field.badge}
                    />
                  ));
                })()}
              </div>

              <DriverActionButtons
                isEditing={isEditing}
                isDeleting={isDeleting}
                onEdit={() => setIsEditing(true)}
                onSave={handleUpdate}
                onCancel={() => setIsEditing(false)}
                onDelete={handleDelete}
                onViewVehicles={() => setShowVehicles(true)}
              />
            </div>

            {showVehicles && (
              <div className="block">
                <VehicleCards
                  ownerId={driverMeta.id || Driver.id}
                  onClose={() => setShowVehicles(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverCards;
