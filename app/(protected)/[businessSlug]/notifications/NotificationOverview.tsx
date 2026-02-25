"use client";

import { useMemo, useState } from "react";
import Button from "@/components/Button";
import DeleteButton from "@/components/DeleteButton";
import EditButton from "@/components/EditButton";
import { FaPaperPlane, FaXmark } from "react-icons/fa6";
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
  sendingIds?: string[];
  selectedNotificationId?: string | null;
  onToggleStatus: (notification: NotificationRecord) => void | Promise<void>;
  onDelete: (notification: NotificationRecord) => void | Promise<void>;
  onEdit: (notification: NotificationRecord) => void | Promise<void>;
  onSendNow?: (notification: NotificationRecord) => void | Promise<void>;
  onSelectNotification?: (notification: NotificationRecord) => void;
  onCreate?: () => void;
  showCreateButton?: boolean;
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
  sendingIds = [],
  selectedNotificationId = null,
  onToggleStatus,
  onDelete,
  onEdit,
  onSendNow,
  onSelectNotification,
  onCreate,
  showCreateButton = false,
}: NotificationOverviewProps) => {
  const [armedSendNotificationId, setArmedSendNotificationId] = useState<
    string | null
  >(null);

  const sortedNotifications = useMemo(() => {
    return notifications
      .filter((notification) => notification.deliveryMode === "scheduled")
      .sort((a, b) => {
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
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-brand">
            Notification Overview
          </h2>
        </div>
        {showCreateButton && onCreate ? (
          <Button type="button" size="sm" onClick={onCreate}>
            Add new notification
          </Button>
        ) : null}
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
          const isSelected = selectedNotificationId === notification.id;
          const isToggling = togglingIds.includes(notification.id);
          const isDeleting = deletingIds.includes(notification.id);
          const isSending = sendingIds.includes(notification.id);
          const isBusy = isToggling || isDeleting || isSending;
          const isSendArmed = armedSendNotificationId === notification.id;
          const scheduleLine = buildScheduleLine(notification);
          const displayMessage =
            notification.message?.trim() || "Notification message";
          const actionLabel =
            displayMessage.length > 40
              ? `${displayMessage.slice(0, 40).trimEnd()}...`
              : displayMessage;

          return (
            <article
              key={notification.id}
              role={onSelectNotification ? "button" : undefined}
              tabIndex={onSelectNotification ? 0 : undefined}
              onClick={() => onSelectNotification?.(notification)}
              onKeyDown={(event) => {
                if (!onSelectNotification) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectNotification(notification);
                }
              }}
              className={`rounded-xl border px-3 py-2.5 transition-colors ${
                isSelected
                  ? "border-brand/60 bg-brand/10"
                  : "border-accent-3 bg-primary/25"
              } ${onSelectNotification ? "cursor-pointer" : ""}`}
              aria-pressed={onSelectNotification ? isSelected : undefined}
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
                    <span className="text-[11px] font-medium text-contrast/55">
                      {scheduleLine}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-sm font-semibold text-contrast">
                    {displayMessage}
                  </p>
                </div>

                <div
                  className="flex shrink-0 items-center gap-1 self-end sm:self-auto"
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                >
                  {onSendNow ? (
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (isBusy) return;
                          if (!isSendArmed) {
                            setArmedSendNotificationId(notification.id);
                            return;
                          }
                          setArmedSendNotificationId(null);
                          void onSendNow(notification);
                        }}
                        disabled={isBusy}
                        title={
                          isSending
                            ? "Sending..."
                            : isSendArmed
                              ? "Confirm send now"
                              : "Send now"
                        }
                        aria-label={`Send notification now: ${actionLabel}`}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-brand/40 bg-brand/10 text-brand transition-transform duration-200 hover:bg-brand/20 disabled:cursor-not-allowed disabled:opacity-60 ${
                          isSendArmed ? "scale-[1.06]" : "scale-100"
                        }`}
                      >
                        <FaPaperPlane className="text-sm" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (isBusy) return;
                          setArmedSendNotificationId(null);
                        }}
                        aria-label="Cancel send now"
                        title="Cancel"
                        className={`inline-flex items-center justify-center overflow-hidden rounded-full border text-xs font-semibold transition-all duration-200 border-contrast/40 bg-contrast/5 text-contrast hover:bg-contrast/10 ${
                          isSendArmed
                            ? "ml-1 h-8 w-8 opacity-100"
                            : "pointer-events-none ml-0 h-0 w-0 opacity-0"
                        }`}
                      >
                        <FaXmark className="text-sm" />
                      </button>
                    </div>
                  ) : null}
                  <EditButton
                    disabled={isBusy}
                    title="Edit notification"
                      ariaLabel={`Edit notification ${actionLabel}`}
                    onClick={() => void onEdit(notification)}
                  />
                  <div className={isDeleting ? "opacity-60" : ""}>
                    <DeleteButton
                      disabled={isBusy}
                      title={isDeleting ? "Deleting..." : "Delete notification"}
                      ariaLabel={`Delete notification ${actionLabel}`}
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
