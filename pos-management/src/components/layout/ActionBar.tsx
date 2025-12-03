import React, { useMemo } from "react";
import {
  RotateCcw,
  Trash2,
  Printer,
  FileText,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  User,
  BarChart3,
  Receipt,
  Undo,
  Calculator,
  Package,
} from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { toast } from "sonner";

interface ActionBarProps {
  onOpenItemModal?: () => void;
  onOpenNewMaterialModal?: () => void;
  selectedItemId?: string | null;
  onClearSelection?: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  onOpenItemModal,
  selectedItemId,
  onClearSelection,
}) => {
  const { clearCart, cart, updateQuantity, removeFromCart } = useCart();

  // Memoize selected item
  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    return (
      cart.find((item) => {
        const id =
          typeof item.product === "string" ? item.product : item.product._id;
        return id === selectedItemId;
      }) ?? null
    );
  }, [cart, selectedItemId]);

  const getSelectedItemName = useMemo(() => {
    if (!selectedItem) return "";
    if ("name" in selectedItem && selectedItem.name) return selectedItem.name;
    if (
      typeof selectedItem.product === "object" &&
      selectedItem.product?.name
    ) {
      return selectedItem.product.name;
    }
    return "Selected Item";
  }, [selectedItem]);

  const hasSelection = Boolean(selectedItem);

  // Helpers to extract productId from selectedItem
  const selectedProductId = useMemo(() => {
    if (!selectedItem) return null;
    return typeof selectedItem.product === "string"
      ? selectedItem.product
      : selectedItem.product._id;
  }, [selectedItem]);

  // Increment selected item quantity
  const handleIncrement = () => {
    if (!selectedItem || !selectedProductId) {
      toast.warning("Please select an item first!", {
        description: "Click on an item in the cart to select it",
        duration: 3000,
      });
      return;
    }

    updateQuantity(selectedProductId, selectedItem.quantity + 1);

    toast.success("Quantity increased!", {
      description: `${getSelectedItemName} quantity is now ${
        selectedItem.quantity + 1
      }`,
      duration: 2000,
    });
  };

  // Decrement selected item quantity
  const handleDecrement = () => {
    if (!selectedItem || !selectedProductId) {
      toast.warning("Please select an item first!", {
        description: "Click on an item in the cart to select it",
        duration: 3000,
      });
      return;
    }

    const newQuantity = selectedItem.quantity - 1;
    if (newQuantity >= 1) {
      updateQuantity(selectedProductId, newQuantity);
      toast.success("Quantity decreased!", {
        description: `${getSelectedItemName} quantity is now ${newQuantity}`,
        duration: 2000,
      });
    } else {
      toast.warning("Minimum quantity is 1", {
        description: "Use the delete button to remove the item",
        duration: 3000,
      });
    }
  };

  // Delete selected row (with confirmation)
  const handleDeleteRow = () => {
    if (!selectedItem || !selectedProductId) {
      toast.warning("Please select an item first!", {
        description: "Click on an item in the cart to select it",
        duration: 3000,
      });
      return;
    }

    toast.custom(
      (t) => (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80">
          <div className="flex items-start">
            <div className="shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="text-red-600" size={20} />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-semibold text-gray-900">
                Delete Item
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Are you sure you want to delete "{getSelectedItemName}" from
                cart?
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => toast.dismiss(t)}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    removeFromCart(selectedProductId);
                    onClearSelection?.();
                    toast.dismiss(t);
                    toast.success("Item deleted!", {
                      description: `${getSelectedItemName} has been removed from cart`,
                      duration: 3000,
                    });
                  }}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
  };

  // Clear all items (with confirmation)
  const handleClear = () => {
    if (cart.length === 0) return;

    toast.custom(
      (t) => (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80">
          <div className="flex items-start">
            <div className="shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="text-red-600" size={20} />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-semibold text-gray-900">
                Clear All Items
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Are you sure you want to clear all {cart.length} items from
                cart?
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => toast.dismiss(t)}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    clearCart();
                    onClearSelection?.();
                    toast.dismiss(t);
                    toast.success("Cart cleared!", {
                      description: `All ${cart.length} items have been removed`,
                      duration: 3000,
                    });
                  }}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
  };

  const handlePrev = () => {
    if (cart.length === 0) {
      toast.info("Cart is empty", {
        description: "Add items to cart first",
        duration: 2000,
      });
      return;
    }

    if (!selectedItemId) {
      toast.info("Selected first item", { duration: 1500 });
      return;
    }

    const currentIndex = cart.findIndex((item) => {
      const id =
        typeof item.product === "string" ? item.product : item.product._id;
      return id === selectedItemId;
    });

    if (currentIndex > 0) {
      toast.info("Selected previous item", { duration: 1500 });
    } else if (currentIndex === 0) {
      toast.info("Selected last item", { duration: 1500 });
    }
  };

  const handleNext = () => {
    if (cart.length === 0) {
      toast.info("Cart is empty", {
        description: "Add items to cart first",
        duration: 2000,
      });
      return;
    }

    if (!selectedItemId) {
      toast.info("Selected first item", { duration: 1500 });
      return;
    }

    const currentIndex = cart.findIndex((item) => {
      const id =
        typeof item.product === "string" ? item.product : item.product._id;
      return id === selectedItemId;
    });

    if (currentIndex >= 0 && currentIndex < cart.length - 1) {
      toast.info("Selected next item", { duration: 1500 });
    } else if (currentIndex === cart.length - 1) {
      toast.info("Selected first item", { duration: 1500 });
    }
  };

  return (
    <div className="bg-white border-t border-gray-300 p-2">
      {/* First Row - 6 buttons */}
      <div className="grid grid-cols-6 gap-2 mb-2">
        <button className="bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg flex flex-col items-center justify-center py-3 text-sm font-bold transition-all hover:shadow-md h-16">
          <span className="text-xl mb-1">⏸</span> Hold
        </button>

        <button className="bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-lg flex flex-col items-center justify-center py-3 text-sm font-bold transition-all hover:shadow-md h-16">
          <RotateCcw size={18} className="mb-1" /> Recall
        </button>

        <button
          onClick={handleIncrement}
          disabled={!hasSelection || cart.length === 0}
          className="bg-green-100 hover:bg-green-200 border border-green-300 rounded-lg flex flex-col items-center justify-center py-3 text-sm font-bold transition-all hover:shadow-md h-16 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Increase selected item quantity"
        >
          <Plus size={18} className="mb-1" /> QTY+
        </button>

        <button
          onClick={handleClear}
          disabled={cart.length === 0}
          className="bg-red-100 hover:bg-red-200 border border-red-300 rounded-lg flex flex-col items-center justify-center py-3 text-sm font-bold text-red-800 transition-all hover:shadow-md h-16 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 size={18} className="mb-1" /> Del All
        </button>

        <button className="bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-lg text-sm flex flex-col items-center justify-center py-3 shadow-md transition-all hover:scale-105 h-16">
          <FileText size={18} className="mb-1" />
          PREVIEW & SAVE
        </button>

        <button className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-sm flex flex-col items-center justify-center py-3 shadow-md transition-all hover:scale-105 h-16">
          <Printer size={18} className="mb-1" />
          SAVE & PRINT
        </button>
      </div>

      {/* Second Row - 7 buttons */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        <button
          onClick={handlePrev}
          disabled={cart.length === 0}
          className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center py-3 text-xs font-bold transition-all h-16 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Select previous item"
        >
          <ChevronLeft size={14} className="mr-1" /> Prev
        </button>

        <button
          onClick={handleNext}
          disabled={cart.length === 0}
          className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center py-3 text-xs font-bold transition-all h-16 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Select next item"
        >
          Next <ChevronRight size={14} className="ml-1" />
        </button>

        <button
          onClick={handleDecrement}
          disabled={!hasSelection || cart.length === 0}
          className="bg-orange-100 hover:bg-orange-200 border border-orange-300 rounded-lg flex items-center justify-center py-3 text-xs font-bold transition-all h-16 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Decrease selected item quantity"
        >
          <Minus size={14} className="mr-1" /> QTY-
        </button>

        <button
          onClick={handleDeleteRow}
          disabled={!hasSelection || cart.length === 0}
          className="bg-red-100 hover:bg-red-200 border border-red-300 rounded-lg flex items-center justify-center py-3 text-xs font-bold text-red-800 transition-all h-16 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete selected item"
        >
          <Trash2 size={14} className="mr-1" /> Del Row
        </button>

        <button className="bg-cyan-100 hover:bg-cyan-200 border border-cyan-300 rounded-lg flex items-center justify-center py-3 text-xs font-bold transition-all h-16">
          <BarChart3 size={14} className="mr-1" /> Report
        </button>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center py-3 text-xs h-16">
          <span className="text-gray-600">Cash:</span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center py-3 text-xs h-16">
          <span className="text-gray-600">0:00</span>
        </div>
      </div>

      {/* Third Row - 7 buttons */}
      <div className="grid grid-cols-7 gap-2">
        <button className="bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-lg flex items-center justify-center py-3 text-xs font-bold transition-all h-16">
          <Receipt size={14} className="mr-1" /> Re Print
        </button>

        <button className="bg-orange-100 hover:bg-orange-200 border border-orange-300 rounded-lg flex items-center justify-center py-3 text-xs font-bold transition-all h-16">
          <Undo size={14} className="mr-1" /> S Return
        </button>

        <button
          onClick={handleClear}
          disabled={cart.length === 0}
          className="bg-red-100 hover:bg-red-200 border border-red-300 rounded-lg flex items-center justify-center py-3 text-xs font-bold text-red-800 transition-all h-16 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 size={14} className="mr-1" /> Clear
        </button>

        <button className="bg-green-100 hover:bg-green-200 border border-green-300 rounded-lg flex items-center justify-center py-3 text-xs font-bold transition-all h-16">
          <Calculator size={14} className="mr-1" /> Price
        </button>

        <button className="bg-purple-100 hover:bg-purple-200 border border-purple-300 rounded-lg flex items-center justify-center py-3 text-xs font-bold transition-all h-16">
          <User size={14} className="mr-1" /> Accounts
        </button>

        <button
          onClick={onOpenItemModal}
          className="bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg flex items-center justify-center py-3 text-xs font-bold transition-all h-16"
        >
          <Package size={14} className="mr-1" /> Item
        </button>

        <div className="bg-yellow-50 border border-yellow-300 rounded-lg flex items-center justify-between px-4 text-xs h-16">
          <span className="text-gray-600 font-bold">Balance:</span>
          <span className="font-bold text-green-700 text-sm">0.00</span>
        </div>
      </div>
    </div>
  );
};
