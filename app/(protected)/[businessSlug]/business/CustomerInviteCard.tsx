"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react";
import Button from "@/components/Button";

type CustomerInviteCardProps = {
  businessId: string;
};

const CustomerInviteCard = ({ businessId }: CustomerInviteCardProps) => {
  const [appOrigin, setAppOrigin] = useState("");
  const qrRef = useRef<HTMLCanvasElement | null>(null);
  const joinUrl = appOrigin ? `${appOrigin}/join/${businessId}` : "";
  const downloadName = useMemo(
    () => `loyalty-invite-${businessId}.png`,
    [businessId]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const configuredOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN;
      setAppOrigin(configuredOrigin || window.location.origin);
    }
  }, []);

  const handleDownloadQr = () => {
    if (!joinUrl) return;
    const canvas = qrRef.current;
    if (!canvas) {
      toast.error("QR code not ready yet.");
      return;
    }
    try {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadName;
      link.click();
    } catch (error) {
      console.error(error);
      toast.error("Unable to download QR code.");
    }
  };

  return (
    <div className="rounded-lg border border-accent-3 bg-primary p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-contrast">
            Customer invite
          </h3>
          <p className="text-xs text-contrast/70">
            Share this QR code so customers can register.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="neutral"
            onClick={async () => {
              if (!joinUrl) return;
              try {
                await navigator.clipboard.writeText(joinUrl);
                toast.success("Invite link copied.");
              } catch (error) {
                console.error(error);
                toast.error("Unable to copy invite link.");
              }
            }}
            disabled={!joinUrl}
            size="sm"
          >
            Copy invite link
          </Button>
          <Button
            type="button"
            variant="neutral"
            onClick={handleDownloadQr}
            disabled={!joinUrl}
            size="sm"
          >
            Download QR
          </Button>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="rounded-lg border border-accent-3 bg-white p-3">
          {joinUrl ? (
            <QRCodeCanvas
              value={joinUrl}
              size={140}
              ref={qrRef}
            />
          ) : (
            <div className="flex h-[140px] w-[140px] items-center justify-center text-xs text-contrast/60">
              Loading...
            </div>
          )}
        </div>
        <div className="text-xs text-contrast/70">
          <p className="font-semibold text-contrast">Invite URL</p>
          <p className="mt-2 break-all">{joinUrl || "Generating..."}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerInviteCard;
