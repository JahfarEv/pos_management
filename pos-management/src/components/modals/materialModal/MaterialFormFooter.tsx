import React from "react";
import type { MaterialFormData } from "../../../types/materialTypes";

type ReduxThunkPromise<T = any> = Promise<T> & {
  unwrap: () => Promise<T>;
};

interface MaterialFormFooterProps {
  formData: MaterialFormData;
  isSubmitting: boolean;
  productsLoading: boolean;
  categoriesNames: string[];
  categoryObjects: any[];
  createProduct: any;
  addCategoryLocal: (name: string) => void;
  createCategoryOnServer: (name: string) => ReduxThunkPromise | Promise<any>;
  setCategory: (category: string) => void;
  setFormData: (data: MaterialFormData) => void;
  setError: (error: string | null) => void;
  setIsSubmitting: (submitting: boolean) => void;
  onClearAll: () => void;
  onClose: () => void;
}

// Helper to safely unwrap promises
const safeAwait = async <T,>(promise: any): Promise<T> => {
  if (promise && typeof promise === "object" && "unwrap" in promise) {
    return await promise.unwrap();
  }
  return await promise;
};

export const MaterialFormFooter: React.FC<MaterialFormFooterProps> = ({
  formData,
  isSubmitting,
  productsLoading,
  categoriesNames,
  createProduct,
  addCategoryLocal,
  createCategoryOnServer,
  setCategory,
  setFormData,
  setError,
  setIsSubmitting,
  onClearAll,
  onClose,
}) => {
  const validateForm = (): boolean => {
    if (!formData.itemName.trim()) {
      setError("Item Name is required");
      return false;
    }

    if (!formData.category) {
      setError("Category is required");
      return false;
    }

    if (!formData.retailRate) {
      setError("Retail Rate is required");
      return false;
    }

    if (!formData.unitPrimary) {
      setError("Primary Unit is required");
      return false;
    }

    if (!formData.conversionFactor) {
      setError("Conversion Factor is required");
      return false;
    }

    if (formData.enabledOpeningStock && !formData.openingStockQuantity) {
      setError("Opening Stock Quantity is required when enabled");
      return false;
    }

    return true;
  };

  const prepareProductData = () => {
    return {
      itemName: formData.itemName,
      itemHsn: formData.itemHsn || undefined,
      itemCode: formData.itemCode || undefined,
      barcode: formData.barcode || undefined,
      purchaseRate: formData.purchaseRate
        ? parseFloat(formData.purchaseRate)
        : 0,
      retailRate: parseFloat(formData.retailRate) || 0,
      wholesaleRate: formData.wholesaleRate
        ? parseFloat(formData.wholesaleRate)
        : 0,
      unitPrimary: formData.unitPrimary,
      unitSecondary: formData.unitSecondary || undefined,
      conversionFactor: parseFloat(formData.conversionFactor) || 1,
      discountAmount: formData.discountAmount
        ? parseFloat(formData.discountAmount)
        : 0,
      discountType: formData.discountType,
      warehouse: formData.warehouse || undefined,
      taxPercentage: formData.taxPercentage
        ? parseFloat(formData.taxPercentage)
        : 0,
      batchEnabled: formData.batchEnabled,
      serialNumberEnabled: formData.serialNumberEnabled,
      stock: formData.enabledOpeningStock
        ? parseInt(formData.openingStockQuantity) || 0
        : 0,
      category: formData.category,
      purchaseTax: formData.purchaseTax,
      retailTax: formData.retailTax,
      wholesaleTax: formData.wholesaleTax,
      enabledOpeningStock: formData.enabledOpeningStock,
      openingStock: formData.enabledOpeningStock
        ? {
            quantity: parseInt(formData.openingStockQuantity) || 0,
            date: new Date().toISOString(),
          }
        : undefined,
      itemImage: formData.itemImage,
    };
  };

  const ensureCategoryExists = async (name: string) => {
    const exists = categoriesNames.includes(name);
    if (!exists) {
      addCategoryLocal(name);
      try {
        // Use safeAwait helper to handle both Redux thunks and regular promises
        await safeAwait(createCategoryOnServer(name));
      } catch (e) {
        console.error("Failed to persist category:", e);
      }
      setCategory(name);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = prepareProductData();

      if (payload.category) {
        await ensureCategoryExists(String(payload.category));
      }

      await safeAwait(createProduct(payload));

      onClearAll();
      onClose();
    } catch (err: any) {
      console.error("Error saving product:", err);
      setError(err?.message || "Failed to save product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndNew = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = prepareProductData();

      if (payload.category) {
        ensureCategoryExists(String(payload.category)).catch((e) =>
          console.error("persist category error:", e)
        );
      }

      // Use safeAwait for createProduct
      await safeAwait(createProduct(payload));

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
    } catch (err: any) {
      console.error("Error saving product:", err);
      setError(err?.message || "Failed to save product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
      <button
        onClick={onClearAll}
        disabled={isSubmitting}
        className="px-4 py-2 rounded-md border border-red-300 bg-red-100 text-red-700 text-sm hover:bg-red-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Clear all
      </button>

      <button
        onClick={handleSaveAndNew}
        disabled={isSubmitting || productsLoading}
        className="px-4 py-2 rounded-md border border-blue-300 bg-white text-blue-700 text-sm hover:bg-blue-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Saving..." : "Save & New"}
      </button>

      <button
        onClick={handleSave}
        disabled={isSubmitting || productsLoading}
        className="px-4 py-2 rounded-md bg-blue-800 text-white text-sm hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Saving..." : "Save"}
      </button>
    </div>
  );
};
