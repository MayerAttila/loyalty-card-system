"use client";

import { useMemo } from "react";
import DeleteButton from "@/components/DeleteButton";
import EditButton from "@/components/EditButton";
import type { NotificationRecord } from "@/types/notification";
import { getNotificationColor } from "./notificationVisuals";

const formatDateOnly = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const WEEKDAY_LABELS: Record<string, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

type NotificationOverviewProps = {
  notifications: NotificationRecord[];
  loading?: boolean;
  togglingIds?: string[];
  deletingIds?: string[];
  onToggleStatus: (notification: NotificationRecord) => void | Promise<void>;
  onDelete: (notification: NotificationRecord) => void | Promise<void>;
  onEdit: (notification: NotificationRecord) => void | Promise<void>;
};

const toTimeLabel = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "--:--";
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const buildScheduleLine = (notification: NotificationRecord) => {
  if (notification.deliveryMode === "now") {
    return "Send now";
  }

  if (notification.scheduleType === "repeat") {
    if (notification.repeatPattern === "monthly") {
      const time = notification.repeatTimeLocal ?? "--:--";
      return `Monthly • day ${notification.monthlyDayOfMonth ?? 1} • ${time}`;
    }
    const days = notification.repeatDays
      .map((day) => WEEKDAY_LABELS[day] ?? day.toUpperCase())
      .join(", ");
    const time = notification.repeatTimeLocal ?? "--:--";
    const cadence =
      notification.repeatPattern === "biweekly" ? "Every 2 weeks" : "Weekly";
    return days ? `${cadence} • ${days} • ${time}` : `${cadence} • ${time}`;
  }

  const scheduledIso = notification.scheduledAtUtc ?? notification.nextRunAtUtc;
  if (!scheduledIso) {
    return "One-time schedule";
  }

  return `${formatDateOnly(scheduledIso)} • ${toTimeLabel(scheduledIso)}`;
};

const NotificationOverview = ({
  notifications,
  loading = false,
  togglingIds = [],
  deletingIds = [],
  onToggleStatus,
  onDelete,
  onEdit,
}: NotificationOverviewProps) => {
  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      const aTime = new Date(
        a.nextRunAtUtc ?? a.scheduledAtUtc ?? a.createdAt,
      ).getTime();
      const bTime = new Date(
        b.nextRunAtUtc ?? b.scheduledAtUtc ?? b.createdAt,
      ).getTime();
      return aTime - bTime;
    });
  }, [notifications]);

  return (
    <section className="rounded-2xl border border-accent-3 bg-accent-1 p-5">
      <div>
        <div>
          <h2 className="text-xl font-semibold text-brand">
            Notification Overview
          </h2>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="rounded-xl border border-accent-3 bg-primary/25 p-6 text-center">
            <p className="text-sm font-semibold text-contrast">
              Loading notifications...
            </p>
          </div>
        ) : null}

        {!loading && sortedNotifications.length === 0 ? (
          <div className="rounded-xl border border-accent-3 bg-primary/25 p-6 text-center">
            <p className="text-sm font-semibold text-contrast">
              No planned notifications yet
            </p>
            <p className="mt-2 text-xs text-contrast/65">
              Create a notification and it will appear here.
            </p>
          </div>
        ) : null}

        {sortedNotifications.map((notification) => {
          const isActive = notification.status === "active";
          const isToggling = togglingIds.includes(notification.id);
          const isDeleting = deletingIds.includes(notification.id);
          const isBusy = isToggling || isDeleting;
          const scheduleLine = buildScheduleLine(notification);

          return (
            <article
              key={notification.id}
              className="rounded-xl border border-accent-3 bg-primary/25 px-3 py-2.5"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span
                      className="inline-flex h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: getNotificationColor(notification.id),
                        opacity: isActive ? 1 : 0.35,
                      }}
                      aria-hidden="true"
                    />
                    <p className="text-sm font-semibold text-contrast">
                      {notification.title}
                    </p>
                    <span className="text-[11px] font-medium text-contrast/55">
                      {scheduleLine}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-contrast/72">
                    {notification.message}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1 self-end sm:self-auto">
                  <EditButton
                    disabled={isBusy}
                    title="Edit notification"
                    ariaLabel={`Edit notification ${notification.title}`}
                    onClick={() => void onEdit(notification)}
                  />
                  <div className={isDeleting ? "opacity-60" : ""}>
                    <DeleteButton
                      disabled={isBusy}
                      title={isDeleting ? "Deleting..." : "Delete notification"}
                      ariaLabel={`Delete notification ${notification.title}`}
                      onConfirm={() => void onDelete(notification)}
                    />
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isActive}
                    aria-disabled={isBusy}
                    disabled={isBusy}
                    onClick={() => void onToggleStatus(notification)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-contrast/80 disabled:opacity-60"
                  >
                    <span
                      className={`relative inline-flex h-6 w-11 items-center rounded-full border border-accent-3 transition-colors duration-200 ${
                        isActive ? "bg-brand/80" : "bg-primary/50"
                      }`}
                    >
                      <span
                        className={`inline-block h-4.5 w-4.5 rounded-full bg-primary shadow-sm transition-transform duration-200 ${
                          isActive ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default NotificationOverview;
