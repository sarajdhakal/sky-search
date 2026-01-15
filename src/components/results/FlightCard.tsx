"use client";

import { FlightOffer, AIRLINES } from "@/types/flight";
import {
  formatDuration,
  formatTime,
  formatPrice,
  getStopsCount,
  getStopsLabel,
} from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Plane, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface FlightCardProps {
  flight: FlightOffer;
  isExpanded?: boolean;
}

export function FlightCard({ flight }: FlightCardProps) {
  const [expanded, setExpanded] = useState(false);
  const outbound = flight.itineraries[0];
  const returnFlight = flight.itineraries[1];
  const firstSegment = outbound.segments[0];
  const lastSegment = outbound.segments[outbound.segments.length - 1];
  const stops = getStopsCount(outbound.segments);
  const mainCarrier = flight.validatingAirlineCodes[0];
  const airlineName = AIRLINES[mainCarrier] || mainCarrier;

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-slate-300",
        expanded && "shadow-lg border-slate-300"
      )}
    >
      <div className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Airline Info */}
          <div className="flex items-center gap-3 lg:w-40 flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {mainCarrier}
            </div>
            <div>
              <div className="font-medium text-slate-900 text-sm lg:text-base">
                {airlineName}
              </div>
              <div className="text-xs text-slate-500">
                {firstSegment.carrierCode} {firstSegment.number}
              </div>
            </div>
          </div>

          {/* Flight Times */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              {/* Departure */}
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-slate-900">
                  {formatTime(firstSegment.departure.at)}
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  {firstSegment.departure.iataCode}
                </div>
              </div>

              {/* Duration & Stops */}
              <div className="flex-1 px-4">
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(outbound.duration)}
                </div>
                <div className="relative">
                  <div className="h-0.5 bg-slate-200 rounded-full" />
                  <Plane className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 bg-white" />
                  {stops > 0 && (
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 text-xs text-amber-600 font-medium whitespace-nowrap">
                      {getStopsLabel(stops)}
                    </div>
                  )}
                </div>
              </div>

              {/* Arrival */}
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-slate-900">
                  {formatTime(lastSegment.arrival.at)}
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  {lastSegment.arrival.iataCode}
                </div>
              </div>
            </div>

            {/* Return Flight (if exists) */}
            {returnFlight && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-900">
                      {formatTime(returnFlight.segments[0].departure.at)}
                    </div>
                    <div className="text-sm text-slate-600">
                      {returnFlight.segments[0].departure.iataCode}
                    </div>
                  </div>

                  <div className="flex-1 px-4">
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(returnFlight.duration)}
                    </div>
                    <div className="relative">
                      <div className="h-0.5 bg-slate-200 rounded-full" />
                      <Plane className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 bg-white rotate-180" />
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-900">
                      {formatTime(
                        returnFlight.segments[returnFlight.segments.length - 1]
                          .arrival.at
                      )}
                    </div>
                    <div className="text-sm text-slate-600">
                      {
                        returnFlight.segments[returnFlight.segments.length - 1]
                          .arrival.iataCode
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Price & Action */}
          <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 lg:ml-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <div className="text-right">
              <div className="text-2xl lg:text-3xl font-bold text-slate-900">
                {formatPrice(flight.price.grandTotal, flight.price.currency)}
              </div>
              <div className="text-xs text-slate-500">
                {flight.travelerPricings.length > 1
                  ? "total for all travelers"
                  : "per person"}
              </div>
            </div>
            <button
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              Select
            </button>
          </div>
        </div>
      </div>

      {/* Expand/Collapse Details */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-3 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 text-sm text-slate-600 font-medium"
      >
        {expanded ? (
          <>
            Hide details <ChevronUp className="h-4 w-4" />
          </>
        ) : (
          <>
            Show details <ChevronDown className="h-4 w-4" />
          </>
        )}
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-6 pb-6 bg-slate-50 animate-fade-in">
          <div className="space-y-6">
            {flight.itineraries.map((itinerary, itinIndex) => (
              <div key={itinIndex}>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">
                  {itinIndex === 0 ? "Outbound" : "Return"} Flight
                </h4>
                <div className="space-y-3">
                  {itinerary.segments.map((segment, segIndex) => (
                    <div
                      key={segIndex}
                      className="bg-white rounded-lg p-4 border border-slate-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                          {segment.carrierCode}
                        </div>
                        <div className="flex-1 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="font-semibold text-slate-900">
                              {formatTime(segment.departure.at)}
                            </div>
                            <div className="text-slate-500">
                              {segment.departure.iataCode}
                              {segment.departure.terminal &&
                                ` T${segment.departure.terminal}`}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-slate-500">
                              {formatDuration(segment.duration)}
                            </div>
                            <div className="text-xs text-slate-400">
                              {AIRLINES[segment.carrierCode] || segment.carrierCode}{" "}
                              {segment.number}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-slate-900">
                              {formatTime(segment.arrival.at)}
                            </div>
                            <div className="text-slate-500">
                              {segment.arrival.iataCode}
                              {segment.arrival.terminal &&
                                ` T${segment.arrival.terminal}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Price Breakdown */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">
                Price Breakdown
              </h4>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                {flight.travelerPricings.map((pricing, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm py-1"
                  >
                    <span className="text-slate-600">
                      {pricing.travelerType === "ADULT"
                        ? "Adult"
                        : pricing.travelerType === "CHILD"
                          ? "Child"
                          : "Infant"}
                    </span>
                    <span className="font-medium text-slate-900">
                      {formatPrice(pricing.price.total, pricing.price.currency)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-sm pt-2 mt-2 border-t border-slate-200">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="font-bold text-blue-600">
                    {formatPrice(flight.price.grandTotal, flight.price.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
