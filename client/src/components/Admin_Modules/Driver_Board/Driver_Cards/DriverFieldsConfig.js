import { formatDateSafe } from "../../../../utils/DateUtil";

const createDriverFieldsConfig = (user, driverMeta, formData) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        className:
          "bg-emerald-900/40 text-emerald-300 border-emerald-700",
        text: "ACTIVE",
      },
      suspended: {
        className: "bg-amber-900/40 text-amber-300 border-amber-700",
        text: "SUSPENDED",
      },
      deleted: {
        className: "bg-red-900/40 text-red-300 border-red-700",
        text: "DELETED",
      },
    };
    return (
      statusConfig[status] || {
        className: "bg-[#222] text-white/70 border-white/10",
        text: status?.toUpperCase() || "UNKNOWN",
      }
    );
  };

  const getVerificationBadge = (isVerified) => ({
    className: isVerified
      ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
      : "bg-red-900/40 text-red-300 border-red-700",
    text: isVerified ? "VERIFIED" : "NOT VERIFIED",
  });

  return {
    personalInfo: [
      {
        label: "Email",
        value: user?.email,
        readOnly: true,
      },
      {
        label: "First Name",
        value: user?.first_name,
        readOnly: true,
      },
      {
        label: "Last Name",
        value: user?.last_name,
        readOnly: true,
      },
      {
        label: "Middle Name",
        value: user?.middle_name,
        readOnly: true,
      },
      {
        label: "Role",
        value: user?.role,
        readOnly: true,
        badge: {
          className: "bg-white text-black border-white",
          text: user?.role || "—",
        },
      },
    ],
    kycDocuments: [
      {
        label: "Aadhaar Card",
        value: driverMeta.aadhar_card,
        readOnly: true,
      },
      {
        label: "PAN Card",
        value: driverMeta.pan_card,
        readOnly: true,
      },
      {
        label: "Driver License",
        value: driverMeta.driver_license,
        readOnly: true,
      },
    ],
    verificationStatus: [
      {
        label: "Aadhaar Verified",
        value: driverMeta.is_aadhaar_verified,
        readOnly: true,
        badge: getVerificationBadge(driverMeta.is_aadhaar_verified),
      },
      {
        label: "PAN Verified",
        value: driverMeta.is_pan_verified,
        readOnly: true,
        badge: getVerificationBadge(driverMeta.is_pan_verified),
      },
      {
        label: "License Verified",
        value: driverMeta.is_driver_license_verified,
        readOnly: true,
        badge: getVerificationBadge(driverMeta.is_driver_license_verified),
      },
    ],
    editableFields: [
      {
        label: "Phone Number",
        value: formData.phone_number,
        name: "phone_number",
      },
      {
        label: "City",
        value: formData.city,
        name: "city",
      },
      {
        label: "State",
        value: formData.state,
        name: "state",
      },
      {
        label: "Role Description",
        value: formData.role_description,
        name: "role_description",
      },
      {
        label: "Status",
        value: formData.status,
        name: "status",
        type: "select",
        options: [
          { value: "active", label: "Active" },
          { value: "suspended", label: "Suspended" },
        ],
        badge: getStatusBadge(formData.status),
      },
    ],
    timestamps: [
      {
        label: "Created At",
        value: formatDateSafe(formData.created_at, {
          locale: "en-IN",
          timeZone: "Asia/Kolkata",
          variant: "datetime",
          fallback: "—",
          assumeUTCForMySQL: true,
        }),
        readOnly: true,
      },
      {
        label: "Updated At",
        value: formatDateSafe(formData.updated_at, {
          locale: "en-IN",
          timeZone: "Asia/Kolkata",
          variant: "datetime",
          fallback: "—",
          assumeUTCForMySQL: true,
        }),
        readOnly: true,
      },
    ],
  };
};

export default createDriverFieldsConfig;
