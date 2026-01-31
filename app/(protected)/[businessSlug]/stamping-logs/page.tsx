import { RequireRole } from "@/lib/auth/RequireRole";
import StampingLogsClient from "./StampingLogsClient";
import { getStampingLogs } from "@/api/server/stampingLog.api";
import type { StampingLogEntry } from "@/types/stampingLog";
import HelpCard from "@/components/HelpCard";

const StampingLogsPage = async () => {
  let logs: StampingLogEntry[] = [];
  try {
    logs = await getStampingLogs();
  } catch {
    logs = [];
  }

  return (
    <RequireRole allow={["ADMIN", "OWNER"]}>
      <div className="space-y-6">
        {logs.length === 0 ? (
          <HelpCard
            title="No stamping activity yet"
            description="Logs will appear as soon as staff apply stamps."
          />
        ) : null}
        <StampingLogsClient logs={logs} />
      </div>
    </RequireRole>
  );
};

export default StampingLogsPage;
