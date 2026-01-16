"use client";

import { useState } from "react";
import { Airport, SearchParams } from "@/types/flight";
import { AirportSearch } from "./AirportSearch";
import { DatePicker } from "./DatePicker";
import { PassengerSelector } from "./PassengerSelector";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ArrowUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  loading?: boolean;
}

export function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [tripType, setTripType] = useState<"roundtrip" | "oneway">("roundtrip");
  const [origin, setOrigin] = useState<Airport | null>(null);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [departureDate, setDepartureDate] = useState(
    format(addDays(new Date(), 7), "yyyy-MM-dd")
  );
  const [returnDate, setReturnDate] = useState(
    format(addDays(new Date(), 14), "yyyy-MM-dd")
  );
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [travelClass, setTravelClass] = useState<SearchParams["travelClass"]>("ECONOMY");

  const handleSwapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!origin || !destination || !departureDate) {
      return;
    }

    const params: SearchParams = {
      origin: origin.iataCode,
      destination: destination.iataCode,
      departureDate,
      returnDate: tripType === "roundtrip" ? returnDate : undefined,
      adults: passengers.adults,
      children: passengers.children,
      infants: passengers.infants,
      travelClass,
    };

    onSearch(params);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-4 sm:p-6 lg:p-8">
        {/* Trip Type Toggle */}
        <div className="flex gap-2 mb-4 sm:mb-6">
          <button
            type="button"
            onClick={() => setTripType("roundtrip")}
            className={cn(
              "px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all",
              tripType === "roundtrip"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            Round Trip
          </button>
          <button
            type="button"
            onClick={() => setTripType("oneway")}
            className={cn(
              "px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all",
              tripType === "oneway"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            One Way
          </button>
        </div>

        {/* Main Search Fields */}
        <div className="space-y-4">
          {/* Origin & Destination - Stack on mobile */}
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-end gap-3 sm:gap-4">
              <div className="flex-1">
                <AirportSearch
                  label="From"
                  placeholder="City or airport"
                  value={origin}
                  onChange={setOrigin}
                  icon="departure"
                />
              </div>

              {/* Swap button - positioned differently on mobile vs desktop */}
              <button
                type="button"
                onClick={handleSwapLocations}
                className="absolute right-0 top-6 sm:hidden z-10 h-10 w-10 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 shadow-md"
                title="Swap locations"
              >
                <ArrowUpDown className="h-4 w-4 text-slate-500" />
              </button>

              <button
                type="button"
                onClick={handleSwapLocations}
                className="hidden sm:flex flex-shrink-0 h-12 w-12 rounded-xl border border-slate-200 bg-white items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all self-end"
                title="Swap locations"
              >
                <ArrowUpDown className="h-5 w-5 text-slate-500 rotate-90" />
              </button>

              <div className="flex-1">
                <AirportSearch
                  label="To"
                  placeholder="City or airport"
                  value={destination}
                  onChange={setDestination}
                  icon="arrival"
                />
              </div>
            </div>
          </div>

          {/* Dates - Stack on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <DatePicker
              label="Departure"
              value={departureDate}
              onChange={setDepartureDate}
              placeholder="Select date"
            />
            {tripType === "roundtrip" && (
              <DatePicker
                label="Return"
                value={returnDate}
                onChange={setReturnDate}
                minDate={departureDate ? new Date(departureDate) : undefined}
                placeholder="Select date"
              />
            )}
          </div>

          {/* Passengers & Class - Stack on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <PassengerSelector
              value={passengers}
              onChange={setPassengers}
            />
            <Select
              label="Class"
              value={travelClass}
              onChange={(e) => setTravelClass(e.target.value as SearchParams["travelClass"])}
              options={[
                { value: "ECONOMY", label: "Economy" },
                { value: "PREMIUM_ECONOMY", label: "Premium Economy" },
                { value: "BUSINESS", label: "Business" },
                { value: "FIRST", label: "First" },
              ]}
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-6">
          <Button
            type="submit"
            size="lg"
            loading={loading}
            disabled={!origin || !destination || !departureDate}
            className="w-full"
          >
            <Search className="h-5 w-5 mr-2" />
            Search Flights
          </Button>
        </div>
      </div>
    </form>
  );
}