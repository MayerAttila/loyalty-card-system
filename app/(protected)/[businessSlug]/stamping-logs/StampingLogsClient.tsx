"use client";

import { useEffect, useMemo, useState } from "react";
import DataTable, { type DataTableColumn } from "@/components/DataTable";
import { getStampingLogs, type StampingLogEntry } from "@/api/client/stampingLog.api";

const formatDateTime = (value: unknown) => {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
};

const StampingLogsClient = () => {
  const [logs, setLogs] = useState<StampingLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getStampingLogs(200);
        if (active) setLogs(data);
      } catch (err) {
        if (!active) return;
        const message =
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          (err as { response?: { data?: { message?: string } } }).response?.data
            ?.message
            ? (err as { response?: { data?: { message?: string } } }).response
                ?.data?.message
            : "Unable to load stamping logs.";
        setError(message ?? "Unable to load stamping logs.");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const columns = useMemo<DataTableColumn<StampingLogEntry>[]>(
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
            <p className="text-xs text-contrast/60">
              {row.stampedBy.email}
            </p>
          </div>
        ),
        sortValue: (row) => row.stampedBy.name,
      },
    ],
    []
  );

  if (loading) {
    return <p className="mt-4 text-sm text-contrast/70">Loading logs...</p>;
  }

  if (error) {
    return (
      <p className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">
        {error}
      </p>
    );
  }

  return (
    <div className="mt-6">
      <DataTable
        data={logs}
        columns={columns}
        storageKey="stamping-logs"
        emptyMessage="No stamps recorded yet."
        defaultSortKey="stampedAt"
        defaultSortDirection="desc"
      />
    </div>
  );
};

export default StampingLogsClient;
