import React from "react";
import { Edit, Trash2 } from "lucide-react";
import type { Product } from "../../../../store/slices/productsSlice";

interface ProductActionsProps {
  product: Product;
  onViewDetails: (item: Product, event: React.MouseEvent) => void;
  onEdit: (item: Product, event: React.MouseEvent) => void;
  onDelete: (item: Product, event: React.MouseEvent) => void;
}

export const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="absolute right-0  w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-40">
    

      <button
        onClick={(e) => onEdit(product, e)}
        className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
      >
        <Edit size={16} />
        Edit Item
      </button>

      <button
        onClick={(e) => onDelete(product, e)}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
      >
        <Trash2 size={16} />
        Delete Item
      </button>
    </div>
  );
};