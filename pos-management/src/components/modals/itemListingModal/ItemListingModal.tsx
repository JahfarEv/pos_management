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
import { Spinner } from "../../../components/common/Spinner";

export const ItemListingModal: React.FC = () => {
  const {
    isItemListingModalOpen,
    closeItemListingModal,
    openNewMaterialModal,
  } = useModal();
  const dispatch = useAppDispatch();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isItemListingModalOpen) {
      setIsLoading(true);
      dispatch(fetchProducts()).finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      });
    }
  }, [isItemListingModalOpen, dispatch]);

  useEffect(() => {
    if (!isItemListingModalOpen) {
      setEditingProduct(null);
      setIsLoading(true);
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
        className="fixed inset-0  bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={closeItemListingModal}
      >
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden border border-gray-200 flex flex-col"
          onClick={(e) => e.stopPropagation()}
          style={{
            maxHeight: "90vh",
            height: "67vh",
          }}
        >
          {/* Modal Header - Fixed height */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-700 px-6 py-4 flex items-center justify-between shrink-0">
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

          {/* Modal Content - Scrollable area with hidden scrollbar */}
          <div className="flex-1 overflow-hidden p-0">
            <div
              className="h-full overflow-y-auto p-4 
                        [&::-webkit-scrollbar]:hidden 
                        [-ms-overflow-style:'none'] 
                        [scrollbar-width:'none']"
            >
              {/* Show loader when modal initially opens */}
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="text-center">
                    <Spinner
                      size={48}
                      color="border-blue-600"
                      borderWidth={4}
                    />
                    <p className="mt-4 text-gray-600 font-medium">
                      Loading materials...
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Please wait while we fetch the product list
                    </p>
                  </div>
                </div>
              ) : editingProduct ? (
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
      </div>
    </>
  );
};
