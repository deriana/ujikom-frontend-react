import { ShieldCheck, Target, Heart } from "lucide-react";

export default function About() {
    const values = [
        {
            title: "Our Vision",
            description: "To lead the global transformation of human resource management through innovative, intelligent, and human-centric technology.",
            icon: Target,
            color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400"
        },
        {
            title: "Security First",
            description: "We prioritize the privacy and security of your employee data, employing bank-grade encryption and rigorous compliance standards.",
            icon: ShieldCheck,
            color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400"
        },
        {
            title: "Human Centric",
            description: "Behind every data point is a person. Our platform is designed to enhance the human experience in the workplace.",
            icon: Heart,
            color: "text-rose-600 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400"
        }
    ];

    return (
        <section id="about" className="py-24 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Image / Illustration Placeholder */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                src="/landing_about_img.jpeg"
                                alt="Modern Office Team"
                                className="w-full h-[400px] object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <h2 className="text-sm font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase mb-4">
                            Who We Are
                        </h2>
                        <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                            Redefining the Future of <br />
                            <span className="text-indigo-600">Workforce Management</span>
                        </h3>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
                            At HideriHR, we believe that the heart of every successful organization is its people. Founded by technology experts and HR professionals, we've built an ecosystem that bridges the gap between complex data and human connection.
                        </p>

                        <div className="space-y-8">
                            {values.map((item, index) => (
                                <div key={index} className="flex gap-6">
                                    <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                            {item.title}
                                        </h4>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
