"use client";

import { FormEvent, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import { createNotification } from "@/api/client/notification.api";
import type { NotificationRecord, NotificationWeekday } from "@/types/notification";

type DeliveryMode = "now" | "scheduled";
type ScheduleType = "once" | "repeat";
type WeekdayKey = NotificationWeekday;

const WEEKDAY_OPTIONS: Array<{ key: WeekdayKey; label: string; short: string }> = [
  { key: "mon", label: "Monday", short: "Mon" },
  { key: "tue", label: "Tuesday", short: "Tue" },
  { key: "wed", label: "Wednesday", short: "Wed" },
  { key: "thu", label: "Thursday", short: "Thu" },
  { key: "fri", label: "Friday", short: "Fri" },
  { key: "sat", label: "Saturday", short: "Sat" },
  { key: "sun", label: "Sunday", short: "Sun" },
];

const WEEKDAY_PRESETS: Record<"everyday" | "weekdays" | "weekends", WeekdayKey[]> = {
  everyday: WEEKDAY_OPTIONS.map((day) => day.key),
  weekdays: ["mon", "tue", "wed", "thu", "fri"],
  weekends: ["sat", "sun"],
};

const toLocalDateInputValue = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

type NotificationComposerProps = {
  businessId: string;
  onCancel?: () => void;
  onCreated?: (notification: NotificationRecord) => void;
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
  onCreated,
}: NotificationComposerProps) => {
  const now = useMemo(() => new Date(), []);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("scheduled");
  const [scheduleType, setScheduleType] = useState<ScheduleType>("once");
  const [repeatDays, setRepeatDays] = useState<WeekdayKey[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [scheduledDate, setScheduledDate] = useState(toLocalDateInputValue(now));
  const [scheduledTime, setScheduledTime] = useState("10:00");
  const [submitting, setSubmitting] = useState(false);
  const isRecurringSchedule =
    deliveryMode === "scheduled" && scheduleType === "repeat";

  const isSamePresetSelected = (preset: WeekdayKey[]) =>
    preset.length === repeatDays.length &&
    preset.every((day) => repeatDays.includes(day));

  const repeatSummary = useMemo(() => {
    if (!isRecurringSchedule) return "";
    if (repeatDays.length === 0) return "Select one or more days.";
    if (isSamePresetSelected(WEEKDAY_PRESETS.everyday)) {
      return `Every day at ${scheduledTime || "selected time"}.`;
    }
    if (isSamePresetSelected(WEEKDAY_PRESETS.weekdays)) {
      return `Every weekday at ${scheduledTime || "selected time"}.`;
    }
    if (isSamePresetSelected(WEEKDAY_PRESETS.weekends)) {
      return `Every weekend at ${scheduledTime || "selected time"}.`;
    }
    const labels = WEEKDAY_OPTIONS.filter((day) => repeatDays.includes(day.key)).map(
      (day) => day.label,
    );
    return `${labels.join(", ")} at ${scheduledTime || "selected time"}.`;
  }, [isRecurringSchedule, repeatDays, scheduledTime]);

  const toggleRepeatDay = (day: WeekdayKey) => {
    setRepeatDays((current) =>
      current.includes(day)
        ? current.filter((value) => value !== day)
        : [...current, day],
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Notification title is required.");
      return;
    }

    if (!message.trim()) {
      toast.error("Notification message is required.");
      return;
    }

    if (deliveryMode === "scheduled") {
      if (!scheduledTime) {
        toast.error("Scheduled time is required.");
        return;
      }
      if (isRecurringSchedule && repeatDays.length === 0) {
        toast.error("Select at least one repeat day.");
        return;
      }
      if (!isRecurringSchedule && !scheduledDate) {
        toast.error("Scheduled date is required.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      const payloadBase = {
        businessId,
        title: title.trim(),
        message: message.trim(),
        deliveryMode,
        timezone,
      } as const;

      const created =
        deliveryMode === "now"
          ? await createNotification({
              ...payloadBase,
              scheduleType: "once",
            })
          : isRecurringSchedule
            ? await createNotification({
                ...payloadBase,
                scheduleType: "repeat",
                repeatDays,
                repeatTimeLocal: scheduledTime,
              })
            : await createNotification({
                ...payloadBase,
                scheduleType: "once",
                scheduledAtUtc: toScheduledAtUtcIso(scheduledDate, scheduledTime),
              });

      toast.success(
        deliveryMode === "now"
          ? "Notification saved."
          : "Scheduled notification saved."
      );
      onCreated?.(created);
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
            Notification Composer
          </h2>
          <p className="mt-2 text-sm text-contrast/80">
            Create a notification and choose whether to send it now or schedule
            it for later.
          </p>
        </div>
        <div className="inline-flex rounded-xl border border-accent-3 bg-primary/35 p-1">
          <button
            type="button"
            onClick={() => setDeliveryMode("now")}
            className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
              deliveryMode === "now"
                ? "bg-brand text-primary"
                : "text-contrast/70 hover:text-contrast"
            }`}
          >
            Send now
          </button>
          <button
            type="button"
            onClick={() => setDeliveryMode("scheduled")}
            className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
              deliveryMode === "scheduled"
                ? "bg-brand text-primary"
                : "text-contrast/70 hover:text-contrast"
            }`}
          >
            Schedule
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="grid gap-4">
          <CustomInput
            id="notification-title"
            label="Notification title"
            placeholder="Weekend offer"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

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
          <div className="mt-2 flex items-center justify-between gap-3 text-xs text-contrast/60">
            <span>Keep it short and action-focused.</span>
            <span>{message.length}/500</span>
          </div>
        </div>

        {deliveryMode === "scheduled" ? (
          <div className="rounded-xl border border-accent-3 bg-primary/25 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-contrast">
                  Delivery settings
                </p>
                <p className="mt-1 text-xs text-contrast/65">
                  Choose a one-time schedule or repeat on selected weekdays.
                </p>
              </div>
              <span className="inline-flex h-8 items-center rounded-full border border-brand/20 bg-brand/10 px-3 text-xs font-semibold uppercase tracking-wide text-brand">
                Scheduled
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <p className="mb-2 block text-xs font-semibold text-contrast/70">
                  Schedule type
                </p>
                <div className="inline-flex rounded-xl border border-accent-3 bg-primary/35 p-1">
                  <button
                    type="button"
                    onClick={() => setScheduleType("once")}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                      scheduleType === "once"
                        ? "bg-brand text-primary"
                        : "text-contrast/70 hover:text-contrast"
                    }`}
                  >
                    One time
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleType("repeat")}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                      scheduleType === "repeat"
                        ? "bg-brand text-primary"
                        : "text-contrast/70 hover:text-contrast"
                    }`}
                  >
                    Repeat
                  </button>
                </div>
                <p className="mt-2 text-xs text-contrast/65">
                  {isRecurringSchedule
                    ? repeatSummary
                    : "Send one notification at the selected date and time."}
                </p>
              </div>

              {isRecurringSchedule ? (
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

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-contrast/60">
            This saves the notification configuration. Wallet delivery execution
            will be connected next.
          </p>
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
