"use client";

import { useMemo, useState } from "react";
import DataTable, { type DataTableColumn } from "@/components/DataTable";
import FormSwitch from "@/components/FormSwitch";
import SearchBar from "@/components/SearchBar";
import type { StampingLogEntry } from "@/types/stampingLog";
import type { NotificationLogEntry } from "@/types/notification";

const formatDateTime = (value: unknown) => {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
};

const normalizeStr = (value: unknown) =>
  String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const channelLabelMap: Record<NotificationLogEntry["channel"], string> = {
  apple_wallet: "Apple Wallet",
  google_wallet: "Google Wallet",
};

const statusBadgeClassMap: Record<NotificationLogEntry["status"], string> = {
  sent: "border-emerald-400/40 bg-emerald-400/15 text-emerald-200",
  failed: "border-rose-400/40 bg-rose-400/15 text-rose-200",
  skipped: "border-amber-400/40 bg-amber-400/15 text-amber-200",
  queued: "border-sky-400/40 bg-sky-400/15 text-sky-200",
};

type LogsTabKey = "stamping" | "notification";

type Props = {
  logs: StampingLogEntry[];
  notificationLogs: NotificationLogEntry[];
};

type SearchRow = Record<string, string>;

const LogsClient = ({ logs, notificationLogs }: Props) => {
  const [activeTab, setActiveTab] = useState<LogsTabKey>("stamping");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchAccessor, setSearchAccessor] = useState<string | null>(null);

  const stampingColumns = useMemo<DataTableColumn<StampingLogEntry>[]>(
    () => [
      {
        key: "stampedAt",
        label: "Time",
        sortable: true,
        width: 220,
        render: (value) => formatDateTime(value),
        sortValue: (row) => new Date(row.stampedAt).getTime(),
      },
      {
        key: "customer",
        label: "Customer",
        sortable: true,
        width: 220,
        render: (_, row) => (
          <div>
            <p className="font-medium text-contrast">{row.customer.name}</p>
            <p className="text-xs text-contrast/60">{row.customer.email}</p>
          </div>
        ),
        sortValue: (row) => row.customer.name,
      },
      {
        key: "stampCountAfter",
        label: "Stamps",
        sortable: true,
        width: 180,
        align: "right",
        render: (_, row) => (
          <div className="text-right">
            <p className="text-sm text-contrast/80">
              {row.stampCountAfter}/{row.cardTemplate.maxPoints}
            </p>
            <p className="text-xs text-contrast/60">
              +{row.addedStamps} this stamp
            </p>
          </div>
        ),
        sortValue: (row) => row.stampCountAfter,
      },
      {
        key: "stampedBy",
        label: "Staff",
        sortable: true,
        width: 200,
        render: (_, row) => (
          <div>
            <p className="font-medium text-contrast">{row.stampedBy.name}</p>
            <p className="text-xs text-contrast/60">{row.stampedBy.email}</p>
          </div>
        ),
        sortValue: (row) => row.stampedBy.name,
      },
    ],
    [],
  );

  const notificationColumns = useMemo<DataTableColumn<NotificationLogEntry>[]>(
    () => [
      {
        key: "attemptedAt",
        label: "Time",
        sortable: true,
        width: 220,
        render: (_, row) => formatDateTime(row.attemptedAt ?? row.createdAt),
        sortValue: (row) =>
          new Date(row.attemptedAt ?? row.createdAt).getTime(),
      },
      {
        key: "customer",
        label: "Customer",
        sortable: true,
        width: 220,
        render: (_, row) => (
          <div>
            <p className="font-medium text-contrast">
              {row.customerLoyaltyCard.customer.name}
            </p>
            <p className="text-xs text-contrast/60">
              {row.customerLoyaltyCard.customer.email}
            </p>
          </div>
        ),
        sortValue: (row) => row.customerLoyaltyCard.customer.name,
      },
      {
        key: "channel",
        label: "Channel",
        sortable: true,
        width: 170,
        render: (_, row) => (
          <div>
            <p className="font-medium text-contrast">
              {channelLabelMap[row.channel]}
            </p>
            <p className="text-xs uppercase tracking-wide text-contrast/60">
              {row.triggerType === "manual_now" ? "Send now" : "Scheduled"}
            </p>
          </div>
        ),
        sortValue: (row) => row.channel,
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
        width: 160,
        render: (_, row) => (
          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${statusBadgeClassMap[row.status]}`}
          >
            {row.status}
          </span>
        ),
        sortValue: (row) => row.status,
      },
      {
        key: "message",
        label: "Message",
        sortable: true,
        width: 320,
        render: (_, row) => (
          <div>
            <p className="line-clamp-2 text-sm text-contrast/90">
              {row.notification.message}
            </p>
            {row.errorMessage ? (
              <p className="mt-1 line-clamp-1 text-xs text-rose-200/90">
                {row.errorCode ? `${row.errorCode}: ` : ""}
                {row.errorMessage}
              </p>
            ) : null}
          </div>
        ),
        sortValue: (row) => row.notification.message,
      },
    ],
    [],
  );

  const stampingSearchData = useMemo(
    () =>
      logs.map((log) => ({
        customerName: log.customer.name,
        customerEmail: log.customer.email,
        staffName: log.stampedBy.name,
        staffEmail: log.stampedBy.email,
        staffRole: log.stampedBy.role,
      })),
    [logs],
  );

  const notificationSearchData = useMemo(
    () =>
      notificationLogs.map((log) => ({
        message: log.notification.message,
        customerName: log.customerLoyaltyCard.customer.name,
        customerEmail: log.customerLoyaltyCard.customer.email,
        channel: log.channel,
        status: log.status,
        triggerType: log.triggerType,
        errorMessage: log.errorMessage ?? "",
      })),
    [notificationLogs],
  );

  const filteredStampingLogs = useMemo(() => {
    if (!searchQuery) return logs;

    const q = normalizeStr(searchQuery);
    const searchIn = (value: unknown) => normalizeStr(value).includes(q);

    return logs.filter((log) => {
      const fields = {
        customerName: log.customer.name,
        customerEmail: log.customer.email,
        staffName: log.stampedBy.name,
        staffEmail: log.stampedBy.email,
        staffRole: log.stampedBy.role,
      };

      if (searchAccessor && searchAccessor in fields) {
        return searchIn(fields[searchAccessor as keyof typeof fields]);
      }

      return Object.values(fields).some(searchIn);
    });
  }, [logs, searchAccessor, searchQuery]);

  const filteredNotificationLogs = useMemo(() => {
    if (!searchQuery) return notificationLogs;

    const q = normalizeStr(searchQuery);
    const searchIn = (value: unknown) => normalizeStr(value).includes(q);

    return notificationLogs.filter((log) => {
      const fields = {
        message: log.notification.message,
        customerName: log.customerLoyaltyCard.customer.name,
        customerEmail: log.customerLoyaltyCard.customer.email,
        channel: channelLabelMap[log.channel],
        status: log.status,
        triggerType: log.triggerType,
        errorMessage: log.errorMessage ?? "",
      };

      if (searchAccessor && searchAccessor in fields) {
        return searchIn(fields[searchAccessor as keyof typeof fields]);
      }

      return Object.values(fields).some(searchIn);
    });
  }, [notificationLogs, searchAccessor, searchQuery]);

  const isStampingTab = activeTab === "stamping";

  const searchData: SearchRow[] = isStampingTab
    ? stampingSearchData.map((row) => ({
        customerName: row.customerName,
        customerEmail: row.customerEmail,
        staffName: row.staffName,
        staffEmail: row.staffEmail,
        staffRole: row.staffRole,
      }))
    : notificationSearchData.map((row) => ({
        message: row.message,
        customerName: row.customerName,
        customerEmail: row.customerEmail,
        channel: row.channel,
        status: row.status,
        triggerType: row.triggerType,
        errorMessage: row.errorMessage,
      }));
  const searchKeys: string[] = isStampingTab
    ? ["customerName", "customerEmail", "staffName", "staffEmail", "staffRole"]
    : [
        "message",
        "customerName",
        "customerEmail",
        "channel",
        "status",
        "triggerType",
        "errorMessage",
      ];

  return (
    <section className="rounded-xl border border-accent-3 bg-accent-1 p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex justify-start">
            <FormSwitch
              items={[
                { key: "stamping", label: "Stamping Logs" },
                { key: "notification", label: "Notification Logs" },
              ]}
              activeKey={activeTab}
              onChange={(key) => {
                if (key === "stamping" || key === "notification") {
                  setActiveTab(key);
                }
              }}
            />
          </div>
          <div className="w-full xl:max-w-sm">
            <SearchBar
              data={searchData}
              searchKeys={searchKeys}
              placeholder={
                isStampingTab
                  ? "Search customer or staff"
                  : "Search message, customer, status"
              }
              onSearchChange={({ query, accessor }) => {
                setSearchQuery(query);
                setSearchAccessor(accessor);
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        {isStampingTab ? (
          <DataTable
            data={filteredStampingLogs}
            columns={stampingColumns}
            storageKey="logs-stamping"
            emptyMessage="No stamps recorded yet."
            defaultSortKey="stampedAt"
            defaultSortDirection="desc"
          />
        ) : (
          <DataTable
            data={filteredNotificationLogs}
            columns={notificationColumns}
            storageKey="notification-logs"
            emptyMessage="No notification deliveries recorded yet."
            defaultSortKey="attemptedAt"
            defaultSortDirection="desc"
          />
        )}
      </div>
    </section>
  );
};

export default LogsClient;
