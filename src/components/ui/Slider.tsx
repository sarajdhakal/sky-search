"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  formatLabel?: (value: number) => string;
  className?: string;
}

export function Slider({
  min,
  max,
  value,
  onChange,
  step = 1,
  formatLabel = (v) => v.toString(),
  className,
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  const getPercentage = useCallback(
    (v: number) => ((v - min) / (max - min)) * 100,
    [min, max]
  );

  const getValue = useCallback(
    (percentage: number) => {
      const raw = (percentage / 100) * (max - min) + min;
      const stepped = Math.round(raw / step) * step;
      return Math.max(min, Math.min(max, stepped));
    },
    [min, max, step]
  );

  const handleMouseDown = (thumb: "min" | "max") => (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(thumb);
  };

  const handleMove = useCallback(
    (clientX: number) => {
      if (!dragging || !trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const percentage = ((clientX - rect.left) / rect.width) * 100;
      const newValue = getValue(percentage);

      if (dragging === "min") {
        onChange([Math.min(newValue, value[1] - step), value[1]]);
      } else {
        onChange([value[0], Math.max(newValue, value[0] + step)]);
      }
    },
    [dragging, getValue, onChange, step, value]
  );

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleMouseUp = () => setDragging(null);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, handleMove]);

  const minPercent = getPercentage(value[0]);
  const maxPercent = getPercentage(value[1]);

  return (
    <div className={cn("pt-2 pb-6", className)}>
      <div
        ref={trackRef}
        className="relative h-2 bg-slate-200 rounded-full cursor-pointer"
        onClick={(e) => {
          const rect = trackRef.current?.getBoundingClientRect();
          if (!rect) return;
          const percentage = ((e.clientX - rect.left) / rect.width) * 100;
          const newValue = getValue(percentage);
          const distToMin = Math.abs(newValue - value[0]);
          const distToMax = Math.abs(newValue - value[1]);
          if (distToMin < distToMax) {
            onChange([newValue, value[1]]);
          } else {
            onChange([value[0], newValue]);
          }
        }}
      >
        <div
          className="absolute h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />
        <div
          className={cn(
            "absolute w-5 h-5 bg-white rounded-full shadow-lg border-2 border-blue-500 -translate-x-1/2 -translate-y-1/2 top-1/2 cursor-grab transition-transform",
            dragging === "min" && "scale-110 cursor-grabbing"
          )}
          style={{ left: `${minPercent}%` }}
          onMouseDown={handleMouseDown("min")}
        />
        <div
          className={cn(
            "absolute w-5 h-5 bg-white rounded-full shadow-lg border-2 border-indigo-500 -translate-x-1/2 -translate-y-1/2 top-1/2 cursor-grab transition-transform",
            dragging === "max" && "scale-110 cursor-grabbing"
          )}
          style={{ left: `${maxPercent}%` }}
          onMouseDown={handleMouseDown("max")}
        />
      </div>
      <div className="flex justify-between mt-2 text-sm text-slate-600">
        <span>{formatLabel(value[0])}</span>
        <span>{formatLabel(value[1])}</span>
      </div>
    </div>
  );
}
