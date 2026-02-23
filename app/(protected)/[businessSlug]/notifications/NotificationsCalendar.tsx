"use client";

import { useMemo, useState } from "react";
import Button from "@/components/Button";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CALENDAR_CELL_COUNT = 42;

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const startOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const addMonths = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth() + amount, 1);

const addDays = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);

const toDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const parseDateKey = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
};

type CalendarCell = {
  date: Date;
  key: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
};

const buildCalendarCells = (visibleMonth: Date, today: Date): CalendarCell[] => {
  const monthStart = startOfMonth(visibleMonth);
  const dayOfWeek = monthStart.getDay(); // 0 Sun ... 6 Sat
  const mondayOffset = (dayOfWeek + 6) % 7;
  const gridStart = addDays(monthStart, -mondayOffset);
  const monthIndex = visibleMonth.getMonth();

  return Array.from({ length: CALENDAR_CELL_COUNT }, (_, index) => {
    const date = addDays(gridStart, index);
    const day = startOfDay(date);
    const key = toDateKey(day);

    return {
      date: day,
      key,
      isCurrentMonth: day.getMonth() === monthIndex,
      isToday: key === toDateKey(today),
      isPast: day.getTime() < today.getTime(),
    };
  });
};

const formatMonthLabel = (date: Date) =>
  date.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

const formatSelectedDateLabel = (value: string) =>
  parseDateKey(value).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const NotificationsCalendar = () => {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(today));
  const [selectedDateKeys, setSelectedDateKeys] = useState<string[]>([]);

  const monthLabel = useMemo(
    () => formatMonthLabel(visibleMonth),
    [visibleMonth],
  );

  const calendarCells = useMemo(
    () => buildCalendarCells(visibleMonth, today),
    [today, visibleMonth],
  );

  const toggleDate = (cell: CalendarCell) => {
    if (cell.isPast) return;

    setSelectedDateKeys((current) => {
      if (current.includes(cell.key)) {
        return current.filter((value) => value !== cell.key);
      }
      return [...current, cell.key];
    });
  };

  return (
    <section className="rounded-2xl border border-accent-3 bg-accent-1 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-brand">
            Schedule Calendar
          </h2>
          <p className="mt-2 text-sm text-contrast/80">
            Select one or more dates for a future notification campaign.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="neutral"
            onClick={() => setVisibleMonth(startOfMonth(today))}
          >
            Today
          </Button>
          <Button
            type="button"
            size="sm"
            variant="neutral"
            onClick={() => setSelectedDateKeys([])}
            disabled={selectedDateKeys.length === 0}
          >
            Clear dates
          </Button>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-accent-3 bg-primary/35 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="neutral"
              onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
              aria-label="Previous month"
            >
              ‹
            </Button>
            <Button
              type="button"
              size="sm"
              variant="neutral"
              onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
              aria-label="Next month"
            >
              ›
            </Button>
          </div>
          <p className="text-sm font-semibold text-contrast">{monthLabel}</p>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-2">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="flex h-8 items-center justify-center text-[11px] font-semibold uppercase tracking-wide text-contrast/60"
            >
              {label}
            </div>
          ))}

          {calendarCells.map((cell) => {
            const isSelected = selectedDateKeys.includes(cell.key);

            const baseClassName =
              "relative flex h-12 items-center justify-center rounded-lg border text-sm font-semibold transition-all duration-200";

            const stateClassName = cell.isPast
              ? "cursor-not-allowed border-accent-3/60 bg-primary/40 text-contrast/35"
              : isSelected
                ? "border-brand/60 bg-brand text-primary shadow-[0_8px_20px_-12px_rgba(230,52,90,0.7)]"
                : cell.isCurrentMonth
                  ? "border-accent-3 bg-primary/70 text-contrast hover:border-brand/50 hover:bg-brand/10 hover:text-brand"
                  : "border-accent-3/70 bg-primary/40 text-contrast/45 hover:border-accent-3 hover:text-contrast/70";

            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => toggleDate(cell)}
                disabled={cell.isPast}
                className={`${baseClassName} ${stateClassName}`}
                aria-pressed={isSelected}
                aria-label={`${isSelected ? "Deselect" : "Select"} ${cell.date.toDateString()}`}
              >
                <span>{cell.date.getDate()}</span>
                {cell.isToday ? (
                  <span
                    className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${
                      isSelected ? "bg-primary" : "bg-brand"
                    }`}
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NotificationsCalendar;
