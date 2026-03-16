import { useEffect, useState } from "react";
import { Briefcase, MapPin, Clock, CheckCircle2, Inbox, ChevronRight, Award, Zap } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import PageMeta from "@/components/common/PageMeta";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import { useNavigate, useParams } from "react-router-dom";
import { jobConfig } from "@/config/jobConfig";

export default function CareerPage() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const job = jobConfig.find((j) => j.id === jobId);

    if (!job) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
                    <h1 className="text-2xl font-black text-red-500 mb-4 italic">JOB NOT FOUND</h1>
                    <p className="text-gray-500 mb-6">Maaf, lowongan yang Anda cari tidak tersedia.</p>
                    <Button onClick={() => navigate("/careers")}>Lihat Lowongan Lain</Button>
                </div>
            </div>
        );
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [jobId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                <Navbar />
                <main className="pt-20 pb-24 flex items-center justify-center min-h-[80vh]">
                    <div className="max-w-3xl mx-auto px-4 text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-8 border border-emerald-100 dark:border-emerald-500/20 shadow-2xl shadow-emerald-500/20 rotate-3">
                            <CheckCircle2 size={48} />
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 italic">Success!</h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-md mx-auto">
                            Thank you for applying for the <strong>{job.title}</strong> position.
                        </p>
                        <Button onClick={() => navigate("/")} variant="outline" className="rounded-2xl px-10">
                            Return to Home
                        </Button>
                    </div>
                </main>
                <Footer footer={""} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Pakai job.title untuk Meta & Title */}
            <PageMeta title={`Careers - ${job.title}`} />
            <Navbar />

            <main className="pt-20">
                <div className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 py-20 sm:py-32 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                            <div className="max-w-3xl">
                                <div className="mb-6">
                                    <Badge color={job.isOpen ? "success" : "error"} variant="light">
                                        {job.isOpen ? "Hiring Now" : "Position Closed"}
                                    </Badge>
                                </div>
                                <h1 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white mb-8 leading-tight italic">
                                    {job.title}
                                </h1>
                                <div className="flex flex-wrap gap-8 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    <div className="flex items-center gap-3">
                                        <Briefcase size={20} className="text-indigo-600" />
                                        <span>{job.department}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin size={20} className="text-indigo-600" />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock size={20} className="text-indigo-600" />
                                        <span>{job.type}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tombol Apply dengan Smooth Scroll */}
                            {job.isOpen && (
                                <div className="shrink-0 pb-2">
                                    <button
                                        onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="h-16 px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-lg font-black shadow-2xl shadow-indigo-500/40 transition-all active:scale-95"
                                    >
                                        Apply for this Role
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-7 space-y-16">
                            {/* Description */}
                            <section>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3 italic">
                                    <span className="w-8 h-1 bg-indigo-600 rounded-full" /> Job Description
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {job.description}
                                </p>
                            </section>

                            {/* Requirements Map */}
                            <section>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3 italic">
                                    <span className="w-8 h-1 bg-indigo-600 rounded-full" /> Requirements
                                </h2>
                                <ul className="space-y-5">
                                    {job.requirements?.map((req: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-4 group">
                                            <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                                <ChevronRight size={14} strokeWidth={3} />
                                            </div>
                                            <span className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* Benefits Map */}
                            <section>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3 italic">
                                    <span className="w-8 h-1 bg-indigo-600 rounded-full" /> Benefits & Perks
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {job.benefits?.map((benefit: string, idx: number) => (
                                        <div key={idx} className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center gap-4 group hover:border-indigo-500/50 transition-all duration-300">
                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center text-indigo-600">
                                                <Zap size={20} fill="currentColor" />
                                            </div>
                                            <span className="font-bold text-gray-700 dark:text-gray-300">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Form Section */}
                        <div className="lg:col-span-5 relative">
                            <div id="apply" className="sticky top-28">
                                {job.isOpen ? (
                                    <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl shadow-gray-200/40 dark:shadow-none relative">
                                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-[-10deg]">
                                            <Award size={24} />
                                        </div>
                                        <div className="mb-10">
                                            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 italic">Apply Now</h2>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-tight">Be part of the future of HR technology.</p>
                                        </div>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Full Name *</Label>
                                                <Input placeholder="Enter your complete name" className="h-14 rounded-2xl border-gray-200" />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Email *</Label>
                                                    <Input type="email" placeholder="mail@example.com" className="h-14 rounded-2xl border-gray-200" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Phone *</Label>
                                                    <Input type="tel" placeholder="+62..." className="h-14 rounded-2xl border-gray-200" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Portfolio Link *</Label>
                                                <Input placeholder="https://github.com/..." className="h-14 rounded-2xl border-gray-200" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Cover Letter</Label>
                                                <TextArea rows={4} placeholder="Tell us why you?" className="rounded-2xl border-gray-200" />
                                            </div>
                                            <Button type="submit" className="w-full h-16 rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/40 transition-transform active:scale-95" disabled={loading}>
                                                {loading ? "Processing..." : "Submit Application"}
                                            </Button>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="p-12 rounded-[2.5rem] bg-gray-50 dark:bg-gray-800/40 border-2 border-dashed border-gray-200 dark:border-gray-700 text-center text-gray-500">
                                        <Inbox size={48} className="mx-auto mb-4 opacity-20" />
                                        <p className="font-bold italic">Rekrutmen Ditutup</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer footer={""} />
        </div>
    );
}