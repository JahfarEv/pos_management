import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ToastContainer } from "react-toastify";
import { useModal } from "../../../hooks/useModal";
import { useAppDispatch } from "../../../store/hooks";
import {
  fetchProducts,
  type Product,
} from "../../../store/slices/productsSlice";
import { ProductList } from "./components/ProductList";
import { EditProductForm } from "./components/EditProductForm";

export const ItemListingModal: React.FC = () => {
  const {
    isItemListingModalOpen,
    closeItemListingModal,
    openNewMaterialModal,
  } = useModal();
  const dispatch = useAppDispatch();



  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (isItemListingModalOpen) {
      dispatch(fetchProducts());
    }
  }, [isItemListingModalOpen, dispatch]);

  useEffect(() => {
    if (!isItemListingModalOpen) {
      setEditingProduct(null);
    }
  }, [isItemListingModalOpen]);

  if (!isItemListingModalOpen) return null;

  const handleEditCancel = () => {
    setEditingProduct(null);
  };

  return (
    <>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div
        className="fixed inset-0  bg-opacity-50 z-50 flex items-center justify-center"
        onClick={closeItemListingModal}
      >
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-700 px-6 py-5 flex items-center justify-between">
            <h2 className="text-white text-xl font-semibold">
              {editingProduct ? "Edit Product" : "Material List"}
            </h2>
            <button
              onClick={
                editingProduct ? handleEditCancel : closeItemListingModal
              }
              className="text-white hover:text-blue-200 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-4">
            {editingProduct ? (
              <EditProductForm
                product={editingProduct}
                onCancel={handleEditCancel}
                onSuccess={() => setEditingProduct(null)}
              />
            ) : (
              <ProductList
                onAddItem={openNewMaterialModal}
                onEditItem={setEditingProduct}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
