"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

export type DataTableColumn<T> = {
  key: string;
  label: string;
  sortable?: boolean;
  width?: number;
  align?: "left" | "right";
  render?: (value: unknown, row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
};

type SortDirection = "asc" | "desc";

type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  storageKey?: string;
  emptyMessage?: string;
  defaultSortKey?: string;
  defaultSortDirection?: SortDirection;
  respectStoredSort?: boolean;
};

type ResizeState = {
  key: string;
  startX: number;
  startWidth: number;
};

const DEFAULT_WIDTH = 180;
const MIN_WIDTH = 110;

function buildDefaultWidths<T>(columns: DataTableColumn<T>[]) {
  return columns.reduce<Record<string, number>>((acc, column) => {
    acc[column.key] = column.width ?? DEFAULT_WIDTH;
    return acc;
  }, {});
}

function getStorageId(storageKey?: string) {
  return storageKey ? `datatable:${storageKey}` : null;
}

const DataTable = <T,>({
  data,
  columns,
  storageKey,
  emptyMessage = "No data found.",
  defaultSortKey,
  defaultSortDirection = "asc",
  respectStoredSort = true,
}: DataTableProps<T>) => {
  const fallbackSortKey =
    columns.find((column) => column.sortable)?.key ?? null;
  const resolvedSortKey =
    defaultSortKey &&
    columns.some((column) => column.key === defaultSortKey && column.sortable)
      ? defaultSortKey
      : fallbackSortKey;
  const [sortKey, setSortKey] = useState<string | null>(resolvedSortKey);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(defaultSortDirection);
  const [columnWidths, setColumnWidths] = useState(() =>
    buildDefaultWidths(columns)
  );
  const [resizing, setResizing] = useState<ResizeState | null>(null);
  const [isHydrated, setIsHydrated] = useState(!storageKey);

  useEffect(() => {
    const storageId = getStorageId(storageKey);
    if (!storageId) return;

    try {
      const raw = localStorage.getItem(storageId);
      if (!raw) {
        setIsHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw) as {
        widths?: Record<string, number>;
        sortKey?: string | null;
        sortDirection?: SortDirection;
      };

      if (parsed.widths) {
        setColumnWidths((prev) => ({
          ...prev,
          ...parsed.widths,
        }));
      }

      if (respectStoredSort && parsed.sortKey) {
        setSortKey(parsed.sortKey);
      } else {
        setSortKey(resolvedSortKey);
      }

      if (respectStoredSort && parsed.sortDirection) {
        setSortDirection(parsed.sortDirection);
      } else {
        setSortDirection(defaultSortDirection);
      }
    } catch {
    } finally {
      setIsHydrated(true);
    }
  }, [storageKey]);

  useEffect(() => {
    const storageId = getStorageId(storageKey);
    if (!storageId || !isHydrated) return;

    const payload = JSON.stringify({
      widths: columnWidths,
      sortKey,
      sortDirection,
    });

    localStorage.setItem(storageId, payload);
  }, [storageKey, columnWidths, sortKey, sortDirection, isHydrated]);

  useEffect(() => {
    if (!resizing) return;

    const handleMove = (event: MouseEvent) => {
      const delta = event.clientX - resizing.startX;
      const nextWidth = Math.max(MIN_WIDTH, resizing.startWidth + delta);
      setColumnWidths((prev) => ({
        ...prev,
        [resizing.key]: nextWidth,
      }));
    };

    const handleUp = () => {
      setResizing(null);
    };

    document.body.style.cursor = "col-resize";
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [resizing]);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const column = columns.find((col) => col.key === sortKey);
    if (!column || !column.sortable) return data;

    const sorted = [...data];
    sorted.sort((a, b) => {
      const getValue = (row: T) => {
        if (column.sortValue) return column.sortValue(row);
        const raw = (row as Record<string, unknown>)[column.key];
        if (typeof raw === "boolean") return raw ? 1 : 0;
        return raw ?? "";
      };

      const aValue = getValue(a);
      const bValue = getValue(b);

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      const comparison = String(aValue).localeCompare(String(bValue));
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [data, sortKey, sortDirection, columns]);

  const handleSort = (key: string) => {
    if (key === sortKey) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
  };

  const startResize = (
    key: string,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setResizing({
      key,
      startX: event.clientX,
      startWidth: columnWidths[key] ?? DEFAULT_WIDTH,
    });
  };

  const renderSortIndicator = (key: string) => {
    if (key !== sortKey) return null;
    return (
      <span className="ml-1 inline-flex text-contrast/60">
        {sortDirection === "asc" ? (
          <FaAngleUp className="text-xs" />
        ) : (
          <FaAngleDown className="text-xs" />
        )}
      </span>
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-accent-3 bg-primary/40 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
      <div className="overflow-x-auto">
      <table className="min-w-full table-fixed text-left text-sm text-contrast">
        <thead className="border-b border-accent-3 text-xs uppercase tracking-wide text-contrast/70">
          <tr>
            {columns.map((column) => {
              const isRightAligned = column.align === "right";
              const width = columnWidths[column.key] ?? DEFAULT_WIDTH;
              const isLast = column.key === columns[columns.length - 1]?.key;

              return (
                <th
                  key={column.key}
                  className={`relative px-4 py-3 ${
                    isRightAligned ? "text-right" : "text-left"
                  }`}
                  style={{ width }}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className="group inline-flex items-center gap-1 text-left"
                      onClick={() => handleSort(column.key)}
                    >
                      <span className="group-hover:text-contrast">
                        {column.label}
                      </span>
                      {renderSortIndicator(column.key)}
                    </button>
                  ) : (
                    column.label
                  )}
                  {!isLast ? (
                    <>
                      <div
                        className="absolute right-0 top-0 h-full w-3 cursor-col-resize"
                        onMouseDown={(event) => startResize(column.key, event)}
                      />
                      <div className="pointer-events-none absolute right-0 top-1/2 h-5 w-px -translate-y-1/2 bg-accent-4/70" />
                    </>
                  ) : null}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td
                className="px-4 py-6 text-center text-contrast/70"
                colSpan={columns.length}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, index) => (
              <tr
                key={`row-${index}`}
                className={`border-b border-accent-3/60 transition-colors ${
                  index % 2 === 0
                    ? "bg-primary/40"
                    : "bg-accent-1/50"
                } hover:bg-accent-2/60`}
              >
                {columns.map((column) => {
                  const value = (row as Record<string, unknown>)[column.key];
                  const isRightAligned = column.align === "right";

                  return (
                    <td
                      key={`${column.key}-${index}`}
                      className={`px-4 py-4 ${
                        isRightAligned ? "text-right" : "text-left"
                      }`}
                    >
                      {column.render
                        ? column.render(value, row)
                        : String(value ?? "")}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default DataTable;
