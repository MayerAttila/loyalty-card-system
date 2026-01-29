"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type SearchSuggestion = {
  label: string;
  accessor: string;
};

type SearchChangePayload = {
  query: string;
  accessor: string | null;
};

type SearchBarProps<T> = {
  data: T[];
  searchKeys: Array<keyof T | string>;
  onSearchChange: (payload: SearchChangePayload) => void;
  placeholder?: string;
  initialQuery?: string;
  maxSuggestions?: number;
  debounceMs?: number;
};

const normalizeStr = (str: unknown) =>
  String(str ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const isExactMatch = (q: string, list: string[]) =>
  list.length === 1 && list[0].toLowerCase() === q.toLowerCase();

const useDebounce = (value: string, delay = 200) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const InputField = React.memo(
  ({
    value,
    onChange,
    onKeyDown,
    placeholder,
    inputRef,
    onClear,
  }: {
    value: string;
    onChange: (value: string) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    inputRef: React.RefObject<HTMLInputElement | null>;
    onClear: () => void;
  }) => (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-contrast/40">
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          event.stopPropagation();
          onKeyDown?.(event);
        }}
        placeholder={placeholder}
        className="w-full rounded-full border border-accent-3 bg-primary py-2 pl-11 pr-11 text-sm text-contrast placeholder:text-contrast/50 focus:outline-none focus:ring-2 focus:ring-brand/40"
      />
      {value ? (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            onClick={onClear}
            aria-label="Clear"
            className="rounded-full p-1 text-contrast/50 transition hover:bg-accent-2 hover:text-contrast"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  )
);

const renderSuggestion = (suggestion: string, query: string) => {
  if (!query) return suggestion;
  const index = suggestion.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return suggestion;
  const start = suggestion.substring(0, index);
  const match = suggestion.substring(index, index + query.length);
  const end = suggestion.substring(index + query.length);
  return (
    <>
      {start}
      <span className="font-semibold text-contrast">{match}</span>
      {end}
    </>
  );
};

export default function SearchBar<T>({
  data,
  searchKeys,
  onSearchChange,
  placeholder = "Search...",
  initialQuery = "",
  maxSuggestions = 8,
  debounceMs = 200,
}: SearchBarProps<T>) {
  const [searchQuery, setSearchQuery] = useState(() =>
    String(initialQuery ?? "")
  );
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [suppressSuggestions, setSuppressSuggestions] = useState(false);
  const suggestionsContainerRef = useRef<HTMLUListElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const debouncedQuery = useDebounce(searchQuery, debounceMs);
  const lastInitialQueryRef = useRef(String(initialQuery ?? ""));

  useEffect(() => {
    const nextQuery = String(initialQuery ?? "");
    if (nextQuery !== lastInitialQueryRef.current) {
      lastInitialQueryRef.current = nextQuery;
      setSearchQuery(nextQuery);
      setSuppressSuggestions(false);
    }
  }, [initialQuery]);

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    if (!suppressSuggestions) {
      onSearchChange({ query: debouncedQuery, accessor: null });
    }
  }, [debouncedQuery, suppressSuggestions, onSearchChange]);

  useEffect(() => {
    if (suppressSuggestions || !debouncedQuery) {
      setSuggestions([]);
      return;
    }

    const qNormalized = normalizeStr(debouncedQuery);
    const suggestionMap = new Map<string, string>();

    data.forEach((item) => {
      searchKeys.forEach((key) => {
        const value = (item as Record<string, unknown>)?.[key as string];
        if (!value) return;
        const sValue = String(value);
        if (
          normalizeStr(sValue).startsWith(qNormalized) &&
          !suggestionMap.has(sValue)
        ) {
          suggestionMap.set(sValue, String(key));
        }
      });
    });

    const suggestionList = Array.from(suggestionMap, ([label, accessor]) => ({
      label,
      accessor,
    }))
      .filter((item) => normalizeStr(item.label) !== qNormalized)
      .sort((a, b) => a.label.localeCompare(b.label))
      .slice(0, maxSuggestions);

    if (
      isExactMatch(
        qNormalized,
        suggestionList.map((s) => normalizeStr(s.label))
      )
    ) {
      setSuggestions([]);
    } else {
      setSuggestions(suggestionList);
    }

    setHighlightedIndex(-1);
  }, [debouncedQuery, data, searchKeys, suppressSuggestions, maxSuggestions]);

  useEffect(() => {
    if (highlightedIndex >= 0 && suggestionsContainerRef.current) {
      const item = suggestionsContainerRef.current.children[highlightedIndex];
      (item as HTMLElement | undefined)?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  const handleSelection = useCallback(
    (suggestion: SearchSuggestion) => {
      setSearchQuery(suggestion.label);
      setSuppressSuggestions(true);
      setSuggestions([]);
      onSearchChange({ query: suggestion.label, accessor: suggestion.accessor });
    },
    [onSearchChange]
  );

  const handleQueryChange = (value: string) => {
    setSearchQuery(value);
    setSuppressSuggestions(false);
    if (!value) {
      onSearchChange({ query: "", accessor: null });
    }
  };

  const onKeyDownHandler = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape") {
        setSuggestions([]);
        return;
      }
      if (suggestions.length === 0) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
          break;
        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex(
            (prev) => (prev - 1 + suggestions.length) % suggestions.length
          );
          break;
        case "Enter":
        case "Tab":
          if (highlightedIndex >= 0) {
            event.preventDefault();
            handleSelection(suggestions[highlightedIndex]);
          }
          break;
        default:
          break;
      }
    },
    [suggestions, highlightedIndex, handleSelection]
  );

  return (
    <div className="relative w-full md:max-w-xl">
      <InputField
        value={searchQuery}
        onChange={handleQueryChange}
        onKeyDown={onKeyDownHandler}
        placeholder={placeholder}
        inputRef={inputRef}
        onClear={() => handleQueryChange("")}
      />

      {suggestions.length > 0 ? (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-accent-3 bg-primary shadow-xl">
          <ul className="max-h-80 overflow-y-auto py-2" ref={suggestionsContainerRef}>
            {suggestions.map((suggestion, idx) => (
              <li
                key={`${suggestion.accessor}:${suggestion.label}`}
                className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${
                  idx === highlightedIndex
                    ? "bg-brand/15 text-brand"
                    : "text-contrast/80 hover:bg-accent-2 hover:text-contrast"
                }`}
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleSelection(suggestion);
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
              >
                <span>{renderSuggestion(suggestion.label, searchQuery)}</span>
                <span className="ml-2 text-xs text-contrast/50">
                  [{suggestion.accessor}]
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
