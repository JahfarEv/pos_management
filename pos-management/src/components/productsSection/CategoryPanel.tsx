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
  const [isMobile, setIsMobile] = useState(false);

  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const isLoadingRef = useRef(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

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
        rootMargin: isMobile ? "100px" : "200px", // Smaller margin on mobile
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
  }, [debouncedLoadMore, isMobile]);

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
    const isNearBottom =
      triggerRect.top <= windowHeight + (isMobile ? 150 : 300); // Reduced threshold on mobile

    if (isNearBottom && hasMoreCategories()) {
      console.log("Scroll: Near bottom, loading more");
      debouncedLoadMore();
    }
  }, [
    hasMoreCategories,
    categoryLoading,
    loadingMore,
    debouncedLoadMore,
    isMobile,
  ]);

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

  const handleCategorySelect = (categoryName: string) => {
    setLoadingCategory(categoryName);

    if (categoryName === "All") {
      setCategory("All");
      loadProductsByCategorySlug("all");
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

  const handleManualLoadMore = useCallback(async () => {
    if (isLoadingRef.current || categoryLoading || loadingMore) {
      console.log("Already loading, skipping manual trigger");
      return;
    }

    isLoadingRef.current = true;
    setInfiniteScrollTriggered(true);

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
      className={`
        bg-white border-gray-300 p-2 overflow-y-auto 
        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']
        ${
          isMobile
            ? "w-full border-b" // Full width on mobile, border at bottom
            : "min-w-[35%] border-r" // Original layout on desktop
        }
      `}
      style={{
        maxHeight: isMobile ? "50vh" : "calc(100vh - 100px)", // Reduced height on mobile
      }}
    >
      <div
        className={`
        grid gap-2
        ${
          isMobile
            ? "grid-cols-3" 
            : "grid-cols-2" 
        }
        sm:grid-cols-3 // 3 columns on small tablets
        md:grid-cols-2 // Back to 2 columns on medium screens
        lg:grid-cols-2 // Maintain 2 columns on large screens
      `}
      >
        {/* Categories List */}
        {categoriesNames.map((categoryName, index) => {
          const active = isCategorySelected(categoryName);
          return (
            <button
              key={`${categoryName}-${index}`}
              onClick={() => handleCategorySelect(categoryName)}
              className={`
                p-3 text-sm font-bold cursor-pointer uppercase rounded border-2 
                flex items-center justify-center text-center
                ${isMobile ? "h-16 min-w-[100px]" : "h-22 min-w-[120px]"}
                ${
                  active
                    ? "bg-blue-300 text-white border-blue-400 shadow-md"
                    : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 hover:border-gray-400"
                }
                transition-all duration-200 active:scale-95 // Add touch feedback
              `}
              style={{
                wordBreak: "break-word", // Better text wrapping
              }}
            >
              {loadingCategory === categoryName ? (
                <Spinner
                  size={isMobile ? 18 : 22} // Smaller spinner on mobile
                  color={active ? "border-white" : "border-blue-600"}
                  borderWidth={3}
                />
              ) : (
                <span className="truncate">
                  {" "}
                  {/* Truncate long text */}
                  {categoryName}
                </span>
              )}
            </button>
          );
        })}

        {/* INFINITE SCROLL SPINNER */}
        {(showInfiniteScrollSpinner || loadingMore) && (
          <div className="col-span-full flex flex-col items-center justify-center py-4">
            <div className="flex items-center justify-center mb-2">
              <Spinner
                size={isMobile ? 24 : 28}
                color="border-blue-600"
                borderWidth={3}
              />
            </div>
            {!isMobile && ( // Hide text on mobile to save space
              <span className="text-gray-600 text-sm">
                Loading more categories...
              </span>
            )}
          </div>
        )}

        {hasMoreCategories() && !showInfiniteScrollSpinner && !loadingMore && (
          <div
            ref={loadMoreTriggerRef}
            className="col-span-full flex flex-col items-center justify-center py-4"
          >
            <div className="text-center mb-2">
              <div
                className={`
                ${isMobile ? "text-[10px]" : "text-xs"} 
                text-gray-400
              `}
              >
                {categoriesPagination.page} of {categoriesPagination.pages}
              </div>
            </div>

            <button
              onClick={handleManualLoadMore}
              disabled={categoryLoading || infiniteScrollTriggered}
              className={`
                px-4 py-2 bg-transparent text-blue-600 rounded-lg border border-blue-300
                disabled:opacity-50 disabled:cursor-not-allowed font-medium 
                transition-all duration-200 flex items-center hover:bg-blue-50
                active:scale-95
                ${isMobile ? "text-xs" : "text-sm"}
              `}
            >
              {infiniteScrollTriggered ? (
                <>
                  <Spinner
                    size={isMobile ? 14 : 16}
                    color="border-blue-600"
                    borderWidth={2}
                  />
                  {!isMobile && <span className="ml-2">Loading...</span>}
                </>
              ) : (
                <>
                  <span className="truncate">
                    {isMobile ? "Load More" : "Load More Categories"}
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Initial Loading Indicator */}
      {categoryLoading && !loadingMore && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="flex items-center">
            <Spinner
              size={isMobile ? 24 : 32}
              color="border-blue-600"
              borderWidth={4}
            />
            {!isMobile && (
              <span className="ml-3 text-gray-600 text-sm font-medium">
                Loading categories...
              </span>
            )}
          </div>
          {!isMobile && (
            <div className="text-xs text-gray-500 mt-2">
              Fetching categories from server
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryPanel;
