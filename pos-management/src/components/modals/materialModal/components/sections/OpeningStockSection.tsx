import React from "react";

interface OpeningStockSectionProps {
  enabledOpeningStock: boolean;
  openingStockQuantity: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isSubmitting: boolean;
}

export const OpeningStockSection: React.FC<OpeningStockSectionProps> = ({
  enabledOpeningStock,
  openingStockQuantity,
  onInputChange,
  isSubmitting,
}) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          name="enabledOpeningStock"
          checked={enabledOpeningStock}
          onChange={onInputChange}
          disabled={isSubmitting}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded disabled:cursor-not-allowed"
        />
        <label className="ml-2 text-sm text-gray-900">
          Enabled Opening Stock
        </label>
      </div>

      {enabledOpeningStock && (
        <div className="flex-1 max-w-xs">
          <label className="block text-sm text-gray-700">
            Opening Stock Quantity *
          </label>
          <input
            type="number"
            name="openingStockQuantity"
            value={openingStockQuantity}
            onChange={onInputChange}
            placeholder="0"
            min="0"
            disabled={isSubmitting}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            required={enabledOpeningStock}
          />
        </div>
      )}
    </div>
  );
};