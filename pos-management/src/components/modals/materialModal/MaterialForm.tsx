import React from "react";
import type { MaterialFormProps } from "../../../types/materialTypes";
import { CategorySection } from "../materialModal/components/sections/CategorySection";
import { ItemNameSection } from "../materialModal/components/sections/ItemNameSection";
import { RatesSection } from "../materialModal/components/sections/RatesSection";
import { UnitSection } from "../materialModal/components/sections/UnitSection";
import { DiscountWarehouseSection } from "../materialModal/components/sections/DiscountWarehouseSection";
import { TaxBatchSection } from "../materialModal/components/sections/TaxBatchSection";
import { OpeningStockSection } from "../materialModal/components/sections/OpeningStockSection";
import { ItemImageSection } from "../materialModal/components/sections/ItemImageSection";

export const MaterialForm: React.FC<MaterialFormProps> = ({
  formData,
  isSubmitting,
  categories,
  onInputChange,
  onCategoryChange,
  onFileChange,
  openAddCategoryModal,
}) => {
  const categoryOptions = categories?.length > 0
    ? categories.filter((c) => c !== "All")
    : [];

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
      {/* 1. Category Section */}
      <CategorySection
        category={formData.category}
        categoryOptions={categoryOptions}
        onCategoryChange={onCategoryChange}
        isSubmitting={isSubmitting}
        openAddCategoryModal={openAddCategoryModal}
      />

      {/* 2. Purchase Rate */}
      <RatesSection
        type="purchase"
        rate={formData.purchaseRate}
        tax={formData.purchaseTax}
        onInputChange={onInputChange}
        isSubmitting={isSubmitting}
        required={false}
      />

      {/* 3. Item Name + Item HSN */}
      <ItemNameSection
        itemName={formData.itemName}
        itemHsn={formData.itemHsn}
        onInputChange={onInputChange}
        isSubmitting={isSubmitting}
      />

      {/* 4. Retail Rate */}
      <RatesSection
        type="retail"
        rate={formData.retailRate}
        tax={formData.retailTax}
        onInputChange={onInputChange}
        isSubmitting={isSubmitting}
        required={true}
      />

      {/* 5. Item Code + Barcode */}
      <div className="flex space-x-6 col-span-1">
        <div className="flex-1">
          <label className="block text-sm text-gray-700">Item Code</label>
          <input
            type="text"
            name="itemCode"
            value={formData.itemCode}
            onChange={onInputChange}
            placeholder="Enter item code"
            disabled={isSubmitting}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-700">Barcode</label>
          <input
            type="text"
            name="barcode"
            value={formData.barcode}
            onChange={onInputChange}
            placeholder="Barcode"
            disabled={isSubmitting}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* 6. Wholesale Rate */}
      <RatesSection
        type="wholesale"
        rate={formData.wholesaleRate}
        tax={formData.wholesaleTax}
        onInputChange={onInputChange}
        isSubmitting={isSubmitting}
        required={false}
      />

      {/* 7. Unit Section */}
      <UnitSection
        unitPrimary={formData.unitPrimary}
        unitSecondary={formData.unitSecondary}
        conversionFactor={formData.conversionFactor}
        onInputChange={onInputChange}
        isSubmitting={isSubmitting}
      />

      {/* 8. Discount + Warehouse Section */}
      <DiscountWarehouseSection
        discountAmount={formData.discountAmount}
        discountType={formData.discountType}
        warehouse={formData.warehouse}
        onInputChange={onInputChange}
        isSubmitting={isSubmitting}
      />

      {/* 9. Tax + Batch + Serial Number Section */}
      <TaxBatchSection
        taxPercentage={formData.taxPercentage}
        batchEnabled={formData.batchEnabled}
        serialNumberEnabled={formData.serialNumberEnabled}
        onInputChange={onInputChange}
        isSubmitting={isSubmitting}
      />

      {/* 10. Opening Stock Section */}
      <OpeningStockSection
        enabledOpeningStock={formData.enabledOpeningStock}
        openingStockQuantity={formData.openingStockQuantity}
        onInputChange={onInputChange}
        isSubmitting={isSubmitting}
      />

      {/* 11. Item Image Section */}
      <ItemImageSection
        itemImage={formData.itemImage}
        onFileChange={onFileChange}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};