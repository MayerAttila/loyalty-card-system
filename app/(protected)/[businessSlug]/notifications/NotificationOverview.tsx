"use client";

import { useMemo } from "react";
import DeleteButton from "@/components/DeleteButton";
import type { NotificationRecord } from "@/types/notification";

const formatDateTime = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
};

const buildScheduleSummary = (notification: NotificationRecord) => {
  if (notification.deliveryMode === "now") {
    return "Manual send (Send now mode)";
  }

  if (notification.scheduleType === "repeat") {
    const days = notification.repeatDays
      .map((day) => WEEKDAY_LABELS[day] ?? day.toUpperCase())
      .join(", ");
    const time = notification.repeatTimeLocal ?? "time not set";
    return days ? `${days} at ${time}` : `Repeat at ${time}`;
  }

  if (notification.scheduledAtUtc) {
    return formatDateTime(notification.scheduledAtUtc);
  }

  return "One-time schedule pending";
};

const resolveNextRunDisplay = (notification: NotificationRecord) => {
  const nextRun = notification.nextRunAtUtc ?? notification.scheduledAtUtc;
  return nextRun ? formatDateTime(nextRun) : "Not computed yet";
};

const NotificationOverview = ({
  notifications,
  loading = false,
  togglingIds = [],
  deletingIds = [],
  onToggleStatus,
  onDelete,
}: NotificationOverviewProps) => {
  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      const aTime = new Date(a.nextRunAtUtc ?? a.scheduledAtUtc ?? a.createdAt).getTime();
      const bTime = new Date(b.nextRunAtUtc ?? b.scheduledAtUtc ?? b.createdAt).getTime();
      return aTime - bTime;
    });
  }, [notifications]);

  const activeCount = notifications.filter((item) => item.status === "active").length;
  const inactiveCount = notifications.length - activeCount;

  return (
    <section className="rounded-2xl border border-accent-3 bg-accent-1 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-brand">
            Notification Overview
          </h2>
          <p className="mt-2 text-sm text-contrast/80">
            Review planned notifications and toggle each one active or inactive.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-8 items-center rounded-full border border-brand/20 bg-brand/10 px-3 text-xs font-semibold text-brand">
            Active {activeCount}
          </span>
          <span className="inline-flex h-8 items-center rounded-full border border-accent-3 bg-primary/40 px-3 text-xs font-semibold text-contrast/75">
            Inactive {inactiveCount}
          </span>
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
          return (
            <article
              key={notification.id}
              className="rounded-xl border border-accent-3 bg-primary/25 p-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-contrast">
                      {notification.title}
                    </p>
                    <span
                      className={`inline-flex h-7 items-center rounded-full border px-2.5 text-[11px] font-semibold uppercase tracking-wide ${
                        isActive
                          ? "border-brand/25 bg-brand/10 text-brand"
                          : "border-accent-3 bg-primary/50 text-contrast/70"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="inline-flex h-7 items-center rounded-full border border-accent-3 bg-primary/40 px-2.5 text-[11px] font-semibold uppercase tracking-wide text-contrast/65">
                      {notification.deliveryMode === "now"
                        ? "Manual"
                        : notification.scheduleType === "repeat"
                        ? "Recurring"
                        : "One-time"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-contrast/75">
                    {notification.message}
                  </p>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-lg border border-accent-3 bg-primary/35 px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-contrast/55">
                        Schedule
                      </p>
                      <p className="mt-1 text-xs font-medium text-contrast/80">
                        {buildScheduleSummary(notification)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-accent-3 bg-primary/35 px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-contrast/55">
                        Next run
                      </p>
                      <p className="mt-1 text-xs font-medium text-contrast/80">
                        {resolveNextRunDisplay(notification)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3 lg:pl-4">
                  <div className={isDeleting ? "opacity-60" : ""}>
                    <DeleteButton
                      disabled={isDeleting || isToggling}
                      title={isDeleting ? "Deleting..." : "Delete notification"}
                      ariaLabel={`Delete notification ${notification.title}`}
                      onConfirm={() => void onDelete(notification)}
                    />
                  </div>
                  <span className="text-xs font-semibold text-contrast/65">
                    {isActive ? "Enabled" : "Disabled"}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isActive}
                    aria-disabled={isToggling || isDeleting}
                    disabled={isToggling || isDeleting}
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
