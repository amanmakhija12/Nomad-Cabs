import { X, UploadCloud, Car } from "lucide-react";
import { useState } from "react";
import { getVehicleIcon } from "./Vehicles";

const AddVehicleModal = ({ onClose, onSubmit, ownerId }) => {
	const [formData, setFormData] = useState({
		owner_id: ownerId,
		vehicle_type: "",
		rc_number: "",
		puc_number: "",
		insurance_policy_number: "",
		puc_expiry: "",
		insurance_expiry: "",
		rc_document: null,
		puc_document: null,
		insurance_document: null,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e) => {
		const { name, files } = e.target;
		setFormData((prev) => ({ ...prev, [name]: files[0] }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
	};

	const Icon = getVehicleIcon(formData.vehicle_type);

	return (
		<div
			className="fixed inset-0 z-50 bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-md flex items-center justify-center p-4"
			onClick={onClose}
		>
			<div
				className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar relative"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 relative">
					<button
						type="button"
						aria-label="Close"
						onClick={onClose}
						className="absolute top-4 right-4 z-50 inline-flex items-center justify-center
                            h-12 w-12 rounded-full cursor-pointer bg-white shadow-lg border border-gray-200
                            text-gray-600 hover:text-red-500 hover:bg-red-50 hover:border-red-200
                            ring-2 ring-transparent ring-offset-white
                            transition-all duration-200 ease-out transform hover:scale-110"
					>
						<X />
					</button>

					<div className="text-center mb-8">
						<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
							<Icon size={32} className="text-white" />
						</div>
						<h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
							Add New Vehicle
						</h2>
						<p className="text-gray-600 mt-2 text-lg">
							Fill in the details below
						</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
							<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600">
								Vehicle Type
							</label>
							<select
								className="w-full p-3 text-base font-medium text-black bg-white border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
								required
								name="vehicle_type"
								defaultValue={formData.vehicle_type}
								onChange={handleChange}
							>
								<option value="" disabled selected>
									Select Vehicle Type
								</option>
								<option value="auto">Auto</option>
								<option value="bike">Bike</option>
								<option value="sedan">Sedan</option>
								<option value="suv">SUV</option>
							</select>
						</div>
						{[
							{ label: "RC Number", name: "rc_number" },
							{ label: "PUC Number", name: "puc_number" },
							{
								label: "Insurance Policy Number",
								name: "insurance_policy_number",
							},
							{ label: "PUC Expiry", name: "puc_expiry", type: "date" },
							{
								label: "Insurance Expiry",
								name: "insurance_expiry",
								type: "date",
							},
						].map(({ label, name, type = "text" }) => (
							<div
								key={name}
								className="group bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300"
							>
								<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600">
									{label}
								</label>
								<input
									type={type}
									name={name}
									value={formData[name]}
									onChange={handleChange}
									required
									className="w-full p-3 text-base font-medium text-black bg-white border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
								/>
							</div>
						))}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{[
							{ label: "Upload RC Document", name: "rc_document" },
							{ label: "Upload PUC Document", name: "puc_document" },
							{
								label: "Upload Insurance Document",
								name: "insurance_document",
							},
						].map(({ label, name }) => (
							<div
								key={name}
								className="relative group bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200 hover:border-blue-300"
							>
								<label className="block text-xs font-semibold text-blue-600 uppercase tracking-wide mb-10 group-hover:text-blue-700 text-center">
									{label}
								</label>
								<input
									type="file"
									name={name}
									accept=".pdf,.jpg,.jpeg,.png"
									onChange={handleFileChange}
									className="hidden"
								/>
								<button
									type="button"
									onClick={() =>
										document.querySelector(`input[name="${name}"]`).click()
									}
									className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all cursor-pointer absolute bottom-4 left-1/2 transform -translate-x-1/2"
								>
									Upload File
								</button>
							</div>
						))}
					</div>

					<div className="flex justify-end pt-4">
						<button
							type="submit"
							className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all"
						>
							<UploadCloud size={18} />
							<span>Add Vehicle</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddVehicleModal;
