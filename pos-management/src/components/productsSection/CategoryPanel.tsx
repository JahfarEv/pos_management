import React from "react";
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
  } = useCategories();
  const [loadingCategory, setLoadingCategory] = React.useState<string | null>(
    null
  );

  // -------------------------
  // Handle Category Clicking
  // -------------------------
  
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

    const slug = cat?.slug || cat?.name || cat?.id || cat?._id || categoryName;

    const selectedId = cat?.id || cat?._id || cat?.slug || categoryName;

    setCategory(selectedId);
    loadProductsByCategorySlug(slug);
    onCategorySelect(categoryName);

    setTimeout(() => setLoadingCategory(null), 400);
  };

  const isCategorySelected = (categoryName: string) => {
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
  };

  return (
    <div className="w-[35%] bg-white border-r border-gray-300 p-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">

      <div className="grid grid-cols-2 gap-2">
        {categoriesNames.map((categoryName) => {
          const active = isCategorySelected(categoryName);

          return (
            <button
              key={categoryName}
              onClick={() => handleCategorySelect(categoryName)}
              className={`p-3 text-sm font-bold uppercase rounded border-2 transition-all flex items-center justify-center text-center h-16
    ${
      active
        ? "bg-blue-600 text-white border-blue-700 shadow-md"
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
      </div>

      {categoriesNames.length > 1 && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          {categoriesNames.length - 1} categories available
        </div>
      )}
    </div>
  );
};

export default CategoryPanel;
