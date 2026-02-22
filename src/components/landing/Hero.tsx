import { useNavigate } from "react-router-dom";
import Button from "../ui/button/Button";
import { ArrowRight, ShieldCheck, Zap, Users } from "lucide-react";

export default function Hero() {
    const navigate = useNavigate();

    return (
        <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
            {/* Background Ornaments */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-400/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-blue-400/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in">
                    <Zap size={14} />
                    Revolutionizing HR Management
                </div>

                <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8">
                    The Intelligent Core for <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                        Professional HRIS
                    </span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg lg:text-xl text-gray-500 dark:text-gray-400 leading-relaxed mb-10">
                    Streamline your workforce management with Neuro HR. From automated payroll to real-time attendance, manage everything in one sleek, secure platform.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <Button
                        onClick={() => navigate("/login")}
                        className="w-full sm:w-auto h-14 px-8 rounded-2xl text-base font-bold shadow-xl shadow-indigo-500/25"
                        endIcon={<ArrowRight size={20} />}
                    >
                        Get Started Free
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto h-14 px-8 rounded-2xl text-base font-bold"
                    >
                        Watch Demo
                    </Button>
                </div>

                {/* Social Proof / Trusted By */}
                <div className="pt-12 border-t border-gray-100 dark:border-gray-800/50">
                    <p className="text-sm font-medium text-gray-400 dark:text-gray-500 mb-8 uppercase tracking-widest text-center">
                        Trusted by modern companies worldwide
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 font-bold text-gray-400 text-xl"><ShieldCheck /> SECURE</div>
                        <div className="flex items-center gap-2 font-bold text-gray-400 text-xl"><Zap /> FAST</div>
                        <div className="flex items-center gap-2 font-bold text-gray-400 text-xl"><Users /> SOCIAL</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
