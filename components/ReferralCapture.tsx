"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { storeReferralCode } from "@/lib/referral";

const ReferralCapture = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (!ref) return;
    storeReferralCode(ref);
  }, [searchParams]);

  return null;
};

export default ReferralCapture;

