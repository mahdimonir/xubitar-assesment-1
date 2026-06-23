"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
}

export function Pagination({ totalItems, itemsPerPage }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className={`flex items-center justify-center space-x-4 text-sm font-semibold text-gray-700 bg-gray-50/50 py-3.5 px-6 border-t border-gray-100 transition-opacity duration-200 ${
      isPending ? "opacity-60" : ""
    }`}>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!hasPrev}
        className={`w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center transition-colors select-none ${
          hasPrev
            ? "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
            : "bg-gray-100 text-gray-300 cursor-not-allowed"
        }`}
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <span className="text-gray-900 select-none">
        Showing {startItem} to {endItem} from {totalItems}
      </span>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!hasNext}
        className={`w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center transition-colors select-none ${
          hasNext
            ? "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
            : "bg-gray-100 text-gray-300 cursor-not-allowed"
        }`}
        aria-label="Next Page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
