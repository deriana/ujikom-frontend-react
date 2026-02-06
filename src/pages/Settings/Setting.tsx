import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import AttendanceSetting from "@/components/settings/Attendance";
import GeneralSetting from "@/components/settings/General";
import GeoSetting from "@/components/settings/Geofencing";
import { Clock, Globe, MapPin } from "lucide-react";
import { useState } from "react";

const DUMMY_DATA = {
  attendance: {
    work_end_time: "17:00",
    work_start_time: "09:00",
    late_tolerance_minutes: 10,
  },
  general: {
    logo: "/logo/logo-long.webp",
    footer: "Copyright 2026 © Laravel",
    favicon: "/logo/favicon.jpeg",
    site_name: "Laravel",
  },
  geo_fencing: {
    radius_meters: 100,
    office_latitude: -6.2,
    office_longitude: 106.816666,
  },
};

export default function Setting() {
  const [activeTab, setActiveTab] = useState("general");

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
              {activeTab === "general" && (
                <GeneralSetting data={DUMMY_DATA.general} />
              )}
              {activeTab === "attendance" && (
                <AttendanceSetting data={DUMMY_DATA.attendance} />
              )}
              {activeTab === "geo_fencing" && (
                <GeoSetting data={DUMMY_DATA.geo_fencing} />
              )}
            </div>
          </div>{" "}
      </div>
    </>
  );
}
