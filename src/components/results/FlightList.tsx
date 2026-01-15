"use client";

import { FlightOffer } from "@/types/flight";
import { FlightCard } from "./FlightCard";
import { FlightSkeletonList } from "./FlightSkeleton";
import { Select } from "@/components/ui/Select";
import { Plane, AlertCircle } from "lucide-react";

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
            Prices include taxes and fees
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
        {flights.map((flight, index) => (
          <div
            key={flight.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <FlightCard flight={flight} />
          </div>
        ))}
      </div>
    </div>
  );
}
