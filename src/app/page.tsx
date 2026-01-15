"use client";

import { useState } from "react";
import { SearchForm } from "@/components/search/SearchForm";
import { FlightList } from "@/components/results/FlightList";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { PriceGraph } from "@/components/results/PriceGraph";
import { useFlightSearch } from "@/hooks/useFlightSearch";
import { SearchParams } from "@/types/flight";
import { Plane, Filter, Search, Zap, DollarSign } from "lucide-react";

export default function Home() {
  const {
    flights,
    filteredFlights,
    loading,
    error,
    filters,
    availableAirlines,
    priceRange,
    maxDuration,
    searchFlights,
    setFilters,
    resetFilters,
    sortBy,
    setSortBy,
  } = useFlightSearch();

  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (params: SearchParams) => {
    setHasSearched(true);
    await searchFlights(params);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          {/* Logo & Title */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Plane className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white">
                SkySearch
              </h1>
            </div>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Find the perfect flight at the best price. Compare thousands of
              flights from top airlines worldwide.
            </p>
          </div>

          {/* Search Form */}
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-slate-50"
            />
          </svg>
        </div>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="bg-slate-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Mobile Filter Toggle */}
            {flights.length > 0 && (
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowFilters(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  <Filter className="h-5 w-5" />
                  Filters
                  {(filters.stops.length > 0 || filters.airlines.length > 0) && (
                    <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                      Active
                    </span>
                  )}
                </button>
              </div>
            )}

            <div className="flex gap-8">
              {/* Filters Sidebar */}
              {flights.length > 0 && (
                <FilterPanel
                  filters={filters}
                  onChange={setFilters}
                  onReset={resetFilters}
                  availableAirlines={availableAirlines}
                  priceRange={priceRange}
                  maxDuration={maxDuration}
                  filteredCount={filteredFlights.length}
                  totalCount={flights.length}
                  isOpen={showFilters}
                  onClose={() => setShowFilters(false)}
                />
              )}

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Flight List */}
                  <div className="xl:col-span-2">
                    <FlightList
                      flights={filteredFlights}
                      loading={loading}
                      error={error}
                      sortBy={sortBy}
                      onSortChange={setSortBy}
                      totalFlights={flights.length}
                    />
                  </div>

                  {/* Price Graph */}
                  {flights.length > 0 && !loading && (
                    <div className="xl:col-span-1">
                      <div className="sticky top-4">
                        <PriceGraph
                          flights={flights}
                          filteredFlights={filteredFlights}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Initial State (Before Search) */}
      {!hasSearched && (
        <div className="bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  title: "Smart Search",
                  description:
                    "Compare prices from hundreds of airlines and travel sites in seconds.",
                },
                {

                  title: "Best Prices",
                  description:
                    "Find the lowest fares with our real-time price tracking and alerts.",
                },
                {

                  title: "Lightning Fast",
                  description:
                    "Get results instantly with our optimized search engine.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow"                >
                  <div className="text-4xl mb-4">
                    {feature.title === "Smart Search" && (<Search className="h-10 w-10 mx-auto text-blue-500" />
                    )}
                    {feature.title === "Best Prices" && (
                      <DollarSign className="h-10 w-10 mx-auto text-blue-500" />
                    )}
                    {feature.title === "Lightning Fast" && (
                      <Zap className="h-10 w-10 mx-auto text-blue-500" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Popular Routes */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">
                Popular Routes
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { from: "NYC", to: "LAX", price: "$99" },
                  { from: "SFO", to: "LHR", price: "$449" },
                  { from: "MIA", to: "CDG", price: "$389" },
                  { from: "ORD", to: "DXB", price: "$699" },
                ].map((route, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="font-bold text-slate-900">
                        {route.from}
                      </span>
                      <Plane className="h-4 w-4 text-blue-500" />
                      <span className="font-bold text-slate-900">
                        {route.to}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500">from</div>
                    <div className="text-xl font-bold text-blue-600">
                      {route.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Plane className="h-6 w-6" />
              <span className="font-bold text-lg">Sky Search</span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2026 SarajCreation. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
