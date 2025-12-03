// import React, { useState } from "react";
// import { useCart } from "../../hooks/useCart";
// import { Loader2, CheckCircle } from "lucide-react";
// import type { CartItem } from "../../types/cart";

// interface CartTableProps {
//   selectedItemId?: string | null;
//   onSelectItem?: (itemId: string | null) => void;
// }

// export const CartTable: React.FC<CartTableProps> = ({
//   selectedItemId,
//   onSelectItem,
// }) => {
//   const { cart, removeFromCart, updateQuantity, loading } = useCart();
//   const [editingQty, setEditingQty] = useState<string | null>(null);

//   // Helper function to get product ID from CartItem
//   const getProductId = (item: CartItem): string => {
//     if (typeof item.product === "string") {
//       return item.product;
//     }
//     return item.product._id ;
//   };

//   // Helper function to get product name from CartItem
//   const getProductName = (item: CartItem): string => {
//     if (item.name) return item.name;
//     if (typeof item.product === "object") {
//       return item.product.name;
//     }
//     return "Unknown Product";
//   };

//   // Helper function to get unit from CartItem
//   const getProductUnit = (item: CartItem): string => {
//     // If product is an object and has unitPrimary
//     if (typeof item.product === "object" && item.product.unitPrimary) {
//       return item.product.unitPrimary;
//     }
//     // Fallback to PCS if no unit found
//     return "PCS";
//   };

//   // Handle item selection
//   const handleSelectItem = (item: CartItem) => {
//     const productId = getProductId(item);
//     if (productId === selectedItemId) {
//       // Deselect if already selected
//       onSelectItem?.(null);
//     } else {
//       // Select new item
//       onSelectItem?.(productId);
//     }
//   };

//   // Handle quantity change
//   const handleQuantityChange = async (item: CartItem, newQuantity: number) => {
//     const productId = getProductId(item);
//     if (!productId) return;

//     setEditingQty(productId);
//     try {
//       if (newQuantity < 1) {
//         await removeFromCart(productId);
//       } else {
//         await updateQuantity(productId, newQuantity);
//       }
//     } catch (error) {
//       console.error("Failed to update quantity:", error);
//     } finally {
//       setEditingQty(null);
//     }
//   };

//   if (loading && cart.length === 0) {
//     return (
//       <div className="flex items-center justify-center bg-amber-200">
//         <Loader2 className="animate-spin text-blue-600" size={32} />
//         <span className="ml-3 text-gray-600">Loading cart...</span>
//       </div>
//     );
//   }

//   console.log("Cart data:", cart);
//   console.log("Selected item ID:", selectedItemId);

//   return (
//     <div className="flex flex-col h-3/6 ">
//       <style>{`
//         .hide-scrollbar::-webkit-scrollbar { display: none; }
//         .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>

//       {/* Cart Table Header */}
//       <div className="grid grid-cols-12 bg-blue-800 text-white py-3 px-2 font-semibold text-sm sticky top-0">
//         <div className="col-span-1 text-center">#</div>
//         <div className="col-span-4">ITEM NAME</div>
//         <div className="col-span-2 text-center">QTY</div>
//         <div className="col-span-2 text-right">PRICE</div>
//         <div className="col-span-1 text-right">UNIT</div>
//         <div className="col-span-2 text-right">AMOUNT</div>
//       </div>

//       {/* Cart Items */}
//       <div className="flex-1 border-gray-200 ">
//         {cart.length === 0 ? (
//           <div className="flex items-center justify-center h-full w-full">
//             <div className="flex flex-col items-center justify-center text-gray-500">
//               <div className="text-4xl mb-4">🛒</div>
//               <div className="text-lg font-medium mb-2">Your cart is empty</div>
//               <div className="text-sm">Add items from the product list</div>
//             </div>
//           </div>
//         ) : (
//           <div className="divide-y divide-gray-100 overflow-y-auto max-h-48 hide-scrollbar">
//             {cart.map((item, idx) => {
//               const productId = getProductId(item);
//               const itemName = getProductName(item);
//               const price = item.price || 0;
//               const unit = getProductUnit(item);
//               const subtotal = item.subtotal ?? price * item.quantity;
//               const isSelected = productId === selectedItemId;

//               console.log(`Item ${idx}:`, {
//                 productId,
//                 selectedItemId,
//                 isSelected,
//                 itemName,
//               });

//               return (
//                 <div
//                   key={`${productId}-${idx}`}
//                   className={`
//                     grid grid-cols-12 text-sm py-3 px-2
//                     hover:bg-blue-50 transition-colors group items-center
//                     border-b border-gray-200
//                     ${
//                       isSelected
//                         ? "bg-blue-100 border-l-4 border-l-blue-500"
//                         : ""
//                     }
//                   `}
//                 >
//                   {/* Selection Checkbox - First Column */}
//                   <div className="col-span-1 flex justify-center">
//                     <button
//                       onClick={() => {
//                         console.log("Selecting item:", productId);
//                         handleSelectItem(item);
//                       }}
//                       className="p-1 rounded-full hover:bg-blue-100 transition-colors"
//                       title={isSelected ? "Deselect item" : "Select item"}
//                     >
//                       {isSelected ? (
//                         <CheckCircle className="text-green-600" size={20} />
//                       ) : (
//                         <div className="w-5 h-5 rounded-full border-2 border-gray-400 hover:border-blue-500 transition-colors"></div>
//                       )}
//                     </button>
//                   </div>

//                   {/* Item Name */}
//                   <div className="col-span-4">
//                     <div className="font-medium text-gray-900 truncate">
//                       {itemName}
//                     </div>
//                     <div className="text-xs text-gray-500 mt-1 truncate">
//                       ID: {productId || "N/A"}
//                     </div>
//                     {isSelected && (
//                       <div className="text-xs text-blue-600 font-medium mt-1">
//                         ✓ Selected
//                       </div>
//                     )}
//                   </div>

//                   {/* Quantity */}
//                   <div className="col-span-2">
//                     <div className="flex items-center justify-center space-x-2">
//                       <input
//                         type="number"
//                         value={item.quantity}
//                         onChange={(e) => {
//                           const value = parseInt(e.target.value);
//                           if (!isNaN(value) && productId) {
//                             handleQuantityChange(item, value);
//                           }
//                         }}
//                         className="w-16 text-center border border-gray-300 rounded py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         min="1"
//                         disabled={loading || editingQty === productId}
//                         aria-label={`Quantity for ${itemName}`}
//                       />
//                       {editingQty === productId && (
//                         <Loader2
//                           className="animate-spin text-blue-600"
//                           size={16}
//                         />
//                       )}
//                     </div>
//                   </div>

//                   {/* Price */}
//                   <div className="col-span-2 text-right font-medium text-gray-700">
//                     ₹{price.toFixed(2)}
//                   </div>

//                   {/* Unit */}
//                   <div className="col-span-1 text-right font-medium text-gray-700">
//                     {unit}
//                   </div>

//                   {/* Amount (Subtotal) */}
//                   <div className="col-span-2 text-right font-bold text-blue-700">
//                     ₹{subtotal.toFixed(2)}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CartTable;

import React, { useState } from "react";
import { useCart } from "../../hooks/useCart";
import { Loader2, CheckCircle } from "lucide-react";
import type { CartItem } from "../../types/cart";

interface CartTableProps {
  selectedItemId?: string | null;
  onSelectItem?: (itemId: string | null) => void;
}

export const CartTable: React.FC<CartTableProps> = ({
  selectedItemId,
  onSelectItem,
}) => {
  const { cart, removeFromCart, updateQuantity, loading } = useCart();
  const [editingQty, setEditingQty] = useState<string | null>(null);

  // Helper function to get product ID from CartItem (safe)
  const getProductId = (item: CartItem): string | null => {
    if (!item) return null;
    if (typeof item.product === "string") return item.product;
    if (item.product && typeof item.product === "object") {
      // product might be null if it was deleted; guard against that
      return item.product._id ?? null;
    }
    return null;
  };

  // Helper function to get product name from CartItem (safe)
  const getProductName = (item: CartItem): string => {
    if (!item) return "Unknown Product";
    if (item.name) return item.name;
    if (typeof item.product === "object" && item.product && item.product.name) {
      return item.product.name;
    }
    return "Unknown Product";
  };

  // Helper function to get unit from CartItem (safe)
  const getProductUnit = (item: CartItem): string => {
    if (
      typeof item.product === "object" &&
      item.product &&
      item.product.unitPrimary
    ) {
      return item.product.unitPrimary;
    }
    return "PCS";
  };

  // Handle item selection
  const handleSelectItem = (item: CartItem) => {
    const productId = getProductId(item);
    // If no productId, do not select (or you can still select the row by item id)
    if (!productId) return;
    if (productId === selectedItemId) {
      onSelectItem?.(null);
    } else {
      onSelectItem?.(productId);
    }
  };

  // Handle quantity change
  const handleQuantityChange = async (item: CartItem, newQuantity: number) => {
    const productId = getProductId(item);
    if (!productId) return;

    setEditingQty(productId);
    try {
      if (newQuantity < 1) {
        await removeFromCart(productId);
      } else {
        await updateQuantity(productId, newQuantity);
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setEditingQty(null);
    }
  };

  if (loading && cart.length === 0) {
    return (
      <div className="flex items-center justify-center bg-amber-200">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <span className="ml-3 text-gray-600">Loading cart...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-3/6 ">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Cart Table Header */}
      <div className="grid grid-cols-12 bg-blue-800 text-white py-3 px-2 font-semibold text-sm sticky top-0 z-10">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-4">ITEM NAME</div>
        <div className="col-span-2 text-center">QTY</div>
        <div className="col-span-2 text-right">PRICE</div>
        <div className="col-span-1 text-right">UNIT</div>
        <div className="col-span-2 text-right">AMOUNT</div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 border-gray-200 ">
        {cart.length === 0 ? (
          <div className="flex items-center justify-center h-full w-full">
            <div className="flex flex-col items-center justify-center text-gray-500">
              <div className="text-4xl mb-4">🛒</div>
              <div className="text-lg font-medium mb-2">Your cart is empty</div>
              <div className="text-sm">Add items from the product list</div>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 overflow-y-auto max-h-48 hide-scrollbar">
            {cart.map((item, idx) => {
              const productId = getProductId(item);
              const itemName = getProductName(item);
              const price = item.price ?? 0;
              const unit = getProductUnit(item);
              const subtotal = item.subtotal ?? price * item.quantity;
              const isSelected =
                productId !== null && productId === selectedItemId;

              // use a stable key: prefer item.id/_id, then productId, then idx
              const key =
                (item as any).id ??
                (item as any)._id ??
                productId ??
                `cart-${idx}`;

              const isUnavailable = productId === null;

              return (
                <div
                  key={key}
                  className={`
                    grid grid-cols-12 text-sm py-3 px-2 
                    hover:bg-blue-50 transition-colors group items-center
                    border-b border-gray-200
                    ${
                      isSelected
                        ? "bg-blue-100 border-l-4 border-l-blue-500"
                        : ""
                    }
                    ${isUnavailable ? "opacity-70 bg-gray-50" : ""}
                  `}
                >
                  {/* Selection Checkbox - First Column */}
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => handleSelectItem(item)}
                      className="p-1 rounded-full hover:bg-blue-100 transition-colors"
                      title={
                        isUnavailable
                          ? "Product unavailable"
                          : isSelected
                          ? "Deselect item"
                          : "Select item"
                      }
                      disabled={isUnavailable}
                    >
                      {isSelected ? (
                        <CheckCircle className="text-green-600" size={20} />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-400 hover:border-blue-500 transition-colors"></div>
                      )}
                    </button>
                  </div>

                  {/* Item Name */}
                  <div className="col-span-4">
                    <div className="font-medium text-gray-900 truncate">
                      {itemName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      ID: {productId ?? "N/A"}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2">
                    <div className="flex items-center justify-center space-x-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (!isNaN(value) && productId && value >= 0) {
                            handleQuantityChange(item, value);
                          }
                        }}
                        className="w-16 text-center border border-gray-300 rounded py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min={1}
                        disabled={
                          loading || editingQty === productId || isUnavailable
                        }
                        aria-label={`Quantity for ${itemName}`}
                      />
                      {editingQty === productId && (
                        <Loader2
                          className="animate-spin text-blue-600"
                          size={16}
                        />
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-right font-medium text-gray-700">
                    ₹{price.toFixed(2)}
                  </div>

                  {/* Unit */}
                  <div className="col-span-1 text-right font-medium text-gray-700">
                    {unit}
                  </div>

                  {/* Amount (Subtotal) */}
                  <div className="col-span-2 text-right font-bold text-blue-700">
                    ₹{subtotal.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTable;
