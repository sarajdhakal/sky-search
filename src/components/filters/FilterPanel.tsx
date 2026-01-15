"use client";

import { FilterState } from "@/types/flight";
import { Slider } from "@/components/ui/Slider";
import { formatPrice, formatHour } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Filter,
  X,
  CircleDot,
  DollarSign,
  Clock,
  Building2,
  RotateCcw,
} from "lucide-react";

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  availableAirlines: { code: string; name: string }[];
  priceRange: [number, number];
  maxDuration: number;
  filteredCount: number;
  totalCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export function FilterPanel({
  filters,
  onChange,
  onReset,
  availableAirlines,
  priceRange,
  maxDuration,
  filteredCount,
  totalCount,
  isOpen,
  onClose,
}: FilterPanelProps) {
  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleStop = (stop: number) => {
    const newStops = filters.stops.includes(stop)
      ? filters.stops.filter((s) => s !== stop)
      : [...filters.stops, stop];
    updateFilter("stops", newStops);
  };

  const toggleAirline = (code: string) => {
    const newAirlines = filters.airlines.includes(code)
      ? filters.airlines.filter((a) => a !== code)
      : [...filters.airlines, code];
    updateFilter("airlines", newAirlines);
  };

  const hasActiveFilters =
    filters.stops.length > 0 ||
    filters.airlines.length > 0 ||
    filters.priceRange[0] > priceRange[0] ||
    filters.priceRange[1] < priceRange[1] ||
    filters.departureTimeRange[0] > 0 ||
    filters.departureTimeRange[1] < 24 ||
    filters.duration < maxDuration;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Filter Panel */}
      <div
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto w-80 lg:w-72 bg-white lg:bg-transparent transition-transform duration-300 lg:transition-none overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="lg:sticky lg:top-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-slate-600" />
                <h3 className="font-semibold text-slate-900">Filters</h3>
              </div>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={onReset}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="lg:hidden p-1 hover:bg-slate-100 rounded-lg"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Filter result count */}
            <div className="px-4 py-2 bg-slate-50 text-sm text-slate-600">
              Showing {filteredCount} of {totalCount} flights
            </div>

            <div className="p-4 space-y-6">
              {/* Stops */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CircleDot className="h-4 w-4 text-slate-500" />
                  <h4 className="font-medium text-slate-900">Stops</h4>
                </div>
                <div className="space-y-2">
                  {[
                    { value: 0, label: "Nonstop" },
                    { value: 1, label: "1 stop" },
                    { value: 2, label: "2+ stops" },
                  ].map(({ value, label }) => (
                    <label
                      key={value}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.stops.includes(value)}
                        onChange={() => toggleStop(value)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700 group-hover:text-slate-900">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="h-4 w-4 text-slate-500" />
                  <h4 className="font-medium text-slate-900">Price</h4>
                </div>
                <Slider
                  min={priceRange[0]}
                  max={priceRange[1]}
                  value={[
                    Math.max(filters.priceRange[0], priceRange[0]),
                    Math.min(filters.priceRange[1], priceRange[1]),
                  ]}
                  onChange={(value) => updateFilter("priceRange", value)}
                  step={10}
                  formatLabel={(v) => formatPrice(v)}
                />
              </div>

              {/* Departure Time */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <h4 className="font-medium text-slate-900">Departure Time</h4>
                </div>
                <Slider
                  min={0}
                  max={24}
                  value={filters.departureTimeRange}
                  onChange={(value) => updateFilter("departureTimeRange", value)}
                  step={1}
                  formatLabel={formatHour}
                />
              </div>

              {/* Duration */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <h4 className="font-medium text-slate-900">Max Duration</h4>
                </div>
                <div className="pt-2 pb-6">
                  <input
                    type="range"
                    min={60}
                    max={maxDuration}
                    step={30}
                    value={filters.duration}
                    onChange={(e) =>
                      updateFilter("duration", parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between mt-2 text-sm text-slate-600">
                    <span>1h</span>
                    <span className="font-medium text-blue-600">
                      {Math.floor(filters.duration / 60)}h{" "}
                      {filters.duration % 60 > 0 && `${filters.duration % 60}m`}
                    </span>
                    <span>{Math.floor(maxDuration / 60)}h</span>
                  </div>
                </div>
              </div>

              {/* Airlines */}
              {availableAirlines.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    <h4 className="font-medium text-slate-900">Airlines</h4>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableAirlines.map(({ code, name }) => (
                      <label
                        key={code}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={filters.airlines.includes(code)}
                          onChange={() => toggleAirline(code)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700 group-hover:text-slate-900 truncate">
                          {name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
