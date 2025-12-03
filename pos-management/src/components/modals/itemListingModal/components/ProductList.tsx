import { useState, useEffect, useRef } from "react";
import { Search, Plus } from "lucide-react";
import useProducts from "../../../../hooks/useProducts";
import { ProductTable } from "./ProductTable";
import { MinimalPagination } from "./Pagination";

export const ProductList = ({ onAddItem, onEditItem }: any) => {
  const [search, setSearch] = useState("");
  const timeoutRef = useRef<number | null>(null);
  const { products, pagination, loading, reload } = useProducts();

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      reload({
        q: search || undefined,
        page: 1,
        limit: 6,
      });
    }, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [search]);

  // 2. Initial load - MANDATORY
  useEffect(() => {
    reload({ page: 1, limit: 6 });
  }, []);

  // 3. Page change handler - MANDATORY
  const goToPage = (page: number) => {
    reload({
      q: search || undefined,
      page,
      limit: 6,
    });
  };

  return (
    <>
      <h3 className="text-2xl px-2 font-bold text-blue-700 pb-3">
        Material List
      </h3>

      <div className="flex items-center space-x-2 mb-4">
        <div className="grow relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 " />
          <input
            type="text"
            placeholder="Search..."
            className="w-1/2 pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={loading}
          />
        </div>
        <button
          onClick={onAddItem}
          className="bg-blue-800 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md flex items-center"
          disabled={loading}
        >
          <Plus size={18} className="mr-1" /> Add
        </button>
      </div>

      <ProductTable products={products} onEditItem={onEditItem} />

      {pagination && pagination.pages > 1 && (
        <MinimalPagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={goToPage}
          loading={loading}
        />
      )}
    </>
  );
};
