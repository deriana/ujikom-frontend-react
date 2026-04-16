import { WifiOff, RefreshCw, AlertCircle } from "lucide-react";

interface ConnectionAlertProps {
  isOnline: boolean;
  isServerError: boolean;
}

export const ConnectionAlert = ({ isOnline, isServerError }: ConnectionAlertProps) => {
  if (isOnline && !isServerError) return null;

  return (
    <div className="sticky top-15 z-40 bg-red-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium animate-pulse shadow-md">
      {!isOnline ? <WifiOff size={16} /> : <AlertCircle size={16} />}
      <span>
        {!isOnline 
          ? "You're currently offline. Please check your internet connection." 
          : "We're having trouble reaching our server. Please try again in a moment."
        }
      </span>
      <button 
        onClick={() => window.location.reload()}
        className="ml-2 px-2 py-1 bg-white/20 hover:bg-white/30 rounded-md transition-colors flex items-center gap-1.5 text-xs border border-white/30"
        title="Retry"
      >
        <RefreshCw size={14} />
        <span>Retry</span>
      </button>
    </div>
  );
};