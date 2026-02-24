"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import FormSwitch from "@/components/FormSwitch";
import {
  createNotification,
  sendNotificationNow,
  updateNotification,
} from "@/api/client/notification.api";
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
  const isEditMode = Boolean(initialNotification?.id);
  const isRecurringSchedule =
    deliveryMode === "scheduled" && scheduleType === "repeat";
  const isMonthlyRepeat = isRecurringSchedule && repeatPattern === "monthly";

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
