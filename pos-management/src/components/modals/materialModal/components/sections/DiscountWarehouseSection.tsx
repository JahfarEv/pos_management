import React from "react";
import { ChevronDown } from "lucide-react";

interface DiscountWarehouseSectionProps {
  discountAmount: string;
  discountType: string;
  warehouse: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isSubmitting: boolean;
}

export const DiscountWarehouseSection: React.FC<DiscountWarehouseSectionProps> = ({
  discountAmount,
  discountType,
  warehouse,
  onInputChange,
  isSubmitting,
}) => {
  return (
    <div className="flex items-end space-x-4">
      <div className="flex-1">
        <label className="block text-sm text-gray-700">
          Discount Amount
        </label>
        <div className="flex mt-1">
          <input
            type="number"
            name="discountAmount"
            value={discountAmount}
            onChange={onInputChange}
            placeholder="Discount amount"
            disabled={isSubmitting}
            className="flex-1 border border-gray-300 rounded-l-md py-2 px-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <div className="relative w-1/2">
            <select
              name="discountType"
              value={discountType}
              onChange={onInputChange}
              disabled={isSubmitting}
              className="appearance-none w-full border border-gray-300 border-l-0 rounded-r-md py-2 pl-3 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="Percentage">Percentage</option>
              <option value="Fixed">Fixed</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700">Warehouse</label>
        <div className="mt-1 relative">
          <select
            name="warehouse"
            value={warehouse}
            onChange={onInputChange}
            disabled={isSubmitting}
            className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select warehouse</option>
            <option value="Main">Main Warehouse</option>
            <option value="Secondary">Secondary Warehouse</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
};