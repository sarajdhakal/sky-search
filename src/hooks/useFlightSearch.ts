"use client";

import { useState, useCallback, useMemo } from "react";
import { FlightOffer, SearchParams, FilterState, AIRLINES } from "@/types/flight";
import { getStopsCount, getDurationInMinutes, getHourFromDateTime } from "@/lib/utils";

interface UseFlightSearchReturn {
  flights: FlightOffer[];
  filteredFlights: FlightOffer[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
  availableAirlines: { code: string; name: string }[];
  priceRange: [number, number];
  maxDuration: number;
  searchFlights: (params: SearchParams) => Promise<void>;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const DEFAULT_FILTERS: FilterState = {
  stops: [],
  priceRange: [0, 10000],
  airlines: [],
  departureTimeRange: [0, 24],
  arrivalTimeRange: [0, 24],
  duration: 1440,
};

export function useFlightSearch(): UseFlightSearchReturn {
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState("price");

  const searchFlights = useCallback(async (params: SearchParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed");
      }

      setFlights(data.data || []);

      // Reset filters when new search
      setFilters(DEFAULT_FILTERS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const availableAirlines = useMemo(() => {
    const airlineCodes = new Set<string>();
    flights.forEach((flight) => {
      flight.validatingAirlineCodes.forEach((code) => airlineCodes.add(code));
      flight.itineraries.forEach((itinerary) => {
        itinerary.segments.forEach((segment) => {
          airlineCodes.add(segment.carrierCode);
        });
      });
    });

    return Array.from(airlineCodes)
      .map((code) => ({
        code,
        name: AIRLINES[code] || code,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [flights]);

  const priceRange = useMemo((): [number, number] => {
    if (flights.length === 0) return [0, 10000];

    const prices = flights.map((f) => parseFloat(f.price.grandTotal));
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [flights]);

  const maxDuration = useMemo(() => {
    if (flights.length === 0) return 1440;

    let max = 0;
    flights.forEach((flight) => {
      flight.itineraries.forEach((itinerary) => {
        const duration = getDurationInMinutes(itinerary.duration);
        if (duration > max) max = duration;
      });
    });

    return Math.ceil(max / 60) * 60;
  }, [flights]);

  const filteredFlights = useMemo(() => {
    let result = [...flights];

    // Filter by stops
    if (filters.stops.length > 0) {
      result = result.filter((flight) => {
        const stops = getStopsCount(flight.itineraries[0].segments);
        return filters.stops.includes(stops) || (filters.stops.includes(2) && stops >= 2);
      });
    }

    // Filter by price
    result = result.filter((flight) => {
      const price = parseFloat(flight.price.grandTotal);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Filter by airlines
    if (filters.airlines.length > 0) {
      result = result.filter((flight) => {
        const flightAirlines = new Set<string>();
        flight.validatingAirlineCodes.forEach((code) => flightAirlines.add(code));
        flight.itineraries.forEach((itinerary) => {
          itinerary.segments.forEach((segment) => {
            flightAirlines.add(segment.carrierCode);
          });
        });
        return filters.airlines.some((airline) => flightAirlines.has(airline));
      });
    }

    // Filter by departure time
    if (filters.departureTimeRange[0] > 0 || filters.departureTimeRange[1] < 24) {
      result = result.filter((flight) => {
        const departureHour = getHourFromDateTime(flight.itineraries[0].segments[0].departure.at);
        return departureHour >= filters.departureTimeRange[0] && departureHour <= filters.departureTimeRange[1];
      });
    }

    // Filter by arrival time
    if (filters.arrivalTimeRange[0] > 0 || filters.arrivalTimeRange[1] < 24) {
      result = result.filter((flight) => {
        const segments = flight.itineraries[0].segments;
        const arrivalHour = getHourFromDateTime(segments[segments.length - 1].arrival.at);
        return arrivalHour >= filters.arrivalTimeRange[0] && arrivalHour <= filters.arrivalTimeRange[1];
      });
    }

    // Filter by duration
    if (filters.duration < maxDuration) {
      result = result.filter((flight) => {
        const duration = getDurationInMinutes(flight.itineraries[0].duration);
        return duration <= filters.duration;
      });
    }

    // Sort results
    result.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return parseFloat(a.price.grandTotal) - parseFloat(b.price.grandTotal);
        case "duration":
          return (
            getDurationInMinutes(a.itineraries[0].duration) -
            getDurationInMinutes(b.itineraries[0].duration)
          );
        case "departure":
          return (
            new Date(a.itineraries[0].segments[0].departure.at).getTime() -
            new Date(b.itineraries[0].segments[0].departure.at).getTime()
          );
        case "arrival":
          const aSegments = a.itineraries[0].segments;
          const bSegments = b.itineraries[0].segments;
          return (
            new Date(aSegments[aSegments.length - 1].arrival.at).getTime() -
            new Date(bSegments[bSegments.length - 1].arrival.at).getTime()
          );
        case "stops":
          return (
            getStopsCount(a.itineraries[0].segments) -
            getStopsCount(b.itineraries[0].segments)
          );
        default:
          return 0;
      }
    });

    return result;
  }, [flights, filters, sortBy, maxDuration]);

  const resetFilters = useCallback(() => {
    setFilters({
      ...DEFAULT_FILTERS,
      priceRange,
      duration: maxDuration,
    });
  }, [priceRange, maxDuration]);

  return {
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
  };
}
