"use client";

import React from "react";

type RewardNoticeProps = {
  rewardsEarned: number;
};

const RewardNotice = ({ rewardsEarned }: RewardNoticeProps) => {
  if (!rewardsEarned || rewardsEarned <= 0) return null;

  return (
    <div className="mt-3 rounded-lg border border-brand/40 bg-brand/10 px-4 py-3 text-sm text-brand">
      {rewardsEarned === 1
        ? "Reward unlocked for this customer."
        : `${rewardsEarned} rewards unlocked for this customer.`}
    </div>
  );
};

export default RewardNotice;
