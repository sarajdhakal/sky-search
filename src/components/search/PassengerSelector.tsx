"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Users, Minus, Plus } from "lucide-react";

interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

interface PassengerSelectorProps {
  value: PassengerCounts;
  onChange: (counts: PassengerCounts) => void;
}

export function PassengerSelector({ value, onChange }: PassengerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const totalPassengers = value.adults + value.children + value.infants;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateCount = (type: keyof PassengerCounts, delta: number) => {
    const newValue = { ...value };
    newValue[type] = Math.max(
      type === "adults" ? 1 : 0,
      Math.min(9, newValue[type] + delta)
    );

    // Ensure infants don't exceed adults
    if (type === "adults" && newValue.infants > newValue.adults) {
      newValue.infants = newValue.adults;
    }

    onChange(newValue);
  };

  const passengerTypes = [
    {
      key: "adults" as const,
      label: "Adults",
      description: "12+ years",
      min: 1,
    },
    {
      key: "children" as const,
      label: "Children",
      description: "2-11 years",
      min: 0,
    },
    {
      key: "infants" as const,
      label: "Infants",
      description: "Under 2 years",
      min: 0,
    },
  ];

  return (
    <div className="relative flex-1">
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        Passengers
      </label>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-left flex items-center gap-3",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          "hover:border-slate-300"
        )}
      >
        <Users className="h-5 w-5 text-slate-400" />
        <span className="text-slate-900">
          {totalPassengers} {totalPassengers === 1 ? "Passenger" : "Passengers"}
        </span>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-5 w-72 animate-fade-in"
        >
          <div className="space-y-4">
            {passengerTypes.map(({ key, label, description, min }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">{label}</div>
                  <div className="text-sm text-slate-500">{description}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateCount(key, -1)}
                    disabled={value[key] <= min}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                      value[key] <= min
                        ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-6 text-center font-semibold text-slate-900">
                    {value[key]}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCount(key, 1)}
                    disabled={value[key] >= 9}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                      value[key] >= 9
                        ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                        : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    )}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {value.infants > value.adults && (
            <p className="mt-3 text-sm text-amber-600 bg-amber-50 rounded-lg p-2">
              Each infant must be accompanied by an adult.
            </p>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full mt-4 h-10 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
