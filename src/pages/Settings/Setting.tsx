import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import AttendanceSetting from "@/components/settings/Attendance";
import GeneralSetting from "@/components/settings/General";
import GeoSetting from "@/components/settings/Geofencing";
import { useSettings } from "@/hooks/useSetting";
import { SettingsData } from "@/types";
import { Clock, Globe, MapPin } from "lucide-react";
import { useState } from "react";


export default function Setting() {
  const [activeTab, setActiveTab] = useState("general");
  const { data: settings } = useSettings() as {
    data: SettingsData | undefined;
  };
  const general = settings?.general.values;
  const attendance = settings?.attendance.values;
  const geo_fencing = settings?.geo_fencing.values;

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "attendance", label: "Attendance", icon: Clock },
    { id: "geo_fencing", label: "Geo Fencing", icon: MapPin },
  ];
  return (
    <>
      <PageMeta title="Settings" />
      <PageBreadcrumb pageTitle="Settings" />
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all shrink-0 lg:shrink
                  ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
                      : "bg-white dark:bg-gray-900 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {activeTab === "general" && general && (
              <GeneralSetting data={general} />
            )}
            {activeTab === "attendance" && attendance && (
              <AttendanceSetting data={attendance} />
            )}
            {activeTab === "geo_fencing" && geo_fencing && (
              <GeoSetting data={geo_fencing} />
            )}
          </div>
        </div>{" "}
      </div>
    </>
  );
}
