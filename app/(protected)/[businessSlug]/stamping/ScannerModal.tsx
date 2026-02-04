"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader, type IScannerControls } from "@zxing/browser";
import type { Exception, Result } from "@zxing/library";

type ScannerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onScan: (value: string) => void;
};

const ScannerModal = ({ isOpen, onClose, onScan }: ScannerModalProps) => {
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerReaderRef = useRef<BrowserQRCodeReader | null>(null);
  const scannerControlsRef = useRef<IScannerControls | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    if (
      typeof window === "undefined" ||
      !navigator?.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== "function"
    ) {
      setScannerError(
        "Camera not available. Use HTTPS (or localhost) and allow permissions."
      );
      setIsScanning(false);
      return () => {
        cancelled = true;
      };
    }

    if (!videoRef.current) {
      setScannerError("Camera not ready.");
      setIsScanning(false);
      return () => {
        cancelled = true;
      };
    }

    const reader = new BrowserQRCodeReader();
    scannerReaderRef.current = reader;
    setScannerError(null);
    setIsScanning(true);

    const onDecode = (
      result: Result | undefined,
      error: Exception | undefined,
      controls: IScannerControls
    ) => {
      if (cancelled) return;
      scannerControlsRef.current = controls;
      if (result?.getText()) {
        onScan(result.getText());
        onClose();
        return;
      }
      if (error && error.name !== "NotFoundException") {
        setScannerError("Unable to read QR code.");
      }
    };

    reader
      .decodeFromConstraints(
        { video: { facingMode: "environment" } },
        videoRef.current,
        onDecode
      )
      .then((controls) => {
        if (cancelled) {
          controls.stop();
          return;
        }
        scannerControlsRef.current = controls;
      })
      .catch((error: Error) => {
        if (cancelled) return;
        setScannerError(
          error.message ||
            "Unable to access the camera. Check permissions."
        );
      })
      .finally(() => {
        if (!cancelled) setIsScanning(false);
      });

    return () => {
      cancelled = true;
      if (scannerControlsRef.current) {
        scannerControlsRef.current.stop();
        scannerControlsRef.current = null;
      }
      if (scannerReaderRef.current) {
        scannerReaderRef.current = null;
      }
    };
  }, [isOpen, onClose, onScan]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-xl border border-accent-3 bg-primary p-4 text-contrast shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-brand">Scan QR Code</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2 py-1 text-contrast/70 hover:text-contrast"
            aria-label="Close scanner"
          >
            ✕
          </button>
        </div>
        <p className="mt-2 text-sm text-contrast/70">
          Point your camera at the customer QR code.
        </p>
        <div className="mt-4 overflow-hidden rounded-lg border border-accent-3 bg-black">
          <video
            ref={videoRef}
            className="h-72 w-full object-cover"
            muted
            playsInline
          />
        </div>
        {scannerError ? (
          <p className="mt-3 text-sm text-red-400">{scannerError}</p>
        ) : null}
        {isScanning ? (
          <p className="mt-3 text-xs text-contrast/60">Scanning...</p>
        ) : null}
      </div>
    </div>
  );
};

export default ScannerModal;
