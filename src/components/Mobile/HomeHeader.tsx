import { AuthContext } from "@/context/AuthContext";
import { Calendar, CloudSun, Moon, Sun, User } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";

export default function HomeHeader() {
  const { user } = useContext(AuthContext);
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", icon: <Sun size={14} /> };
    if (hour < 15)
      return { text: "Good Afternoon", icon: <CloudSun size={14} /> };
    if (hour < 18)
      return { text: "Good Evening", icon: <CloudSun size={14} /> };
    return { text: "Good Night", icon: <Moon size={14} /> };
  };

  return (
    <div className="px-5 pt-6">
      <div className="bg-white dark:bg-linear-to-br dark:from-gray-800 dark:to-gray-900 px-6 py-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-blue-600 dark:text-blue-400">
                {getGreeting().icon}
              </span>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                {getGreeting().text}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {user?.name?.split(" ")[0] || "Employee"}
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <Calendar size={12} className="text-gray-400" />
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                {currentDate}
              </p>
            </div>
          </div>
          <Link
            to="/profile"
            className="w-12 h-12 rounded-2xl bg-linear-to-tr from-blue-600 to-blue-400 p-0.5 shadow-lg shadow-blue-200 dark:shadow-none"
          >
            <div className="w-full h-full rounded-[14px] bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
              {user?.employee?.profile_photo ? (
                <img
                  src={user.employee.profile_photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="text-blue-600 w-6 h-6" />
              )}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
