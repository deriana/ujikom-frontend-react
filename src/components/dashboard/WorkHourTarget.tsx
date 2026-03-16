interface WorkHourTargetProps {
  totalKerja?: number;
  targetMenit?: number;
  variant?: "primary" | "neutral";
}

export const WorkHourTarget = ({ 
  totalKerja = 0, 
  targetMenit = 10800,
  variant = "primary"
}: WorkHourTargetProps) => {
  const percentage = Math.min(Math.round((totalKerja / targetMenit) * 100), 100);

  const styles = {
    primary: "bg-linear-to-br from-blue-600 to-indigo-700 text-white shadow-blue-500/20",
    neutral: "bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/5 text-gray-900 dark:text-white shadow-sm"
  };

  const isNeutral = variant === "neutral";

  return (
    <div className={`rounded-[2.5rem] p-6 shadow-lg ${styles[variant]}`}>
      <h4 className="font-bold text-lg">Working Hours Target</h4>
      
      <p className={`mt-1 text-sm ${isNeutral ? "text-gray-500 dark:text-gray-400" : "text-blue-100/80"}`}>
        You have met <span className={`font-semibold ${isNeutral ? "text-blue-500" : "text-white"}`}>{percentage}%</span> of this month's target.
      </p>

      {/* Progress Bar */}
      <div className={`mt-5 h-2.5 w-full rounded-full ${isNeutral ? "bg-gray-100 dark:bg-gray-700" : "bg-white/20"}`}>
        <div
          className={`h-2.5 rounded-full transition-all duration-700 ease-out ${isNeutral ? "bg-blue-500" : "bg-white"}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Stats Footer */}
      <div className={`mt-4 flex items-center justify-between text-xs font-medium ${isNeutral ? "text-gray-400" : ""}`}>
        <span>{totalKerja.toLocaleString()} Minutes</span>
        <span className={isNeutral ? "" : "text-blue-200"}>Target: {targetMenit.toLocaleString()}</span>
      </div>
    </div>
  );
};