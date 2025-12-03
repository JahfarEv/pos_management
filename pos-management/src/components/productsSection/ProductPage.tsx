import CategoryPanel from "./CategoryPanel";
import ProductGrid from "./ProductGrid";
import { useState } from "react";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="flex w-full h-full">
      <CategoryPanel
        onCategorySelect={(cat) => {
          setSelectedCategory(cat);
        }}
      />

      <ProductGrid selectedCategory={selectedCategory} />
    </div>
  );
}
