import { useNavigate } from "react-router-dom";
import { Users, Layers, Briefcase } from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import ComponentCard from "@/components/common/ComponentCard";

const pages = [
  {
    name: "Division",
    icon: <Layers className="w-8 h-8" />,
    path: "/trash/divisions",
  },
  {
    name: "Teams",
    icon: <Briefcase className="w-8 h-8" />,
    path: "/teams",
  },
  {
    name: "Users",
    icon: <Users className="w-8 h-8" />,
    path: "/users",
  },
];

export default function Trash() {
  const navigate = useNavigate();

  return (
    <div>
      <PageBreadcrumb pageTitle="Trash" />
        <div className="min-h-screen px-5 py-7 xl:px-10 xl:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pages.map((page) => (
              <div
                key={page.name}
                onClick={() => navigate(page.path)}
                className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 text-center transition hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex justify-center mb-4 text-gray-800 dark:text-white">
                  {page.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  {page.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
