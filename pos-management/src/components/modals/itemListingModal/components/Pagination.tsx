import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  startIndex,
  onPageChange,
}) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="flex justify-between items-center pt-4 text-xs text-gray-600">
      <span>
        Showing {startIndex + 1}-{endIndex} of {totalItems} records
      </span>
      <div className="flex items-center space-x-1">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="px-3 py-1 border border-gray-300 rounded-md">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};