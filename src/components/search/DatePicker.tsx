"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isBefore,
  parseISO,
  startOfDay,
} from "date-fns";

export function DatePicker({ label, value, onChange, minDate = new Date(), placeholder = "Select date" }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => (value ? parseISO(value) : new Date()));
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update position for the Hanging Structure
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && !buttonRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    const result = [];
    let day = start;
    while (day <= end) {
      result.push(day);
      day = addDays(day, 1);
    }
    return result;
  }, [currentMonth]);

  const calendarDropdown = (
    <div
      ref={dropdownRef}
      style={{ top: coords.top, left: coords.left, position: "absolute" }}
      className="z-[9999] w-[320px] rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Bold Header to match image_94bcf0.png */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-slate-50 rounded-full">
          <ChevronLeft className="h-6 w-6 text-slate-700 stroke-[2.5px]" />
        </button>

        <span className="text-lg font-bold text-slate-800 tracking-tight">
          {format(currentMonth, "MMMM yyyy")}
        </span>

        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-slate-50 rounded-full">
          <ChevronRight className="h-6 w-6 text-slate-700 stroke-[2.5px]" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-2">
        {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map(d => (
          <div key={d} className="h-8 flex items-center justify-center text-xs font-medium text-slate-500 ">{d}</div>
        ))}
        {days.map((day, i) => {
          const isSelected = value && isSameDay(day, parseISO(value));
          const disabled = isBefore(startOfDay(day), startOfDay(minDate));
          const isCurrMonth = isSameMonth(day, currentMonth);

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => {
                onChange(format(day, "yyyy-MM-dd"));
                setIsOpen(false);
              }}
              className={cn(
                "h-10 w-10 rounded-lg text-sm font-medium transition-all",
                !isCurrMonth && "text-slate-300 pointer-events-none",
                isCurrMonth && !isSelected && !disabled && "text-slate-700 hover:bg-slate-100",
                isSelected && "bg-[#0066FF] text-white font-bold shadow-md shadow-blue-200",
                disabled && "text-slate-100 text-black cursor-not-allowed opacity-30"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex-1">
      <label className="block text-[13px] font-bold text-slate-500 mb-2 ml-1 uppercase tracking-wide">{label}</label>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-14 px-4 rounded-xl border-2 flex items-center gap-3 transition-all bg-white",
          isOpen ? "border-[#0066FF] shadow-sm" : "border-slate-100 hover:border-slate-300"
        )}
      >
        <Calendar className="h-5 w-5 text-slate-400" />
        <span className={cn("text-[15px] tracking-tight", !value ? "text-slate-400" : "text-slate-900")}>
          {value ? format(parseISO(value), "EEE, MMM d") : placeholder}
        </span>
      </button>
      {isOpen && typeof document !== "undefined" && createPortal(calendarDropdown, document.body)}
    </div>
  );
}