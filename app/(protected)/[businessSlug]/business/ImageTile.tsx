"use client";

import React from "react";
import { FiTrash2 } from "react-icons/fi";
import { BusinessStampImage } from "@/types/stampImage";

type ImageTileProps = {
  image: BusinessStampImage;
  onDelete: (imageId: string) => void;
  deleting: boolean;
};

const ImageTile = ({ image, onDelete, deleting }: ImageTileProps) => {
  return (
    <div className="relative h-16 w-16 rounded-lg border border-accent-3 bg-transparent">
      <img
        src={image.url}
        alt={image.kind === "STAMP_ON" ? "Stamp on" : "Stamp off"}
        className="h-full w-full object-contain"
      />
      <button
        type="button"
        onClick={() => onDelete(image.id)}
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
