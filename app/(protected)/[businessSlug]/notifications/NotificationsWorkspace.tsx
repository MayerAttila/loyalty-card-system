"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import NotificationsCalendar from "./NotificationsCalendar";
import NotificationComposer from "./NotificationComposer";
import NotificationOverview from "./NotificationOverview";
import {
  deleteNotification,
  getNotificationsByBusinessId,
  updateNotificationStatus,
} from "@/api/client/notification.api";
import type { NotificationRecord } from "@/types/notification";

type NotificationsWorkspaceProps = {
  businessId: string;
};

const NotificationsWorkspace = ({ businessId }: NotificationsWorkspaceProps) => {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingNotification, setEditingNotification] =
    useState<NotificationRecord | null>(null);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [togglingIds, setTogglingIds] = useState<string[]>([]);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const composerRef = useRef<HTMLDivElement | null>(null);

  const togglingSet = useMemo(() => new Set(togglingIds), [togglingIds]);
  const deletingSet = useMemo(() => new Set(deletingIds), [deletingIds]);

  const loadNotifications = useCallback(async () => {
    setLoadingNotifications(true);
    try {
      const data = await getNotificationsByBusinessId(businessId);
      setNotifications(data);
    } catch (error) {
      console.error("getNotificationsByBusinessId failed", error);
      toast.error("Unable to load notifications.");
    } finally {
      setLoadingNotifications(false);
    }
  }, [businessId]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (!isComposerOpen) return;

    const timeoutId = window.setTimeout(() => {
      composerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);

    return () => window.clearTimeout(timeoutId);
  }, [isComposerOpen]);

  const handleSaved = (notification: NotificationRecord) => {
    setNotifications((current) => {
      const existingIndex = current.findIndex((item) => item.id === notification.id);
      if (existingIndex === -1) {
        return [notification, ...current];
      }
      return current.map((item) => (item.id === notification.id ? notification : item));
    });
    setEditingNotification(null);
    setIsComposerOpen(false);
  };

  const handleStartCreate = () => {
    setEditingNotification(null);
    setIsComposerOpen(true);
  };

  const handleEditNotification = (notification: NotificationRecord) => {
    if (deletingSet.has(notification.id)) return;
    setEditingNotification(notification);
    setIsComposerOpen(true);
  };

  const handleToggleStatus = async (notification: NotificationRecord) => {
    if (togglingSet.has(notification.id) || deletingSet.has(notification.id)) return;

    setTogglingIds((current) => [...current, notification.id]);
    try {
      const updated = await updateNotificationStatus(notification.id);
      setNotifications((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
      toast.success(
        updated.status === "active"
          ? "Notification activated."
          : "Notification deactivated."
      );
    } catch (error) {
      console.error("updateNotificationStatus failed", error);
      toast.error("Unable to update notification status.");
    } finally {
      setTogglingIds((current) => current.filter((id) => id !== notification.id));
    }
  };

  const handleDeleteNotification = async (notification: NotificationRecord) => {
    if (deletingSet.has(notification.id) || togglingSet.has(notification.id)) return;

    setDeletingIds((current) => [...current, notification.id]);
    try {
      await deleteNotification(notification.id);
      setNotifications((current) =>
        current.filter((item) => item.id !== notification.id)
      );
      toast.success("Notification deleted.");
    } catch (error) {
      console.error("deleteNotification failed", error);
      toast.error("Unable to delete notification.");
    } finally {
      setDeletingIds((current) => current.filter((id) => id !== notification.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {!isComposerOpen ? (
          <Button type="button" onClick={handleStartCreate}>
            Add new notification
          </Button>
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <NotificationsCalendar notifications={notifications} />
        <NotificationOverview
          notifications={notifications}
          loading={loadingNotifications}
          togglingIds={togglingIds}
          deletingIds={deletingIds}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteNotification}
          onEdit={handleEditNotification}
        />
      </div>

      {isComposerOpen ? (
        <div ref={composerRef} className="scroll-mt-24">
          <NotificationComposer
            businessId={businessId}
            initialNotification={editingNotification}
            onCancel={() => {
              setEditingNotification(null);
              setIsComposerOpen(false);
            }}
            onSaved={handleSaved}
          />
        </div>
      ) : null}
    </div>
  );
};

export default NotificationsWorkspace;
