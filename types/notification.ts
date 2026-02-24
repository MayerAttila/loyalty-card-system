export type NotificationStatus = "active" | "inactive";
export type NotificationDeliveryMode = "now" | "scheduled";
export type NotificationScheduleType = "once" | "repeat";
export type NotificationRepeatPattern = "weekly" | "biweekly" | "monthly";
export type NotificationWeekday =
  | "mon"
  | "tue"
  | "wed"
  | "thu"
  | "fri"
  | "sat"
  | "sun";

export type NotificationRecord = {
  id: string;
  businessId: string;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  message: string;
  status: NotificationStatus;
  deliveryMode: NotificationDeliveryMode;
  scheduleType: NotificationScheduleType;
  scheduledAtUtc: string | null;
  repeatDays: NotificationWeekday[];
  repeatPattern: NotificationRepeatPattern | null;
  monthlyDayOfMonth: number | null;
  repeatTimeLocal: string | null;
  timezone: string;
  nextRunAtUtc: string | null;
  lastRunAtUtc: string | null;
  createdAt: string;
  updatedAt: string;
  logCount: number;
};

export type CreateNotificationPayload = {
  businessId: string;
  message: string;
  deliveryMode: NotificationDeliveryMode;
  scheduleType?: NotificationScheduleType;
  scheduledAtUtc?: string | null;
  repeatDays?: NotificationWeekday[];
  repeatPattern?: NotificationRepeatPattern | null;
  monthlyDayOfMonth?: number | null;
  repeatTimeLocal?: string | null;
  timezone?: string;
};

export type UpdateNotificationStatusPayload = {
  status?: NotificationStatus;
};

export type SendNotificationNowResponse = {
  notificationId: string;
  executionId: string;
  triggerType: "manual_now";
  sentCount: number;
  failedCount: number;
  skippedCount: number;
  targetCardCount: number;
  attemptedAt: string;
};
