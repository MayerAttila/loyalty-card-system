"use client";

import { useMemo, useState } from "react";
import DataTable, { type DataTableColumn } from "@/components/DataTable";
import SearchBar from "@/components/SearchBar";
import type { StampingLogEntry } from "@/types/stampingLog";

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

const StampingLogsClient = ({ logs }: { logs: StampingLogEntry[] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchAccessor, setSearchAccessor] = useState<string | null>(null);

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

  const searchData = useMemo(
    () =>
      logs.map((log) => ({
        customerName: log.customer.name,
        customerEmail: log.customer.email,
        staffName: log.stampedBy.name,
        staffEmail: log.stampedBy.email,
        staffRole: log.stampedBy.role,
      })),
    [logs]
  );

  const filteredLogs = useMemo(() => {
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

  return (
    <section className="rounded-xl border border-accent-3 bg-accent-1 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-brand">Logs</h2>
          <p className="mt-2 text-sm text-contrast/80">
            Review redemption history, stamp activity, and system events.
          </p>
        </div>
        <div className="w-full md:max-w-sm">
          <SearchBar
            data={searchData}
            searchKeys={[
              "customerName",
              "customerEmail",
              "staffName",
              "staffEmail",
              "staffRole",
            ]}
            placeholder="Search customer or staff"
            onSearchChange={({ query, accessor }) => {
              setSearchQuery(query);
              setSearchAccessor(accessor);
            }}
          />
        </div>
      </div>

      <div className="mt-6">
        <DataTable
          data={filteredLogs}
          columns={columns}
          storageKey="stamping-logs"
          emptyMessage="No stamps recorded yet."
          defaultSortKey="stampedAt"
          defaultSortDirection="desc"
        />
      </div>
    </section>
  );
};

export default StampingLogsClient;
