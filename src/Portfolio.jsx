import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';

/**
 * GLASS PILL NAVIGATION COMPONENT
 * ------------------------------------------------------------------
 * Theme: Grey (Slate/Zinc) & Orange (Primary) with Red Highlights.
 * Fully Responsive with smooth section-based scrolling.
 */

const GlassPillNav = ({
  items,
  activeHref = '#home',
  onNavigate,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const navContainerRef = useRef(null);
  const pillRefs = useRef([]);
  const circleRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useLayoutEffect(() => {
    const calculateGeometry = () => {
      pillRefs.current.forEach((pill, index) => {
        const circle = circleRefs.current[index];
        if (!pill || !circle) return;

        const rect = pill.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2; 
        
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;
        circle.style.transformOrigin = `50% ${originY}px`;
      });
    };

    calculateGeometry();
    window.addEventListener('resize', calculateGeometry);
    const timeout = setTimeout(calculateGeometry, 100);

    return () => {
      window.removeEventListener('resize', calculateGeometry);
      clearTimeout(timeout);
    };
  }, [items]);

  const handleItemClick = (e, href) => {
    e.preventDefault();
    onNavigate(href);
    setIsMobileMenuOpen(false);

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <header 
        ref={navContainerRef}
        className={`fixed top-0 left-0 w-full z-50 flex justify-center transition-all duration-500 ease-out pointer-events-none ${
          scrolled ? 'py-2' : 'py-4 md:py-8'
        }`}
        style={{
          transform: 'translateY(0)',
          opacity: 1,
          animation: 'slideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className={`
          pointer-events-auto
          relative flex items-center justify-between
          backdrop-blur-xl saturate-150
          border border-slate-200/30 dark:border-slate-800/50 shadow-xl
          transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${scrolled 
            ? 'w-[95%] md:w-[600px] rounded-full bg-slate-100/80 dark:bg-slate-900/80 px-2 py-2' 
            : 'w-[92%] md:w-[850px] rounded-[2rem] bg-slate-50/40 dark:bg-slate-950/40 px-6 py-4'
          }
        `}>
          
          {/* Action Left (Visual Balance on Desktop) */}
          <div className="hidden md:flex items-center gap-2 w-32">
             <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Available</span>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {items.map((item, i) => {
              const isActive = activeHref === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  ref={el => pillRefs.current[i] = el}
                  onClick={(e) => handleItemClick(e, item.href)}
                  className={`
                    group relative overflow-hidden rounded-full px-5 py-2.5
                    text-sm font-semibold transition-colors duration-300
                    ${isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400'}
                  `}
                >
                  {/* Gooey Fill - Uses Orange as Primary Fill */}
                  <span 
                    ref={el => circleRefs.current[i] = el}
                    className="absolute left-1/2 -translate-x-1/2 rounded-full bg-orange-600 pointer-events-none z-0 block
                      scale-0 group-hover:scale-100
                      transition-transform duration-400 ease-out"
                    aria-hidden="true"
                  />
                  
                  <div className="relative z-10 overflow-hidden h-5 flex flex-col items-center">
                    <span className={`block h-full leading-5 transition-transform duration-300 ease-out group-hover:-translate-y-[150%] ${isActive ? 'text-red-500' : ''}`}>
                      {item.label}
                    </span>
                    <span className="absolute top-0 left-0 w-full text-center h-full leading-5 text-white
                      translate-y-[150%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                      transition-all duration-300 ease-out">
                      {item.label}
                    </span>
                  </div>

                  {/* Red Highlight Dot for Active State */}
                  {isActive && (
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-500 shadow-[0_0_8px_red]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Contact Button & Mobile Toggle */}
          <div className="flex items-center gap-3 pr-1 ml-auto md:ml-0">
             <button 
                onClick={(e) => handleItemClick(e, '#contact')}
                className="hidden md:block px-6 py-2.5 rounded-full bg-slate-900 dark:bg-orange-600 text-white text-sm font-bold hover:bg-orange-500 dark:hover:bg-orange-500 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-900/10"
             >
                Contact
             </button>

             <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-3 rounded-full bg-slate-200/50 dark:bg-slate-800/50 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all text-slate-800 dark:text-white md:hidden"
                aria-label="Toggle Menu"
             >
               {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
             </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <div className={`fixed inset-0 z-40 md:hidden flex flex-col pt-24 px-4 pointer-events-none transition-all duration-500 ${
        isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
          <div 
             className={`absolute inset-0 bg-slate-950/60 backdrop-blur-md pointer-events-auto transition-opacity duration-500 ${
               isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
             }`}
             onClick={() => setIsMobileMenuOpen(false)}
          />
          
          <div 
            className={`
              pointer-events-auto w-full bg-slate-50/90 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-6 shadow-2xl flex flex-col gap-3 relative
              transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
              ${isMobileMenuOpen ? 'translate-y-0 scale-100' : '-translate-y-12 scale-90 opacity-0'}
            `}
          >
            {items.map((item) => (
               <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleItemClick(e, item.href)}
                className={`
                  relative p-4 rounded-2xl text-xl font-bold transition-all flex items-center justify-between
                  ${activeHref === item.href 
                    ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20' 
                    : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'}
                `}
               >
                 {item.label}
                 {activeHref === item.href && <div className="w-2 h-2 rounded-full bg-red-400 animate-ping" />}
               </a>
            ))}
            <button 
              onClick={(e) => handleItemClick(e, '#contact')}
              className="mt-4 w-full py-5 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-lg font-black shadow-xl active:scale-95 transition-transform"
            >
               Get in Touch
            </button>
          </div>
      </div>
      
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

/**
 * DEMO WRAPPER
 */
const App = () => {
  const [activeSection, setActiveSection] = useState('#home');

  const navItems = [
    { label: 'Home', href: '#home' },
     { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' }
   
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    ['home', 'skills', 'projects', 'about', 'contact'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const Section = ({ id, title, colorClass }) => (
    <section 
      id={id} 
      className={`min-h-screen flex flex-col items-center justify-center p-8 transition-colors duration-700 ${colorClass}`}
    >
      <span className="text-orange-500 font-black text-sm uppercase tracking-widest mb-4">Section</span>
      <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white">
        {title}<span className="text-red-600">.</span>
      </h2>
    </section>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-orange-500 selection:text-white">
      <GlassPillNav 
        items={navItems}
        activeHref={activeSection}
        onNavigate={setActiveSection}
      />
      <Home id="home"/>
      <About id="about"/>
      {/* <Section  title="HOME" colorClass="bg-slate-50 dark:bg-slate-950" /> */}
      <Section id="skills" title="SKILLS" colorClass="bg-slate-100 dark:bg-slate-900" />
      <Section id="projects" title="PROJECTS" colorClass="bg-slate-200 dark:bg-slate-800" />
      {/* <Section id="about" title="ABOUT" colorClass="bg-slate-100 dark:bg-slate-900" /> */}
      {/* <Section id="contact" title="CONTACT" colorClass="bg-orange-50 dark:bg-slate-950" /> */}
      <Contact/>
    </div>
  );
};

export default App;