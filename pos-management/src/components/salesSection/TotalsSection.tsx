import React, { useState } from "react";

interface TotalsSectionProps {
  totalQty: number;
  totalAmount: number;
}

export const TotalsSection: React.FC<TotalsSectionProps> = ({
  totalQty,
  totalAmount,
}) => {
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [adjustment, setAdjustment] = useState(0);

  const taxable = totalAmount - discount;

  const finalTotal = totalAmount + tax - discount + adjustment;

  return (
    <>
      {/* Totals Header */}
      <div className="bg-blue-800 text-white grid grid-cols-4 px-4 py-2 font-bold text-center">
        <span>TOTAL QTY</span>
        <span>{totalQty ?? 0}</span>

        <span>TOTAL AMOUNT</span>
        <span className="text-right">{totalAmount?.toFixed(2) ?? "0.00"}</span>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-2 gap-4 text-sm my-3">
        {/* Tax */}
        <div className="relative">
          <span className="absolute -top-2 left-3 bg-white px-2 text-gray-600 font-medium text-xs">
            Total Tax
          </span>
          <input
            type="number"
            value={tax}
            onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded-md p-2 text-right"
            step="0.001"
          />
        </div>

        <div className="relative">
          <span className="absolute -top-2 left-3 bg-white px-2 text-gray-600 font-medium text-xs">
            Total Taxable
          </span>
          <input
            value={taxable.toFixed(3)}
            readOnly
            className="w-full border border-gray-300 rounded-md p-2 text-right bg-gray-100"
          />
        </div>

        <div className="relative">
          <span className="absolute -top-2 left-3 bg-white px-2 text-gray-600 font-medium text-xs">
            Total Discount
          </span>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded-md p-2 text-right"
            step="0.001"
            min="0"
            max={totalAmount}
          />
        </div>

        <div className="relative">
          <span className="absolute -top-2 left-3 bg-white px-2 text-gray-600 font-medium text-xs">
            Adjustment
          </span>
          <input
            type="number"
            value={adjustment}
            onChange={(e) => setAdjustment(parseFloat(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded-md p-2 text-right"
            step="1"
          />
        </div>
      </div>

      <div className="bg-yellow-200 text-right p-2 text-2xl font-bold border border-yellow-300 rounded w-fit ml-auto px-6">
        {finalTotal.toFixed(3)}
      </div>
    </>
  );
};
