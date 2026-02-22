import { jobConfig } from "@/config/jobConfig";
import { useNavigate } from "react-router-dom";
import { Briefcase, MapPin, ChevronRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Badge from "@/components/ui/badge/Badge";

export default function JobListPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navbar />
            <main className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 italic">Join the Team</h1>
                    <p className="text-gray-500 dark:text-gray-400">Explore open positions at HideriHR</p>
                </div>

                <div className="grid gap-6">
                    {jobConfig.map((job) => (
                        <div 
                            key={job.id}
                            onClick={() => navigate(`/careers/${job.id}`)}
                            className="group p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-2xl hover:border-indigo-500/50 transition-all cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                        {job.title}
                                    </h3>
                                    <Badge color={job.isOpen ? "success" : "error"} variant="light">
                                        {job.isOpen ? "Open" : "Closed"}
                                    </Badge>
                                </div>
                                <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
                                    <span className="flex items-center gap-1.5"><Briefcase size={16}/> {job.department}</span>
                                    <span className="flex items-center gap-1.5"><MapPin size={16}/> {job.location}</span>
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <ChevronRight size={24} strokeWidth={3} />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}