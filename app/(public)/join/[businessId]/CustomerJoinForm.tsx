"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import CustomInput from "@/components/CustomInput";
import { createCustomer } from "@/api/client/customer.api";

type CustomerJoinFormProps = {
  businessId: string;
  businessName?: string;
};

const CustomerJoinForm = ({ businessId, businessName }: CustomerJoinFormProps) => {
  const params = useParams<{ businessId?: string | string[] }>();
  const resolvedBusinessId = useMemo(() => {
    if (businessId) return businessId;
    const fromParams = params?.businessId;
    if (Array.isArray(fromParams)) return fromParams[0] ?? "";
    return fromParams ?? "";
  }, [businessId, params?.businessId]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!resolvedBusinessId) {
      toast.error("Missing business link.");
      return;
    }
    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!email.trim()) {
      toast.error("Email is required.");
      return;
    }

    setSubmitting(true);
    try {
      await createCustomer({
        name: name.trim(),
        email: email.trim(),
        businessId: resolvedBusinessId,
      });
      setSubmitted(true);
      toast.success("You are registered!");
    } catch (error) {
      console.error(error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ??
        (error instanceof Error ? error.message : "Unable to register.");
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-accent-3 bg-primary/40 p-6 text-center">
        <h2 className="text-lg font-semibold text-contrast">All set!</h2>
        <p className="mt-2 text-sm text-contrast/70">
          You have been registered{businessName ? ` for ${businessName}` : ""}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CustomInput
        id="customerName"
        placeholder="Your name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
        disabled={submitting}
      />
      <CustomInput
        id="customerEmail"
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        disabled={submitting}
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-primary disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Join business"}
      </button>
    </form>
  );
};

export default CustomerJoinForm;
