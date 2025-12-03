import React from "react";
import { ChevronDown } from "lucide-react";

interface CategorySectionProps {
  category: string;
  categoryOptions: string[];
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isSubmitting: boolean;
  openAddCategoryModal: () => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  categoryOptions,
  onCategoryChange,
  isSubmitting,
}) => {
  return (
    <div>
      <label className="block text-sm text-gray-700">
        Item group selection *
      </label>
      <div className="mt-1 relative">
        <select
          name="category"
          value={category}
          onChange={onCategoryChange}
          disabled={isSubmitting}
          className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select category</option>
          <option value="__add_category__" className="text-blue-600 font-semibold">
            ➕ Add Category
          </option>
          {categoryOptions
            .filter((c) => c !== "All")
            .map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
        />
      </div>
    </div>
  );
};