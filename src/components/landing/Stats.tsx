export default function Stats() {
    const stats = [
        { label: "Active Employees", value: "10K+" },
        { label: "Process Efficiency", value: "95%" },
        { label: "Company Users", value: "500+" },
        { label: "Uptime Guarantee", value: "99.9%" },
    ];

    return (
        <div className="relative py-20 bg-indigo-600 dark:bg-indigo-900/50 overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center group">
                            <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2 transition-transform duration-300 group-hover:scale-110">
                                {stat.value}
                            </div>
                            <div className="text-sm font-medium text-indigo-100/70 uppercase tracking-widest">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
