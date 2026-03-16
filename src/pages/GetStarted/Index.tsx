import { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useSettingsContext } from '@/context/SettingsContext';
import { useNavigate } from 'react-router-dom';

export function GetStarted() {
  const { user } = useAuth();
  const { general } = useSettingsContext();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  useEffect(() => {
    const hasCompleted = localStorage.getItem('has_completed_get_started');
    if (!hasCompleted) {
      // Tambahkan overflow hidden ke body supaya background gak bisa di-scroll
      document.body.style.overflow = 'hidden';
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('has_completed_get_started', 'true');
    document.body.style.overflow = 'unset'; // Kembalikan scroll body
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-99999999 bg-white dark:bg-gray-950 flex flex-col animate-in fade-in duration-300">
      
      {/* Tombol Skip di pojok kanan atas */}
      <button 
        onClick={handleDismiss}
        className="absolute top-6 right-6 text-gray-400 font-medium z-10 p-2"
      >
        Skip
      </button>

      {/* Content Container */}
      <div className="flex-1 flex flex-col justify-center px-8 max-w-md mx-auto w-full">
        
        {/* Branding/Icon */}
        <div className="mb-8 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-4xl mx-auto animate-bounce">
            🏢
          </div>
        </div>

        {/* Text Area */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
            Hello, {user?.name?.split(' ')[0] || 'User'}!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            Welcome to {general?.site_name || 'HRIS'}. Let's set up your account in seconds to start working.
          </p>
        </div>

        {/* List Langkah-langkah */}
        <div className="space-y-4 mb-10">
          <StepItem 
            icon="👤" 
            title="Employee Profile" 
            desc={user?.employee?.position?.name || "Position already registered."} 
            done={true} 
          />
          <StepItem 
            icon="📸" 
            title="Face Attendance" 
            desc="Go to Profile > Biometric & Security to register your face." 
            done={false} 
            active={true}
          />
          <StepItem 
            icon="📊" 
            title="Monitor Dashboard" 
            desc="View your attendance statistics and salary." 
            done={false} 
          />
        </div>

        {/* Action Button */}
        <button 
          onClick={() => {
            handleDismiss();
            navigate('/profile');
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg transition-all active:scale-95"
        >
          Set Up Now
        </button>
      </div>

      {/* Footer Info */}
      <div className="p-8 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-600">
          {general?.site_name || 'HRIS'}
        </p>
      </div>
    </div>
  );
}

// Sub-component Step Item
function StepItem({ icon, title, desc, done, active }: { 
  icon: string, title: string, desc: string, done: boolean, active?: boolean 
}) {
  return (
    <div className={`flex items-center p-4 rounded-2xl border ${active ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900'}`}>
      <div className="text-2xl mr-4">{icon}</div>
      <div className="flex-1">
        <h4 className={`font-bold text-sm ${active ? 'text-blue-900 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}>{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
      </div>
      {done && <span className="text-green-500 dark:text-emerald-400 text-sm font-bold">Complete</span>}
    </div>
  );
}