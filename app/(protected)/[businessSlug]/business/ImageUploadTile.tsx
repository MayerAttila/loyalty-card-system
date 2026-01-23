"use client";

import React from "react";
import { FiPlus } from "react-icons/fi";

type ImageUploadTileProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

const ImageUploadTile = ({ label, onClick, disabled }: ImageUploadTileProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-dashed border-accent-3 bg-contrast/5 text-contrast/50 transition disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="absolute inset-0 bg-brand/0 transition group-hover:bg-brand/10" />
      <span className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <span className="absolute left-1 top-1 h-8 w-8 rounded-full bg-brand/20 blur-md" />
      </span>
      <span className="relative transition group-hover:scale-110 group-hover:text-brand">
        <FiPlus size={18} aria-hidden="true" />
      </span>
    </button>
  );
};

export default ImageUploadTile;
