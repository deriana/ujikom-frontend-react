import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ActivityHeader() {
  const navigate = useNavigate();

  return (
    <header className="p-6 bg-transparent dark:bg-transparent">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full bg-gray-100 dark:bg-gray-800 transition-colors"
        >
          <ChevronLeft size={20} className="dark:text-white" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-black dark:text-white uppercase tracking-tighter">
            Attendance Log
          </h1>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
            Your daily details
          </p>
        </div>
        <div className="w-10" />
      </div>
    </header>
  );
}
