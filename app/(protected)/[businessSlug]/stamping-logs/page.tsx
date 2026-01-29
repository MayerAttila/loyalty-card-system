import { RequireRole } from "@/lib/auth/RequireRole";
import StampingLogsClient from "./StampingLogsClient";
import { getStampingLogs } from "@/api/server/stampingLog.api";
import type { StampingLogEntry } from "@/types/stampingLog";

const StampingLogsPage = async () => {
  let logs: StampingLogEntry[] = [];
  try {
    logs = await getStampingLogs();
  } catch {
    logs = [];
  }

  return (
    <RequireRole allow={["ADMIN", "OWNER"]}>
      <StampingLogsClient logs={logs} />
    </RequireRole>
  );
};

export default StampingLogsPage;
