"use client";

import React from "react";

const LocationSelectorPanel = () => {
  return (
    <div className="rounded-lg border border-accent-3 bg-primary p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-contrast">Location</h3>
          <p className="text-xs text-contrast/70">
            Choose the primary location for your business.
          </p>
        </div>
        <span className="rounded-full border border-accent-3 px-2 py-1 text-[10px] font-semibold text-contrast/70">
          Google Maps
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-accent-3 bg-contrast/5 px-3 py-2 text-xs text-contrast/70">
          <span className="inline-flex h-2 w-2 rounded-full bg-brand" />
          Search for an address
        </div>
        <div className="rounded-lg border border-accent-3 bg-contrast/5 px-3 py-2 text-xs text-contrast/70">
          123 Market St, San Francisco, CA
        </div>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-lg border border-accent-3 bg-contrast/5">
        <div className="absolute left-3 top-3 rounded-md bg-primary px-2 py-1 text-[10px] font-semibold text-contrast/70">
          Map preview
        </div>
        <div className="grid h-40 w-full place-items-center text-xs text-contrast/60">
          Google Maps canvas placeholder
        </div>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-full rounded-full bg-brand/20" />
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-full rounded-full bg-brand" />
        </div>
      </div>
    </div>
  );
};

export default LocationSelectorPanel;
