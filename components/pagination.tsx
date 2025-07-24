"use client";

import { Pagination as PaginationType } from "@/types/Pagination";

interface PaginationProps {
  currentPage: number;
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  pagination,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
      >
        Previous
      </button>

      <div className="text-sm">
        Page {currentPage} of {pagination.total_pages}
        <span className="ml-2 text-gray-500">
          ({pagination.total_count} results)
        </span>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= pagination.total_pages}
        className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
