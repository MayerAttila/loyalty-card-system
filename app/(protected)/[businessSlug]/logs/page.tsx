import { RequireRole } from "@/lib/auth/RequireRole";
import LogsClient from "./LogsClient";
import { getStampingLogs } from "@/api/server/stampingLog.api";
import type { StampingLogEntry } from "@/types/stampingLog";
import { getNotificationLogs } from "@/api/server/notificationLog.api";
import type { NotificationLogEntry } from "@/types/notification";
import HelpCard from "@/components/HelpCard";

const INITIAL_TABLE_LOAD_COUNT = 20;

const LogsPage = async () => {
  let logs: StampingLogEntry[] = [];
  let notificationLogs: NotificationLogEntry[] = [];
  try {
    logs = await getStampingLogs(INITIAL_TABLE_LOAD_COUNT);
  } catch {
    logs = [];
  }
  try {
    notificationLogs = await getNotificationLogs(INITIAL_TABLE_LOAD_COUNT);
  } catch {
    notificationLogs = [];
  }

  return (
    <RequireRole allow={["ADMIN", "OWNER"]}>
      <div className="space-y-6">
        {logs.length === 0 && notificationLogs.length === 0 ? (
          <HelpCard
            title="No activity logs yet"
            description="Stamping and notification logs will appear as soon as your team starts using them."
          />
        ) : null}
        <LogsClient logs={logs} notificationLogs={notificationLogs} />
      </div>
    </RequireRole>
  );
};

export default LogsPage;
