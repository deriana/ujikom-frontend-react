import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggleButton } from "../common/ThemeToggleButton";
import { useAuth } from "@/hooks/useAuth";
import Button from "../ui/button/Button";
import { useRoleName } from "@/hooks/useRoleName";
import { ROLES } from "@/constants/Roles";
import { SiteBrand } from "../SiteBrand";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    
    const isHomePage = location.pathname === "/";
    const isCareerDetailPage = location.pathname.startsWith("/careers/");

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Features", href: "/#features" },
        { name: "Careers", href: "/#careers" }, 
        { name: "About", href: "/#about" },
        { name: "Contact", href: "/#contact" },
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
                    <SiteBrand logoClassName="rounded-lg" nameClassName="text-indigo-600 dark:text-indigo-400 italic" />

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => {
                            // LOGIKA AKTIF: 
                            // 1. Jika di Home dan href-nya cocok dengan hash.
                            // 2. Jika di Detail Career, maka link "Careers" tetap terlihat aktif/semi-aktif.
                            const isLinkCareers = link.name === "Careers";
                            const isActive =
                                (link.href === "/" && isHomePage && !location.hash) ||
                                (location.hash && link.href.includes(location.hash)) ||
                                (isLinkCareers && isCareerDetailPage);

                            const isExternal = !link.href.startsWith("/#");
                            
                            const baseStyle = "text-sm font-medium transition-colors duration-200";
                            const activeStyle = "text-indigo-600 dark:text-white cursor-default";
                            const inactiveStyle = "text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white";

                            const combinedClassName = `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`;

                            // Jika link aktif dan kita di page yang sama, jadikan span agar tidak re-scroll
                            if (isActive && !isCareerDetailPage) {
                                return (
                                    <span key={link.name} className={combinedClassName}>
                                        {link.name}
                                    </span>
                                );
                            }

                            // Jika di HomePage, gunakan anchor <a> untuk smooth scroll ke ID
                            if (isHomePage && !isExternal && link.href !== "/") {
                                return (
                                    <a
                                        key={link.name}
                                        href={link.href.replace("/", "")}
                                        className={combinedClassName}
                                    >
                                        {link.name}
                                    </a>
                                );
                            }

                            // Default: Gunakan <Link> untuk pindah page (dari detail kembali ke home)
                            return (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className={combinedClassName}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
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