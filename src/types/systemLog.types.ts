import { ApiResponse } from "./common";

/**
 * Represents a single log entry parsed from the Laravel log file
 */
export interface SystemLog {
  timestamp: string;
  env: string;
  level: string;
  message: string;
}

/**
 * Response structure for the log list API
 */
export interface SystemLogResponse extends ApiResponse<SystemLog[]> {
  date: string;
}

/**
 * Query parameters for fetching logs
 */
export interface SystemLogParams {
  date?: string; // Format: YYYY-MM-DD
}
