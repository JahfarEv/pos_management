import React from "react";
import { ChevronDown } from "lucide-react";

interface TaxBatchSectionProps {
  taxPercentage: string;
  batchEnabled: boolean;
  serialNumberEnabled: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isSubmitting: boolean;
}

export const TaxBatchSection: React.FC<TaxBatchSectionProps> = ({
  taxPercentage,
  batchEnabled,
  serialNumberEnabled,
  onInputChange,
  isSubmitting,
}) => {
  return (
    <div className="flex items-end justify-between w-full">
      <div className="grid grid-cols-3 gap-4 flex-1">
        <div>
          <label className="block text-sm text-gray-700">Tax %</label>
          <div className="mt-1 relative">
            <select
              name="taxPercentage"
              value={taxPercentage}
              onChange={onInputChange}
              disabled={isSubmitting}
              className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select tax rate</option>
              <option value="0">0%</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700">Batch</label>
          <div className="mt-2 flex items-center">
            <input
              type="checkbox"
              name="batchEnabled"
              checked={batchEnabled}
              onChange={onInputChange}
              disabled={isSubmitting}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded disabled:cursor-not-allowed"
            />
            <label className="ml-2 text-sm text-gray-900">
              Enabled
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700">
            Serial Number
          </label>
          <div className="mt-2 flex items-center">
            <input
              type="checkbox"
              name="serialNumberEnabled"
              checked={serialNumberEnabled}
              onChange={onInputChange}
              disabled={isSubmitting}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded disabled:cursor-not-allowed"
            />
            <label className="ml-2 text-sm text-gray-900">
              Enabled
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};