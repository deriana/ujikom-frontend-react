import { useNavigate } from "react-router-dom";
import { ThemeToggleButton } from "../common/ThemeToggleButton";
import { useAuth } from "@/hooks/useAuth";
import Button from "../ui/button/Button";
import { useRoleName } from "@/hooks/useRoleName";
import { ROLES } from "@/constants/Roles";

export default function Navbar() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const navLinks = [
        { name: "Home", href: "#" },
        { name: "Features", href: "#features" },
        { name: "About", href: "#about" },
        { name: "Careers", href: "/careers" },
        { name: "Contact", href: "#contact" },
    ];


    const { isRole } = useRoleName();

    const handleGoToDashboard = () => {
        if (isRole(ROLES.ADMIN) || isRole(ROLES.OWNER)) {
            navigate("/dashboard/admin");
        } else {
            navigate("/dashboard/employee");
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full transition-all duration-300 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                            <span className="text-xl font-bold italic">H</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Hideri<span className="text-indigo-600">HR</span>
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <ThemeToggleButton />
                        {user ? (
                            <Button onClick={handleGoToDashboard} size="sm">
                                Dashboard
                            </Button>
                        ) : (
                            <Button onClick={() => navigate("/login")} variant="outline" size="sm">
                                Sign In
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
