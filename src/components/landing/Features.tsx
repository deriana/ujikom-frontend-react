import {
    Users,
    Calendar,
    CreditCard,
    Briefcase,
    BarChart3,
    ShieldCheck
} from "lucide-react";

const features = [
    {
        name: "Employee Management",
        description: "Centralize all employee data, from personal records to professional growth tracking.",
        icon: Users,
        color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
        name: "Real-time Attendance",
        description: "Multi-factor authentication (GPS, Face, QR) for precise and fraud-proof attendance tracking.",
        icon: Calendar,
        color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    },
    {
        name: "Automated Payroll",
        description: "Calculate salaries, bonuses, and deductions automatically with direct integration to attendance.",
        icon: CreditCard,
        color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
        name: "Recruitment Suite",
        description: "Manage the entire hiring funnel from job posting to onboarding with seamless workflows.",
        icon: Briefcase,
        color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    },
    {
        name: "Advanced Analytics",
        description: "Get deep insights into workforce productivity and turnover with high-impact data visualization.",
        icon: BarChart3,
        color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
    },
    {
        name: "Enterprise Security",
        description: "Bank-grade encryption and role-based access control to keep your sensitive HR data private.",
        icon: ShieldCheck,
        color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    },
];

export default function Features() {
    return (
        <div id="features" className="py-24 sm:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-sm font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase mb-4">
                        Everything You Need
                    </h2>
                    <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        The Complete HR Ecosystem
                    </p>
                    <div className="w-20 h-1.5 bg-indigo-600 mx-auto mt-6 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-8 rounded-3xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${feature.color}`}>
                                <feature.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                {feature.name}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
