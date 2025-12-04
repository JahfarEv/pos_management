import React, { useState, useEffect, useRef } from "react";
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
import useProducts from "../../../hooks/useProducts";
import { MinimalPagination } from "./components/Pagination";

export const ItemListingModal: React.FC = () => {
  const {
    isItemListingModalOpen,
    closeItemListingModal,
    openNewMaterialModal,
  } = useModal();
  const dispatch = useAppDispatch();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { products, pagination, loading, reload } = useProducts();
  const [search, setSearch] = useState("");
  const timeoutRef = useRef<number | null>(null);

  const isEditing = Boolean(editingProduct);

  // Initial backend fetch (if needed)
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

  // Initial product list load
  useEffect(() => {
    if (isItemListingModalOpen) {
      reload({ page: 1, limit: 6 });
    }
  }, [isItemListingModalOpen, reload]);

  // Debounced search
  useEffect(() => {
    if (!isItemListingModalOpen) return;

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      reload({
        q: search || undefined,
        page: 1,
        limit: 6,
      });
    }, 500);

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [search, reload, isItemListingModalOpen]);

  if (!isItemListingModalOpen) return null;

  const handleEditCancel = () => {
    setEditingProduct(null);
  };

  const handleBackdropClick = () => {
    if (isEditing) {
      handleEditCancel();
    } else {
      closeItemListingModal();
    }
  };

  const goToPage = (page: number) => {
    reload({
      q: search || undefined,
      page,
      limit: 6,
    });
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
        onClick={handleBackdropClick}
      >
        <div
          className={`
            bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 flex flex-col
            w-full
            ${isEditing ? "max-w-3xl" : "max-w-4xl"}
          `}
          onClick={(e) => e.stopPropagation()}
          style={
            isEditing
              ? {
                  maxHeight: "80vh",
                }
              : {
                  maxHeight: "90vh",
                  height: "67vh",
                }
          }
        >
          {/* Header */}
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

          {/* Body + Footer */}
          <div className="flex-1 flex flex-col overflow-hidden p-0">
            {/* Scrollable content */}
            <div
              className="flex-1 overflow-y-auto p-4 
                        [&::-webkit-scrollbar]:hidden 
                        [-ms-overflow-style:'none'] 
                        [scrollbar-width:'none']"
            >
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
                  products={products}
                  loading={loading}
                  search={search}
                  onSearchChange={setSearch}
                />
              )}
            </div>

            {/* Fixed bottom pagination (list mode only) */}
            {!isEditing && !isLoading && pagination && pagination.pages > 1 && (
              <div className="border-t px-4 py-3 bg-white shrink-0">
                <MinimalPagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={goToPage}
                  loading={loading}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
