import React, { useState } from "react";
import { MoreVertical } from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../../../store/hooks";
import {
  deleteProduct,
  fetchProducts,
} from "../../../../store/slices/productsSlice";
import { ProductActions } from "./ProductActions";
import type { Product } from "../../../../store/slices/productsSlice";

interface ProductTableProps {
  products: Product[];
  onEditItem: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEditItem,
}) => {
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const handleActionClick = (itemId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveActionMenu(activeActionMenu === itemId ? null : itemId);
  };

  const handleEditItem = (item: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    onEditItem(item);
    setActiveActionMenu(null);
  };

  const handleDeleteItem = async (item: Product, event: React.MouseEvent) => {
    event.stopPropagation();

    toast.info(
      <div className="text-center">
        <p className="font-semibold text-gray-800">Delete "{item.itemName}"?</p>
        <p className="text-sm text-gray-600 mt-1">
          This action cannot be undone.
        </p>
        <div className="flex justify-center space-x-2 mt-3">
          <button
            onClick={async () => {
              toast.dismiss();
              const loadingToast = toast.loading("Deleting product...");

              try {
                const result = await dispatch(deleteProduct(item.id));

                if (result.meta.requestStatus === "fulfilled") {
                  toast.update(loadingToast, {
                    render: `"${item.itemName}" deleted successfully!`,
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                  });
                  dispatch(fetchProducts());
                } else {
                  const errorMessage =
                    (result.payload as string) || "Delete failed";
                  toast.update(loadingToast, {
                    render: `Delete failed: ${errorMessage}`,
                    type: "error",
                    isLoading: false,
                    autoClose: 5000,
                  });
                }
              } catch (error: any) {
                console.error("Unexpected error:", error);
                toast.update(loadingToast, {
                  render: "Unexpected error during delete",
                  type: "error",
                  isLoading: false,
                  autoClose: 5000,
                });
              }
            }}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
      }
    );

    setActiveActionMenu(null);
  };

  const handleViewDetails = (item: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log("Product details:", item);
    setActiveActionMenu(null);
  };

  const closeActionMenu = () => setActiveActionMenu(null);

  // Empty state
  if (products.length === 0) {
    return (
      <div className="text-center py-8 border border-gray-300">
        <div className="text-gray-400 text-4xl mb-4">📦</div>
        <div className="text-gray-500 font-medium text-lg">
          No products found
        </div>
        <div className="text-gray-400 text-sm mt-1">
          Try a different search term or add new products
        </div>
      </div>
    );
  }

  return (
    <div onClick={closeActionMenu}>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 border border-gray-300 text-left font-medium text-gray-500 uppercase tracking-wider w-1/12">
              TYPE
            </th>
            <th className="px-4 py-2 border border-gray-300 text-left font-medium text-gray-500 uppercase tracking-wider w-5/12">
              ITEM NAME
            </th>
            <th className="px-4 py-2 border border-gray-300 text-left font-medium text-gray-500 uppercase tracking-wider w-2/12">
              PRICE
            </th>
            <th className="px-4 py-2 border border-gray-300 text-left font-medium text-gray-500 uppercase tracking-wider w-1/12">
              STOCK
            </th>
            <th className="px-4 py-2 border border-gray-300 text-left font-medium text-gray-500 uppercase tracking-wider w-1/12">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody className="bg-white text-sm">
          {products.map((item) => (
            <tr key={item.id} className="hover:bg-blue-50 transition">
              <td className="px-4 py-2 border border-gray-300 font-medium text-gray-900">
                G
              </td>
              <td className="px-4 py-2 border border-gray-300">
                <div className="flex items-center">
                  <span className="text-gray-600">{item.itemName}</span>
                  {item.lowStock && (
                    <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Low Stock
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-2 border border-gray-300 font-semibold text-gray-800">
                ${item.price.toFixed(3)}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-gray-600">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    item.stock <= 5
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {item.stock}
                </span>
              </td>
              <td className="px-4 py-2 border border-gray-300 text-right relative">
                <button
                  className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"
                  onClick={(e) => handleActionClick(item.id, e)}
                >
                  <MoreVertical size={18} />
                </button>

                {/* Action Menu */}
                {activeActionMenu === item.id && (
                  <ProductActions
                    product={item}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
