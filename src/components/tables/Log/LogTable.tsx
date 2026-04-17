import { useState } from "react";
import { useSystemLogs, useDownloadSystemLog } from "@/hooks/useSystemLog";
import { Column, SystemLog } from "@/types";
import { DataTable } from "../BasicTables/DataTable";
import { FileText, Download, Terminal, Calendar as CalendarIcon } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { formatDateID } from "@/utils/date";
import { Modal } from "@/components/ui/modal";
import DatePicker from "@/components/form/date-picker";

export default function SystemLogTable() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);

  const { data: logs = [], isLoading, isError, error } = useSystemLogs({ date: selectedDate });
  const { mutate: downloadLog, isPending: isDownloading } = useDownloadSystemLog();

  const columns: Column<SystemLog>[] = [
    {
      header: "Timestamp",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-400 dark:bg-white/5">
            <Terminal size={16} />
          </div>
          <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
            {row.timestamp}
          </span>
        </div>
      ),
    },
    {
      header: "Environment",
      render: (row) => (
        <Badge variant="light" color="primary">
          <span className="text-[10px] font-bold uppercase">{row.env}</span>
        </Badge>
      ),
    },
    {
      header: "Level",
      render: (row) => {
        const colors: Record<string, "error" | "warning" | "success" | "info"> = {
          ERROR: "error",
          WARNING: "warning",
          INFO: "info",
          DEBUG: "success",
        };
        return (
          <Badge variant="solid" color={colors[row.level] || "info"}>
            {row.level}
          </Badge>
        );
      },
    },
    {
      header: "Message",
      render: (row) => (
        <div 
          className="max-w-md cursor-pointer hover:opacity-70 transition-opacity"
          onClick={() => setSelectedLog(row)}
        >
          <p className="text-sm font-mono text-gray-900 dark:text-gray-100 line-clamp-2">
            {row.message}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">System Logs</h2>
            <p className="text-xs text-gray-500">Monitor backend application events and errors</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <DatePicker
              id="system-log-date"
              mode="single"
              value={selectedDate}
              onChange={(dates) => dates[0] && setSelectedDate(dates[0].toLocaleDateString("en-CA"))}
            />
          </div>
          <button
            onClick={() => downloadLog(selectedDate)}
            disabled={isDownloading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all"
          >
            <Download size={16} />
            {isDownloading ? "Processing..." : "Download Raw"}
          </button>
        </div>
      </div>

      {isError ? (
        <div className="p-8 text-center bg-red-50 dark:bg-red-500/5 rounded-3xl border border-red-100 dark:border-red-500/10">
          <p className="text-red-600 dark:text-red-400 font-bold">Error loading logs: {(error as Error).message}</p>
        </div>
      ) : (
        <DataTable
          tableTitle={`Logs for ${formatDateID(new Date(selectedDate))}`}
          data={logs}
          columns={columns}
          loading={isLoading}
          searchableKeys={["message", "level"]}
        />
      )}

      <Modal 
        isOpen={!!selectedLog} 
        onClose={() => setSelectedLog(null)}
        className="max-w-2xl"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-500">
                  <Terminal size={20} />
                </div>
                <Badge variant="solid" color={selectedLog?.level === 'ERROR' ? 'error' : 'info'}>
                  {selectedLog?.level}
                </Badge>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Log Detail</h3>
                <p className="text-xs text-gray-500">{selectedLog?.timestamp}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
            <pre className="text-xs font-mono text-gray-800 dark:text-gray-300 whitespace-pre-wrap wrap-break-word leading-relaxed">
              {selectedLog?.message}
            </pre>
          </div>
        </div>
      </Modal>
    </div>
  );
}
