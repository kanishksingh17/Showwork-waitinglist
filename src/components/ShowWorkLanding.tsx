import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrbitingPlatforms } from "@/components/ui/orbiting-platforms";
import { ShowWorkTimeline } from "@/components/ui/showwork-timeline";
import DisplayCards from "@/components/ui/display-cards";
import { InView } from "@/components/ui/in-view";
import { BouncyCardsFeatures } from "@/components/ui/bouncy-cards-features";

import { cn } from "@/lib/utils";
import {
    Menu,
    X,
    Code2,
    Zap,
    Globe,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    Star,
    Twitter,
    Github,
    Linkedin,
    Youtube,
    Instagram,
    ChevronDown,
    PhoneCall,
    Sparkles,
} from "lucide-react";

// Import portfolio images - temporarily commented out due to missing assets
// import portfolioWebApp from '@/assets/portfolio-web-app.jpg';
// import portfolioMobileApp from '@/assets/portfolio-mobile-app.jpg';
// import portfolioEcommerce from '@/assets/portfolio-ecommerce.jpg';
// import demoWorkspace from '@/assets/demo-workspace.jpg';


const ShowWorkLanding = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [titleNumber, setTitleNumber] = useState(0);
    const [expandedCard, setExpandedCard] = useState<number | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [showDemoPopup, setShowDemoPopup] = useState(false);
    const [isDesktop, setIsDesktop] = useState(() => {
        // Initialize safely - default to false (mobile) if window is not available
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 640;
        }
        return false;
    });

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const checkDesktop = () => {
            // Debounce the resize check
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const desktop = window.innerWidth >= 640;
                console.log('Screen width check:', window.innerWidth, 'px - isDesktop:', desktop);
                setIsDesktop(desktop);
            }, 150); // Debounce resize events
        };

        // Initial check
        const desktop = window.innerWidth >= 640;
        setIsDesktop(desktop);

        // Add event listener with passive option
        window.addEventListener('resize', checkDesktop, { passive: true });

        // Cleanup
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', checkDesktop);
        };
    }, []);

    const rotatingWords = useMemo(
        () => ["Professionally", "Stunningly", "Effortlessly", "Powerfully", "Instantly", "Beautifully"],
        []
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setTitleNumber((prev) => (prev + 1) % rotatingWords.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [rotatingWords.length]);

    // Scroll handler for navigation animation with throttling
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setIsScrolled(window.scrollY > 50);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError("");

        try {
            const waitlistId = import.meta.env.VITE_WAITLIST_ID;
            const response = await fetch(`https://api.freewaitlists.com/waitlists/${waitlistId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    meta: {
                        source: 'landing-page',
                        timestamp: new Date().toISOString()
                    }
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Successfully added to waitlist:", data);
                setSubmitSuccess(true);
                setShowDemoPopup(true);
                setEmail("");

                // Scroll to journey section after a short delay
                setTimeout(() => {
                    const journeySection = document.getElementById('journey');
                    if (journeySection) {
                        journeySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 1000);

                // Reset success message after 5 seconds
                setTimeout(() => {
                    setSubmitSuccess(false);
                }, 5000);
            } else {
                throw new Error(data.message || 'Failed to join waitlist');
            }
        } catch (error) {
            console.error("Error submitting to waitlist:", error);
            setSubmitError(error instanceof Error ? error.message : "Failed to join waitlist. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent relative overflow-x-hidden">



            {/* Beta Launch Banner */}
            <div className="fixed top-0 left-0 right-0 z-30 bg-blue-600">
                <div className="max-w-screen-xl mx-auto px-4 py-2 text-white text-center md:px-8">
                    <p className="font-medium text-[13px] tracking-tight md:text-base whitespace-nowrap overflow-hidden text-ellipsis">
                        Coming Soon — Join the waitlist for early access
                    </p>
                </div>
            </div>

            {/* Navigation with Scroll Animation */}
            <header className="fixed z-40 w-full top-0">
                <nav className={cn(
                    "w-full transition-all duration-300 px-4 pt-[48px]",
                    isScrolled ? "mt-0" : "mt-4"
                )}>
                    <div className={cn(
                        "mx-auto max-w-6xl px-6 transition-all duration-300 lg:px-12",
                        isScrolled && "bg-white/50 dark:bg-slate-900/50 max-w-4xl rounded-2xl backdrop-blur-xl px-6 py-2 shadow-xl mt-2",
                        isMenuOpen && "bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-xl"
                    )}>
                        <div className="relative flex items-center justify-between gap-6 py-3 lg:py-4">
                            {/* Logo */}
                            <div className="flex flex-shrink-0">
                                <a href="/" aria-label="home" className="flex items-center space-x-2 group hover:scale-105 transition-all duration-300">
                                    <div className="w-8 h-8 logo-bg rounded-lg flex items-center justify-center group-hover:rotate-12 transition-all duration-300">
                                        <Code2 className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold text-foreground">ShowWork</span>
                                </a>
                            </div>

                            {/* Desktop Links */}
                            <div className="hidden lg:flex flex-1 justify-center">
                                <ul className="flex gap-8 text-sm font-medium">
                                    <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                                    <li><a href="#journey" className="text-muted-foreground hover:text-foreground transition-colors">Journey</a></li>
                                    {/* <li><a href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">Demo</a></li> */}
                                </ul>
                            </div>

                            {/* Desktop CTA */}
                            <div className="hidden lg:flex items-center gap-4">
                                <Button
                                    size="sm"
                                    className="logo-bg text-white shadow-lg"
                                    onClick={() => {
                                        const emailInput = document.getElementById('email-input');
                                        if (emailInput) {
                                            emailInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            setTimeout(() => emailInput.focus(), 600);
                                        }
                                    }}
                                >
                                    Join Waitlist
                                </Button>
                            </div>

                            {/* Mobile Toggle */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden p-2 text-foreground"
                                aria-label="Toggle Menu"
                            >
                                {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                            </button>

                            {/* Mobile Dropdown */}
                            <div className={cn(
                                "absolute top-full left-0 right-0 mt-2 p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl lg:hidden transition-all duration-300 transform origin-top",
                                isMenuOpen ? "opacity-100 scale-100 translate-y-0 visible" : "opacity-0 scale-95 -translate-y-4 invisible"
                            )}>
                                <ul className="space-y-4 font-medium text-lg">
                                    <li><a href="#features" onClick={() => setIsMenuOpen(false)} className="block p-2 hover:text-blue-600">Features</a></li>
                                    <li><a href="#journey" onClick={() => setIsMenuOpen(false)} className="block p-2 hover:text-blue-600">Journey</a></li>
                                    <li className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <Button
                                            className="w-full logo-bg text-white shadow-lg"
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                setTimeout(() => {
                                                    const emailInput = document.getElementById('email-input');
                                                    if (emailInput) {
                                                        emailInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                        setTimeout(() => emailInput.focus(), 600);
                                                    }
                                                }, 100);
                                            }}
                                        >
                                            Join Waitlist
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Hero Content Section - Mobile-First */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center overflow-hidden" style={{ paddingTop: 'clamp(11rem, 15vh, 12rem)', paddingBottom: 'clamp(1.5rem, 6vh, 3rem)' }}>
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply animate-blob"></div>
                    <div className="absolute top-20 right-20 w-72 h-72 bg-purple-400/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-400/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-4000"></div>
                </div>


                <div className="w-full" style={{ maxWidth: 'var(--container-max)', paddingInline: 'var(--container-padding)' }}>
                    <div className="text-center w-full mx-auto" style={{ marginBottom: 'var(--space-2xl)', maxWidth: '56rem' }}>
                        <h1 className="font-black text-slate-900 tracking-tight text-center relative" style={{
                            fontSize: 'clamp(2.25rem, 7vw + 0.5rem, 5rem)',
                            lineHeight: '1.15',
                        }}>
                            {/* Floating Widget 1: Analytics (Top Left) */}
                            <div className="hidden lg:flex absolute -top-12 -left-20 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 items-center gap-3 animate-float animation-delay-100 z-20 hover:scale-105 transition-transform cursor-default">
                                <div className="p-2 bg-blue-100 rounded-xl">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Total Views</p>
                                    <p className="text-sm font-bold text-slate-900">12.5k <span className="text-green-500 text-xs font-medium ml-1">↑ 14%</span></p>
                                </div>
                            </div>

                            {/* Floating Widget 2: GitHub (Top Right) */}
                            <div className="hidden lg:flex absolute -top-8 -right-16 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 items-center gap-2 animate-float animation-delay-500 z-20 hover:scale-105 transition-transform cursor-default">
                                <Github className="w-5 h-5 text-slate-900" />
                                <span className="text-sm font-bold text-slate-700">GitHub Connected</span>
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-1"></div>
                            </div>

                            {/* Floating Widget 3: Offers (Bottom Left) */}
                            <div className="hidden lg:flex absolute top-24 -left-24 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 items-center gap-3 animate-float animation-delay-700 z-20 hover:scale-105 transition-transform cursor-default">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-white">
                                        <img src="https://ui-avatars.com/api/?name=Recruiter&background=0D8ABC&color=fff" alt="Recruiter" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-bold text-slate-900">New Job Offer</p>
                                    <p className="text-[10px] text-slate-500">Frontend Dev • Remote</p>
                                </div>
                            </div>

                            {/* Floating Widget 4: Upload (Bottom Right) */}
                            <div className="hidden lg:flex absolute top-32 -right-8 bg-white/90 backdrop-blur-md p-3 pr-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 items-center gap-3 animate-float animation-delay-300 z-20 hover:scale-105 transition-transform cursor-default transform rotate-3">
                                <div className="p-2 bg-purple-100 rounded-xl">
                                    <Zap className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-bold text-slate-900">Project Deployed</p>
                                    <div className="h-1.5 w-24 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                        <div className="h-full bg-purple-500 w-full animate-loadingBar"></div>
                                    </div>
                                </div>
                            </div>

                            <span className="block">
                                Showcase Your Work
                            </span>
                            <span className="relative flex h-[1.3em] w-full justify-center overflow-hidden text-center text-blue-600 dark:text-blue-500">
                                {rotatingWords.map((word, index) => (
                                    <motion.span
                                        key={index}
                                        className="absolute font-black whitespace-nowrap"
                                        initial={{ opacity: 0, y: 100 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 100,
                                            damping: 15
                                        }}
                                        animate={
                                            titleNumber === index
                                                ? {
                                                    y: 0,
                                                    opacity: 1,
                                                }
                                                : {
                                                    y: titleNumber > index ? -120 : 120,
                                                    opacity: 0,
                                                }
                                        }
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </span>
                            <span className="block">
                                Like Never Before
                            </span>
                        </h1>

                        <div className="w-full max-w-2xl mx-auto mt-6 sm:mt-8 p-1">
                            <div className="bg-white/60 backdrop-blur-2xl rounded-[2rem] border border-white/50 shadow-2xl p-5 sm:p-7 relative overflow-hidden group hover:shadow-blue-500/10 transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 pointer-events-none"></div>

                                <div className="relative z-10 text-center mb-6">
                                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                                        Get Exclusive Early Access
                                    </h3>
                                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                                        Be the first to experience the future of developer portfolios.
                                    </p>
                                </div>

                                <div id="hero-signup" className="w-full mx-auto max-w-lg relative z-10">
                                    <form
                                        onSubmit={handleEmailSubmit}
                                        className="relative flex flex-col sm:flex-row items-center bg-white rounded-2xl sm:rounded-full p-2 sm:p-1.5 shadow-lg border border-slate-200/60 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500/50 transition-all duration-300">
                                        <Input
                                            id="email-input"
                                            type="email"
                                            placeholder="Email address"
                                            value={email}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                            className="w-full sm:flex-1 bg-transparent border-none focus:ring-0 focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none shadow-none text-base px-5 h-11 placeholder:text-slate-400"
                                            required
                                        />
                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={isSubmitting}
                                            className="w-full sm:w-auto rounded-xl sm:rounded-full px-8 h-11 sm:h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all duration-300 transform hover:scale-[1.02] sm:hover:scale-105 mt-2 sm:mt-0">
                                            {isSubmitting ? "Joining..." : "Subscribe"}
                                        </Button>
                                    </form>

                                    {submitSuccess && (
                                        <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Successfully joined the waitlist! Check your email.</span>
                                        </div>
                                    )}

                                    {submitError && (
                                        <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            <span>{submitError}</span>
                                        </div>
                                    )}

                                    <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-2 animate-fade-in animation-delay-500">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium shadow-sm">
                                            <Sparkles className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
                                            <span>Limited spots available for exclusive access</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comparison Section: "Success vs Struggle" */}
            <section className="py-12 relative z-10">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                            Talent is everywhere. <br className="hidden sm:block" />
                            <span className="text-blue-600">Visibility is not.</span>
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Stop letting your best work go unnoticed. See the difference ShowWork makes.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-stretch">
                        {/* Card 1: The Struggle (Invisible Developer) */}
                        <div className="group relative bg-slate-50 border border-slate-200 rounded-[2rem] p-8 overflow-hidden hover:bg-slate-100 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-15">
                                <svg className="w-32 h-32 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="relative z-10 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider mb-6">
                                    Without ShowWork
                                </div>
                                <h3 className="text-2xl font-bold text-slate-500 mb-2">The Invisible Developer</h3>
                                <p className="text-slate-500 mb-8">Great code, but no one sees it. Opportunities slip away.</p>

                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 opacity-70">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                                            <div className="h-3 w-24 bg-slate-200 rounded"></div>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded mb-2"></div>
                                        <div className="h-2 w-3/4 bg-slate-100 rounded"></div>
                                        <div className="mt-3 flex gap-2">
                                            <span className="text-xs text-slate-400">0 views</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                                        <X className="w-4 h-4" />
                                        <span>Resume sent to the void</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                                        <X className="w-4 h-4" />
                                        <span>Ghosted by recruiters</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: The Success (ShowWork Advantage) */}
                        <div className="group relative bg-blue-600 text-white rounded-[2rem] p-8 overflow-hidden shadow-2xl shadow-blue-500/30 transform hover:scale-[1.02] transition-transform duration-300">
                            <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm pointer-events-none"></div>
                            {/* Decorative gradients */}
                            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

                            <div className="relative z-10 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md border border-white/20">
                                    With ShowWork
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">The 1% Developer</h3>
                                <p className="text-blue-100 mb-8">Work that speaks for itself. Inbound opportunities daily.</p>

                                <div className="space-y-4">
                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 border-2 border-white"></div>
                                                <div>
                                                    <div className="h-3 w-24 bg-white/40 rounded mb-1"></div>
                                                    <div className="h-2 w-16 bg-white/20 rounded"></div>
                                                </div>
                                            </div>
                                            <div className="text-xs font-bold bg-green-500 text-white px-2 py-0.5 rounded-full shadow-lg shadow-green-500/20">
                                                OFFER RECEIVED
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white/10 rounded-lg text-sm text-blue-50 italic">
                                            "Just saw your ShowWork profile. We need someone exactly like you. Can we chat?"
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-white text-sm font-medium">
                                        <div className="p-1 bg-green-500 rounded-full"><div className="w-2 h-2 bg-white rounded-full"></div></div>
                                        <span>Profile info viewed by LinkedIn, Google, Meta, GitHub</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white text-sm font-medium">
                                        <div className="p-1 bg-green-500 rounded-full"><div className="w-2 h-2 bg-white rounded-full"></div></div>
                                        <span>Skipped technical screening</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 'Beyond Code' Section: Interaction Timeline */}
            <section className="py-16 relative overflow-hidden bg-slate-50 border-y border-slate-200">
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                            The Human Side of Code
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
                            Commits are for machines. <br />
                            <span className="text-blue-600">ShowWork is for your story.</span>
                        </h2>
                        <p className="text-lg text-slate-600">
                            Don't let your work be defined just by green squares. Show the discussions, the decisions, and the community impact.
                        </p>
                    </div>

                    <div className="relative max-w-3xl mx-auto">
                        {/* Vertical Timeline Line */}
                        <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-200 hidden sm:block"></div>

                        <div className="space-y-8 relative">
                            {/* Item 1: LinkedIn */}
                            <div className="relative pl-0 sm:pl-24 group">
                                {/* Timeline Node */}
                                <div className="absolute left-4 top-6 transform -translate-x-1/2 w-8 h-8 bg-white border border-slate-200 rounded-full items-center justify-center z-10 hidden sm:flex">
                                    <Linkedin className="w-4 h-4 text-[#0077b5]" />
                                </div>

                                {/* Card */}
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                            <span className="bg-[#0077b5] text-white p-1 rounded-md sm:hidden"><Linkedin className="w-3 h-3" /></span>
                                            <span>Posted on LinkedIn: 'The Future of Frontend'</span>
                                        </div>
                                        <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">View Post</span>
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                        Just shared my thoughts on the new React server components. It's a paradigm shift that we all need to prepare for. Read the full article on my blog...
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-2 overflow-hidden">
                                            <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://ui-avatars.com/api/?name=Alex&background=random" alt="" />
                                            <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://ui-avatars.com/api/?name=Sarah&background=random" alt="" />
                                            <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://ui-avatars.com/api/?name=Mike&background=random" alt="" />
                                        </div>
                                        <span className="text-xs text-slate-400">Latest Activity: 2 hours ago</span>
                                    </div>
                                </div>
                            </div>

                            {/* Item 2: Reddit */}
                            <div className="relative pl-0 sm:pl-24 group">
                                <div className="absolute left-4 top-6 transform -translate-x-1/2 w-8 h-8 bg-white border border-slate-200 rounded-full items-center justify-center z-10 hidden sm:flex">
                                    <div className="w-4 h-4 text-[#FF4500] font-bold flex items-center justify-center">r/</div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                            <span className="bg-[#FF4500] text-white p-1 rounded-md sm:hidden text-[10px] font-bold">r/</span>
                                            <span>Reddit discussion in r/reactjs</span>
                                        </div>
                                        <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">Join Thread</span>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600 italic mb-4 border border-slate-100">
                                        "I personally stick with Zustand for 90% of my projects. It's lightweight and just works without the boilerplate..."
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <div className="w-5 h-5 rounded-full bg-slate-200"></div>
                                        <span>Latest Activity: Yesterday at 4:30pm</span>
                                    </div>
                                </div>
                            </div>

                            {/* Item 3: Discord */}
                            <div className="relative pl-0 sm:pl-24 group">
                                <div className="absolute left-4 top-6 transform -translate-x-1/2 w-8 h-8 bg-white border border-slate-200 rounded-full items-center justify-center z-10 hidden sm:flex">
                                    <svg className="w-4 h-4 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" /></svg>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                            <span className="bg-[#5865F2] text-white p-1 rounded-md sm:hidden"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" /></svg></span>
                                            <span>Discord conversation in #showwork-community</span>
                                        </div>
                                        <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">Go to Discord</span>
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                        Hey Sarah! I took a look at your portfolio. The typography choices are excellent, but you might want to increase the contrast on the dark mode toggle.
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <img className="h-5 w-5 rounded-full" src="https://ui-avatars.com/api/?name=Designer&background=random" alt="" />
                                        <span>Latest Activity: Jan 18, 2026 at 1:30pm</span>
                                    </div>
                                </div>
                            </div>

                            {/* Item 4: Git PR */}
                            <div className="relative pl-0 sm:pl-24 group">
                                <div className="absolute left-4 top-6 transform -translate-x-1/2 w-8 h-8 bg-white border border-slate-200 rounded-full items-center justify-center z-10 hidden sm:flex">
                                    <Github className="w-4 h-4 text-slate-700" />
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                            <span className="bg-slate-800 text-white p-1 rounded-md sm:hidden"><Github className="w-3 h-3" /></span>
                                            <span>Pull Request #57 on showwork-frontend</span>
                                        </div>
                                        <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">View PR</span>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 font-mono text-xs text-slate-600 mb-4 whitespace-nowrap overflow-x-auto">
                                        feat: Implement new user profile timeline view with responsive...
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <img className="h-5 w-5 rounded-full" src="https://ui-avatars.com/api/?name=Dev&background=random" alt="" />
                                        <span>Latest Activity: Jan 17, 2026 at 9:02am</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            {/* <section id="demo" className="relative z-10 py-12 sm:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            See ShowWork in Action
                        </h2>
                        <p className="text-lg text-foreground-muted max-w-2xl mx-auto mb-6">
                            Watch how easy it is to create stunning portfolios that get you
                            noticed by employers and clients.
                        </p>
                        <Button
                            size="lg"
                            className="logo-bg shadow-lg text-white hover:opacity-90"
                            onClick={() => navigate("/login")}
                        >
                            Watch Full Demo
                        </Button>
                    </div>
                </div>
            </section> */}


            {/* Features Section - Auto-Fit Grid */}
            <section id="features" className="bg-surface-elevated relative z-10" style={{
                paddingTop: 'clamp(10rem, 20vh, 16rem)',
                paddingBottom: 'clamp(3rem, 10vh, 6rem)'
            }}>
                <div className="w-full mx-auto" style={{
                    maxWidth: '69rem',
                    paddingInline: 'var(--container-padding)'
                }}>
                    <div className="text-center" style={{ marginBottom: 'clamp(3rem, 10vh, 6rem)' }}>
                        <h2 className="font-bold text-foreground transition-transform duration-500" style={{
                            fontSize: 'clamp(2rem, 5vw, 3rem)'
                        }}>
                            Everything You Need to Shine
                        </h2>
                    </div>

                    <div className="grid" style={{
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
                        gap: 'clamp(2rem, 5vw, 3rem)'
                    }}>
                        <InView
                            variants={{
                                hidden: { opacity: 0, y: 50 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <div className="group bg-white/40 backdrop-blur-md rounded-xl p-8 border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-400/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:z-10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="w-12 h-12 logo-bg rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative z-10">
                                    <Zap className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:logo-text transition-colors duration-300 relative z-10">
                                    AI Content Generation
                                </h3>
                                <InView
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 },
                                    }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    <p className="text-foreground-muted mb-6 relative z-10 group-hover:translate-x-2 transition-transform duration-300">
                                        Generate compelling project descriptions, technical details, and
                                        marketing copy with AI assistance.
                                    </p>
                                </InView>

                                <motion.div
                                    initial={false}
                                    animate={{ height: expandedCard === 0 ? "auto" : 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden relative z-10"
                                >
                                    <div className="pt-4 space-y-3">
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                            <p className="text-sm text-foreground-muted">Automatically generate SEO-optimized descriptions</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                            <p className="text-sm text-foreground-muted">Create technical documentation with one click</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                            <p className="text-sm text-foreground-muted">Generate multiple variations for A/B testing</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                            <p className="text-sm text-foreground-muted">Customize tone and style to match your brand</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <Button
                                    variant="ghost"
                                    onClick={() => setExpandedCard(expandedCard === 0 ? null : 0)}
                                    className="text-primary hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 font-semibold p-2 -ml-2 rounded-lg transition-all duration-300 relative z-10 mt-4 flex items-center gap-2 hover:scale-105"
                                >
                                    {expandedCard === 0 ? "Show Less" : "Learn More"}
                                    <motion.div
                                        animate={{ rotate: expandedCard === 0 ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ChevronDown className="h-4 w-4" />
                                    </motion.div>
                                </Button>
                            </div>
                        </InView>

                        <InView
                            variants={{
                                hidden: { opacity: 0, y: 50 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="group bg-white/40 backdrop-blur-md rounded-xl p-8 border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-400/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:z-10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="w-12 h-12 logo-bg rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative z-10">
                                    <Globe className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:logo-text transition-colors duration-300 relative z-10">
                                    Multi-Platform Publishing
                                </h3>
                                <InView
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 },
                                    }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    <p className="text-foreground-muted mb-6 relative z-10 group-hover:translate-x-2 transition-transform duration-300">
                                        Share your work across social media, job boards, and
                                        professional networks with one click.
                                    </p>
                                </InView>

                                <motion.div
                                    initial={false}
                                    animate={{ height: expandedCard === 1 ? "auto" : 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden relative z-10"
                                >
                                    <div className="pt-4 space-y-3">
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                            <p className="text-sm text-foreground-muted">Publish to LinkedIn, Twitter, Reddit, and Instagram simultaneously</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                            <p className="text-sm text-foreground-muted">Schedule posts for optimal engagement times</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                            <p className="text-sm text-foreground-muted">Track performance across all platforms in one dashboard</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                            <p className="text-sm text-foreground-muted">Auto-format content for each platform's requirements</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <Button
                                    variant="ghost"
                                    onClick={() => setExpandedCard(expandedCard === 1 ? null : 1)}
                                    className="text-primary hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 font-semibold p-2 -ml-2 rounded-lg transition-all duration-300 relative z-10 mt-4 flex items-center gap-2 hover:scale-105"
                                >
                                    {expandedCard === 1 ? "Show Less" : "Learn More"}
                                    <motion.div
                                        animate={{ rotate: expandedCard === 1 ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ChevronDown className="h-4 w-4" />
                                    </motion.div>
                                </Button>
                            </div>
                        </InView>

                        <InView
                            variants={{
                                hidden: { opacity: 0, y: 50 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <div className="group bg-white/40 backdrop-blur-md rounded-xl p-8 border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-400/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:z-10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="w-12 h-12 logo-bg rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative z-10">
                                    <Star className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:logo-text transition-colors duration-300 relative z-10">
                                    Professional Templates
                                </h3>
                                <InView
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 },
                                    }}
                                    transition={{ duration: 0.5, delay: 0.7 }}
                                >
                                    <p className="text-foreground-muted mb-6 relative z-10 group-hover:translate-x-2 transition-transform duration-300">
                                        Choose from dozens of stunning portfolio templates designed by
                                        professionals for developers.
                                    </p>
                                </InView>

                                <motion.div
                                    initial={false}
                                    animate={{ height: expandedCard === 2 ? "auto" : 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden relative z-10"
                                >
                                    <div className="pt-4 space-y-3">
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                            <p className="text-sm text-foreground-muted">Choose from 50+ professionally designed templates</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                            <p className="text-sm text-foreground-muted">Fully customizable colors, fonts, and layouts</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                            <p className="text-sm text-foreground-muted">Mobile-responsive design out of the box</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                            <p className="text-sm text-foreground-muted">Preview before publishing with live preview mode</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <Button
                                    variant="ghost"
                                    onClick={() => setExpandedCard(expandedCard === 2 ? null : 2)}
                                    className="text-primary hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 font-semibold p-2 -ml-2 rounded-lg transition-all duration-300 relative z-10 mt-4 flex items-center gap-2 hover:scale-105"
                                >
                                    {expandedCard === 2 ? "Show Less" : "Learn More"}
                                    <motion.div
                                        animate={{ rotate: expandedCard === 2 ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ChevronDown className="h-4 w-4" />
                                    </motion.div>
                                </Button>
                            </div>
                        </InView>
                    </div>
                </div>
            </section>



            {/* Orbit + Journey Timeline side-by-side */}
            <section id="journey" className="pt-12 sm:pt-24 pb-12 mt-4 sm:mt-8 scroll-mt-32 relative z-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                        <div className="p-0 relative z-0">
                            <OrbitingPlatforms />
                            {isDesktop && (
                                <div className="mt-10">
                                    <DisplayCards />
                                </div>
                            )}
                            <div className="mt-24">
                                <BouncyCardsFeatures />
                            </div>
                        </div>
                        <div className="p-0 relative z-0">
                            <h3 className="text-2xl font-bold text-foreground mb-6">Your ShowWork Journey</h3>
                            <ShowWorkTimeline />
                        </div>
                    </div>
                </div>
            </section>

            {/* Demo Popup Modal */}
            {showDemoPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full relative transform transition-all scale-100 animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800">
                        <button
                            onClick={() => setShowDemoPopup(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Code2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Demo Coming Soon!</h3>
                            <p className="text-slate-600 dark:text-slate-300 mb-6">
                                We're putting the finishing touches on our interactive demo. You've secured your spot on the waitlist and will be the first to know when it's live!
                            </p>
                            <Button
                                onClick={() => setShowDemoPopup(false)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6"
                            >
                                Got it, thanks!
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 dark:from-blue-950 dark:via-blue-900 dark:to-slate-950 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


                    {/* Bottom Section */}
                    <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <div className="w-8 h-8 logo-bg rounded-lg flex items-center justify-center">
                                <Code2 className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">ShowWork</span>
                        </div>

                        <div className="flex items-center space-x-6">
                            <a
                                href="https://x.com/ShowWork_"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/showwork/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a
                                href="https://www.instagram.com/sho.wwork"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div className="border-t border-white/20 pt-8 mt-8 text-center">
                        <p className="text-white/80">
                            © 2025 ShowWork All Rights Reserved
                        </p>
                        <div className="flex justify-center space-x-6 mt-4">
                            <a
                                href="#"
                                className="text-white/80 hover:text-white text-sm transition-colors"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="text-white/80 hover:text-white text-sm transition-colors"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="#"
                                className="text-white/80 hover:text-white text-sm transition-colors"
                            >
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div >
    );
};

export default ShowWorkLanding;
