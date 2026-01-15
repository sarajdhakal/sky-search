"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { FlightOffer } from "@/types/flight";
import { formatPrice, getStopsCount, formatHour } from "@/lib/utils";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

interface PriceGraphProps {
  flights: FlightOffer[];
  filteredFlights: FlightOffer[];
}

interface PriceDataPoint {
  name: string;
  allFlights: number;
  filteredFlights: number | null;
  count: number;
  filteredCount: number;
}

interface TooltipPayload {
  value: number;
  name: string;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

export function PriceGraph({ flights, filteredFlights }: PriceGraphProps) {
  // Price distribution by time of day
  const priceByTimeData = useMemo(() => {
    const timeSlots = [
      { name: "Early Morning", range: [0, 6], label: "12AM-6AM" },
      { name: "Morning", range: [6, 12], label: "6AM-12PM" },
      { name: "Afternoon", range: [12, 18], label: "12PM-6PM" },
      { name: "Evening", range: [18, 24], label: "6PM-12AM" },
    ];

    return timeSlots.map((slot) => {
      const allInSlot = flights.filter((f) => {
        const hour = new Date(f.itineraries[0].segments[0].departure.at).getHours();
        return hour >= slot.range[0] && hour < slot.range[1];
      });

      const filteredInSlot = filteredFlights.filter((f) => {
        const hour = new Date(f.itineraries[0].segments[0].departure.at).getHours();
        return hour >= slot.range[0] && hour < slot.range[1];
      });

      const allPrices = allInSlot.map((f) => parseFloat(f.price.grandTotal));
      const filteredPrices = filteredInSlot.map((f) => parseFloat(f.price.grandTotal));

      return {
        name: slot.label,
        allFlights: allPrices.length > 0 ? Math.min(...allPrices) : 0,
        filteredFlights: filteredPrices.length > 0 ? Math.min(...filteredPrices) : null,
        count: allInSlot.length,
        filteredCount: filteredInSlot.length,
      };
    });
  }, [flights, filteredFlights]);

  // Price distribution by stops
  const priceByStopsData = useMemo(() => {
    const stopsCategories = [
      { name: "Nonstop", stops: 0 },
      { name: "1 Stop", stops: 1 },
      { name: "2+ Stops", stops: 2 },
    ];

    return stopsCategories.map((cat) => {
      const allWithStops = flights.filter((f) => {
        const stops = getStopsCount(f.itineraries[0].segments);
        return cat.stops === 2 ? stops >= 2 : stops === cat.stops;
      });

      const filteredWithStops = filteredFlights.filter((f) => {
        const stops = getStopsCount(f.itineraries[0].segments);
        return cat.stops === 2 ? stops >= 2 : stops === cat.stops;
      });

      const allPrices = allWithStops.map((f) => parseFloat(f.price.grandTotal));
      const filteredPrices = filteredWithStops.map((f) => parseFloat(f.price.grandTotal));

      return {
        name: cat.name,
        allFlights: allPrices.length > 0 ? Math.min(...allPrices) : 0,
        filteredFlights: filteredPrices.length > 0 ? Math.min(...filteredPrices) : null,
        count: allWithStops.length,
        filteredCount: filteredWithStops.length,
      };
    });
  }, [flights, filteredFlights]);

  // Price statistics
  const stats = useMemo(() => {
    if (filteredFlights.length === 0) return null;

    const prices = filteredFlights.map((f) => parseFloat(f.price.grandTotal));
    const allPrices = flights.map((f) => parseFloat(f.price.grandTotal));

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    const overallMin = Math.min(...allPrices);

    return {
      min,
      max,
      avg,
      savings: avg - overallMin,
      savingsPercent: ((avg - overallMin) / avg) * 100,
    };
  }, [flights, filteredFlights]);

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
        <p className="font-medium text-slate-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.name === "filteredFlights" ? "#3b82f6" : "#e2e8f0" }}
            />
            <span className="text-slate-600">
              {entry.name === "filteredFlights" ? "Filtered" : "All"}:
            </span>
            <span className="font-medium">
              {entry.value ? formatPrice(entry.value) : "N/A"}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (flights.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-900">Price Analysis</h3>
        <p className="text-sm text-slate-500 mt-1">
          See how prices change based on filters
        </p>
      </div>

      {/* Price Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 border-b border-slate-200">
          <div className="text-center">
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
              Lowest
            </div>
            <div className="text-lg font-bold text-green-600">
              {formatPrice(stats.min)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
              Average
            </div>
            <div className="text-lg font-bold text-slate-900">
              {formatPrice(stats.avg)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
              Highest
            </div>
            <div className="text-lg font-bold text-red-500">
              {formatPrice(stats.max)}
            </div>
          </div>
        </div>
      )}

      <div className="p-4 space-y-6">
        {/* Price by Time of Day */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-3">
            Prices by Departure Time
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceByTimeData} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="allFlights" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="allFlights">
                  {priceByTimeData.map((entry, index) => (
                    <Cell key={`cell-all-${index}`} fill="#e2e8f0" />
                  ))}
                </Bar>
                <Bar dataKey="filteredFlights" fill="#3b82f6" radius={[4, 4, 0, 0]} name="filteredFlights">
                  {priceByTimeData.map((entry, index) => (
                    <Cell
                      key={`cell-filtered-${index}`}
                      fill={entry.filteredFlights ? "#3b82f6" : "transparent"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Price by Stops */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-3">
            Prices by Number of Stops
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceByStopsData}>
                <defs>
                  <linearGradient id="colorAll" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e2e8f0" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#e2e8f0" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorFiltered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="allFlights"
                  stroke="#cbd5e1"
                  fill="url(#colorAll)"
                  name="allFlights"
                />
                <Area
                  type="monotone"
                  dataKey="filteredFlights"
                  stroke="#3b82f6"
                  fill="url(#colorFiltered)"
                  name="filteredFlights"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Flight Count Indicator */}
        <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-200" />
            <span className="text-sm text-slate-600">All flights</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500" />
            <span className="text-sm text-slate-600">Filtered flights</span>
          </div>
        </div>
      </div>
    </div>
  );
}
