import { Mail, Phone, MapPin, Send, Github, Twitter, Instagram, Facebook } from "lucide-react";
import Button from "../ui/button/Button";

export default function Contact({sitename}: {sitename:string}) {
    return (
        <section id="contact" className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase mb-4">
                        Get In Touch
                    </h2>
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
                        We're Here to Help
                    </h3>
                    <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                        Have questions about {sitename}? Reach out to our team of experts and discover how we can transform your HR operations.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/50">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-8">Contact Information</h4>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 dark:text-white">Email Us</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">support@hiderihr.com</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 dark:text-white">Call Us</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">+1 (555) 000-0000</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 dark:text-white">Visit Us</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">123 Tech Avenue, Silicon Valley, CA</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-700/50">
                                <h5 className="text-sm font-bold text-gray-900 dark:text-white uppercase mb-4 tracking-wider">Follow Us</h5>
                                <div className="flex gap-4">
                                    {[
                                        { icon: <Github size={20} />, href: "https://github.com/deriana", label: "Github", color: "hover:bg-gray-800 hover:text-white" },
                                        { icon: <Facebook    size={20} />, href: "https://facebook.com/jerri.maruf", label: "Facebook", color: "hover:bg-blue-600 hover:text-white" },
                                        { icon: <Instagram   size={20} />, href: "https://instagram.com/hi_deri_", label: "Instagram", color: "hover:bg-pink-600 hover:text-white" },
                                        { icon: <Twitter size={20} />, href: "https://x.com/Deriana765", label: "X (Twitter)", color: "hover:bg-black hover:text-white" },
                                    ].map((social, i) => (
                                        <a
                                            key={i}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.label}
                                            className={`w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center transition-all duration-300 ${social.color} hover:-translate-y-1 shadow-sm`}
                                        >
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <form className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Subject</label>
                                <input
                                    type="text"
                                    placeholder="Inquiry about Enterprise Plan"
                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Message</label>
                                <textarea
                                    rows={5}
                                    placeholder="Tell us how we can help you..."
                                    className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
                                />
                            </div>

                            <Button className="w-full h-14 rounded-2xl font-bold shadow-lg shadow-indigo-500/30" endIcon={<Send size={18} />}>
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
