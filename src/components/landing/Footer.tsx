import { Github, Twitter, Linkedin, Facebook } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-950 pt-24 pb-12 border-t border-gray-100 dark:border-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold italic">
                                N
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Neuro<span className="text-indigo-600">HR</span>
                            </span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
                            Empowering human potential through intelligent automation. Our mission is to make HR management seamless, secure, and data-driven for companies of all sizes.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Github, Linkedin, Facebook].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all duration-300"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
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
                        © {new Date().getFullYear()} Neuro HR. All rights reserved. Made with ❤️ for modern workplaces.
                    </p>
                </div>
            </div>
        </footer>
    );
}
