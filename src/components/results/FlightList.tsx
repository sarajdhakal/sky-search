"use client";

import { useState, useEffect } from "react";
import { FlightOffer } from "@/types/flight";
import { FlightCard } from "./FlightCard";
import { FlightSkeletonList } from "./FlightSkeleton";
import { Select } from "@/components/ui/Select";
import { Plane, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

interface FlightListProps {
  flights: FlightOffer[];
  loading: boolean;
  error: string | null;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalFlights: number;
}

export function FlightList({
  flights,
  loading,
  error,
  sortBy,
  onSortChange,
  totalFlights,
}: FlightListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when flights change (new search or filter applied)
  useEffect(() => {
    setCurrentPage(1);
  }, [flights.length, sortBy]);

  const totalPages = Math.ceil(flights.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedFlights = flights.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  if (loading) {
    return <FlightSkeletonList />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-slate-600 max-w-md">{error}</p>
      </div>
    );
  }

  if (totalFlights === 0) {
    return null;
  }

  if (flights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
          <Plane className="h-8 w-8 text-amber-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          No flights match your filters
        </h3>
        <p className="text-slate-600">
          Try adjusting your filters to see more results
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {flights.length} of {totalFlights} flights
          </h2>
          <p className="text-sm text-slate-500">
            Showing {startIndex + 1}-{Math.min(endIndex, flights.length)} • Prices include taxes and fees
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Sort by:</span>
          <Select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            options={[
              { value: "price", label: "Price (Low to High)" },
              { value: "duration", label: "Duration (Shortest)" },
              { value: "departure", label: "Departure Time" },
              { value: "arrival", label: "Arrival Time" },
              { value: "stops", label: "Stops (Fewest)" },
            ]}
            className="w-48"
          />
        </div>
      </div>

      {/* Flight Cards */}
      <div className="space-y-4">
        {paginatedFlights.map((flight, index) => (
          <div
            key={flight.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <FlightCard flight={flight} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          {/* Previous Button */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(
              "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              currentPage === 1
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && goToPage(page)}
                disabled={page === "..."}
                className={cn(
                  "min-w-[40px] h-10 rounded-lg text-sm font-medium transition-colors",
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : page === "..."
                      ? "text-slate-400 cursor-default"
                      : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next Button of Pagination*/}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              currentPage === totalPages
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )
      }
    </div >
  );
}