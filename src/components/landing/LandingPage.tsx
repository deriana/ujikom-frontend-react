import { useEffect } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import Stats from "./Stats";
import About from "./About";
import Contact from "./Contact";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import { useSettingsContext } from "@/context/SettingsContext";
import JobListPage from "./JobListPage";
import { useLocation } from "react-router-dom";

export default function LandingPage() {
    const { general } = useSettingsContext();

    const siteName = general?.site_name || "HRIS Management";

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll(".animate-reveal");
        revealElements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            setTimeout(() => {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100); 
        } else {
            window.scrollTo(0, 0);
        }
    }, [pathname, hash]);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            <main>
                <section id="home" className="animate-reveal">
                    <Hero />
                </section>
                <section id="stats" className="animate-reveal">
                    <Stats />
                </section>
                <section id="features" className="animate-reveal">
                    <Features />
                </section>
                <section id="careers" className="animate-reveal">
                    <JobListPage  siteName={siteName}/>
                </section>
                <section id="about" className="animate-reveal">
                    <About sitename={siteName} />
                </section>
                <section id="contact" className="animate-reveal">
                    <Contact sitename={siteName} />
                </section>
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    );
}
