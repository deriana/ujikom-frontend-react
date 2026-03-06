import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <button
                type="button"
                onClick={scrollToTop}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40 transition-all duration-300 hover:bg-indigo-700 hover:-translate-y-1 focus:outline-none ${
                    isVisible 
                        ? "translate-y-0 opacity-100" 
                        : "translate-y-10 opacity-0 pointer-events-none"
                }`}
                aria-label="Scroll to top"
            >
                <ArrowUp size={24} strokeWidth={3} />
            </button>
        </div>
    );
}