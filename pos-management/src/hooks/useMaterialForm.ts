import { useState } from "react";
import type { MaterialFormData } from "../types/materialForm.types";
import { initialMaterialFormData } from "../types/materialForm.types";

export const useMaterialForm = (initialData?: Partial<MaterialFormData>) => {
  const [formData, setFormData] = useState<MaterialFormData>({
    ...initialMaterialFormData,
    ...initialData,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, itemImage: file }));
  };

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
      purchaseRate: formData.purchaseRate ? parseFloat(formData.purchaseRate) : 0,
      retailRate: parseFloat(formData.retailRate) || 0,
      wholesaleRate: formData.wholesaleRate ? parseFloat(formData.wholesaleRate) : 0,
      unitPrimary: formData.unitPrimary,
      unitSecondary: formData.unitSecondary || undefined,
      conversionFactor: parseFloat(formData.conversionFactor) || 1,
      discountAmount: formData.discountAmount ? parseFloat(formData.discountAmount) : 0,
      discountType: formData.discountType,
      warehouse: formData.warehouse || undefined,
      taxPercentage: formData.taxPercentage ? parseFloat(formData.taxPercentage) : 0,
      batchEnabled: formData.batchEnabled,
      serialNumberEnabled: formData.serialNumberEnabled,
      stock: formData.enabledOpeningStock ? parseInt(formData.openingStockQuantity) || 0 : 0,
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
    };
  };

  const resetForm = () => {
    setFormData({ ...initialMaterialFormData, ...initialData });
    setError(null);
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    handleInputChange,
    handleFileChange,
    validateForm,
    prepareProductData,
    resetForm,
  };
};