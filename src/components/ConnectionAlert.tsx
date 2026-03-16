import { WifiOff, RefreshCw } from "lucide-react";

interface ConnectionAlertProps {
  isOnline: boolean;
  isServerError: boolean;
}

export const ConnectionAlert = ({ isOnline, isServerError }: ConnectionAlertProps) => {
  if (isOnline && !isServerError) return null;

  return (
    <div className="sticky top-15 z-40 bg-red-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium animate-pulse shadow-md">
      <WifiOff size={16} />
      <span>
        {!isOnline ? "No internet connection" : "Server is unreachable (Ngrok Off)"}
      </span>
      <button 
        onClick={() => window.location.reload()}
        className="ml-2 p-1 hover:bg-red-600 rounded-full transition-colors"
        title="Retry"
      >
        <RefreshCw size={14} />
      </button>
    </div>
  );
};