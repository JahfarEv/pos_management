
import React, { useState, useEffect, useCallback, useRef } from "react";
import { ProductCard } from "./ProductCard";
import { useCategories } from "../../hooks/useCategory";
import type { Product as ProductType } from "../../store/slices/categorySlice";
import { Spinner } from "../common/Spinner";

interface ProductGridProps {
  searchQuery?: string;
  selectedCategory?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  searchQuery = "",
  selectedCategory = "All",
}) => {
  const {
    setCategory,
    loadProductsByCategorySlug,
    getProductsBucket,
    getProductsPagination,
    hasMoreProductsByCategorySlug,
    loadingMoreProducts,
    getCategoryByName,
    getCategoryBySlug,
  } = useCategories();

  const [categoryBucketSlug, setCategoryBucketSlug] = useState<string>("all");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Debug logs
  console.log("🔄 ProductGrid rendering", {
    selectedCategory,
    searchQuery,
    categoryBucketSlug,
    isInitialLoad,
  });

  // Get products data
  const bucket = getProductsBucket(categoryBucketSlug);
  console.log("📊 Bucket data:", {
    slug: categoryBucketSlug,
    dataLength: bucket?.data?.length || 0,
    data: bucket?.data,
    loading: bucket?.loading,
    error: bucket?.error,
    pagination: bucket?.pagination,
  });

  const sourceProducts: ProductType[] = bucket?.data || [];
  const loading = bucket?.loading || false;
  const error = bucket?.error || null;
  
  // Get pagination info
  const pagination = getProductsPagination(categoryBucketSlug);
  
  // Check if has more products
  const hasMore = hasMoreProductsByCategorySlug(categoryBucketSlug);
  
  // Check if current category is loading more
  const isCurrentCategoryLoadingMore = loadingMoreProducts === categoryBucketSlug;

  // Load initial products when category or search changes
  useEffect(() => {
    console.log("🎯 useEffect triggered for category/search change");
    
    const loadProducts = async () => {
      setIsInitialLoad(true);
      console.log("🚀 Starting product load...");
      
      let slugToUse = "all";
      let selectedId = "All";

      if (searchQuery && searchQuery.trim().length > 0) {
        const cat = selectedCategory && selectedCategory !== "All" 
          ? selectedCategory 
          : "all";
        selectedId = selectedCategory ?? "All";
        slugToUse = cat;
      } else if (!selectedCategory || selectedCategory === "All") {
        selectedId = "All";
        slugToUse = "all";
      } else {
        const byName = getCategoryByName(selectedCategory);
        const bySlug = getCategoryBySlug(selectedCategory);
        const cat = bySlug || byName;

        slugToUse = cat?.slug ?? cat?.name ?? cat?.id ?? selectedCategory;
        selectedId = cat?.id ?? cat?._id ?? cat?.slug ?? selectedCategory;
      }

      console.log("🎯 Setting up category:", {
        selectedCategory,
        searchQuery,
        slugToUse,
        selectedId,
      });

      setCategory(selectedId);
      setCategoryBucketSlug(slugToUse);
      
      try {
        console.log("📡 Calling loadProductsByCategorySlug for:", slugToUse);
        await loadProductsByCategorySlug(slugToUse, { 
          page: 1,
          search: searchQuery || undefined,
        });
        console.log("✅ Products loaded successfully");
      } catch (err) {
        console.error("❌ Failed to load products:", err);
      } finally {
        setIsInitialLoad(false);
      }
    };

    loadProducts();
  }, [
    selectedCategory,
    searchQuery,
    loadProductsByCategorySlug,
    getCategoryByName,
    getCategoryBySlug,
    setCategory,
  ]);

  // Setup infinite scroll
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isLoadingRef = useRef(false);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingRef.current || loading || isCurrentCategoryLoadingMore || !hasMore) {
      console.log("⏸️ Cannot load more - blocked by:", {
        isLoadingRef: isLoadingRef.current,
        loading,
        isCurrentCategoryLoadingMore,
        hasMore,
      });
      return;
    }

    console.log("⬇️ Loading more products for:", categoryBucketSlug);
    isLoadingRef.current = true;

    try {
      await loadProductsByCategorySlug(categoryBucketSlug, { 
        page: (pagination.currentPage || 1) + 1,
      });
      console.log("✅ More products loaded");
    } catch (error) {
      console.error("❌ Failed to load more products:", error);
    } finally {
      isLoadingRef.current = false;
    }
  }, [categoryBucketSlug, loading, isCurrentCategoryLoadingMore, hasMore, loadProductsByCategorySlug, pagination.currentPage]);

  // Setup Intersection Observer
  useEffect(() => {
    if (!loadMoreTriggerRef.current || !hasMore) {
      return;
    }

    console.log("👀 Setting up Intersection Observer");

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        console.log("🎯 Intersection entry:", entry.isIntersecting);
        
        if (entry.isIntersecting) {
          handleLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observer.observe(loadMoreTriggerRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleLoadMore, hasMore]);

  // Display loading state
  if ((loading && isInitialLoad) || sourceProducts.length === 0 && loading) {
    return (
      
          <div className="flex flex-col items-center justify-center">
            <Spinner size={40} color="border-blue-600" borderWidth={3} />
            
            
          </div>
     
    );
  }

  // Display error state
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
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Display empty state
  // if (!loading && sourceProducts.length === 0) {
  //   return (
  //     <div className="w-[75%] bg-white flex items-center justify-center min-h-[400px]">
  //       <div className="text-center">
  //         <div className="text-gray-400 text-4xl mb-4">📦</div>
  //         <div className="text-gray-500 font-medium text-lg">
  //           No products found
  //         </div>
  //         <div className="text-gray-400 text-sm mt-1">
  //           {searchQuery
  //             ? "Try adjusting your search terms"
  //             : selectedCategory !== "All"
  //             ? `No products in "${selectedCategory}" category`
  //             : "No products available"}
  //         </div>
  //         <button
  //           onClick={() => window.location.reload()}
  //           className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
  //         >
  //           Refresh Page
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }


  return (
    <div className="w-[75%] bg-white p-4 overflow-y-auto relative">
      {/* Debug Header - Remove in production */}
      <div className="mb-4 p-3  rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            {/* <h2 className="text-xl font-bold text-">
              {selectedCategory === "" ? "" : selectedCategory}
            </h2> */}
           
          </div>
          
          {loading && (
            <span className="flex items-center text-sm text-blue-600">
              <Spinner size={14} color="border-blue-600"/>
              Loading...
            </span>
          )}
        </div>
        
        {/* Debug info */}
        <div className="mt-2 text-xs text-gray-600">
          <div className="grid grid-cols-3 gap-2">
            <div>Bucket: {categoryBucketSlug}</div>
            <div>Has More: {hasMore ? 'Yes' : 'No'}</div>
            <div>Loading More: {isCurrentCategoryLoadingMore ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-4 gap-4">
        {sourceProducts.map((product: ProductType, index) => {
          console.log(`📦 Rendering product ${index}:`, product.name);
          return (
            <ProductCard
              key={`${product._id || product.id}-${index}`}
              product={product}
            />
          );
        })}
      </div>

      {/* Load More Trigger */}
      {hasMore && (
        <div 
          ref={loadMoreTriggerRef} 
          className="h-20 flex items-center justify-center my-4"
        >
          <div className="text-center">
            <div className="text-gray-500 text-sm mb-2">
              Scroll down to load more products
            </div>
            <button
              onClick={handleLoadMore}
              disabled={loading || isCurrentCategoryLoadingMore}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
            >
              {loading || isCurrentCategoryLoadingMore ? (
                <div className="flex items-center gap-2">
                  <Spinner size={16} color="border-blue-600" />
                  Loading...
                </div>
              ) : (
                "Load More Products"
              )}
            </button>
          </div>
        </div>
      )}

      {/* End Message */}
      {!hasMore && sourceProducts.length > 0 && (
        <div className="text-center py-8 mt-4 border-t border-gray-200">
          <div className="text-green-600 font-medium mb-2">
            🎉 All {sourceProducts.length} products loaded
          </div>
          <div className="text-sm text-gray-500">
            You've reached the end of the list
          </div>
        </div>
      )}

      {/* Empty grid message */}
      {sourceProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">😕</div>
          <div className="text-gray-500 font-medium">
            No products to display
          </div>
          <div className="text-gray-400 text-sm mt-2">
            Try selecting a different category
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;