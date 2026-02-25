"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import FormSwitch from "@/components/FormSwitch";
import { getPublicHolidays } from "@/api/client/holiday.api";
import {
  createNotification,
  sendNotificationNow,
  updateNotification,
} from "@/api/client/notification.api";
import type { HolidayCountryCode, PublicHolidayRecord } from "@/types/holiday";
import type {
  NotificationRecord,
  NotificationRepeatPattern,
  NotificationWeekday,
} from "@/types/notification";

type DeliveryMode = "now" | "scheduled";
type ScheduleType = "once" | "repeat";
type WeekdayKey = NotificationWeekday;
type RepeatPattern = NotificationRepeatPattern;

const WEEKDAY_OPTIONS: Array<{
  key: WeekdayKey;
  label: string;
  short: string;
}> = [
  { key: "mon", label: "Monday", short: "Mon" },
  { key: "tue", label: "Tuesday", short: "Tue" },
  { key: "wed", label: "Wednesday", short: "Wed" },
  { key: "thu", label: "Thursday", short: "Thu" },
  { key: "fri", label: "Friday", short: "Fri" },
  { key: "sat", label: "Saturday", short: "Sat" },
  { key: "sun", label: "Sunday", short: "Sun" },
];

const WEEKDAY_PRESETS: Record<
  "everyday" | "weekdays" | "weekends",
  WeekdayKey[]
> = {
  everyday: WEEKDAY_OPTIONS.map((day) => day.key),
  weekdays: ["mon", "tue", "wed", "thu", "fri"],
  weekends: ["sat", "sun"],
};

const DELIVERY_MODE_ITEMS = [
  { key: "now", label: "Send now" },
  { key: "scheduled", label: "Schedule" },
] as const;

const SCHEDULE_TYPE_ITEMS = [
  { key: "once", label: "One time" },
  { key: "repeat", label: "Repeat" },
] as const;
const HOLIDAY_COUNTRY_STORAGE_KEY = "notifications_holiday_country";
const DEFAULT_HOLIDAY_COUNTRY: HolidayCountryCode = "HU";
const HOLIDAY_WARNING_WINDOW_DAYS = 31;

const weekdayToJsDay = (day: WeekdayKey) => {
  switch (day) {
    case "sun":
      return 0;
    case "mon":
      return 1;
    case "tue":
      return 2;
    case "wed":
      return 3;
    case "thu":
      return 4;
    case "fri":
      return 5;
    case "sat":
      return 6;
    default:
      return null;
  }
};

const toDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

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

const readHolidayCountryPreference = (): HolidayCountryCode => {
  if (typeof window === "undefined") return DEFAULT_HOLIDAY_COUNTRY;
  try {
    const stored = window.localStorage.getItem(HOLIDAY_COUNTRY_STORAGE_KEY);
    if (!stored) return DEFAULT_HOLIDAY_COUNTRY;
    const value = stored.trim().toUpperCase();
    return value || DEFAULT_HOLIDAY_COUNTRY;
  } catch {
    return DEFAULT_HOLIDAY_COUNTRY;
  }
};

const formatHolidayDate = (date: Date) =>
  date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

const toLocalDateInputValue = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const toLocalTimeInputValue = (date: Date) => {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
};

type NotificationComposerProps = {
  businessId: string;
  onCancel?: () => void;
  initialNotification?: NotificationRecord | null;
  prefillDateKey?: string | null;
  onSaved?: (notification: NotificationRecord) => void;
};

const toScheduledAtUtcIso = (dateValue: string, timeValue: string) => {
  const dateParts = dateValue.split("-").map(Number);
  const timeParts = timeValue.split(":").map(Number);
  if (dateParts.length !== 3 || timeParts.length < 2) return null;

  const [year, month, day] = dateParts;
  const [hours, minutes] = timeParts;
  const localDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
  if (Number.isNaN(localDate.getTime())) return null;
  return localDate.toISOString();
};

const NotificationComposer = ({
  businessId,
  onCancel,
  initialNotification = null,
  prefillDateKey = null,
  onSaved,
}: NotificationComposerProps) => {
  const now = useMemo(() => new Date(), []);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("scheduled");
  const [scheduleType, setScheduleType] = useState<ScheduleType>("repeat");
  const [repeatPattern, setRepeatPattern] = useState<RepeatPattern>("weekly");
  const [repeatDays, setRepeatDays] = useState<WeekdayKey[]>([]);
  const [monthlyDayOfMonth, setMonthlyDayOfMonth] = useState("1");
  const [message, setMessage] = useState("");
  const [scheduledDate, setScheduledDate] = useState(
    toLocalDateInputValue(now),
  );
  const [scheduledTime, setScheduledTime] = useState("10:00");
  const [submitting, setSubmitting] = useState(false);
  const [holidayCountryCode] = useState<HolidayCountryCode>(() =>
    readHolidayCountryPreference(),
  );
  const [holidayCache, setHolidayCache] = useState<
    Record<string, PublicHolidayRecord[]>
  >({});
  const [holidayWarningLoadError, setHolidayWarningLoadError] = useState(false);
  const isEditMode = Boolean(initialNotification?.id);
  const isRecurringSchedule =
    deliveryMode === "scheduled" && scheduleType === "repeat";
  const isMonthlyRepeat = isRecurringSchedule && repeatPattern === "monthly";
  const holidayCacheKeyFor = (year: number) => `${holidayCountryCode}:${year}`;

  useEffect(() => {
    if (!initialNotification) {
      setDeliveryMode("scheduled");
      setScheduleType("repeat");
      setRepeatPattern("weekly");
      setRepeatDays([]);
      setMonthlyDayOfMonth("1");
      setMessage("");
      setScheduledDate(toLocalDateInputValue(now));
      setScheduledTime("10:00");
      return;
    }

    setMessage(initialNotification.message ?? "");
    setDeliveryMode(initialNotification.deliveryMode);
    setScheduleType(initialNotification.scheduleType);
    setRepeatPattern(initialNotification.repeatPattern ?? "weekly");
    setRepeatDays(initialNotification.repeatDays ?? []);
    setMonthlyDayOfMonth(String(initialNotification.monthlyDayOfMonth ?? 1));

    if (initialNotification.scheduleType === "repeat") {
      setScheduledTime(initialNotification.repeatTimeLocal ?? "10:00");
      setScheduledDate(toLocalDateInputValue(now));
    } else if (initialNotification.scheduledAtUtc) {
      const scheduled = new Date(initialNotification.scheduledAtUtc);
      if (!Number.isNaN(scheduled.getTime())) {
        setScheduledDate(toLocalDateInputValue(scheduled));
        setScheduledTime(toLocalTimeInputValue(scheduled));
      } else {
        setScheduledDate(toLocalDateInputValue(now));
        setScheduledTime("10:00");
      }
    } else {
      setScheduledDate(toLocalDateInputValue(now));
      setScheduledTime("10:00");
    }
  }, [initialNotification, now]);

  useEffect(() => {
    if (initialNotification || !prefillDateKey) return;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(prefillDateKey)) return;

    setDeliveryMode("scheduled");
    setScheduleType("once");
    setScheduledDate(prefillDateKey);
  }, [initialNotification, prefillDateKey]);

  const holidayWarningYears = useMemo(() => {
    if (deliveryMode !== "scheduled") return [] as number[];

    const years = new Set<number>();
    if (!isRecurringSchedule) {
      const [year] = scheduledDate.split("-").map(Number);
      if (Number.isInteger(year)) years.add(year);
      return Array.from(years);
    }

    const rangeStart = startOfDay(now);
    const rangeEnd = addDays(rangeStart, HOLIDAY_WARNING_WINDOW_DAYS);
    years.add(rangeStart.getFullYear());
    years.add(rangeEnd.getFullYear());
    return Array.from(years);
  }, [deliveryMode, isRecurringSchedule, now, scheduledDate]);

  useEffect(() => {
    const missingYears = holidayWarningYears.filter(
      (year) => !holidayCache[holidayCacheKeyFor(year)],
    );
    if (missingYears.length === 0) return;

    let cancelled = false;
    setHolidayWarningLoadError(false);

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
            next[holidayCacheKeyFor(result.year)] = result.holidays;
          }
          return next;
        });
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("notification composer holiday warning fetch failed", error);
        setHolidayWarningLoadError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [holidayCache, holidayCountryCode, holidayWarningYears]);

  const holidayRecordsByDate = useMemo(() => {
    const map = new Map<string, PublicHolidayRecord[]>();
    for (const year of holidayWarningYears) {
      const holidays = holidayCache[holidayCacheKeyFor(year)] ?? [];
      for (const holiday of holidays) {
        const current = map.get(holiday.date) ?? [];
        current.push(holiday);
        map.set(holiday.date, current);
      }
    }
    return map;
  }, [holidayCache, holidayWarningYears]);

  const holidayWarningText = useMemo(() => {
    if (deliveryMode !== "scheduled") return null;

    if (!isRecurringSchedule) {
      if (!scheduledDate) return null;
      const matches = holidayRecordsByDate.get(scheduledDate) ?? [];
      if (matches.length === 0) return null;
      const names = matches.map((holiday) => holiday.localName || holiday.name);
      return `Selected date is a holiday (${names.join(", ")}).`;
    }

    const rangeStart = startOfDay(now);
    const rangeDays = HOLIDAY_WARNING_WINDOW_DAYS;
    const overlaps: Array<{ date: Date; names: string[] }> = [];

    const selectedJsWeekdays = new Set<number>(
      repeatDays
        .map((day) => weekdayToJsDay(day))
        .filter(
          (
            day,
          ): day is NonNullable<ReturnType<typeof weekdayToJsDay>> =>
            day !== null,
        ),
    );
    const biweeklyAnchor = startOfWeekMonday(now);

    for (let i = 0; i <= rangeDays; i += 1) {
      const candidate = addDays(rangeStart, i);
      const dateKey = toDateKey(candidate);
      const holidayMatches = holidayRecordsByDate.get(dateKey) ?? [];
      if (holidayMatches.length === 0) continue;

      let matchesSchedule = false;
      if (repeatPattern === "monthly") {
        const dayNumber = Number.parseInt(monthlyDayOfMonth, 10);
        matchesSchedule =
          Number.isInteger(dayNumber) && dayNumber >= 1 && dayNumber <= 31
            ? candidate.getDate() === dayNumber
            : false;
      } else {
        if (!selectedJsWeekdays.has(candidate.getDay())) {
          matchesSchedule = false;
        } else if (repeatPattern === "biweekly") {
          const diffWeeks = getWeekDiff(biweeklyAnchor, candidate);
          const parity = ((diffWeeks % 2) + 2) % 2;
          matchesSchedule = parity === 0;
        } else {
          matchesSchedule = true;
        }
      }

      if (!matchesSchedule) continue;
      overlaps.push({
        date: candidate,
        names: holidayMatches.map((holiday) => holiday.localName || holiday.name),
      });
    }

    if (overlaps.length === 0) return null;

    const preview = overlaps
      .slice(0, 2)
      .map((item) => `${formatHolidayDate(item.date)} (${item.names.join(", ")})`)
      .join("; ");
    const suffix = overlaps.length > 2 ? ` +${overlaps.length - 2} more` : "";
    return `Upcoming repeats hit holiday dates in the next ${rangeDays} days: ${preview}${suffix}.`;
  }, [
    deliveryMode,
    holidayRecordsByDate,
    isRecurringSchedule,
    monthlyDayOfMonth,
    now,
    repeatDays,
    repeatPattern,
    scheduledDate,
  ]);

  const isSamePresetSelected = (preset: WeekdayKey[]) =>
    preset.length === repeatDays.length &&
    preset.every((day) => repeatDays.includes(day));

  const repeatSummary = useMemo(() => {
    if (!isRecurringSchedule) return "";
    if (repeatPattern === "monthly") {
      return `Monthly on day ${monthlyDayOfMonth || "1"} at ${
        scheduledTime || "selected time"
      }.`;
    }
    if (repeatDays.length === 0) return "Select one or more days.";
    const cadencePrefix =
      repeatPattern === "biweekly" ? "Every 2 weeks" : "Every week";
    if (isSamePresetSelected(WEEKDAY_PRESETS.everyday)) {
      return `${
        repeatPattern === "biweekly" ? "Every 2 weeks (all days)" : "Every day"
      } at ${scheduledTime || "selected time"}.`;
    }
    if (isSamePresetSelected(WEEKDAY_PRESETS.weekdays)) {
      return `${
        repeatPattern === "biweekly"
          ? "Every 2 weeks (weekdays)"
          : "Every weekday"
      } at ${scheduledTime || "selected time"}.`;
    }
    if (isSamePresetSelected(WEEKDAY_PRESETS.weekends)) {
      return `${
        repeatPattern === "biweekly"
          ? "Every 2 weeks (weekends)"
          : "Every weekend"
      } at ${scheduledTime || "selected time"}.`;
    }
    const labels = WEEKDAY_OPTIONS.filter((day) =>
      repeatDays.includes(day.key),
    ).map((day) => day.label);
    return `${cadencePrefix}: ${labels.join(", ")} at ${
      scheduledTime || "selected time"
    }.`;
  }, [
    isRecurringSchedule,
    monthlyDayOfMonth,
    repeatDays,
    repeatPattern,
    scheduledTime,
  ]);

  const toggleRepeatDay = (day: WeekdayKey) => {
    setRepeatDays((current) =>
      current.includes(day)
        ? current.filter((value) => value !== day)
        : [...current, day],
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim()) {
      toast.error("Notification message is required.");
      return;
    }

    if (deliveryMode === "scheduled") {
      if (!scheduledTime) {
        toast.error("Scheduled time is required.");
        return;
      }
      if (isRecurringSchedule && !isMonthlyRepeat && repeatDays.length === 0) {
        toast.error("Select at least one repeat day.");
        return;
      }
      if (isMonthlyRepeat) {
        const dayNumber = Number.parseInt(monthlyDayOfMonth, 10);
        if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 31) {
          toast.error("Monthly day must be between 1 and 31.");
          return;
        }
      }
      if (!isRecurringSchedule && !scheduledDate) {
        toast.error("Scheduled date is required.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const timezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      const payloadBase = {
        businessId,
        message: message.trim(),
        deliveryMode,
        timezone,
      } as const;

      const saved =
        deliveryMode === "now"
          ? isEditMode && initialNotification
            ? await updateNotification(initialNotification.id, {
                message: payloadBase.message,
                deliveryMode: "now",
                scheduleType: "once",
                timezone,
              })
            : await createNotification({
                ...payloadBase,
                scheduleType: "once",
              })
          : isRecurringSchedule
            ? isEditMode && initialNotification
              ? await updateNotification(initialNotification.id, {
                  message: payloadBase.message,
                  deliveryMode: "scheduled",
                  scheduleType: "repeat",
                  repeatPattern,
                  repeatDays: isMonthlyRepeat ? [] : repeatDays,
                  monthlyDayOfMonth: isMonthlyRepeat
                    ? Number.parseInt(monthlyDayOfMonth, 10)
                    : null,
                  repeatTimeLocal: scheduledTime,
                  timezone,
                })
              : await createNotification({
                  ...payloadBase,
                  scheduleType: "repeat",
                  repeatPattern,
                  repeatDays: isMonthlyRepeat ? [] : repeatDays,
                  monthlyDayOfMonth: isMonthlyRepeat
                    ? Number.parseInt(monthlyDayOfMonth, 10)
                    : null,
                  repeatTimeLocal: scheduledTime,
                })
            : isEditMode && initialNotification
              ? await updateNotification(initialNotification.id, {
                  message: payloadBase.message,
                  deliveryMode: "scheduled",
                  scheduleType: "once",
                  scheduledAtUtc: toScheduledAtUtcIso(
                    scheduledDate,
                    scheduledTime,
                  ),
                  timezone,
                })
              : await createNotification({
                  ...payloadBase,
                  scheduleType: "once",
                  scheduledAtUtc: toScheduledAtUtcIso(
                    scheduledDate,
                    scheduledTime,
                  ),
                });

      let sendNowSummary:
        | Awaited<ReturnType<typeof sendNotificationNow>>
        | null = null;
      if (deliveryMode === "now") {
        sendNowSummary = await sendNotificationNow(saved.id);
      }

      if (sendNowSummary) {
        toast.success(
          `Notification sent. ${sendNowSummary.sentCount} sent, ${sendNowSummary.failedCount} failed, ${sendNowSummary.skippedCount} skipped.`,
        );
      } else {
        toast.success(
          isEditMode ? "Notification updated." : "Scheduled notification saved.",
        );
      }
      onSaved?.(saved);
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || "Unable to save notification."
        : "Unable to save notification.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-accent-3 bg-accent-1 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-brand">
            {isEditMode ? "Edit Notification" : "Notification Composer"}
          </h2>
        </div>
        <FormSwitch
          items={[...DELIVERY_MODE_ITEMS]}
          activeKey={deliveryMode}
          onChange={(key) => setDeliveryMode(key as DeliveryMode)}
        />
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="notification-message"
            className="mb-2 block text-xs font-semibold text-contrast/70"
          >
            Message
          </label>
          <textarea
            id="notification-message"
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Your loyalty card members have a new reward waiting..."
            className="w-full rounded-lg border border-accent-3 bg-primary px-4 py-3 text-sm text-contrast outline-none placeholder:text-contrast/50"
            maxLength={500}
          />
        </div>

        {deliveryMode === "scheduled" ? (
          <div className="rounded-xl border border-accent-3 bg-primary/25 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-contrast">
                  Delivery settings
                </p>
                <p className="mt-1 text-xs text-contrast/65">
                  Choose a one-time schedule or repeat weekly, biweekly, or
                  monthly.
                </p>
              </div>
              <FormSwitch
                items={[...SCHEDULE_TYPE_ITEMS]}
                activeKey={scheduleType}
                onChange={(key) => setScheduleType(key as ScheduleType)}
              />
            </div>

            <div className="mt-4 space-y-4">
              {isRecurringSchedule ? (
                <div className="space-y-3">
                  <div className="rounded-xl border border-accent-3 bg-primary/25 p-2">
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          ["weekly", "Weekly"],
                          ["biweekly", "Biweekly"],
                          ["monthly", "Monthly"],
                        ] as const
                      ).map(([value, label]) => {
                        const selected = repeatPattern === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setRepeatPattern(value)}
                            className={`h-10 rounded-lg border text-xs font-semibold transition-colors ${
                              selected
                                ? "border-brand/50 bg-brand text-primary"
                                : "border-accent-3 bg-primary/40 text-contrast/75 hover:border-brand/40 hover:text-brand"
                            }`}
                            aria-pressed={selected}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {repeatPattern === "monthly" ? (
                    <label className="block text-xs text-contrast/70">
                      Day of month
                      <input
                        type="number"
                        min={1}
                        max={31}
                        value={monthlyDayOfMonth}
                        onChange={(event) =>
                          setMonthlyDayOfMonth(event.target.value)
                        }
                        className="mt-2 h-11 w-full rounded-lg border border-accent-3 bg-primary px-4 text-sm text-contrast outline-none"
                      />
                    </label>
                  ) : (
                    <div className="rounded-xl border border-accent-3 bg-primary/25 p-3">
                      <div className="grid grid-cols-7 gap-2">
                        {WEEKDAY_OPTIONS.map((day) => {
                          const selected = repeatDays.includes(day.key);
                          return (
                            <button
                              key={day.key}
                              type="button"
                              onClick={() => toggleRepeatDay(day.key)}
                              className={`h-10 rounded-lg border text-xs font-semibold transition-colors ${
                                selected
                                  ? "border-brand/50 bg-brand text-primary"
                                  : "border-accent-3 bg-primary/40 text-contrast/75 hover:border-brand/40 hover:text-brand"
                              }`}
                              aria-pressed={selected}
                              title={day.label}
                            >
                              {day.short}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              <div
                className={`grid gap-4 ${
                  isRecurringSchedule ? "" : "sm:grid-cols-2"
                }`}
              >
                {!isRecurringSchedule ? (
                  <label className="block text-xs text-contrast/70">
                    Date
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(event) => setScheduledDate(event.target.value)}
                      className="mt-2 h-11 w-full rounded-lg border border-accent-3 bg-primary px-4 text-sm text-contrast outline-none"
                    />
                  </label>
                ) : null}
                <label className="block text-xs text-contrast/70">
                  Time
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(event) => setScheduledTime(event.target.value)}
                    className="mt-2 h-11 w-full rounded-lg border border-accent-3 bg-primary px-4 text-sm text-contrast outline-none"
                  />
                </label>
              </div>

              {holidayWarningText ? (
                <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-200/90">
                    Holiday warning
                  </p>
                  <p className="mt-1 text-xs text-amber-100/90">
                    {holidayWarningText}
                  </p>
                </div>
              ) : null}

              {holidayWarningLoadError ? (
                <p className="text-xs text-contrast/55">
                  Holiday warning check is temporarily unavailable.
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex flex-wrap items-center gap-2">
            {onCancel ? (
              <Button
                type="button"
                variant="neutral"
                onClick={onCancel}
                disabled={submitting}
              >
                Cancel
              </Button>
            ) : null}
            <Button type="submit" disabled={submitting}>
              {submitting
                ? "Saving..."
                : isEditMode
                  ? "Save changes"
                  : deliveryMode === "now"
                    ? "Send notification now"
                    : "Schedule notification"}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default NotificationComposer;
