import React, { useMemo, useState, useEffect, useCallback } from "react";
import { ProductCard } from "./ProductCard";
import { useCategories } from "../../hooks/useCategory";
import { useAppSelector } from "../../store/hooks";
import { selectProductsBucket } from "../../store/slices/categorySlice";
import type { Product as ProductType } from "../../store/slices/categorySlice";
import { Spinner } from "../common/Spinner";

interface ProductGridProps {
  itemsPerPage?: number;
  searchQuery?: string;
  selectedCategory?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  itemsPerPage = 16,
  searchQuery = "",
  selectedCategory = "All",
}) => {
  const [page, setPage] = useState(1);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const {
    setCategory,
    loadProductsByCategorySlug,
    getCategoryByName,
    getCategoryBySlug,
  } = useCategories();

  const [categoryBucketSlug, setCategoryBucketSlug] = useState<string | null>(
    null
  );

  useEffect(() => {
    setPage(1);
    setCategoryLoading(true);

    const timer = setTimeout(() => {
      setCategoryLoading(false);
    }, 500);
    if (searchQuery && searchQuery.trim().length > 0) {
      const cat =
        selectedCategory && selectedCategory !== "All"
          ? selectedCategory
          : "all";
      setCategory(selectedCategory ?? "All");
      loadProductsByCategorySlug(cat, { search: searchQuery });
      setCategoryBucketSlug(cat);
      return () => clearTimeout(timer);
    }

    if (!selectedCategory || selectedCategory === "All") {
      setCategory("All");
      loadProductsByCategorySlug("all");
      setCategoryBucketSlug("all");
      return () => clearTimeout(timer);
    }

    const byName = getCategoryByName(selectedCategory);
    const bySlug = getCategoryBySlug(selectedCategory);
    const cat = bySlug || byName;

    const slugToUse = cat?.slug ?? cat?.name ?? cat?.id ?? selectedCategory;
    const selectedId = cat?.id ?? cat?._id ?? cat?.slug ?? selectedCategory;

    setCategory(selectedId);
    loadProductsByCategorySlug(slugToUse);
    setCategoryBucketSlug(slugToUse);

    return () => clearTimeout(timer);
  }, [
    selectedCategory,
    searchQuery,
    loadProductsByCategorySlug,
    getCategoryByName,
    getCategoryBySlug,
    setCategory,
  ]);

  const bucket = useAppSelector((s) =>
    selectProductsBucket(categoryBucketSlug ?? "all")(s)
  );
  const sourceProducts: ProductType[] = bucket?.data ?? [];
  const loading = bucket?.loading ?? false;
  const error = bucket?.error ?? null;

  useEffect(() => {
    if (sourceProducts.length > 0 || error) {
      setCategoryLoading(false);
    }
  }, [sourceProducts.length, error]);

  const visibleProducts = useMemo(
    () => sourceProducts.slice(0, page * itemsPerPage),
    [sourceProducts, page, itemsPerPage]
  );

  const hasMore = visibleProducts.length < sourceProducts.length;

  const handleLoadMore = useCallback(() => {
    if (!hasMore) return;
    setPage((p) => p + 1);
  }, [hasMore]);

  const handleRetry = useCallback(() => {
    setPage(1);
    setCategoryLoading(true);
    const slug = categoryBucketSlug ?? "all";
    loadProductsByCategorySlug(
      slug,
      searchQuery ? { search: searchQuery } : undefined
    );
  }, [categoryBucketSlug, loadProductsByCategorySlug, searchQuery]);

  if (categoryLoading || (loading && sourceProducts.length === 0)) {
    return (
      <div className="w-full bg-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="flex flex-col items-center justify-center">
            <Spinner size={40} color="border-blue-600" borderWidth={3} />
            <p className="text-gray-600 mt-4">
              {selectedCategory === "All"
                ? "Loading all products..."
                : `Loading ${selectedCategory} products...`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && sourceProducts.length === 0) {
    return (
      <div className="w-[75%] bg-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <p className="text-red-600 font-medium mb-2">
            Failed to load products
          </p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!loading && visibleProducts.length === 0) {
    return (
      <div className="w-[75%] bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">📦</div>
          <div className="text-gray-500 font-medium text-lg">
            No products found
          </div>
          <div className="text-gray-400 text-sm mt-1">
            {searchQuery
              ? "Try adjusting your search terms or filters"
              : selectedCategory !== "All"
              ? `No products found in ${selectedCategory} category`
              : "Try selecting a different category or check back later"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[75%] bg-white p-2 overflow-y-auto relative">
      {/* Loading Overlay when category changes */}
      {categoryLoading && (
        <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
          <div className="text-center">
            <Spinner size={40} color="border-blue-600" borderWidth={3} />
            <p className="text-gray-700 font-medium mt-3">
              Loading{" "}
              {selectedCategory === "All" ? "all products" : selectedCategory}
              ...
            </p>
          </div>
        </div>
      )}

      <div className="mb-4 px-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">
            {selectedCategory === "All" ? "All Products" : selectedCategory}
            {loading && (
              <span className="ml-2 text-sm text-blue-600 font-normal">
                <Spinner size={14} color="border-blue-600" />
                Loading...
              </span>
            )}
          </h2>
          <div className="text-sm text-gray-500">
            {sourceProducts.length} product
            {sourceProducts.length !== 1 ? "s" : ""} total
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mx-2 my-2">
        {visibleProducts.map((product: ProductType) => (
          <ProductCard
            key={(product as any).id ?? (product as any)._id}
            product={product}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex items-center justify-center py-6">
          <button
            onClick={handleLoadMore}
            className="bg-gray-100 border border-gray-200 px-4 py-2 rounded-md hover:bg-gray-200 transition flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size={16} color="border-gray-600" />
                Loading...
              </>
            ) : (
              `Load more (${sourceProducts.length - visibleProducts.length})`
            )}
          </button>
        </div>
      )}

      {!hasMore && visibleProducts.length > 0 && (
        <div className="text-center py-8">
          <div className="text-green-600 font-semibold">
            🎉 All products loaded!
          </div>
          <div className="text-sm text-gray-500 mt-1">
            You've reached the end of the catalog
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
