import React, { useState } from "react";
import { X } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import useProducts from "../../hooks/useProducts";
import useCategories from "../../hooks/useCategory";
import AddCategoryModal from "./CategoryModal";
import { MaterialForm } from "../modals/materialModal/MaterialForm";
import { MaterialFormFooter } from "../modals/materialModal/MaterialFormFooter";
import type { MaterialFormData } from "../../types/materialTypes";

export const NewMaterialModal: React.FC = () => {
  const [formData, setFormData] = useState<MaterialFormData>({
    itemName: "",
    itemHsn: "",
    itemCode: "",
    barcode: "",
    purchaseRate: "",
    retailRate: "",
    wholesaleRate: "",
    unitPrimary: "",
    unitSecondary: "",
    conversionFactor: "",
    discountAmount: "",
    discountType: "Percentage",
    warehouse: "",
    taxPercentage: "",
    batchEnabled: false,
    serialNumberEnabled: false,
    enabledOpeningStock: false,
    openingStockQuantity: "",
    purchaseTax: "exclude",
    retailTax: "exclude",
    wholesaleTax: "exclude",
    category: "",
    itemImage: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    isNewMaterialModalOpen,
    closeNewMaterialModal,
    openAddCategoryModal,
  } = useModal();

  const { create: createProduct, loading: productsLoading } = useProducts();
  const {
    categories: categoryObjects,
    categoriesNames,
    addCategory: addCategoryLocal,
    createCategoryOnServer,
    selectedCategoryId,
    setCategory,
  } = useCategories();

  if (!isNewMaterialModalOpen) return null;

  const handleClearAll = () => {
    setFormData({
      itemName: "",
      itemHsn: "",
      itemCode: "",
      barcode: "",
      purchaseRate: "",
      retailRate: "",
      wholesaleRate: "",
      unitPrimary: "",
      unitSecondary: "",
      conversionFactor: "",
      discountAmount: "",
      discountType: "Percentage",
      warehouse: "",
      taxPercentage: "",
      batchEnabled: false,
      serialNumberEnabled: false,
      enabledOpeningStock: false,
      openingStockQuantity: "",
      purchaseTax: "exclude",
      retailTax: "exclude",
      wholesaleTax: "exclude",
      category: "",
      itemImage: null,
    });
    setError(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    if (error) setError(null);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "__add_category__") {
      openAddCategoryModal();
      e.currentTarget.value = "";
      return;
    }
    setFormData((prev) => ({ ...prev, category: value }));
    setCategory(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, itemImage: file }));
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-opacity-50"
          onClick={closeNewMaterialModal}
          aria-hidden
        />

        <div className="relative w-full max-w-6xl max-h-[85vh] bg-white rounded-lg shadow-xl border border-gray-300 overflow-hidden flex flex-col">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-700 px-6 py-5 flex items-center justify-end">
            <button
              onClick={closeNewMaterialModal}
              className="text-white hover:text-gray-300 transition"
              disabled={isSubmitting}
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-700 text-transparent bg-clip-text border-b-2 border-blue-600 inline-block">
                New Material
              </h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option>Goods/Services</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Form Content */}
            <MaterialForm
              formData={formData}
              isSubmitting={isSubmitting}
              error={error}
              categories={categoriesNames}
              selectedCategoryId={selectedCategoryId}
              onInputChange={handleInputChange}
              onCategoryChange={handleCategoryChange}
              onFileChange={handleFileChange}
              setError={setError}
              openAddCategoryModal={openAddCategoryModal}
            />
          </div>

          {/* Footer - Pass individual props instead of grouped objects */}
          <MaterialFormFooter
            formData={formData}
            isSubmitting={isSubmitting}
            productsLoading={productsLoading}
            categoriesNames={categoriesNames}
            categoryObjects={categoryObjects}
            createProduct={createProduct}
            addCategoryLocal={addCategoryLocal}
            createCategoryOnServer={createCategoryOnServer}
            setCategory={setCategory}
            setFormData={setFormData}
            setError={setError}
            setIsSubmitting={setIsSubmitting}
            onClearAll={handleClearAll}
            onClose={closeNewMaterialModal}
          />
        </div>
      </div>

      <AddCategoryModal />
    </>
  );
};

export default NewMaterialModal;
