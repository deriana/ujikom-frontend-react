import { SiteBrand } from "../SiteBrand";
import SocialIcons from "./SocialIcons";

export default function Footer({footer}: {footer: string}) {
    return (
        <footer className="bg-white dark:bg-gray-950 pt-24 pb-12 border-t border-gray-100 dark:border-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <SiteBrand logoClassName="rounded-lg"/>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
                            Empowering human potential through intelligent automation. Our mission is to make HR management seamless, secure, and data-driven for companies of all sizes.
                        </p>
                        <div className="flex gap-4">
                           <SocialIcons />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6">
                            Product
                        </h4>
                        <ul className="space-y-4">
                            {["Features", "Pricing", "Case Studies", "Reviews", "Updates"].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6">
                            Company
                        </h4>
                        <ul className="space-y-4">
                            {["About Us", "Careers", "Investors", "Blog", "Contact"].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6">
                            Legal
                        </h4>
                        <ul className="space-y-4">
                            {["Privacy Policy", "Terms of Service", "Cookie Policy", "Compliance"].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-gray-100 dark:border-gray-900 text-center">
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        {footer}
                    </p>
                </div>
            </div>
        </footer>
    );
}
