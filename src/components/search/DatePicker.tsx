"use client";

import { useState, useRef, useEffect } from "react";
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
  isAfter,
  isBefore,
  parseISO,
} from "date-fns";

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  minDate?: Date;
  placeholder?: string;
}

export function DatePicker({
  label,
  value,
  onChange,
  minDate = new Date(),
  placeholder = "Select date",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    value ? parseISO(value) : new Date()
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedDate = value ? parseISO(value) : null;

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

  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days: Date[] = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    onChange(format(date, "yyyy-MM-dd"));
    setIsOpen(false);
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(date, today) || isBefore(date, minDate);
  };

  return (
    <div className="relative flex-1">
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
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
        <Calendar className="h-5 w-5 text-slate-400" />
        {selectedDate ? (
          <span className="text-slate-900">
            {format(selectedDate, "EEE, MMM d")}
          </span>
        ) : (
          <span className="text-slate-400">{placeholder}</span>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-4 animate-fade-in w-[320px]"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-slate-600" />
            </button>
            <span className="font-semibold text-slate-900">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <button
              type="button"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="h-8 flex items-center justify-center text-xs font-medium text-slate-500"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((day, index) => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              const disabled = isDateDisabled(day);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => !disabled && handleDateSelect(day)}
                  disabled={disabled}
                  className={cn(
                    "h-10 w-10 rounded-lg text-sm font-medium transition-all",
                    !isCurrentMonth && "text-slate-300",
                    isCurrentMonth && !isSelected && !disabled && "text-slate-700 hover:bg-slate-100",
                    isSelected && "bg-blue-600 text-white hover:bg-blue-700",
                    isToday && !isSelected && "ring-2 ring-blue-200",
                    disabled && "text-slate-300 cursor-not-allowed hover:bg-transparent"
                  )}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
