"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { QRCodeSVG } from "qrcode.react";

type CustomerInviteCardProps = {
  businessId: string;
};

const CustomerInviteCard = ({ businessId }: CustomerInviteCardProps) => {
  const [appOrigin, setAppOrigin] = useState("");
  const joinUrl = appOrigin ? `${appOrigin}/join/${businessId}` : "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAppOrigin(window.location.origin);
    }
  }, []);

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
        <button
          type="button"
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
          className="rounded-lg border border-accent-3 px-4 py-2 text-xs font-semibold text-contrast/80 disabled:opacity-60"
        >
          Copy invite link
        </button>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="rounded-lg border border-accent-3 bg-white p-3">
          {joinUrl ? (
            <QRCodeSVG value={joinUrl} size={140} />
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
