"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Airport, POPULAR_AIRPORTS } from "@/types/flight";
import { cn, debounce } from "@/lib/utils";
import { Plane, MapPin, X } from "lucide-react";

interface AirportSearchProps {
  label: string;
  placeholder: string;
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
  icon?: "departure" | "arrival";
}

export function AirportSearch({
  label,
  placeholder,
  value,
  onChange,
  icon = "departure",
}: AirportSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [airports, setAirports] = useState<Airport[]>(POPULAR_AIRPORTS.slice(0, 6));
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const searchAirports = useCallback(
    debounce(async (keyword: string) => {
      if (!keyword || keyword.length < 2) {
        setAirports(POPULAR_AIRPORTS.slice(0, 6));
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/airports?keyword=${encodeURIComponent(keyword)}`);
        const data = await response.json();
        setAirports(data.data || []);
      } catch {
        setAirports([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    searchAirports(query);
  }, [query, searchAirports]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (airport: Airport) => {
    onChange(airport);
    setQuery("");
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < airports.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : airports.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && airports[highlightedIndex]) {
          handleSelect(airports[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <div className="relative flex-1">
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Plane
            className={cn(
              "h-5 w-5",
              icon === "departure" ? "rotate-[-45deg]" : "rotate-45"
            )}
          />
        </div>
        {value ? (
          <div
            className={cn(
              "w-full h-12 pl-10 pr-10 rounded-xl border border-slate-200 bg-white flex items-center cursor-pointer",
              "hover:border-slate-300 transition-all duration-200"
            )}
            onClick={() => {
              onChange(null);
              inputRef.current?.focus();
              setIsOpen(true);
            }}
          >
            <span className="font-semibold text-blue-600 mr-2">
              {value.iataCode}
            </span>
            <span className="text-slate-600 truncate">
              {value.city}
            </span>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
                inputRef.current?.focus();
              }}
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            className={cn(
              "w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "hover:border-slate-300"
            )}
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
          />
        )}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in"
        >
          {loading && (
            <div className="p-4 text-center text-slate-500">
              <div className="inline-block animate-spin h-5 w-5 border-2 border-slate-300 border-t-blue-500 rounded-full" />
            </div>
          )}

          {!loading && airports.length === 0 && (
            <div className="p-4 text-center text-slate-500">
              No airports found
            </div>
          )}

          {!loading && airports.length > 0 && (
            <ul className="max-h-64 overflow-y-auto">
              {airports.map((airport, index) => (
                <li
                  key={`${airport.iataCode}-${index}`}
                  className={cn(
                    "px-4 py-3 cursor-pointer transition-colors flex items-start gap-3",
                    highlightedIndex === index
                      ? "bg-blue-50"
                      : "hover:bg-slate-50"
                  )}
                  onClick={() => handleSelect(airport)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <MapPin className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-600">
                        {airport.iataCode}
                      </span>
                      <span className="text-slate-900 truncate">
                        {airport.city}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 truncate">
                      {airport.name}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
