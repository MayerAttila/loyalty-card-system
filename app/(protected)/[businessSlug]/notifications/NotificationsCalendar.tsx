"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";
import CustomDropdown from "@/components/CustomDropdown";
import { getPublicHolidays } from "@/api/client/holiday.api";
import type { HolidayCountryCode, PublicHolidayRecord } from "@/types/holiday";
import type { NotificationRecord } from "@/types/notification";
import {
  getNotificationColor,
  notificationWeekdayToJsDay,
} from "./notificationVisuals";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CALENDAR_CELL_COUNT = 42;
const HOLIDAY_MARKER_COLOR = "#f7c948";
const HOLIDAY_COUNTRY_STORAGE_KEY = "notifications_holiday_country";

const HOLIDAY_COUNTRY_OPTIONS: Array<{
  value: HolidayCountryCode;
  label: string;
}> = [
  { value: "AT", label: "Austria" },
  { value: "BE", label: "Belgium" },
  { value: "BG", label: "Bulgaria" },
  { value: "HR", label: "Croatia" },
  { value: "CZ", label: "Czechia" },
  { value: "DK", label: "Denmark" },
  { value: "EE", label: "Estonia" },
  { value: "FI", label: "Finland" },
  { value: "FR", label: "France" },
  { value: "DE", label: "Germany" },
  { value: "GR", label: "Greece" },
  { value: "HU", label: "Hungary" },
  { value: "IE", label: "Ireland" },
  { value: "IT", label: "Italy" },
  { value: "LV", label: "Latvia" },
  { value: "LT", label: "Lithuania" },
  { value: "LU", label: "Luxembourg" },
  { value: "NL", label: "Netherlands" },
  { value: "NO", label: "Norway" },
  { value: "PL", label: "Poland" },
  { value: "PT", label: "Portugal" },
  { value: "RO", label: "Romania" },
  { value: "SK", label: "Slovakia" },
  { value: "SI", label: "Slovenia" },
  { value: "ES", label: "Spain" },
  { value: "SE", label: "Sweden" },
  { value: "CH", label: "Switzerland" },
  { value: "GB", label: "United Kingdom" },
  { value: "US", label: "United States" },
];

const HOLIDAY_COUNTRY_OPTION_SET = new Set(
  HOLIDAY_COUNTRY_OPTIONS.map((option) => option.value),
);

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const startOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const addMonths = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth() + amount, 1);

const addDays = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);

const startOfWeekMonday = (date: Date) => {
  const day = date.getDay();
  const mondayOffset = (day + 6) % 7;
  return addDays(startOfDay(date), -mondayOffset);
};

const getWeekDiff = (from: Date, to: Date) => {
  const diffMs =
    startOfWeekMonday(to).getTime() - startOfWeekMonday(from).getTime();
  return Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
};

const toDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
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
  const dayOfWeek = monthStart.getDay();
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

const getHolidayCacheKey = (countryCode: HolidayCountryCode, year: number) =>
  `${countryCode}:${year}`;

const detectDefaultHolidayCountry = (): HolidayCountryCode => {
  if (typeof navigator === "undefined") return "HU";
  const locale = (navigator.language || "").toLowerCase();
  if (locale.startsWith("sk")) return "SK";
  if (locale.startsWith("hu")) return "HU";
  return "HU";
};

const readStoredHolidayCountry = (): HolidayCountryCode | null => {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(HOLIDAY_COUNTRY_STORAGE_KEY);
    if (!value) return null;
    const normalized = value.trim().toUpperCase();
    if (!HOLIDAY_COUNTRY_OPTION_SET.has(normalized)) {
      return null;
    }
    return normalized;
  } catch {
    return null;
  }
};

type NotificationsCalendarProps = {
  notifications?: NotificationRecord[];
  selectedNotificationId?: string | null;
  onDateSelect?: (dateKey: string) => void;
};

type CalendarNotificationMarker = {
  id: string;
  color: string;
  active: boolean;
};

const NotificationsCalendar = ({
  notifications = [],
  selectedNotificationId = null,
  onDateSelect,
}: NotificationsCalendarProps) => {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(today));
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [holidayCountryCode, setHolidayCountryCode] =
    useState<HolidayCountryCode>(
      () => readStoredHolidayCountry() ?? detectDefaultHolidayCountry(),
    );
  const [holidayCache, setHolidayCache] = useState<
    Record<string, PublicHolidayRecord[]>
  >({});
  const [loadingHolidayKeys, setLoadingHolidayKeys] = useState<string[]>([]);
  const [holidayError, setHolidayError] = useState<string | null>(null);

  const monthLabel = useMemo(
    () => formatMonthLabel(visibleMonth),
    [visibleMonth],
  );

  const calendarCells = useMemo(
    () => buildCalendarCells(visibleMonth, today),
    [today, visibleMonth],
  );

  const visibleYears = useMemo(
    () =>
      Array.from(
        new Set(calendarCells.map((cell) => cell.date.getFullYear())),
      ).sort((a, b) => a - b),
    [calendarCells],
  );

  useEffect(() => {
    const missingYears = visibleYears.filter(
      (year) => !holidayCache[getHolidayCacheKey(holidayCountryCode, year)],
    );

    if (missingYears.length === 0) return;

    const missingKeys = missingYears.map((year) =>
      getHolidayCacheKey(holidayCountryCode, year),
    );
    let cancelled = false;

    setLoadingHolidayKeys((current) =>
      Array.from(new Set([...current, ...missingKeys])),
    );
    setHolidayError(null);

    void Promise.all(
      missingYears.map(async (year) => ({
        year,
        holidays: await getPublicHolidays(holidayCountryCode, year),
      })),
    )
      .then((results) => {
        if (cancelled) return;
        setHolidayCache((current) => {
          const next = { ...current };
          for (const result of results) {
            next[getHolidayCacheKey(holidayCountryCode, result.year)] =
              result.holidays;
          }
          return next;
        });
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("getPublicHolidays failed", error);
        setHolidayError("Holiday lookup unavailable");
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingHolidayKeys((current) =>
          current.filter((key) => !missingKeys.includes(key)),
        );
      });

    return () => {
      cancelled = true;
    };
  }, [holidayCache, holidayCountryCode, visibleYears]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        HOLIDAY_COUNTRY_STORAGE_KEY,
        holidayCountryCode,
      );
    } catch {
      // Ignore storage write failures (private mode / quota / disabled storage).
    }
  }, [holidayCountryCode]);

  const holidaysByDate = useMemo(() => {
    const visibleDateKeys = new Set(calendarCells.map((cell) => cell.key));
    const map = new Map<string, PublicHolidayRecord[]>();

    for (const year of visibleYears) {
      const holidays =
        holidayCache[getHolidayCacheKey(holidayCountryCode, year)] ?? [];
      for (const holiday of holidays) {
        if (!visibleDateKeys.has(holiday.date)) continue;
        const current = map.get(holiday.date) ?? [];
        current.push(holiday);
        map.set(holiday.date, current);
      }
    }

    return map;
  }, [calendarCells, holidayCache, holidayCountryCode, visibleYears]);

  const notificationMarkersByDate = useMemo(() => {
    const map = new Map<string, CalendarNotificationMarker[]>();
    const visibleDateKeys = new Set(calendarCells.map((cell) => cell.key));

    const pushMarker = (
      dateKey: string,
      marker: CalendarNotificationMarker,
    ) => {
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

      const scheduledIso =
        notification.scheduledAtUtc ?? notification.nextRunAtUtc;
      if (!scheduledIso) continue;
      const scheduledDate = new Date(scheduledIso);
      if (Number.isNaN(scheduledDate.getTime())) continue;
      pushMarker(toDateKey(startOfDay(scheduledDate)), marker);
    }

    return map;
  }, [calendarCells, notifications]);

  const selectedNotificationDateKeys = useMemo(() => {
    if (!selectedNotificationId) return new Set<string>();

    const keys = new Set<string>();
    for (const [dateKey, markers] of notificationMarkersByDate.entries()) {
      if (markers.some((marker) => marker.id === selectedNotificationId)) {
        keys.add(dateKey);
      }
    }
    return keys;
  }, [notificationMarkersByDate, selectedNotificationId]);

  const isHolidayLoading = useMemo(
    () =>
      visibleYears.some((year) =>
        loadingHolidayKeys.includes(
          getHolidayCacheKey(holidayCountryCode, year),
        ),
      ),
    [holidayCountryCode, loadingHolidayKeys, visibleYears],
  );

  const toggleDate = (cell: CalendarCell) => {
    if (cell.isPast) return;

    setSelectedDateKey((current) => (current === cell.key ? null : cell.key));
    onDateSelect?.(cell.key);
  };

  return (
    <section className="rounded-2xl border border-accent-3 bg-accent-1 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="text-xl font-semibold text-brand">Schedule Calendar</h2>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-contrast/60">
            Holidays
          </span>
          <CustomDropdown
            value={holidayCountryCode}
            options={HOLIDAY_COUNTRY_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
              metaLabel: option.value,
            }))}
            onChange={(value) =>
              setHolidayCountryCode(value as HolidayCountryCode)
            }
            ariaLabel="Holiday country options"
          />
          {isHolidayLoading ? (
            <span className="text-[11px] text-contrast/55">Loading...</span>
          ) : holidayError ? (
            <span className="text-[11px] text-brand/80">{holidayError}</span>
          ) : null}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-accent-3 bg-primary/35 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-contrast">{monthLabel}</p>
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
              {"<"}
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
              {">"}
            </Button>
          </div>
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
            const isSelected = selectedDateKey === cell.key;
            const markers = notificationMarkersByDate.get(cell.key) ?? [];
            const hasSelectedNotification = Boolean(selectedNotificationId);
            const isSelectedNotificationDate = selectedNotificationDateKeys.has(
              cell.key,
            );
            const holidays = holidaysByDate.get(cell.key) ?? [];
            const orderedMarkers = hasSelectedNotification
              ? [
                  ...markers.filter((marker) => marker.id === selectedNotificationId),
                  ...markers.filter((marker) => marker.id !== selectedNotificationId),
                ]
              : markers;
            const visibleMarkers = orderedMarkers.slice(0, 3);
            const extraMarkerCount = Math.max(
              orderedMarkers.length - visibleMarkers.length,
              0,
            );
            const holidayLabel =
              holidays.length > 0
                ? holidays
                    .map((holiday) => holiday.localName || holiday.name)
                    .join(", ")
                : "";

            const baseClassName =
              "relative flex h-12 items-center justify-center rounded-lg border text-sm font-semibold transition-all duration-200";

            const stateClassName = cell.isPast
              ? "cursor-not-allowed border-accent-3/60 bg-primary/40 text-contrast/35"
              : isSelected
                ? "border-brand/60 bg-brand text-primary shadow-[0_8px_20px_-12px_rgba(230,52,90,0.7)]"
                : cell.isCurrentMonth
                  ? "border-accent-3 bg-primary/70 text-contrast hover:border-brand/50 hover:bg-brand/10 hover:text-brand"
                  : "border-accent-3/70 bg-primary/40 text-contrast/45 hover:border-accent-3 hover:text-contrast/70";

            const selectedScheduleClassName =
              !isSelected && isSelectedNotificationDate
                ? " ring-1 ring-brand/55 ring-inset border-brand/40 bg-brand/5"
                : "";

            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => toggleDate(cell)}
                disabled={cell.isPast}
                className={`${baseClassName} ${stateClassName}${selectedScheduleClassName}`}
                aria-pressed={isSelected}
                aria-label={`${isSelected ? "Deselect" : "Select"} ${cell.date.toDateString()}${holidayLabel ? `. Holiday: ${holidayLabel}` : ""}`}
                title={holidayLabel || undefined}
              >
                <span>{cell.date.getDate()}</span>

                {holidays.length > 0 ? (
                  <span
                    className="pointer-events-none absolute left-1 top-1 h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: HOLIDAY_MARKER_COLOR }}
                    aria-hidden="true"
                  />
                ) : null}

                {markers.length > 0 ? (
                  <span className="pointer-events-none absolute bottom-1 left-1 right-1 flex items-center justify-center gap-1">
                    {visibleMarkers.map((marker) => (
                      <span
                        key={marker.id}
                        className={`rounded-full ${
                          marker.id === selectedNotificationId
                            ? "h-2 w-2"
                            : "h-1.5 w-1.5"
                        }`}
                        style={{
                          backgroundColor: marker.color,
                          opacity:
                            hasSelectedNotification &&
                            marker.id !== selectedNotificationId
                              ? marker.active
                                ? 0.25
                                : 0.15
                              : marker.active
                                ? 1
                                : 0.35,
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
