interface WorkHourTargetProps {
  totalKerja?: number;
  targetMenit?: number;
}

export const WorkHourTarget = ({ 
  totalKerja = 0, 
  targetMenit = 10800 
}: WorkHourTargetProps) => {
  const percentage = Math.min(Math.round((totalKerja / targetMenit) * 100), 100);

  return (
    <div className="rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg shadow-blue-500/20">
      <h4 className="font-bold text-lg">Target Jam Kerja</h4>
      
      <p className="mt-1 text-sm text-blue-100/80">
        Kamu sudah memenuhi <span className="font-semibold text-white">{percentage}%</span> target bulan ini.
      </p>

      {/* Progress Bar */}
      <div className="mt-5 h-2.5 w-full rounded-full bg-white/20">
        <div
          className="h-2.5 rounded-full bg-white transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Stats Footer */}
      <div className="mt-4 flex items-center justify-between text-xs font-medium">
        <span>{totalKerja.toLocaleString()} Menit</span>
        <span className="text-blue-200">Target: {targetMenit.toLocaleString()}</span>
      </div>
    </div>
  );
};