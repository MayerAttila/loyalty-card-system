"use client";

import React from "react";
import { FiTrash2 } from "react-icons/fi";
import { BusinessStampImage } from "@/types/stampImage";

type ImageTileProps = {
  image: BusinessStampImage;
  onDelete: (imageId: string) => void;
  deleting: boolean;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
};

const ImageTile = ({
  image,
  onDelete,
  deleting,
  selectable = false,
  selected = false,
  onSelect,
}: ImageTileProps) => {
  return (
    <div
      role={selectable ? "button" : undefined}
      tabIndex={selectable ? 0 : undefined}
      onClick={() => {
        if (!selectable || deleting) return;
        onSelect?.();
      }}
      onKeyDown={(event) => {
        if (!selectable || deleting) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.();
        }
      }}
      className={`relative h-16 w-16 rounded-lg border bg-transparent ${
        selected ? "border-brand ring-2 ring-brand/40" : "border-accent-3"
      } ${selectable ? "cursor-pointer" : ""}`}
    >
      <img
        src={image.url}
        alt={image.kind === "STAMP_ON" ? "Stamp on" : "Stamp off"}
        className="h-full w-full object-contain"
      />
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onDelete(image.id);
        }}
        disabled={deleting}
        className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-contrast shadow-sm ring-1 ring-accent-3 transition hover:-translate-y-0.5 hover:scale-110 hover:bg-brand focus-visible:-translate-y-0.5 focus-visible:scale-110 focus-visible:bg-brand focus-visible:outline-none disabled:opacity-60"
        aria-label="Delete stamp image"
      >
        {deleting ? "..." : <FiTrash2 size={12} aria-hidden="true" />}
      </button>
    </div>
  );
};

export default ImageTile;
