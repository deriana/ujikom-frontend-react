import { useEffect } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import Stats from "./Stats";
import About from "./About";
import Contact from "./Contact";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

export default function LandingPage() {
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
                    <section id="about" className="animate-reveal">
                        <About />
                    </section>
                    <section id="contact" className="animate-reveal">
                        <Contact />
                    </section>
                </main>
                <Footer />
                <ScrollToTop />
            </div>
    );
}
