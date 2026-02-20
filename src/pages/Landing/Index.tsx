import { useRoleName } from "@/hooks/useRoleName";
import { ROLES } from "@/constants/Roles";
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const { isRole } = useRoleName();
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    if (isRole(ROLES.ADMIN) || isRole(ROLES.OWNER)) {
      navigate("/dashboard/admin");
    } else {
      navigate("/dashboard/employee");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">
        Welcome to HRIS
      </h1>
      <button
        onClick={handleGoToDashboard}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Go to Dashboard
      </button>
    </div>
  );
};
