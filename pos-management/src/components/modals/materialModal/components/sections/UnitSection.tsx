import React from "react";
import { ChevronDown } from "lucide-react";

interface UnitSectionProps {
  unitPrimary: string;
  unitSecondary: string;
  conversionFactor: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isSubmitting: boolean;
}

export const UnitSection: React.FC<UnitSectionProps> = ({
  unitPrimary,
  unitSecondary,
  conversionFactor,
  onInputChange,
  isSubmitting,
}) => {
  const unitOptions = ["PCS", "KG", "LTR", "MTR"];

  return (
    <div className="flex items-end space-x-4">
      <div className="grid grid-cols-3 gap-4 w-full">
        <div>
          <label className="block text-sm text-gray-700">
            Unit Primary *
          </label>
          <div className="mt-1 relative">
            <select
              name="unitPrimary"
              value={unitPrimary}
              onChange={onInputChange}
              disabled={isSubmitting}
              className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            >
              <option value="">Select Unit</option>
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700">
            Secondary
          </label>
          <div className="mt-1 relative">
            <select
              name="unitSecondary"
              value={unitSecondary}
              onChange={onInputChange}
              disabled={isSubmitting}
              className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select unit</option>
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700">CF *</label>
          <input
            type="number"
            name="conversionFactor"
            value={conversionFactor}
            onChange={onInputChange}
            placeholder="1"
            disabled={isSubmitting}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
          />
        </div>
      </div>
    </div>
  );
};