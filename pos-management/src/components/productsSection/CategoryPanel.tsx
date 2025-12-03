import React, { useEffect, useRef, useCallback, useState } from "react";
import { useCategories } from "../../hooks/useCategory";
import Spinner from "../common/Spinner";

interface CategoryPanelProps {
  onCategorySelect: (category: string) => void;
}

export const CategoryPanel: React.FC<CategoryPanelProps> = ({
  onCategorySelect = () => {},
}) => {
  const {
    categoriesNames,
    selectedCategoryId,
    getCategoryByName,
    setCategory,
    loadProductsByCategorySlug,
    loadMoreCategories,
    hasMoreCategories,
    categoriesPagination,
    categoryLoading,
    loadingMore,
  } = useCategories();

  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);
  const [showInfiniteScrollSpinner, setShowInfiniteScrollSpinner] =
    useState(false);
  const [infiniteScrollTriggered, setInfiniteScrollTriggered] = useState(false);

  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const isLoadingRef = useRef(false); 

  const showSpinnerBeforeApiCall = useCallback(() => {
    setShowInfiniteScrollSpinner(true);
    setInfiniteScrollTriggered(true);

    const spinnerTimeout = setTimeout(() => {
      setShowInfiniteScrollSpinner(false);
    }, 500);

    return spinnerTimeout;
  }, []);

  const debouncedLoadMore = useCallback(async () => {
    // Prevent multiple triggers
    if (isLoadingRef.current || categoryLoading || loadingMore) {
      return;
    }

    const canLoadMore = hasMoreCategories();

    if (canLoadMore) {
      console.log("Triggering load more...");
      isLoadingRef.current = true;

      // Show spinner immediately
      const spinnerTimeout = showSpinnerBeforeApiCall();

      try {
        await loadMoreCategories();
      } catch (error) {
        console.error("Error loading more categories:", error);
      } finally {
        isLoadingRef.current = false;
        setInfiniteScrollTriggered(false);
        clearTimeout(spinnerTimeout);
        setShowInfiniteScrollSpinner(false);
      }
    }
  }, [
    hasMoreCategories,
    categoryLoading,
    loadingMore,
    loadMoreCategories,
    showSpinnerBeforeApiCall,
  ]);

  useEffect(() => {
    if (!loadMoreTriggerRef.current) {
      return;
    }

    console.log("Setting up intersection observer");

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          console.log("Intersection: Load more trigger visible");
          debouncedLoadMore();
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
      console.log("Cleaning up intersection observer");
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [debouncedLoadMore]);

  const handleScroll = useCallback(() => {
    const now = Date.now();
    const scrollDelay = 500; 

    if (now - lastScrollTimeRef.current < scrollDelay) {
      return;
    }

    lastScrollTimeRef.current = now;

    if (
      !loadMoreTriggerRef.current ||
      isLoadingRef.current ||
      categoryLoading ||
      loadingMore
    ) {
      return;
    }

    const triggerRect = loadMoreTriggerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const isNearBottom = triggerRect.top <= windowHeight + 300;

    if (isNearBottom && hasMoreCategories()) {
      console.log("Scroll: Near bottom, loading more");
      debouncedLoadMore();
    }
  }, [hasMoreCategories, categoryLoading, loadingMore, debouncedLoadMore]);

  useEffect(() => {
    console.log("Attaching scroll event");

    let ticking = false;

    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    const scrollElement = containerRef.current || window;
    scrollElement.addEventListener("scroll", scrollHandler, { passive: true });

    return () => {
      console.log("Removing scroll event");
      scrollElement.removeEventListener("scroll", scrollHandler);
    };
  }, [handleScroll]);

  // In CategoryPanel.tsx
  const handleCategorySelect = (categoryName: string) => {
    setLoadingCategory(categoryName);

    if (categoryName === "All") {
      setCategory("All");
      loadProductsByCategorySlug("all"); // This will call /products
      onCategorySelect("All");
      setTimeout(() => setLoadingCategory(null), 400);
      return;
    }

    const cat = getCategoryByName(categoryName);

    const slug = cat?.slug || categoryName.toLowerCase().replace(/\s+/g, "-");

    const selectedId = cat?.id || cat?._id || slug;

    setCategory(selectedId);
    loadProductsByCategorySlug(slug);
    onCategorySelect(categoryName);
    setTimeout(() => setLoadingCategory(null), 400);
  };

  const isCategorySelected = useCallback(
    (categoryName: string) => {
      if (categoryName === "All") {
        return selectedCategoryId === "All";
      }

      const cat = getCategoryByName(categoryName);
      if (cat) {
        return (
          selectedCategoryId === cat.id ||
          selectedCategoryId === cat._id ||
          selectedCategoryId === cat.slug ||
          selectedCategoryId === cat.name
        );
      }
      return selectedCategoryId === categoryName;
    },
    [selectedCategoryId, getCategoryByName]
  );

  // Manual load more with spinner
  const handleManualLoadMore = useCallback(async () => {
    if (isLoadingRef.current || categoryLoading || loadingMore) {
      console.log("Already loading, skipping manual trigger");
      return;
    }

    isLoadingRef.current = true;
    setInfiniteScrollTriggered(true);

    // Show spinner immediately
    const spinnerTimeout = showSpinnerBeforeApiCall();

    try {
      await loadMoreCategories();
    } catch (error) {
      console.error("Error loading more categories:", error);
    } finally {
      isLoadingRef.current = false;
      setInfiniteScrollTriggered(false);
      clearTimeout(spinnerTimeout);
      setShowInfiniteScrollSpinner(false);
    }
  }, [
    categoryLoading,
    loadingMore,
    loadMoreCategories,
    showSpinnerBeforeApiCall,
  ]);

  return (
    <div
      ref={containerRef}
      className="min-w-[35%] bg-white border-r border-gray-300 p-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
      style={{ maxHeight: "calc(100vh - 100px)" }}
    >
      <div className="grid grid-cols-2 gap-2">
        {/* Categories List */}
        {categoriesNames.map((categoryName, index) => {
          const active = isCategorySelected(categoryName);
          return (
            <button
              key={`${categoryName}-${index}`}
              onClick={() => handleCategorySelect(categoryName)}
              className={`p-3 text-sm font-bold cursor-pointer uppercase rounded border-2 flex items-center justify-center text-center h-22 min-w-[150px]
                ${
                  active
                    ? "bg-blue-300 text-white border-blue-400 shadow-md"
                    : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 hover:border-gray-400"
                }`}
            >
              {loadingCategory === categoryName ? (
                <Spinner
                  size={22}
                  color={active ? "border-white" : "border-blue-600"}
                  borderWidth={3}
                />
              ) : (
                categoryName
              )}
            </button>
          );
        })}

        {/* INFINITE SCROLL SPINNER - Show before API call */}
        {(showInfiniteScrollSpinner || loadingMore) && (
          <div className="col-span-2 flex flex-col items-center justify-center py-6">
            <div className="flex items-center justify-center mb-2">
              <Spinner size={28} color="border-blue-600" borderWidth={3} />
            </div>
            {/* <div className="text-sm text-gray-600 font-medium">
              Loading more categories...
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Please wait while we fetch more categories
            </div> */}
          </div>
        )}

        {/* Load More Trigger - Only show when there are more categories AND not loading */}
        {hasMoreCategories() && !showInfiniteScrollSpinner && !loadingMore && (
          <div
            ref={loadMoreTriggerRef}
            className="col-span-2 flex flex-col items-center justify-center py-4"
          >
            <div className="text-center mb-2">
              <div className="text-xs text-transparent">
                {categoriesPagination.page} of {categoriesPagination.pages}
              </div>
            </div>

            <button
              onClick={handleManualLoadMore}
              disabled={categoryLoading || infiniteScrollTriggered}
              className="px-4 py-2 bg-transparent text-transparent rounded-lg border  disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all duration-200 flex items-center"
            >
              {infiniteScrollTriggered ? (
                <>
                  <Spinner size={16} color="border-blue-600" borderWidth={2} />
                </>
              ) : (
                "Load More Categories"
              )}
            </button>
          </div>
        )}
      </div>

      {/* Initial Loading Indicator */}
      {categoryLoading && !loadingMore && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="flex items-center">
            <Spinner size={32} color="border-blue-600" borderWidth={4} />
            <span className="ml-3 text-gray-600 text-sm font-medium">
              Loading categories...
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Fetching categories from server
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPanel;
