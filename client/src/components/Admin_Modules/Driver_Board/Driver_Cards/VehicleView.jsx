import React from "react";
import VehicleCards from "../Vehicle_Cards/VehicleCards";

export default function VehicleView({ ownerId, onBack }) {
  return (
    <div className="p-8">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Vehicles</h3>
        <button
          onClick={onBack}
          className="h-9 px-4 rounded-lg bg-white/10 text-white border border-white/15 hover:bg-white/15 text-sm"
        >
          Back to Details
        </button>
      </div>
      <VehicleCards ownerId={ownerId} onClose={onBack} />
    </div>
  );
}
