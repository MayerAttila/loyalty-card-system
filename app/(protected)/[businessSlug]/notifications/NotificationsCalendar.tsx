"use client";

import { useMemo, useState } from "react";
import Button from "@/components/Button";
import type { NotificationRecord } from "@/types/notification";
import {
  getNotificationColor,
  notificationWeekdayToJsDay,
} from "./notificationVisuals";

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

const startOfWeekMonday = (date: Date) => {
  const day = date.getDay(); // 0..6
  const mondayOffset = (day + 6) % 7;
  return addDays(startOfDay(date), -mondayOffset);
};

const getWeekDiff = (from: Date, to: Date) => {
  const diffMs = startOfWeekMonday(to).getTime() - startOfWeekMonday(from).getTime();
  return Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
};

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

const buildCalendarCells = (
  visibleMonth: Date,
  today: Date,
): CalendarCell[] => {
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

type NotificationsCalendarProps = {
  notifications?: NotificationRecord[];
};

type CalendarNotificationMarker = {
  id: string;
  color: string;
  active: boolean;
};

const NotificationsCalendar = ({
  notifications = [],
}: NotificationsCalendarProps) => {
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

  const notificationMarkersByDate = useMemo(() => {
    const map = new Map<string, CalendarNotificationMarker[]>();
    const visibleDateKeys = new Set(calendarCells.map((cell) => cell.key));

    const pushMarker = (dateKey: string, marker: CalendarNotificationMarker) => {
      if (!visibleDateKeys.has(dateKey)) return;
      const current = map.get(dateKey) ?? [];
      if (!current.some((item) => item.id === marker.id)) {
        current.push(marker);
      }
      map.set(dateKey, current);
    };

    for (const notification of notifications) {
      if (notification.deliveryMode === "now") continue;

      const marker: CalendarNotificationMarker = {
        id: notification.id,
        color: getNotificationColor(notification.id),
        active: notification.status === "active",
      };

      if (notification.scheduleType === "repeat") {
        if (notification.repeatPattern === "monthly") {
          const dayOfMonth = notification.monthlyDayOfMonth ?? null;
          if (!dayOfMonth || dayOfMonth < 1 || dayOfMonth > 31) continue;

          for (const cell of calendarCells) {
            if (cell.date.getDate() === dayOfMonth) {
              pushMarker(cell.key, marker);
            }
          }
          continue;
        }

        const repeatJsDays = new Set<number>();
        for (const day of notification.repeatDays) {
          const jsDay = notificationWeekdayToJsDay(day);
          if (jsDay !== null) repeatJsDays.add(jsDay);
        }
        if (repeatJsDays.size === 0) continue;

        const biweeklyAnchor = new Date(
          notification.createdAt ??
            notification.scheduledAtUtc ??
            notification.nextRunAtUtc ??
            Date.now(),
        );

        for (const cell of calendarCells) {
          if (!repeatJsDays.has(cell.date.getDay())) continue;
          if (notification.repeatPattern === "biweekly") {
            const diffWeeks = getWeekDiff(biweeklyAnchor, cell.date);
            const parity = ((diffWeeks % 2) + 2) % 2;
            if (parity !== 0) continue;
          }
          pushMarker(cell.key, marker);
        }
        continue;
      }

      const scheduledIso = notification.scheduledAtUtc ?? notification.nextRunAtUtc;
      if (!scheduledIso) continue;
      const scheduledDate = new Date(scheduledIso);
      if (Number.isNaN(scheduledDate.getTime())) continue;
      pushMarker(toDateKey(startOfDay(scheduledDate)), marker);
    }

    return map;
  }, [calendarCells, notifications]);

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
      <div>
        <div>
          <h2 className="text-xl font-semibold text-brand">
            Schedule Calendar
          </h2>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-accent-3 bg-primary/35 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="neutral"
              onClick={() =>
                setVisibleMonth((current) => addMonths(current, -1))
              }
              aria-label="Previous month"
            >
              ‹
            </Button>
            <Button
              type="button"
              size="sm"
              variant="neutral"
              onClick={() =>
                setVisibleMonth((current) => addMonths(current, 1))
              }
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
            const markers = notificationMarkersByDate.get(cell.key) ?? [];
            const visibleMarkers = markers.slice(0, 3);
            const extraMarkerCount = Math.max(markers.length - visibleMarkers.length, 0);

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
                {markers.length > 0 ? (
                  <span className="pointer-events-none absolute bottom-1 left-1 right-1 flex items-center justify-center gap-1">
                    {visibleMarkers.map((marker) => (
                      <span
                        key={marker.id}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          backgroundColor: marker.color,
                          opacity: marker.active ? 1 : 0.35,
                        }}
                        aria-hidden="true"
                      />
                    ))}
                    {extraMarkerCount > 0 ? (
                      <span className="text-[10px] font-semibold leading-none text-contrast/65">
                        +{extraMarkerCount}
                      </span>
                    ) : null}
                  </span>
                ) : null}
                {cell.isToday ? (
                  <span
                    className={`absolute right-1 top-1 h-1.5 w-1.5 rounded-full ${
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
