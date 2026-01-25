"use client";

import { useState } from "react";
import { api } from "@/api/client/axios";
import Button from "@/components/Button";

type SessionResponse = null | {
  user?: { id?: string; email?: string; name?: string };
  expires?: string;
};

export default function Admin() {
  const [session, setSession] = useState<SessionResponse>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get<SessionResponse>("/auth/session");
      setSession(res.data ?? null);
    } catch (e) {
      const status =
        typeof e === "object" && e !== null && "response" in e
          ? (e as { response?: { status?: number } }).response?.status
          : undefined;
      setError(
        status
          ? `Request failed: ${status}`
          : "Network error while fetching session."
      );
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-primary text-contrast">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold text-brand">Session Debug</h1>
        <p className="mt-2 text-contrast/80">
          Click the button to call <code>/auth/session</code> and view the
          logged-in user.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <Button onClick={fetchSession} disabled={loading}>
            {loading ? "Checking..." : "Check session"}
          </Button>

          <Button
            onClick={async () => {
              await api.post("/auth/signout");
              setSession(null);
            }}
            variant="neutral"
          >
            Logout
          </Button>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <pre className="mt-6 overflow-auto rounded-xl border border-accent-3 bg-accent-1 p-4 text-sm">
          {session
            ? JSON.stringify(session, null, 2)
            : "No session loaded yet."}
        </pre>
      </section>
    </main>
  );
}
