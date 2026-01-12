import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import {
  Github,
  ExternalLink,
  Mail,
  Code2,
  User,
  Cpu,
  Briefcase,
  Send,
  Terminal,
  ChevronRight,
  Monitor,
  Database,
  Layers,
  Plus
} from 'lucide-react';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [visibleProjects, setVisibleProjects] = useState(4);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const mainRef = useRef(null);
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    getAllProjects();
  }, []);

  const getAllProjects = async () => {
    try {
      const res = await axios.get("https://fiver-portfolio-backend.onrender.com/api/projects");
      console.log(res.data.project);

      setProjects(res.data.project || [])

    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };
  useEffect(() => {
    console.log(projects);

  }, [projects])

  // Preloader Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 500); // Small delay for smooth exit
          return 100;
        }
        const diff = Math.random() * 20;
        return Math.min(oldProgress + diff, 100);
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  // Load GSAP via Script tags

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        document.head.appendChild(script);
      });
    };

    const initGSAP = async () => {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
      setGsapLoaded(true);
    };

    initGSAP();
  }, []);

  // Update header based on scroll position using IntersectionObserver
  useEffect(() => {
    const sections = ['home', 'about', 'skills', 'projects', 'contact'];

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    };

    // get all projects



    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!gsapLoaded || loading) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    let scrollTween;

    const ctx = gsap.context(() => {
      // 1. Reveal Animations for landing
      gsap.from(".reveal", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
        delay: 0.2
      });

      // 2. Dynamic Horizontal Scroll for Projects
      const container = document.querySelector(".projects-wrapper");

      if (container) {
        const totalScrollDistance = container.scrollWidth - window.innerWidth;

        scrollTween = gsap.to(container, {
          x: -totalScrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: ".projects-container",
            pin: true,
            scrub: 0.5,
            invalidateOnRefresh: true,
            end: () => `+=${totalScrollDistance}`,
            onUpdate: (self) => {
              gsap.to(".scroll-progress-bar", { scaleX: self.progress, duration: 0.1 });
            }
          }
        });
      }
    }, mainRef);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      if (scrollTween) scrollTween.kill();
    };
  }, [gsapLoaded, visibleProjects, loading]);

  const handleShowMore = () => {
    setVisibleProjects(prev => prev + 3);
  };

  const skills = [
    { name: 'HTML5', icon: <Monitor className="w-6 h-6" />, color: 'bg-orange-500' },
    { name: 'CSS3', icon: <Layers className="w-6 h-6" />, color: 'bg-blue-500' },
    { name: 'JavaScript', icon: <Code2 className="w-6 h-6" />, color: 'bg-yellow-400' },
    { name: 'React', icon: <Cpu className="w-6 h-6" />, color: 'bg-cyan-400' },
    { name: 'Tailwind', icon: <Layers className="w-6 h-6" />, color: 'bg-sky-400' },
    { name: 'Node.js', icon: <Terminal className="w-6 h-6" />, color: 'bg-green-500' },
    { name: 'Express', icon: <Briefcase className="w-6 h-6" />, color: 'bg-gray-600' },
    { name: 'MongoDB', icon: <Database className="w-6 h-6" />, color: 'bg-emerald-600' },
    { name: 'Bootstrap', icon: <Layers className="w-6 h-6" />, color: 'bg-purple-600' },
  ];

  const allProjects = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Project ${i + 1}`,
    desc: "A sleek full-stack solution with performance-first architecture.",
    tags: ["React", "Node"],
    image: `https://images.unsplash.com/photo-${1460925895917 + i}-afdab827c52f?auto=format&fit=crop&q=60&w=800`
  }));

  const displayedProjects = projects.slice(0, visibleProjects);

  return (
    <div ref={mainRef} className="bg-[#0a0a0a] text-white selection:bg-cyan-500 selection:text-white overflow-x-hidden">

      {/* Preloader Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-500">
          <div className="w-64 h-[2px] bg-white/10 rounded-full relative overflow-hidden mb-4">
            <div
              className="absolute top-0 left-0 h-full bg-cyan-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-mono text-cyan-400 text-xs tracking-[0.3em] uppercase mb-2">Initializing Architecture</span>
            <span className="font-black text-4xl tabular-nums">{Math.round(progress)}%</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white/5 backdrop-blur-lg border border-white/10 px-6 py-3 rounded-full flex gap-8 transition-all duration-700 delay-300 ${loading ? 'opacity-0 -translate-y-10' : 'opacity-100 translate-y-0'}`}>
        {['home', 'about', 'skills', 'projects', 'contact'].map((item) => (
          <button
            key={item}
            onClick={() => {
              const el = document.getElementById(item);
              el?.scrollIntoView({ behavior: 'smooth' });
              setActiveSection(item);
            }}
            className={`text-sm font-medium capitalize transition-all duration-300 ${activeSection === item ? 'text-cyan-400 scale-110' : 'text-gray-400 hover:text-white'}`}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Main Content (Wrapped in opacity for preloader transition) */}
      <div className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>

        {/* Hero Section */}
        <section id="home" className="min-h-screen flex flex-col items-center justify-center relative px-4 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]"></div>
          </div>

          <div className="text-center z-10">
            <h2 className="reveal text-cyan-400 font-mono mb-4 text-lg">Hi, my name is</h2>
            <h1 className="reveal text-6xl md:text-8xl font-black mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent leading-none">
             HAREESH VS
            </h1>
            <p className="reveal text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              I build <span className="text-white italic">resilient</span> digital experiences through full-stack craftsmanship.
            </p>
            <div className="reveal mt-10">
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:pr-12"
              >
                <span className="relative z-10">View My Work</span>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-32 px-4 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square bg-gray-900 rounded-3xl overflow-hidden group shadow-2xl shadow-cyan-500/10">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                alt="Profile"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none"></div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-cyan-400 mb-4">
                <User size={20} />
                <span className="font-mono text-sm uppercase tracking-widest">About Me</span>
              </div>
              <h3 className="text-4xl font-bold mb-6">Designing logic, <br /> building emotion.</h3>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                I specialize in bridging the gap between sophisticated design and robust backend architecture. With a focus on performance and user-centric flows, I transform complex requirements into elegant code.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <h4 className="text-2xl font-bold text-white">6+</h4>
                  <p className="text-gray-400 text-sm">Month Experience</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <h4 className="text-2xl font-bold text-white">{projects.length}+</h4>
                  <p className="text-gray-400 text-sm">Projects Delivered</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-32 bg-[#0d0d0d]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col items-center mb-20 text-center">
              <Cpu className="text-cyan-400 mb-4" />
              <h3 className="text-4xl font-bold">Tech Stack</h3>
              <div className="h-1 w-20 bg-cyan-500 mt-4 rounded-full"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {skills.map((skill, i) => (
                <div
                  key={i}
                  className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/50 transition-all duration-300 flex flex-col items-center gap-4"
                >
                  <div className={`${skill.color} p-4 rounded-2xl bg-opacity-10 text-white group-hover:scale-110 transition-transform`}>
                    {skill.icon}
                  </div>
                  <span className="font-medium text-gray-400 group-hover:text-white">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section - Horizontal Scroll */}
        <section id="projects" className="projects-container min-h-screen bg-black flex flex-col justify-center relative overflow-hidden">
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/10 rounded-full overflow-hidden z-20">
            <div className="scroll-progress-bar h-full bg-cyan-400 w-full origin-left scale-x-0"></div>
          </div>

          <div className="projects-wrapper flex flex-nowrap items-center px-[5vw] gap-8 py-20">
            <div className="flex-shrink-0 w-[400px] pr-8">
              <div className="text-cyan-400 font-mono text-xs mb-3 tracking-widest uppercase">Portfolio</div>
              <h3 className="text-5xl font-black leading-[0.9] mb-6 uppercase tracking-tighter">
                Selected<br />
                <span className="text-transparent" style={{ WebkitTextStroke: '1px white' }}>Works</span>
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[300px]">
                Showcasing refined full-stack engineering and design logic.
              </p>
            </div>

            {displayedProjects.map((proj) => (
              <div key={proj._id} className="project-card flex-shrink-0 w-[320px] md:w-[400px] group">
                <div className="relative overflow-hidden rounded-[2rem] bg-zinc-900 border border-white/10 p-3 transition-all duration-500 hover:border-cyan-500/30">
                  <div className="overflow-hidden rounded-[1.5rem] relative aspect-[16/10]">
                    <img
                      src={proj?.imageUrl}
                      className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      alt={proj?.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  </div>

                  <div className="pt-5 pb-1 px-3">
                    <div className="flex gap-2 mb-3">
                      {proj?.tags.slice(0, 2).map(t => (
                        <span key={t} className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-gray-400">
                          {t}
                        </span>
                      ))}
                    </div>
                    <h4 className="text-xl font-black mb-2 group-hover:text-cyan-400 transition-colors tracking-tight">{proj?.title}</h4>
                    <p className="text-gray-500 text-xs mb-5 line-clamp-2 leading-relaxed">{proj.description}</p>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={proj?.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-white text-black py-2.5 rounded-lg font-bold text-[10px] hover:bg-cyan-400 transition-all active:scale-95"
                      >
                        <ExternalLink size={12} /> LIVE
                      </a>

                      <a
                        href={proj?.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-2.5 rounded-lg font-bold text-[10px] hover:bg-white/10 transition-all active:scale-95"
                      >
                        <Code2 size={12} /> CODE
                      </a>
                    </div>

                  </div>
                </div>
              </div>
            ))}

            {/* Show More Button Card */}
            {visibleProjects < projects.length && (
              <div className="flex-shrink-0 w-[280px] px-2">
                <button
                  onClick={handleShowMore}
                  className="group relative w-full aspect-[4/5] flex flex-col items-center justify-center gap-3 bg-white/[0.02] border-2 border-dashed border-white/10 rounded-[2rem] hover:border-cyan-400 hover:bg-white/[0.04] transition-all"
                >
                  <div className="p-4 bg-cyan-500 text-black rounded-full group-hover:scale-110 transition-transform">
                    <Plus size={24} />
                  </div>
                  <div className="text-center">
                    <span className="block font-black text-base tracking-tight uppercase">Show More</span>
                    <span className="text-gray-500 text-[10px] font-mono tracking-widest uppercase mt-1">({projects.length - visibleProjects} more)</span>
                  </div>
                </button>
              </div>
            )}

            <div className="flex-shrink-0 w-[5vw]"></div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-white/[0.05] to-transparent p-8 md:p-16 rounded-[3rem] border border-white/10">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-4xl font-bold mb-6">Let's build something <span className="text-cyan-400 italic">remarkable</span>.</h3>
                <p className="text-gray-400 mb-8">Currently available for freelance projects and full-time collaborations.</p>

                <div className="space-y-4">
                  <a href="mailto:hello@alexrivera.com" className="flex items-center gap-4 text-gray-300 hover:text-cyan-400 transition-colors">
                    <div className="p-3 bg-white/5 rounded-xl"><Mail size={20} /></div>
                    hareeshvs72@gmail.com
                  </a>
                  <div className="flex gap-4 mt-10">
                    <button  className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-cyan-500/50 transition-all hover:-translate-y-1">
                      <Github size={24} />
                    </button>
                    <button className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-cyan-500/50 transition-all hover:-translate-y-1">
                      <Mail size={24} />
                    </button>
                  </div>
                </div>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500 transition-colors"
                />
                <textarea
                  rows="4"
                  placeholder="Tell me about your project..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500 transition-colors resize-none"
                ></textarea>
                <button className="w-full py-4 bg-cyan-500 text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-cyan-400 transition-colors">
                  <Send size={18} /> Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        <footer className="py-10 text-center text-gray-600 text-sm border-t border-white/5">
          &copy; {new Date().getFullYear()} Hareesh VS. Handcrafted with React & GSAP.
        </footer>
      </div>
    </div>
  );
};

export default Portfolio;