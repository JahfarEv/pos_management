import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MinimalPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export const MinimalPagination: React.FC<MinimalPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}) => {
  const handlePrevPage = () => {
    if (currentPage > 1 && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-2 pt-4">
      {/* Previous button */}
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1 || loading}
        className={`
          w-10 h-10
          rounded-full
          border border-gray-300
          flex items-center justify-center
          transition
          ${currentPage === 1 || loading
            ? "opacity-50 cursor-not-allowed bg-gray-100"
            : "hover:bg-gray-100 hover:border-gray-400"
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
        `}
        aria-label="Previous page"
      >
        <ChevronLeft size={20} className="text-gray-600" />
      </button>

      {/* Current page indicator */}
      <span className="px-3 py-1 text-sm text-gray-600">
        {currentPage} / {totalPages}
      </span>

      {/* Next button */}
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages || loading}
        className={`
          w-10 h-10
          rounded-full
          border border-gray-300
          flex items-center justify-center
          transition
          ${currentPage === totalPages || loading
            ? "opacity-50 cursor-not-allowed bg-gray-100"
            : "hover:bg-gray-100 hover:border-gray-400"
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
        `}
        aria-label="Next page"
      >
        <ChevronRight size={20} className="text-gray-600" />
      </button>
    </div>
  );
};