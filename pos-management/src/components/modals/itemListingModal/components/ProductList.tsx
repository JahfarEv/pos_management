import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { useAppSelector } from "../../../../store/hooks";
import { ProductTable } from "./ProductTable";
import { Pagination } from "./Pagination";
import type { Product } from "../../../../store/slices/productsSlice";

interface ProductListProps {
  onAddItem: () => void;
  onEditItem: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  onAddItem,
  onEditItem,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { products } = useAppSelector((state) => state.products);
  
  const itemsPerPage = 8;

  const filteredItems = products.filter((item) =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <>
      <h3 className="text-2xl px-2 font-bold text-blue-700 pb-3">
        Material List
      </h3>

      {/* Search and Add Button */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="grow relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by item name....."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={onAddItem}
          className="bg-blue-800 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md flex items-center transition shadow-md"
        >
          <Plus size={18} className="mr-1" /> Add Item
        </button>
      </div>

      {/* Product Table */}
      <ProductTable
        products={currentItems}
        onEditItem={onEditItem}
      />

      {/* Pagination */}
      {filteredItems.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredItems.length}
          itemsPerPage={itemsPerPage}
          startIndex={startIndex}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
};