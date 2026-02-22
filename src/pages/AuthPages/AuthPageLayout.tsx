import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router-dom";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="relative items-center hidden w-full h-full lg:w-1/2 bg-indigo-600 dark:bg-white/5 lg:grid overflow-hidden">
          <img
            src="/landing_about_img.jpeg" 
            alt="Branding Visual"
            className="absolute inset-0 object-cover w-full h-full opacity-20"
          />

          <div className="relative flex items-center justify-center z-1">
            <GridShape />

            <div className="flex flex-col items-center max-w-sm px-8">
              <Link to="/" className="flex items-center gap-3 mb-6 transition-transform hover:scale-105">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-2xl">
                  <span className="text-2xl font-black italic">H</span>
                </div>
                <span className="text-3xl font-black tracking-tighter text-white uppercase italic">
                  Hideri<span className="opacity-70">HR</span>
                </span>
              </Link>

              <p className="text-center text-indigo-100 dark:text-white/60 text-lg font-medium leading-relaxed">
                Manage your workforce with intelligence and ease.
                Empowering modern teams for a better workplace.
              </p>
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
