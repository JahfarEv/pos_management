import React from "react";
import { CustomerInfo } from "./CustomerInfo";
import { CartTable } from "./CartTable";
import { TotalsSection } from "./TotalsSection";
import { useCart } from "../../hooks/useCart";
import { Plus } from "lucide-react";

interface SalesPanelProps {
  selectedItemId?: string | null;
  onSelectItem?: (itemId: string | null) => void;
}

export const SalesPanel: React.FC<SalesPanelProps> = ({
  selectedItemId,
  onSelectItem,
}) => {
  const { cart, total, totalQty, clearCart, loading } = useCart();

  const handleAddRow = () => {
    console.log("Add row clicked");
  };

  console.log("SalesPanel - selectedItemId:", selectedItemId);

  return (
    <div className="w-[35%] bg-white border-r border-gray-300 flex flex-col p-4 gap-2">
      <div className="">
        <CustomerInfo />
      </div>

      {/* Cart Section */}
      <div className="flex-1 flex flex-col max-h-[50vh]">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-gray-800">Cart Items</h3>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              disabled={loading}
              className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="flex-1 min-h-0">
          {/* Pass props to CartTable */}
          <CartTable
            selectedItemId={selectedItemId}
            onSelectItem={onSelectItem}
          />
        </div>

        <div className="h-.8/6 bg-gray-100">
          <button
            onClick={handleAddRow}
            className="flex gap-2 text-blue-600 font-semibold cursor-pointer hover:text-blue-800 hover:bg-blue-50 py-3 px-4 rounded-lg transition-colors group"
          >
            <Plus className="text-xl group-hover:rotate-90 transition-transform" />
            <span>Add Row</span>
          </button>
        </div>

        <div className="h-2/6">
          <TotalsSection totalQty={totalQty} totalAmount={total} />
        </div>
      </div>
    </div>
  );
};
