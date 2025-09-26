const btnBase =
  "h-11 px-6 rounded-xl text-sm font-medium flex items-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed";

function DriverActionButtons(props) {
  const {
    isEditing,
    isDeleting,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    onViewVehicles,
  } = props;
  return (
    <div className="flex justify-center flex-wrap gap-3 bg-[#141414] p-6 rounded-2xl border border-white/10">
      {isEditing ? (
        <>
          <button
            onClick={onSave}
            disabled={isDeleting}
            className={`${btnBase} bg-white text-black hover:shadow-lg`}
          >
            Save Changes
          </button>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className={`${btnBase} bg-white/10 text-white border border-white/15 hover:bg-white/15`}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onEdit}
            disabled={isDeleting}
            className={`${btnBase} bg-white text-black hover:shadow-lg`}
          >
            Edit Driver
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className={`${btnBase} bg-red-600 text-white hover:bg-red-700`}
          >
            {isDeleting ? "Deleting..." : "Delete Driver"}
          </button>
          <button
            onClick={onViewVehicles}
            disabled={isDeleting}
            className={`${btnBase} bg-white/10 text-white border border-white/15 hover:bg-white/15`}
          >
            View Vehicles
          </button>
        </>
      )}
    </div>
  );
}

export default DriverActionButtons;
