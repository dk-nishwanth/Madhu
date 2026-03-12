/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence, useTransform } from 'motion/react';
import { Menu, X, ChevronRight, ChevronLeft, ArrowDown, Linkedin, Instagram, Folder } from 'lucide-react';
import Blog from './components/Blog';
import { trackEvent, trackProjectView, trackContactFormSubmit, trackSectionView } from './utils/analytics';

// --- Components ---

const CursorBlink = () => <span className="cursor-blink">|</span>;

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 0.5, x: 0 }}
    viewport={{ once: true }}
    className="text-[10px] tracking-[0.3em] uppercase mb-8 font-medium"
  >
    {`{ ${children} }`}
  </motion.div>
);

const Reveal = ({ children, width = "fit-content" }: { children: React.ReactNode; width?: "fit-content" | "100%" }) => {
  return (
    <div style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.5, delay: 0.25 }}
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const ParallaxIllustration = ({ type, className, speed = 0.2 }: { type: any; className?: string; speed?: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200 * speed]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      <HandDrawnIllustration type={type} className="w-full h-full" />
    </motion.div>
  );
};

const OrangeAsterisk = () => <span className="text-untold-accent font-bold">*</span>;

const HandDrawnIllustration = ({ type, className }: { type: 'high-five' | 'planet' | 'ladder' | 'shh' | 'folder' | 'cat', className?: string }) => {
  // Simple SVG representations of the requested hand-drawn style
  if (type === 'cat') {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Head */}
        <path d="M30 50 Q 50 20 70 50 Q 70 80 50 80 Q 30 80 30 50" strokeLinecap="round" />
        {/* Ears */}
        <path d="M35 35 L 30 20 L 45 30" strokeLinecap="round" />
        <path d="M65 35 L 70 20 L 55 30" strokeLinecap="round" />
        {/* Eyes */}
        <circle cx="42" cy="50" r="2" fill="currentColor" />
        <circle cx="58" cy="50" r="2" fill="currentColor" />
        {/* Nose & Mouth */}
        <path d="M50 58 L 50 62 Q 50 68 45 68 M 50 62 Q 50 68 55 68" strokeLinecap="round" />
        {/* Whiskers */}
        <path d="M35 60 L 20 58 M 35 65 L 20 68" strokeLinecap="round" />
        <path d="M65 60 L 80 58 M 65 65 L 80 68" strokeLinecap="round" />
        {/* Tail */}
        <path d="M70 70 Q 90 70 85 50" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === 'high-five') {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M30 70 Q 40 40 50 70" strokeLinecap="round" />
        <path d="M70 70 Q 60 40 50 70" strokeLinecap="round" />
        <circle cx="45" cy="45" r="3" fill="currentColor" />
        <circle cx="55" cy="45" r="3" fill="currentColor" />
        <path d="M40 30 L 45 20 M 55 30 L 50 20 M 60 35 L 65 25" stroke="currentColor" />
      </svg>
    );
  }
  if (type === 'planet') {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="50" cy="50" r="20" stroke="currentColor" />
        <ellipse cx="50" cy="50" rx="40" ry="10" stroke="currentColor" transform="rotate(-20 50 50)" />
        <circle cx="40" cy="45" r="2" fill="currentColor" />
        <path d="M70 20 L 75 15 M 80 30 L 85 25" stroke="currentColor" />
      </svg>
    );
  }
  if (type === 'ladder') {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M30 90 L 30 20 M 50 90 L 50 20" stroke="currentColor" />
        <path d="M30 80 L 50 80 M 30 65 L 50 65 M 30 50 L 50 50 M 30 35 L 50 35" stroke="currentColor" />
        <circle cx="55" cy="25" r="5" stroke="currentColor" />
        <path d="M55 30 L 55 50 M 55 35 L 45 45 M 55 35 L 65 45" stroke="currentColor" />
      </svg>
    );
  }
  if (type === 'shh') {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M50 20 Q 70 20 70 50 T 50 80 T 30 50 T 50 20" stroke="currentColor" />
        <path d="M50 45 L 50 65" stroke="currentColor" strokeWidth="3" />
        <path d="M45 70 Q 50 75 55 70" stroke="currentColor" />
        <path d="M35 40 Q 40 35 45 40" stroke="currentColor" />
        <path d="M55 40 Q 60 35 65 40" stroke="currentColor" />
      </svg>
    );
  }
  if (type === 'folder') {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 30 L 40 30 L 50 20 L 90 20 L 90 80 L 10 80 Z" stroke="currentColor" />
      </svg>
    );
  }
  return null;
};

// --- Sections ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { short: 'P', full: 'PROJECTS', id: 'projects' },
    { short: 'A', full: 'ABOUT', id: 'about' },
    { short: 'B', full: 'BLOG', id: 'blog' },
    { short: 'C', full: 'CONTACT', id: 'contact' }
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 md:px-8 py-4 md:py-6 flex items-center justify-between ${isScrolled && !isMenuOpen ? 'bg-untold-bg/80 backdrop-blur-md border-b border-untold-ink/10' : ''}`}>
        <div 
          className={`text-xl md:text-2xl font-bold tracking-tighter transition-colors cursor-pointer ${isMenuOpen ? 'text-white' : 'text-untold-ink'}`}
          onClick={() => scrollToSection('home')}
        >
          madhu
        </div>
        
        {!isMenuOpen && (
          <div className="hidden md:flex items-center space-x-12">
            {navItems.map((item) => (
              <button
                key={item.short}
                className="text-xs font-bold tracking-widest relative group overflow-hidden h-4"
                onMouseEnter={() => setHoveredNav(item.short)}
                onMouseLeave={() => setHoveredNav(null)}
                onClick={() => scrollToSection(item.id)}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={hoveredNav === item.short ? 'full' : 'short'}
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    exit={{ y: -20 }}
                    className="block"
                  >
                    {hoveredNav === item.short ? item.full : item.short}
                  </motion.span>
                </AnimatePresence>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-3 md:space-x-6">
          {!isMenuOpen && (
            <button className="hidden sm:block text-[10px] font-bold tracking-widest">(EN) <ChevronRight className="inline w-3 h-3 rotate-90" /></button>
          )}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isMenuOpen ? 'bg-white text-untold-accent' : 'bg-untold-accent text-white hover:scale-110'}`}
          >
            {isMenuOpen ? <X className="w-4 h-4 md:w-5 md:h-5" /> : <Menu className="w-4 h-4 md:w-5 md:h-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-untold-accent flex flex-col justify-center px-4 md:px-8 lg:px-24"
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Tangled line SVG */}
              <svg viewBox="0 0 1000 600" className="w-full h-full opacity-40" fill="none" stroke="white" strokeWidth="1.5">
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  d="M100 250 Q 250 250 350 350 T 450 250 Q 450 150 500 250 T 550 350 Q 650 350 850 250" 
                />
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
                  d="M100 400 Q 300 400 450 500 T 550 400 Q 700 400 850 400" 
                />
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
                  d="M100 550 Q 400 550 500 650 T 600 550 Q 750 550 850 550" 
                />
              </svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-32 gap-y-8 md:gap-y-12 relative z-10">
              <div className="space-y-8 md:space-y-12">
                {['home', 'projects', 'blog'].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="group"
                  >
                    <button 
                      onClick={() => scrollToSection(item)}
                      className="text-[12vw] sm:text-[10vw] md:text-[6vw] font-black tracking-tighter uppercase text-untold-ink hover:text-white transition-colors"
                    >
                      {item}
                    </button>
                    <div className="h-[1px] w-full bg-white/30 mt-2" />
                  </motion.div>
                ))}
              </div>
              <div className="space-y-8 md:space-y-12 md:text-right">
                {['about', 'skills', 'contact'].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="group"
                  >
                    <button 
                      onClick={() => scrollToSection(item)}
                      className="text-[12vw] sm:text-[10vw] md:text-[6vw] font-black tracking-tighter uppercase text-untold-ink hover:text-white transition-colors"
                    >
                      {item}
                    </button>
                    <div className="h-[1px] w-full bg-white/30 mt-2" />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="absolute bottom-8 md:bottom-12 left-4 md:left-8 lg:left-24 flex flex-col md:flex-row justify-between items-start md:items-end w-[calc(100%-32px)] md:w-[calc(100%-64px)] lg:w-[calc(100%-192px)]">
              <div className="text-xs md:text-sm font-bold tracking-tighter text-untold-ink uppercase mb-4 md:mb-0">
                Building digital excellence
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-[10px] font-bold tracking-widest text-untold-ink opacity-50 uppercase">LANG</span>
                <button className="px-3 md:px-4 py-2 border border-untold-ink/20 rounded-full text-[10px] font-bold tracking-widest text-untold-ink uppercase flex items-center">
                  ( EN ) <ChevronRight className="ml-2 w-3 h-3 rotate-90" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen pt-20 md:pt-32 px-4 md:px-8 relative flex flex-col justify-center items-center overflow-hidden bg-[#F2F0EB]">
      {/* Background Image (Subtle) */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <img 
          src="/madhu-profile.png" 
          alt="Background" 
          className="w-full h-full object-cover grayscale"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full flex flex-col items-center"
        >
          <div className="flex flex-col items-center text-center w-full">
            <h1 className="text-[12vw] sm:text-[10vw] md:text-[9vw] font-black leading-[0.8] tracking-tighter uppercase flex items-center justify-center flex-wrap sm:flex-nowrap w-full">
              <span className="shrink-0">madhu</span>
              <span className="inline-block w-[24vw] h-[18vw] sm:w-[20vw] sm:h-[14vw] md:w-[15vw] md:h-[10vw] bg-gray-200 rounded-lg overflow-hidden relative group mx-2 md:mx-8 shrink-0 shadow-xl border border-white/20">
                <img 
                  src="/madhu-profile.png" 
                  alt="Madhu" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  onClick={() => scrollToSection('projects')}
                >
                   <div className="w-4 h-4 sm:w-6 sm:h-6 md:w-12 md:h-12 rounded-full bg-untold-accent/80 flex items-center justify-center text-white shadow-lg">
                     <ChevronRight className="w-2 h-2 sm:w-3 sm:h-3 md:w-5 md:h-5" />
                   </div>
                </div>
              </span>
              <span className="relative shrink-0">
                mithra
                {/* Cat sketch overlapping the A */}
                <div className="absolute -top-4 sm:-top-8 -right-8 sm:-right-12 md:-right-24 opacity-40 pointer-events-none">
                  <HandDrawnIllustration type="cat" className="w-12 h-12 sm:w-16 sm:h-16 md:w-40 md:h-40 text-untold-accent" />
                </div>
              </span>
            </h1>
            <h1 className="text-[14vw] sm:text-[12vw] md:text-[9vw] font-black leading-[0.8] tracking-tighter uppercase mt-2 md:mt-4">
              digital
            </h1>
            <h1 className="text-[14vw] sm:text-[12vw] md:text-[9vw] font-black leading-[0.8] tracking-tighter uppercase mt-2 md:mt-4">
              builder
            </h1>
          </div>
        </motion.div>

        <div className="mt-12 md:mt-16 flex flex-col md:flex-row items-center md:items-end justify-between w-full relative">
          {/* Polaroid and Description */}
          <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-8">
            <motion.div 
              style={{ y: y1 }}
              className="w-32 h-40 sm:w-40 sm:h-52 md:w-56 md:h-72 bg-white p-2 sm:p-3 shadow-2xl rotate-[-4deg] relative z-20"
            >
              <div className="w-full h-[85%] bg-gray-200 overflow-hidden relative">
                <img 
                  src="https://picsum.photos/seed/mountain/600/800" 
                  alt="Polaroid" 
                  className="w-full h-full object-cover grayscale"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-untold-accent flex items-center justify-center text-white text-sm sm:text-lg font-bold shadow-lg z-30">*</div>
              </div>
              <div className="mt-2 sm:mt-3 h-3 sm:h-4 w-full bg-gray-100 rounded" />
            </motion.div>

            <Reveal>
              <div className="max-w-[280px] md:max-w-sm text-xs sm:text-[11px] md:text-sm leading-relaxed opacity-70 mb-4 text-center md:text-left px-4 md:px-0">
                <span className="text-untold-accent font-bold">(*)</span> A zealous Computer Science and Engineering student passionate about Web technologies and ERP Solutions with an avid desire to work on applied research projects.
              </div>
            </Reveal>
          </div>

          {/* Action Button and Scroll Indicator */}
          <div className="flex flex-col items-center md:items-end space-y-6 mt-12 md:mt-0">
            <div className="flex items-center space-x-3 md:space-x-4">
              <button 
                onClick={() => scrollToSection('projects')}
                className="bg-untold-accent text-white px-4 py-2 sm:px-6 sm:py-3 md:px-10 md:py-5 rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold tracking-widest uppercase flex items-center hover:scale-105 transition-transform shadow-xl"
              >
                <span className="mr-1 sm:mr-2">•</span> VIEW MY PROJECTS
              </button>
              <div 
                onClick={() => scrollToSection('projects')}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-full border border-untold-ink/20 flex items-center justify-center cursor-pointer hover:bg-untold-ink hover:text-white transition-colors"
              >
                <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6" />
              </div>
            </div>
            
            <div className="flex items-center space-x-4 pr-2">
               <div className="h-2 w-2 rounded-full bg-untold-accent animate-pulse" />
               <span className="text-[10px] font-bold tracking-widest uppercase opacity-40 [writing-mode:vertical-rl] h-16 sm:h-20 md:h-24">SCROLL TO DISCOVER</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Brands = () => {
  const brands = ["Java", "GitHub", "VS Code", "Eclipse", "HTML", "CSS", "JavaScript", "SQL"];
  
  return (
    <section className="py-16 md:py-32 px-4 md:px-8 bg-white/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between mb-12 md:mb-20">
          <h2 className="text-[16vw] sm:text-[14vw] md:text-[10vw] font-black leading-none tracking-tighter uppercase relative mb-8 md:mb-0">
            tech <br /> stack
            <div className="absolute top-0 -right-12 h-full w-[1px] bg-untold-ink/10 hidden md:block" />
          </h2>
          <HandDrawnIllustration type="high-five" className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 text-untold-ink opacity-30 mx-auto md:mx-0" />
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="w-full md:w-48">
            <SectionLabel>TOOLS & TECHNOLOGIES</SectionLabel>
          </div>
          <div className="flex-1">
            <div className="text-[6vw] sm:text-[5vw] md:text-[3.5vw] font-light leading-[1.1] mb-8 md:mb-12 tracking-tight">
              {brands.map((brand, i) => (
                <span key={brand} className="inline-block mr-2 sm:mr-4 mb-2">
                  <span className="opacity-30">(</span> 
                  <span className="font-medium px-1 sm:px-2">{brand}</span>
                  {brand === "Java" || brand === "JavaScript" ? <span className="text-untold-accent ml-1">+</span> : null}
                  <span className="opacity-30">)</span>
                  {i < brands.length - 1 && <span className="mx-1 sm:mx-2 opacity-20">,</span>}
                </span>
              ))}
              <span className="opacity-50 block mt-4"> and more. Great projects need a solid foundation.</span>
            </div>

            <button className="px-6 py-3 md:px-8 md:py-4 bg-untold-accent text-white rounded-full text-[10px] md:text-xs font-bold tracking-widest hover:scale-105 transition-transform">
              <span className="mr-2">•</span> VIEW ALL SKILLS
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const StoriesTyping = () => {
  const [text, setText] = useState("");
  const fullText = "building / digital solutions";
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-48 px-8 flex flex-col items-center text-center">
      <SectionLabel>SOME PROJECTS I'VE RECENTLY BUILT</SectionLabel>
      <h2 className="text-[8vw] font-black leading-none tracking-tighter uppercase max-w-4xl">
        {text}<CursorBlink />
      </h2>
    </section>
  );
};

const WorkShowcase = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const projects = [
    { 
      name: "IoT Gas Detector", 
      color: "#e84b1f", 
      logo: "ESP32",
      description: "An intelligent gas detection system using ESP32 microcontroller with real-time monitoring capabilities. Features wireless connectivity, mobile alerts, and cloud data logging for enhanced safety in industrial and residential environments.",
      technologies: ["ESP32", "IoT", "Sensors", "WiFi", "Mobile App"],
      status: "Completed",
      caseStudy: {
        problem: "Industrial and residential gas leaks pose significant safety risks. Traditional detection systems lack real-time monitoring and remote alerting capabilities.",
        solution: "Developed an IoT-based gas detection system with ESP32 microcontroller, multiple gas sensors, and wireless connectivity for real-time monitoring and instant alerts.",
        process: [
          "Research and analysis of existing gas detection systems",
          "Hardware selection and circuit design with ESP32",
          "Sensor calibration and testing for accuracy",
          "Mobile app development for real-time monitoring",
          "Cloud integration for data logging and analytics",
          "Field testing in various environments"
        ],
        results: [
          "99.2% accuracy in gas detection",
          "Real-time alerts within 2 seconds of detection",
          "30% cost reduction compared to commercial systems",
          "Successfully deployed in 5 test locations"
        ],
        challenges: "Power management for continuous operation, sensor calibration in different environmental conditions, ensuring reliable wireless connectivity.",
        learnings: "Importance of thorough testing in real-world conditions, need for robust error handling in IoT systems, value of user feedback in iterative development."
      }
    },
    { 
      name: "Weather Web App", 
      color: "#5b8fd9", 
      logo: "API",
      description: "A responsive weather application providing real-time weather data, forecasts, and interactive maps. Built with modern web technologies and integrated with multiple weather APIs for accurate predictions.",
      technologies: ["React", "Weather API", "JavaScript", "CSS3", "Responsive Design"],
      status: "Live",
      caseStudy: {
        problem: "Users need accurate, real-time weather information with intuitive interface and reliable forecasting for planning daily activities.",
        solution: "Created a responsive web application integrating multiple weather APIs with interactive maps, detailed forecasts, and location-based services.",
        process: [
          "User research and competitor analysis",
          "API integration and data normalization",
          "Responsive UI/UX design implementation",
          "Performance optimization for mobile devices",
          "Cross-browser testing and deployment",
          "User feedback collection and iterations"
        ],
        results: [
          "95% user satisfaction rating",
          "Sub-2 second load times on mobile",
          "Integration with 3 weather data sources",
          "500+ daily active users"
        ],
        challenges: "Handling API rate limits, ensuring data accuracy across different sources, optimizing performance for slower networks.",
        learnings: "Importance of progressive web app features, value of caching strategies, need for graceful error handling in API-dependent applications."
      }
    },
    { 
      name: "AI-ML Internship", 
      color: "#f0b429", 
      logo: "AICTE",
      description: "Comprehensive internship program focusing on artificial intelligence and machine learning applications. Worked on data analysis, predictive modeling, and neural network implementations for real-world problems.",
      technologies: ["Python", "TensorFlow", "Scikit-learn", "Data Analysis", "Neural Networks"],
      status: "Completed",
      caseStudy: {
        problem: "Bridge the gap between theoretical ML knowledge and practical implementation in real-world scenarios with actual datasets and business constraints.",
        solution: "Participated in structured internship program with hands-on projects, mentorship, and exposure to industry-standard ML workflows and tools.",
        process: [
          "Theoretical foundation review and assessment",
          "Hands-on projects with real datasets",
          "Mentorship sessions with industry experts",
          "Collaborative projects with peer interns",
          "Presentation of findings to stakeholders",
          "Documentation and knowledge sharing"
        ],
        results: [
          "Completed 3 major ML projects",
          "Achieved 87% accuracy in predictive modeling project",
          "Contributed to 2 research publications",
          "Received excellence certificate"
        ],
        challenges: "Working with messy, real-world data, understanding business context for technical decisions, balancing model complexity with interpretability.",
        learnings: "Data preprocessing is crucial for model success, importance of domain expertise in feature engineering, value of iterative model development."
      }
    },
    { 
      name: "TNWISE Hackathon", 
      color: "#e84b1f", 
      logo: "2025",
      description: "Participated in Tamil Nadu's premier hackathon, developing innovative solutions for social challenges. Created a prototype addressing local community needs with technology-driven approaches.",
      technologies: ["Full Stack", "Innovation", "Prototyping", "Team Collaboration"],
      status: "Participated",
      caseStudy: {
        problem: "Rural education accessibility challenges in Tamil Nadu, including limited internet connectivity, lack of digital resources, and language barriers.",
        solution: "Developed a Progressive Web App for offline-capable educational content delivery with local language support and community-driven content creation.",
        process: [
          "Problem identification and user research",
          "Rapid ideation and solution brainstorming",
          "Technical architecture and stack selection",
          "48-hour intensive development sprint",
          "User testing with target demographic",
          "Pitch preparation and presentation"
        ],
        results: [
          "Functional MVP completed in 48 hours",
          "Positive feedback from judges and users",
          "Top 10 finalist position",
          "Recognition for social impact potential"
        ],
        challenges: "Time constraints for comprehensive development, balancing feature scope with quality, coordinating team efforts under pressure.",
        learnings: "Value of rapid prototyping, importance of user-centered design even in time-constrained environments, power of collaborative problem-solving."
      }
    },
    { 
      name: "Infosys Pragati", 
      color: "#5b8fd9", 
      logo: "Cohort 3",
      description: "Selected for Infosys Pragati program focusing on emerging technologies and industry best practices. Gained hands-on experience in enterprise-level software development and agile methodologies.",
      technologies: ["Enterprise Development", "Agile", "Software Engineering", "Best Practices"],
      status: "Ongoing",
      caseStudy: {
        problem: "Gap between academic learning and industry requirements in software development, particularly in enterprise-scale applications and professional workflows.",
        solution: "Comprehensive training program combining theoretical knowledge with practical industry experience, mentorship, and real project exposure.",
        process: [
          "Selection through competitive assessment",
          "Structured learning modules on emerging technologies",
          "Hands-on projects with industry mentors",
          "Agile methodology training and practice",
          "Soft skills and professional development",
          "Capstone project with real business impact"
        ],
        results: [
          "Successfully completed 80% of program modules",
          "Led team of 4 in capstone project",
          "Received mentor appreciation for technical skills",
          "Networking with 50+ industry professionals"
        ],
        challenges: "Adapting to enterprise-scale development practices, managing multiple learning streams simultaneously, balancing program with academic commitments.",
        learnings: "Importance of code quality and documentation in enterprise environments, value of collaborative development practices, significance of continuous learning in tech industry."
      }
    },
    { 
      name: "ASCII Club", 
      color: "#f0b429", 
      logo: "SDG",
      description: "Active member of ASCII programming club, contributing to sustainable development goals through technology. Organized coding workshops and developed solutions for environmental and social challenges.",
      technologies: ["Community Building", "Workshops", "Sustainable Tech", "Leadership"],
      status: "Active",
      caseStudy: {
        problem: "Limited programming awareness among students and lack of platforms for collaborative learning and social impact projects.",
        solution: "Established active programming community focused on skill development, knowledge sharing, and creating technology solutions for social good.",
        process: [
          "Community needs assessment and planning",
          "Workshop curriculum development",
          "Event organization and coordination",
          "Mentorship program establishment",
          "Social impact project identification",
          "Collaboration with external organizations"
        ],
        results: [
          "Organized 15+ workshops with 200+ participants",
          "Mentored 25+ junior students",
          "Led 3 social impact projects",
          "Established partnerships with 2 NGOs"
        ],
        challenges: "Maintaining consistent engagement, balancing technical depth with accessibility, coordinating diverse skill levels and interests.",
        learnings: "Importance of inclusive community building, value of peer-to-peer learning, impact of technology in addressing social challenges."
      }
    },
    { 
      name: "Internshala Program", 
      color: "#e84b1f", 
      logo: "ISP",
      description: "Completed intensive training program covering web development, data structures, and software engineering principles. Built multiple projects demonstrating proficiency in modern development practices.",
      technologies: ["Web Development", "Data Structures", "Software Engineering", "Project Management"],
      status: "Certified",
      caseStudy: {
        problem: "Need for structured learning path in web development with practical project experience and industry-relevant skills development.",
        solution: "Comprehensive online training program with hands-on projects, assessments, and certification in modern web development technologies.",
        process: [
          "Structured curriculum following industry standards",
          "Weekly assignments and project milestones",
          "Peer collaboration and code reviews",
          "Industry expert mentorship sessions",
          "Capstone project development",
          "Final assessment and certification"
        ],
        results: [
          "Completed all modules with 95% average score",
          "Built 5 full-stack web applications",
          "Received certification with distinction",
          "Gained proficiency in modern development stack"
        ],
        challenges: "Managing self-paced learning effectively, debugging complex issues independently, balancing multiple project deadlines.",
        learnings: "Value of consistent practice in skill development, importance of clean code and documentation, benefits of structured learning approach."
      }
    },
    { 
      name: "IBM AI Honor", 
      color: "#5b8fd9", 
      logo: "Cert",
      description: "Earned IBM AI certification demonstrating expertise in artificial intelligence concepts, machine learning algorithms, and practical AI implementation in business scenarios.",
      technologies: ["IBM Watson", "AI Concepts", "Machine Learning", "Business Applications"],
      status: "Certified",
      caseStudy: {
        problem: "Need for industry-recognized validation of AI/ML skills and understanding of enterprise AI implementation practices.",
        solution: "Comprehensive IBM AI certification program covering theoretical foundations, practical applications, and business use cases of artificial intelligence.",
        process: [
          "Self-study of AI fundamentals and IBM Watson platform",
          "Hands-on labs with IBM Cloud services",
          "Case study analysis of real-world AI implementations",
          "Practice assessments and skill validation",
          "Final certification examination",
          "Continuous learning through IBM resources"
        ],
        results: [
          "Successfully earned IBM AI certification",
          "Demonstrated proficiency in Watson services",
          "Completed 10+ hands-on AI projects",
          "Gained understanding of enterprise AI deployment"
        ],
        challenges: "Understanding complex AI algorithms and their business applications, navigating IBM's extensive platform ecosystem, staying updated with rapidly evolving AI landscape.",
        learnings: "Importance of understanding business context for AI solutions, value of hands-on experience with cloud AI services, significance of ethical AI considerations."
      }
    }
  ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.children[0]?.clientWidth || 0;
      const gap = 16; // Space between cards
      const scrollAmount = cardWidth + gap;
      
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
      
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.children[0]?.clientWidth || 0;
      const gap = 16; // Space between cards
      const scrollAmount = cardWidth + gap;
      
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      
      setCurrentIndex(Math.min(projects.length - 1, currentIndex + 1));
    }
  };

  const scrollToProject = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.children[0]?.clientWidth || 0;
      const gap = 16; // Space between cards
      const scrollAmount = (cardWidth + gap) * index;
      
      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
      
      setCurrentIndex(index);
    }
  };

  // Handle scroll detection to update current index
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cardWidth = container.children[0]?.clientWidth || 0;
      const gap = 16;
      const scrollLeft = container.scrollLeft;
      const newIndex = Math.round(scrollLeft / (cardWidth + gap));
      setCurrentIndex(Math.min(Math.max(0, newIndex), projects.length - 1));
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [projects.length]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        scrollLeft();
      } else if (e.key === 'ArrowRight') {
        scrollRight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  // Add touch/swipe support for mobile
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let startX = 0;
    let scrollLeftStart = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      scrollLeftStart = container.scrollLeft;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!startX) return;
      
      const currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      container.scrollLeft = scrollLeftStart + diff;
    };

    const handleTouchEnd = () => {
      startX = 0;
      scrollLeftStart = 0;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <>
      <section className="py-16 md:py-32 overflow-hidden">
        <Reveal width="100%">
          <div className="relative">
            {/* Scroll hint for mobile */}
            <div className="absolute top-4 right-4 md:hidden z-10 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium animate-pulse">
              Swipe to explore →
            </div>
            
            {/* Desktop scrollbar area indicator */}
            <div className="hidden md:block absolute bottom-0 left-4 right-4 h-6 bg-gradient-to-t from-untold-bg/50 to-transparent pointer-events-none z-10 rounded-b-lg"></div>
            
            {/* Desktop scroll hint */}
            <div className="hidden md:block absolute bottom-2 right-8 z-20 text-xs text-untold-ink/40 font-medium">
              Scroll horizontally or use arrow keys →
            </div>
            
            <div 
              ref={scrollContainerRef}
              className="flex space-x-4 md:space-x-6 px-4 md:px-8 overflow-x-auto pb-16 md:pb-24 desktop-scrollbar items-start scroll-smooth scroll-snap-x"
            >
              {projects.map((project, i) => (
              <motion.div
                key={project.name}
                whileHover={{ y: -30, scale: 1.02 }}
                onClick={() => {
                  setSelectedProject(project);
                  trackProjectView(project.name);
                }}
                className="flex-shrink-0 w-48 sm:w-56 md:w-64 lg:w-80 h-[300px] sm:h-[350px] md:h-[450px] lg:h-[650px] relative group shadow-lg overflow-hidden cursor-pointer scroll-snap-start"
                style={{ 
                  backgroundColor: project.color,
                  marginTop: `${(i % 3) * 30}px` // Reduced staircase effect for mobile
                }}
              >
                <div className="absolute top-4 md:top-8 left-4 md:left-8 text-white/80 font-bold text-[8px] md:text-[10px] tracking-widest uppercase">
                   ( {project.logo} )
                </div>
                <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 writing-vertical text-white font-black text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-tighter uppercase leading-none">
                  {project.name}
                </div>
                
                {/* Image overlay on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                   <img 
                     src={`https://picsum.photos/seed/${project.name}/800/1200`} 
                     alt={project.name} 
                     className="w-full h-full object-cover grayscale"
                     referrerPolicy="no-referrer"
                   />
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100">
                   <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white text-untold-ink flex items-center justify-center">
                     <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                   </div>
                </div>

                {/* Click indicator */}
                <div className="absolute top-3 md:top-4 right-3 md:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white/60 text-[10px] md:text-xs font-medium">Click to explore</div>
                </div>
              </motion.div>
            ))}
            </div>
          </div>
        </Reveal>
        
        <div className="px-4 md:px-8 mt-8 md:mt-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <Reveal>
            <div className="flex items-center space-x-3 md:space-x-4">
              <button 
                onClick={scrollLeft}
                disabled={currentIndex === 0}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-untold-ink/20 flex items-center justify-center hover:bg-untold-ink hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <div className="flex space-x-1 md:space-x-2">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToProject(index)}
                    className={`w-[2px] h-4 md:h-6 transition-all cursor-pointer ${
                      index === currentIndex ? 'bg-untold-accent w-[3px]' : 'bg-untold-ink/10 hover:bg-untold-ink/30'
                    }`}
                  />
                ))}
              </div>
              <button 
                onClick={scrollRight}
                disabled={currentIndex >= projects.length - 1}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-untold-ink/20 flex items-center justify-center hover:bg-untold-ink hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <div className="text-[9px] md:text-[10px] font-bold tracking-widest ml-2 md:ml-4">
                <span className="text-untold-accent">({String(currentIndex + 1).padStart(2, '0')})</span> {projects.length} ALL
              </div>
            </div>
          </Reveal>
          <Reveal>
            <button 
              onClick={() => {
                const element = document.getElementById('education');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase border-b border-untold-accent pb-1 group text-center md:text-left"
            >
              EVERY PROJECT HAS A STORY — <span className="underline group-hover:text-untold-accent transition-colors">EXPLORE MY JOURNEY</span>
            </button>
          </Reveal>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6 md:p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div 
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                      style={{ backgroundColor: selectedProject.color }}
                    />
                    <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-gray-500">
                      {selectedProject.logo}
                    </span>
                    <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full font-medium ${
                      selectedProject.status === 'Live' ? 'bg-green-100 text-green-700' :
                      selectedProject.status === 'Ongoing' ? 'bg-blue-100 text-blue-700' :
                      selectedProject.status === 'Active' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedProject.status}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-untold-ink mb-2">
                    {selectedProject.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Project Overview */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-gray-500 mb-2 sm:mb-3">
                  Project Overview
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                  {selectedProject.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Case Study Details */}
              {selectedProject.caseStudy && (
                <div className="space-y-6">
                  {/* Problem & Solution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-3">
                        Problem Statement
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {selectedProject.caseStudy.problem}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-3">
                        Solution Approach
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {selectedProject.caseStudy.solution}
                      </p>
                    </div>
                  </div>

                  {/* Process */}
                  <div>
                    <h4 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-3">
                      Development Process
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProject.caseStudy.process.map((step: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-untold-accent/10 text-untold-accent flex items-center justify-center text-xs font-bold mt-0.5">
                            {index + 1}
                          </div>
                          <span className="text-sm text-gray-700 flex-1">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Results */}
                  <div>
                    <h4 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-3">
                      Key Results & Impact
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedProject.caseStudy.results.map((result: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                          <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                          <span className="text-sm text-gray-700 flex-1">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Challenges & Learnings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-3">
                        Challenges Faced
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed p-3 bg-orange-50 rounded-lg">
                        {selectedProject.caseStudy.challenges}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-3">
                        Key Learnings
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed p-3 bg-blue-50 rounded-lg">
                        {selectedProject.caseStudy.learnings}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Project Image */}
              <div className="mb-4 sm:mb-6 mt-6">
                <div className="aspect-video rounded-lg sm:rounded-xl overflow-hidden bg-gray-100">
                  <img 
                    src={`https://picsum.photos/seed/${selectedProject.name}/800/450`} 
                    alt={selectedProject.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 bg-untold-ink text-white py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-medium hover:bg-untold-ink/90 transition-colors text-sm sm:text-base">
                  View Live Project
                </button>
                <button className="flex-1 border border-gray-200 text-gray-700 py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base">
                  View Source Code
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

const AboutUs = () => {
  return (
    <section className="py-16 md:py-32 px-4 md:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionLabel>ABOUT ME</SectionLabel>
        
        <div className="relative mb-12 md:mb-20">
          <Reveal width="100%">
            <h2 className="text-[8vw] sm:text-[7vw] md:text-[5vw] font-black leading-tight tracking-tighter uppercase max-w-5xl">
              I combine technical skills, research passion, and problem-solving—working across domains to deliver 
              <span className="inline-block bg-untold-ink text-white px-2 sm:px-4 mx-1 sm:mx-2 relative">
                digital solutions
                <motion.div 
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 bg-untold-ink -z-10 origin-left"
                />
              </span> 
              that impact people. <CursorBlink />
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="relative order-2 md:order-1">
            <ParallaxIllustration type="planet" className="absolute -top-8 md:-top-12 -right-8 md:-right-12 w-16 h-16 md:w-24 md:h-24 text-untold-accent opacity-40" speed={0.5} />
            <ParallaxIllustration type="cat" className="w-48 h-48 md:w-64 md:h-64 text-untold-ink opacity-10 mx-auto md:mx-0" speed={-0.2} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs sm:text-sm leading-relaxed opacity-70 text-center max-w-[280px]">
              <Reveal>
                <div>
                  Currently pursuing B.E. in Computer Science at K S Rangasamy College of Technology. <span className="font-bold">Maintaining a CGPA of 8.5.</span> Passionate about Web technologies and ERP Solutions.
                </div>
              </Reveal>
            </div>
          </div>
          
          <div className="flex items-end justify-center md:justify-end space-x-1 sm:space-x-2 order-1 md:order-2">
             {[85, 98, 87, 95, 90].map((h, i) => (
               <motion.div 
                 key={i} 
                 initial={{ height: 0 }}
                 whileInView={{ height: `${h * 1.5}px` }}
                 transition={{ duration: 1, delay: i * 0.1 }}
                 className="w-8 sm:w-10 md:w-12 bg-untold-ink" 
               />
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Ecosystem = () => {
  const agencies = ["Java", "SQL", "HTML/CSS", "JavaScript", "AI/ML", "IoT"];
  
  return (
    <section className="py-32 px-8 bg-untold-bg overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <Reveal width="100%">
          <div className="relative mb-32">
            {/* Giant background text with circles as seen in image 6 & 7 */}
            <div className="relative inline-block">
              <h2 className="text-[20vw] font-black leading-none tracking-tighter uppercase text-untold-ink select-none">madhu</h2>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[25vw] h-[25vw] rounded-full border border-untold-accent border-dotted opacity-40 -translate-x-1/4" />
                <div className="w-[25vw] h-[25vw] rounded-full border border-untold-accent border-dotted opacity-40 translate-x-1/4" />
                <div className="w-[20vw] h-[20vw] rounded-full border border-untold-accent border-dotted opacity-30 -translate-y-1/4" />
              </div>
            </div>
            <div className="mt-8 text-[10px] font-bold tracking-widest uppercase">CORE COMPETENCIES. <span className="text-untold-accent">ONE VERSATILE DEVELOPER.</span></div>
          </div>
        </Reveal>
        
        <div className="relative h-[600px] flex items-center justify-center mt-20 text-untold-ink">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="w-[400px] h-[400px] rounded-full border border-untold-ink/10 border-dashed" 
            />
          </div>
          
          <Reveal>
            <div className="relative z-10 text-[8vw] md:text-[6vw] font-black uppercase tracking-tighter leading-none">
              build <span className="text-untold-accent">digital</span> <br /> future <br /> today
            </div>
          </Reveal>

          {agencies.map((agency, i) => {
            const angle = (i * 360) / agencies.length;
            const radius = 300;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            
            return (
              <motion.div
                key={agency}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                style={{ x, y }}
                className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full border border-untold-accent/30 bg-white/80 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold tracking-widest uppercase p-4 text-center hover:bg-untold-accent hover:text-white hover:border-untold-accent transition-all cursor-pointer shadow-sm group"
              >
                <div className="group-hover:scale-110 transition-transform">{agency}</div>
              </motion.div>
            );
          })}
        </div>

        <Reveal>
          <button 
            onClick={() => {
              const element = document.getElementById('skills');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mt-32 px-10 py-5 bg-untold-accent text-white rounded-full text-xs font-bold tracking-widest hover:scale-105 transition-transform"
          >
            <span className="mr-2">•</span> EXPLORE MY SKILLS
          </button>
        </Reveal>
      </div>
    </section>
  );
};

const MapSection = () => {
  return (
    <section className="py-32 px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        <div className="relative">
          <Reveal width="100%">
            {/* Sketched map of India/Tamil Nadu area */}
            <svg viewBox="0 0 400 600" className="w-full h-auto opacity-20">
              <path 
                d="M200 100 Q 250 150 220 250 T 240 400 T 200 550" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1" 
                strokeDasharray="2 2" 
              />
              <path 
                d="M100 100 L 300 100 M 100 150 L 300 150 M 100 200 L 300 200 M 100 250 L 300 250 M 100 300 L 300 300 M 100 350 L 300 350 M 100 400 L 300 400 M 100 450 L 300 450 M 100 500 L 300 500" 
                stroke="currentColor" 
                strokeWidth="0.5" 
                opacity="0.3"
              />
              {/* Asterisk pins for Tamil Nadu */}
              {[ [220, 450], [230, 460], [210, 470] ].map((pos, i) => (
                <motion.text 
                  key={i} 
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  x={pos[0]} y={pos[1]} 
                  className="fill-untold-accent font-bold text-2xl"
                >
                  *
                </motion.text>
              ))}
            </svg>
          </Reveal>
        </div>

        <div>
          <SectionLabel>LOCAL ROOTS, GLOBAL VISION</SectionLabel>
          <Reveal>
            <h2 className="text-[8vw] md:text-[5vw] font-black leading-tight tracking-tighter uppercase mb-8">
              Based in <br /> Tiruchengode, <br /> Tamil Nadu <CursorBlink />
            </h2>
          </Reveal>
          <div className="max-w-md">
            <Reveal>
              <p className="text-sm leading-relaxed opacity-70 mb-12">
                <span className="text-untold-accent font-bold">(*)</span> Located in <span className="bg-untold-ink text-white px-1">Tamil Nadu - 637205</span>. I am open to remote opportunities and global collaboration. My journey started in Tiruchengode, and I am eager to contribute significantly to the world of computer science and ERP solutions.
              </p>
            </Reveal>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-untold-accent text-white rounded-full text-xs font-bold tracking-widest transition-transform"
            >
              <span className="mr-2">•</span> GET IN TOUCH
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

const UntoldStories = () => {
  const [showNotes, setShowNotes] = useState(false);
  const notes = [
    { text: "98% in SSLC - A foundation of excellence.", color: "#e84b1f" },
    { text: "87% in HSC - Pushing boundaries in science.", color: "#5b8fd9" },
    { text: "Event Coordinator at ASCII Club - Leading with creativity.", color: "#f0b429" }
  ];

  return (
    <section className="py-16 md:py-32 px-4 md:px-8 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')]">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <SectionLabel>MY JOURNEY</SectionLabel>
        <Reveal width="100%">
          <h2 className="text-[12vw] sm:text-[10vw] md:text-[8vw] font-black leading-none tracking-tighter uppercase mb-8 md:mb-12 flex flex-col sm:flex-row items-center justify-center flex-wrap gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              my 
              <span className="inline-block p-2 sm:p-3 md:p-4 border border-untold-ink/20 rounded-lg">
                <HandDrawnIllustration type="folder" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
              </span> 
              untold
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              stories
              <ParallaxIllustration type="shh" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-untold-accent" speed={0.3} />
            </div>
          </h2>
        </Reveal>
        
        <Reveal width="100%">
          <p className="text-base sm:text-lg md:text-xl font-light opacity-70 mb-12 md:mb-20 max-w-2xl mx-auto px-4 sm:px-0">
            Every milestone is a story of dedication and learning. <CursorBlink />
          </p>
        </Reveal>

        <button 
          onClick={() => setShowNotes(!showNotes)}
          className="text-[10px] sm:text-xs font-bold tracking-widest uppercase border-b border-untold-accent pb-1 hover:text-untold-accent transition-colors px-4 py-2"
        >
          {showNotes ? 'Hide Stories' : 'Click to uncover more !'}
        </button>

        <AnimatePresence>
          {showNotes && (
            <div className="absolute inset-0 pointer-events-none">
              {notes.map((note, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    x: window.innerWidth < 768 
                      ? (i - 1) * 120 + (Math.random() * 30 - 15)  // Mobile: smaller spacing
                      : (i - 1) * 300 + (Math.random() * 50 - 25), // Desktop: original spacing
                    y: window.innerWidth < 768 
                      ? (i - 1) * 80 + (Math.random() * 30 - 15)   // Mobile: more vertical spread
                      : (i - 1) * 50 + (Math.random() * 50 - 25),  // Desktop: original spacing
                    rotate: (Math.random() * 20 - 10)
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 p-4 sm:p-5 md:p-6 shadow-2xl pointer-events-auto cursor-grab active:cursor-grabbing rounded-lg"
                  style={{ backgroundColor: note.color }}
                  drag
                  dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
                  whileDrag={{ scale: 1.1, rotate: 0 }}
                >
                  <div className="text-white font-bold text-sm sm:text-base md:text-lg leading-tight h-full flex items-center justify-center text-center">
                    {note.text}
                  </div>
                  
                  {/* Close button for mobile */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNotes(false);
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white text-xs md:hidden"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Mobile overlay to close notes */}
        {showNotes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-0 md:hidden"
            onClick={() => setShowNotes(false)}
          />
        )}
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-64 px-8 text-center bg-untold-bg">
      <SectionLabel>YOUR VISION, MY CODE</SectionLabel>
      <Reveal width="100%">
        <h2 className="text-[12vw] md:text-[10vw] font-black leading-[0.9] tracking-tighter uppercase max-w-5xl mx-auto mt-12 mb-16">
          let's build your <br /> next digital solution
        </h2>
      </Reveal>
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          const element = document.getElementById('contact');
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }}
        className="px-12 py-6 bg-untold-accent text-white rounded-full text-xs font-bold tracking-widest transition-transform"
      >
        <span className="mr-2">•</span> GET IN TOUCH
      </motion.button>
    </section>
  );
};

const ContactSection = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    trackContactFormSubmit();
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-16 md:py-32 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20">
          <div>
            <SectionLabel>GET IN TOUCH</SectionLabel>
            <h2 className="text-[12vw] sm:text-[10vw] md:text-[8vw] font-black leading-[0.9] tracking-tighter uppercase mb-8 md:mb-12">
              let's <br /> talk
            </h2>
            
            <div className="space-y-6 md:space-y-8 mt-12 md:mt-20">
              <div className="group cursor-pointer">
                <div className="text-[10px] font-bold tracking-widest uppercase opacity-40 mb-2">EMAIL</div>
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tighter group-hover:text-untold-accent transition-colors break-all">
                  madhumithramithra8@gmail.com
                </div>
              </div>
              
              <div className="group cursor-pointer">
                <div className="text-[10px] font-bold tracking-widest uppercase opacity-40 mb-2">PHONE</div>
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tighter group-hover:text-untold-accent transition-colors">
                  +91 96776 32414
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="text-[10px] font-bold tracking-widest uppercase opacity-40 mb-2">LOCATION</div>
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tighter group-hover:text-untold-accent transition-colors">
                  Tiruchengode, Tamil Nadu
                </div>
              </div>
            </div>

            <div className="mt-12 md:mt-20 flex space-x-4 md:space-x-6">
              {[
                { icon: <Linkedin className="w-4 h-4 md:w-5 md:h-5" />, label: "LINKEDIN" },
                { icon: <Instagram className="w-4 h-4 md:w-5 md:h-5" />, label: "INSTAGRAM" }
              ].map((social) => (
                <button key={social.label} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-untold-ink/10 flex items-center justify-center hover:bg-untold-ink hover:text-white transition-all">
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#F2F0EB] p-6 md:p-8 lg:p-12 rounded-2xl md:rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
              <HandDrawnIllustration type="shh" className="w-48 h-48 md:w-64 md:h-64" />
            </div>
            
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-8 relative z-10"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase opacity-40">NAME</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Your name"
                      className="w-full bg-transparent border-b border-untold-ink/10 py-4 focus:outline-none focus:border-untold-accent transition-colors font-medium"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase opacity-40">EMAIL</label>
                    <input 
                      type="email" 
                      required
                      placeholder="Your email address"
                      className="w-full bg-transparent border-b border-untold-ink/10 py-4 focus:outline-none focus:border-untold-accent transition-colors font-medium"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase opacity-40">MESSAGE</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Tell me about your project"
                      className="w-full bg-transparent border-b border-untold-ink/10 py-4 focus:outline-none focus:border-untold-accent transition-colors font-medium resize-none"
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-untold-ink text-white py-6 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-untold-accent transition-colors shadow-xl"
                  >
                    SEND MESSAGE
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20"
                >
                  <div className="w-20 h-20 bg-untold-accent rounded-full flex items-center justify-center text-white">
                    <ChevronRight className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold tracking-tighter">MESSAGE SENT!</h3>
                  <p className="opacity-60 max-w-[240px]">Thanks for reaching out. I'll get back to you as soon as possible.</p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs font-bold tracking-widest uppercase underline underline-offset-8"
                  >
                    SEND ANOTHER
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const navItems = [
    { name: "HOME", id: "home" },
    { name: "ABOUT", id: "about" },
    { name: "PROJECTS", id: "projects" },
    { name: "SKILLS", id: "skills" },
    { name: "BLOG", id: "blog" },
    { name: "CONTACT", id: "contact" }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <footer className="bg-untold-ink text-white py-16 md:py-32 px-4 md:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20">
        <div>
          <h2 
            className="text-[20vw] sm:text-[16vw] md:text-[15vw] lg:text-[12vw] font-black tracking-tighter uppercase leading-none mb-8 md:mb-12 cursor-pointer"
            onClick={() => scrollToSection('home')}
          >
            madhu<CursorBlink />
          </h2>
          <div className="text-sm opacity-50 space-y-2 mb-8 md:mb-12">
            <p>+91 96776 32414</p>
            <p className="break-all">madhumithramithra8@gmail.com</p>
            <p>Tiruchengode, Tamil Nadu</p>
          </div>
          <div className="relative mt-12 md:mt-20 hidden md:block">
            <HandDrawnIllustration type="ladder" className="w-32 h-32 md:w-48 md:h-48 text-white opacity-40" />
            <div className="absolute top-0 left-16 md:left-24">
               {/* Illustration of person reaching for star as seen in image 13 */}
               <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-32 md:h-32" fill="none" stroke="white" strokeWidth="1">
                 <path d="M50 80 L 50 40 M 50 45 L 35 35 M 50 45 L 65 35 M 50 80 L 40 95 M 50 80 L 60 95" />
                 <path d="M60 20 L 65 10 M 70 25 L 80 20 M 65 30 L 75 35" stroke="currentColor" />
                 <circle cx="67" cy="15" r="2" fill="white" className="animate-pulse" />
               </svg>
            </div>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          {navItems.map((item, i) => (
            <div 
              key={item.name} 
              className="flex items-center justify-between group cursor-pointer border-b border-white/10 pb-4 md:pb-6 pt-2"
              onClick={() => scrollToSection(item.id)}
            >
              <span className="text-xs md:text-sm opacity-30 font-mono">0{i + 1}</span>
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black tracking-tighter uppercase group-hover:text-untold-accent transition-colors">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 md:mt-32 pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[9px] md:text-[10px] font-bold tracking-widest uppercase opacity-50 gap-6 md:gap-8">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 md:space-x-8 text-center sm:text-left">
          <button className="hover:text-white transition-colors">PRIVACY POLICY</button>
          <button className="hover:text-white transition-colors">TERMS AND CONDITIONS</button>
        </div>
        
        <div className="flex items-center space-x-4 order-first md:order-none">
           <span>( EN )</span>
           <ChevronRight className="w-3 h-3 rotate-90" />
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 md:space-x-8">
           <span>FOLLOW ME</span>
           <div className="flex space-x-4">
             <button className="hover:text-white transition-colors" onClick={() => window.open('https://linkedin.com/in/Madhumithra-R', '_blank')}>LI</button>
             <button className="hover:text-white transition-colors" onClick={() => window.open('https://github.com/Madhumithra-R', '_blank')}>GH</button>
           </div>
        </div>
      </div>
      
      <div className="mt-8 md:mt-12 flex justify-center">
        <div className="w-2 h-2 rounded-full bg-untold-accent" />
      </div>
    </footer>
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 h-48 w-4 flex flex-col items-center z-50">
      <div className="h-full w-[1px] bg-untold-ink/10 relative">
        <motion.div 
          className="absolute top-0 left-0 w-full bg-untold-accent origin-top"
          style={{ scaleY }}
        />
      </div>
      <div className="w-2 h-2 rounded-full bg-untold-accent mt-2" />
    </div>
  );
};

const SketchCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useRef<{ x: number; y: number; age: number; offset: { x: number; y: number } }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      // Add points with tighter offsets for a bold pen feel
      for (let i = 0; i < 3; i++) {
        points.current.push({ 
          x: e.clientX, 
          y: e.clientY, 
          age: 60,
          offset: {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
          }
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (points.current.length > 0) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#e84b1f';

        for (let i = 0; i < points.current.length; i++) {
          const p = points.current[i];
          const opacity = p.age / 60;
          
          // Main bold stroke
          ctx.globalAlpha = opacity * 0.6;
          ctx.lineWidth = 4 + Math.random() * 3;

          if (i > 3) {
            const prev = points.current[i - 3];
            ctx.beginPath();
            ctx.moveTo(prev.x + prev.offset.x, prev.y + prev.offset.y);
            ctx.lineTo(p.x + p.offset.x, p.y + p.offset.y);
            ctx.stroke();
            
            // Subtle "ink bleed" or secondary fiber stroke
            ctx.globalAlpha = opacity * 0.2;
            ctx.lineWidth = 8 + Math.random() * 4;
            ctx.stroke();
          }

          p.age--;
        }

        points.current = points.current.filter(p => p.age > 0);
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
};

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[200] bg-[#F2F0EB] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="noise-overlay" />
      
      <div className="relative w-48 h-48 md:w-64 md:h-64 mb-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full h-full rounded-2xl overflow-hidden shadow-2xl relative z-10"
        >
          <img 
            src="/madhu-profile.png" 
            alt="Loading" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-6 border-2 border-dashed border-untold-accent/20 rounded-full"
        />
        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-untold-accent rounded-full flex items-center justify-center text-white font-bold shadow-lg z-20">
          {progress}%
        </div>
      </div>

      <div className="flex flex-col items-center">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-black tracking-tighter uppercase text-untold-ink"
        >
          madhu
        </motion.h1>
        <div className="w-48 h-[2px] bg-untold-ink/10 mt-4 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-untold-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-6 text-[10px] font-bold tracking-[0.3em] uppercase opacity-40">
          Building digital excellence
        </div>
      </div>

      <div className="absolute bottom-12 right-12">
        <HandDrawnIllustration type="planet" className="w-24 h-24 text-untold-accent opacity-20 animate-spin-slow" />
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="relative cursor-none">
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <div className="noise-overlay" />
      <SketchCursor />
      <ScrollProgress />
      <Navbar />
      
      <main>
        <div id="home"><Hero /></div>
        <Brands />
        <StoriesTyping />
        <div id="projects"><WorkShowcase /></div>
        <div id="about"><AboutUs /></div>
        <div id="skills"><Ecosystem /></div>
        <MapSection />
        <div id="education"><UntoldStories /></div>
        <Blog />
        <CTA />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
