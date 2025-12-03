import React, { useState } from "react";
import { useAppDispatch } from "../../../../store/hooks";
import { updateProduct, fetchProducts } from "../../../../store/slices/productsSlice";
import type { Product } from "../../../../store/slices/productsSlice";

interface EditProductFormProps {
  product: Product;
  onCancel: () => void;
  onSuccess: () => void;
}

export const EditProductForm: React.FC<EditProductFormProps> = ({
  product,
  onCancel,
  onSuccess,
}) => {
  const [editFormData, setEditFormData] = useState({
    itemName: product.itemName,
    price: product.price,
    category: product.category ?? "",
    stock: product.stock,
    lowStock: product.lowStock,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        itemName: editFormData.itemName,
        retailRate: editFormData.price,
        category: editFormData.category,
        stock: editFormData.stock,
        lowStock: editFormData.stock <= 5,
      };

      await dispatch(
        updateProduct({
          id: product.id,
          payload: updateData,
        })
      ).unwrap();

      // Auto-refresh after successful update
      await dispatch(fetchProducts());
      onSuccess();
    } catch (error) {
      console.error("Failed to update product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (value: string) => {
    const stock = parseInt(value) || 0;
    setEditFormData((prev) => ({
      ...prev,
      stock: stock,
      lowStock: stock <= 5,
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Edit: {product.itemName}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={editFormData.itemName}
              onChange={(e) =>
                setEditFormData((prev) => ({
                  ...prev,
                  itemName: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <input
              type="number"
              step="0.001"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={editFormData.price}
              onChange={(e) =>
                setEditFormData((prev) => ({
                  ...prev,
                  price: parseFloat(e.target.value),
                }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={editFormData.category}
              onChange={(e) =>
                setEditFormData((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity *
            </label>
            <input
              type="number"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={editFormData.stock}
              onChange={(e) => handleStockChange(e.target.value)}
            />
            {editFormData.stock <= 5 && (
              <p className="text-xs text-red-600 mt-1">
                Low stock warning (5 or less)
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};