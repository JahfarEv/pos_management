import React from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import type { Product } from "../../store/slices/categorySlice";
import { addItem } from "../../store/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toast } from "sonner";
import type { AuthUser } from "../../store/slices/authSlice"; // Import AuthUser type

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const [isAdding, setIsAdding] = React.useState(false);

  const user = useAppSelector((state) => state.auth.user) as AuthUser | null;
  const cartLoading = useAppSelector((state) => state.cart.loading);

  const price = getProductPrice(product);

  const handleAddToCart = async () => {
    if (!user?._id) {
      toast.error("Please login to add items to cart");
      return;
    }

    if (isAdding || cartLoading) {
      return;
    }

    setIsAdding(true);
    try {
      const productId = product._id;
      if (!productId) {
        toast.error("Product ID not found");
        return;
      }

      await dispatch(
        addItem({
          userId: user._id, 
          productId,
          quantity: 1,
        })
      ).unwrap();

      toast.success(`${product.name} added to cart!`);
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to add to cart";
      toast.error(errorMessage);
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || cartLoading || product.lowStock}
      className="cursor-pointer
    bg-yellow-100 shadow-md border border-amber-200 rounded-xl 
    flex flex-col items-center justify-between 
    h-40 md:h-44 lg:h-48 relative
    hover:shadow-lg transition-all duration-150 hover:scale-105
    disabled:opacity-50 disabled:cursor-not-allowed
    w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
    active:scale-[1.02]
    group
  "
      aria-label={`Add ${product.name} to cart`}
    >
      {/* Price badge */}
      <div className="absolute -top-3 left-3 bg-green-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md rotate-340">
        ${price.toFixed(2)}
      </div>

      {/* Product content */}
      <div className="flex flex-col items-center justify-center flex-1 w-full px-4">
        <div className="relative">
          {isAdding ? (
            <Loader2 className="text-orange-700 mb-3 animate-spin" size={28} />
          ) : (
            <ShoppingCart
              className="text-orange-700 mb-3 group-hover:scale-110 transition-transform"
              size={28}
            />
          )}
          {!user?._id && !isAdding && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              !
            </div>
          )}
        </div>

        <div className="text-center w-full">
          <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1 line-clamp-2">
            {product.name}
          </h3>
          {product.category && (
            <p className="text-xs text-gray-600 font-medium mb-1">
              {product.category}
            </p>
          )}

          {/* Status indicators */}
          {isAdding && (
            <p className="text-xs text-blue-600 mt-1 font-medium animate-pulse">
              Adding...
            </p>
          )}
          {!user?._id && !isAdding && (
            <p className="text-xs text-red-600 mt-1 font-medium">
              Login required
            </p>
          )}
        </div>
      </div>

      {/* Stock indicator */}
      <div className="w-full">
        {product.lowStock ? (
          <div className="bg-red-500 text-white text-xs font-bold py-1.5 rounded-b-xl shadow-sm flex items-center justify-center gap-1">
            <span className="text-sm">⚠</span>
            LOW STOCK
          </div>
        ) : (
          <div className="text-xs text-gray-500 py-1.5">In stock</div>
        )}
      </div>
    </button>
  );
};

function getProductPrice(product: any): number {
  const priceFields = [
    "price",
    "retailRate",
    "retailPrice",
    "purchaseRate",
    "sellingPrice",
    "costPrice",
  ];

  for (const field of priceFields) {
    if (typeof product[field] === "number" && product[field] > 0) {
      return product[field];
    }
  }

  return 0;
}

export default ProductCard;
