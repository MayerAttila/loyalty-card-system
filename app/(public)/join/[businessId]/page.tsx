import React from "react";
import CustomerJoinForm from "./CustomerJoinForm";
import { getBusinessById } from "@/api/server/business.api";

type JoinPageProps = {
  params: { businessId: string };
};

const JoinPage = async ({ params }: JoinPageProps) => {
  const { businessId } = params;
  let businessName: string | undefined;

  try {
    const business = await getBusinessById(businessId);
    businessName = business?.name;
  } catch (error) {
    console.error("join page business lookup failed", error);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center bg-primary px-6 py-10 text-contrast">
      <div className="rounded-2xl border border-accent-3 bg-accent-1 p-8">
        <h1 className="text-2xl font-semibold text-contrast">
          {businessName ? `Join ${businessName}` : "Join this business"}
        </h1>
        <p className="mt-2 text-sm text-contrast/70">
          Enter your details to receive your loyalty card.
        </p>
        <div className="mt-6">
          <CustomerJoinForm
            businessId={businessId}
            businessName={businessName}
          />
        </div>
      </div>
    </main>
  );
};

export default JoinPage;
