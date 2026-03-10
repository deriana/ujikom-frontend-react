import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router-dom";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import { SiteBrand } from "@/components/SiteBrand";
import Quote from "@/components/common/Quote";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0 z-10">
        
        {/* SISI KIRI: FORM AREA (CHILDREN) */}
        <div className="relative flex items-center justify-center w-full h-full p-6 lg:w-1/2 sm:p-12 overflow-hidden">
          {/* --- BUBBLES DECORATION FOR FORM AREA --- */}
          <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-indigo-500/30 dark:bg-indigo-500/20 rounded-full blur-[80px] animate-pulse" />
          <div className="absolute bottom-[5%] right-[-10%] w-96 h-96 bg-brand-500/25 dark:bg-brand-500/15 rounded-full blur-[100px]" />
          
          {/* Floating Geometric Bubbles */}
          <div className="absolute top-[15%] right-[10%] w-16 h-16 bg-indigo-100/40 dark:bg-indigo-900/40 rounded-full border-4 border-indigo-200/30 dark:border-indigo-700/30 hidden sm:block animate-bounce shadow-xl" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-[20%] left-[5%] w-24 h-24 bg-brand-50/50 dark:bg-brand-900/30 rounded-full border-8 border-brand-100/40 dark:border-brand-800/40 hidden sm:block animate-pulse shadow-lg" />
          <div className="absolute top-[45%] -left-7.5 w-20 h-20 bg-indigo-400/20 rounded-full border-2 border-indigo-300/30 hidden lg:block backdrop-blur-sm" />
          
          {/* Small Dots */}
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-indigo-500 rounded-full opacity-40 animate-ping" />
          <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-brand-500 rounded-full opacity-40 animate-ping" style={{ animationDelay: '1.5s' }} />

          <div className="w-full max-w-md">
             {children}
          </div>
        </div>

        {/* SISI KANAN: BRANDING AREA (DESKTOP) */}
        <div className="relative items-center hidden w-full h-full lg:w-1/2 bg-indigo-600 dark:bg-white/5 lg:grid overflow-hidden shadow-2xl">
          
          {/* Background Image & Grid Pattern */}
          <img
            src="/landing_about_img.jpeg" 
            alt="Branding Visual"
            className="absolute inset-0 object-cover w-full h-full opacity-20"
          />
          <div className="absolute inset-0 opacity-20">
            <GridShape />
          </div>

          <div className="relative flex flex-col items-center justify-center px-12 text-center z-1">
            {/* Logo Link dengan Backdrop Blur */}
            <Link to="/" className="mb-10 transition-all duration-300 hover:scale-105 group">
              <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl group-hover:border-white/40">
                <SiteBrand 
                  logoClassName="rounded-xl shadow-inner" 
                  nameClassName="text-3xl font-bold tracking-tight text-white drop-shadow-md"
                />
              </div>
            </Link>

            <div className="space-y-6">
              {/* Heading dengan style dari kode kedua */}
              <h2 className="text-3xl font-bold leading-tight text-white">
                Manage your workforce <br/>
                <span className="text-indigo-200">with intelligence and ease.</span>
              </h2>
              
              <div className="pt-8 border-t border-white/10 max-w-sm mx-auto">
                <p className="text-indigo-100/70 dark:text-white/40 text-sm font-light italic">
                  <Quote />
                </p>
              </div>
            </div>
          </div>

          {/* Ornamen Glow Tambahan di Sisi Kanan */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-30" />
        </div>

        {/* Theme Toggler Tetap di Posisinya */}
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}