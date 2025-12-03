import React from "react";

interface ItemNameSectionProps {
  itemName: string;
  itemHsn: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isSubmitting: boolean;
}

export const ItemNameSection: React.FC<ItemNameSectionProps> = ({
  itemName,
  itemHsn,
  onInputChange,
  isSubmitting,
}) => {
  return (
    <div className="flex space-x-6 col-span-1">
      <div className="flex-1">
        <label className="block text-sm text-gray-700">
          Item Name *
        </label>
        <input
          type="text"
          name="itemName"
          value={itemName}
          onChange={onInputChange}
          placeholder="Enter item name"
          disabled={isSubmitting}
          className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm text-gray-700">Item HSN</label>
        <input
          type="text"
          name="itemHsn"
          value={itemHsn}
          onChange={onInputChange}
          placeholder="Enter item HSN"
          disabled={isSubmitting}
          className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
};