import React, { useEffect, useRef, useCallback, useMemo } from 'react';

/* ------------------------------------------------------------------
   BACKGROUND CANVAS EFFECT (GRID & PARTICLES)
   ------------------------------------------------------------------ */

const BackgroundEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width, height;
    let mouse = { x: -1000, y: -1000 };

    const particles = [];
    const particleCount = 40;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) this.reset();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const drawGrid = () => {
      const gridSize = 50;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const drawParticles = () => {
      particles.forEach(p => {
        p.update();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.strokeStyle = `rgba(234, 88, 12, ${0.2 * (1 - dist / 150)})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      drawGrid();
      drawParticles();
      animationFrameId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
    />
  );
};

/* ------------------------------------------------------------------
   PROFILE CARD COMPONENT
   ------------------------------------------------------------------ */

const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v, precision = 3) => parseFloat(v.toFixed(precision));
const adjust = (v, fMin, fMax, tMin, tMax) => round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

const ProfileCard = React.memo(({
  avatarUrl = '/image.png' || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hareesh',
  name = 'Hareesh VS',
  title = 'Fullstack Developer',
  handle = 'hareesh_vs'
}) => {
  const wrapRef = useRef(null);
  const shellRef = useRef(null);

  const setVarsFromXY = (x, y) => {
    const shell = shellRef.current;
    const wrap = wrapRef.current;
    if (!shell || !wrap) return;
    const width = shell.clientWidth || 1;
    const height = shell.clientHeight || 1;
    const percentX = clamp((100 / width) * x);
    const percentY = clamp((100 / height) * y);
    const centerX = percentX - 50;
    const centerY = percentY - 50;

    wrap.style.setProperty('--pointer-x', `${percentX}%`);
    wrap.style.setProperty('--pointer-y', `${percentY}%`);
    wrap.style.setProperty('--background-y', `${adjust(percentY, 0, 100, 35, 65)}%`);
    wrap.style.setProperty('--rotate-x', `${round(-(centerX / 10))}deg`);
    wrap.style.setProperty('--rotate-y', `${round(centerY / 8)}deg`);
  };

  const onMove = (e) => {
    const rect = shellRef.current.getBoundingClientRect();
    setVarsFromXY(e.clientX - rect.left, e.clientY - rect.top);
  };

  const onLeave = () => {
    const wrap = wrapRef.current;
    wrap.style.setProperty('--rotate-x', `0deg`);
    wrap.style.setProperty('--rotate-y', `0deg`);
  };

  return (
    <div ref={wrapRef} className="relative touch-none" style={{ perspective: '1000px' }}>
      <div 
        ref={shellRef} 
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative z-[1] transition-transform duration-500 ease-out"
        style={{ transform: 'rotateX(var(--rotate-y, 0deg)) rotateY(var(--rotate-x, 0deg))' }}
      >
        <div className="relative overflow-hidden w-[340px] h-[480px] rounded-[30px] border border-white/10 bg-black shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-orange-950/40" />
          
          <div className="absolute inset-0 opacity-30 mix-blend-color-dodge pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)`,
              backgroundSize: '200% 100%',
              backgroundPosition: 'var(--pointer-x) 0'
            }}
          />

          <div className="absolute top-12 left-0 w-full text-center p-6">
            <h3 className="text-4xl font-black text-white leading-tight uppercase tracking-tighter">
              {name.split(' ')[0]}<br/>{name.split(' ')[1]}
            </h3>
            <p className="text-orange-500 font-mono text-[10px] uppercase tracking-[0.4em] mt-2">{title}</p>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-center">
             <div className="w-32 h-32 rounded-full border-2 border-orange-500/20 p-1 mb-4">
                <img src={avatarUrl} alt="avatar" className="w-full h-full rounded-full bg-neutral-800" />
             </div>
             <div className="backdrop-blur-md bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-mono text-white/70">
                @{handle} — ACTIVE_DEV
             </div>
          </div>
        </div>
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------
   MAIN ABOUT SECTION
   ------------------------------------------------------------------ */

const About = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const revealElements = containerRef.current.querySelectorAll('.scroll-reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const technologies = {
    Frontend: ["React", "Tailwind CSS", "JavaScript", "HTML", "CSS"],
    Backend: ["Node.js", "Express.js"],
    Database: ["MongoDB",], // "MySQL"
    Tools: ["Git", "GitHub", "Postman", "GSAP"]
  };

  const activities = [
    "Build responsive & interactive web apps",
    "Develop RESTful APIs & backend logic",
    "Design clean UI with modern animations",
    "Optimize performance & code quality",
    "Turn concepts into real-world solutions"
  ];

  return (
    <section ref={containerRef} id="about" className="relative min-h-screen w-full bg-[#020204] flex flex-col items-center py-24 px-6 md:px-12 lg:px-24 overflow-hidden selection:bg-orange-500/40">
      
      <BackgroundEffect />

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
        
        {/* Left Column */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start space-y-8 scroll-reveal reveal-fade-right">
          <ProfileCard 
            name="Hareesh VS"
            title="Full-Stack Developer"
            handle="hareesh_vs"
             image="/image.png"
          />
          
          <div className="w-full space-y-4 pt-8 scroll-reveal reveal-fade-up" style={{ transitionDelay: '0.3s' }}>
            <h4 className="text-orange-500 font-mono text-xs uppercase tracking-[0.3em] font-bold">What I Do</h4>
            <ul className="grid grid-cols-1 gap-3">
              {activities.map((act, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm group scroll-reveal reveal-fade-up" style={{ transitionDelay: `${0.4 + (i * 0.1)}s` }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-600 group-hover:scale-150 transition-transform" />
                  {act}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* Header Reveal */}
          <div className="space-y-6">
            <h2 className="scroll-reveal reveal-slide-up text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
              About <span className="text-transparent stroke-text italic font-light">Me</span>
            </h2>
            
            <div className="space-y-4 text-slate-400 text-lg md:text-xl leading-relaxed font-light">
              <p className="scroll-reveal reveal-fade-up" style={{ transitionDelay: '0.2s' }}>
                I’m <span className="text-white font-medium">Hareesh VS</span>, a passionate <span className="text-white font-medium">Full-Stack Web Developer</span> who loves building clean, scalable, and user-focused web applications. I enjoy transforming ideas into functional digital experiences with attention to performance, design, and usability.
              </p>
              <p className="scroll-reveal reveal-fade-up" style={{ transitionDelay: '0.4s' }}>
                With hands-on experience in <span className="text-orange-500 font-mono text-sm">MERN</span> stack development, I specialize in creating responsive interfaces, efficient backend APIs, and smooth user interactions. I believe great software is a balance between clean code and meaningful user experience.
              </p>
              <div className="scroll-reveal reveal-clip-left" style={{ transitionDelay: '0.6s' }}>
                <p className="text-sm border-l-2 border-orange-500/50 pl-4 py-2 italic bg-white/5 rounded-r-lg">
                  I’m continuously learning new technologies and improving my problem-solving skills to stay aligned with modern development standards.
                </p>
              </div>
            </div>
          </div>

          {/* Technologies Grid */}
          <div className="space-y-8 scroll-reveal reveal-fade-up" style={{ transitionDelay: '0.6s' }}>
            <h4 className="text-orange-500 font-mono text-xs uppercase tracking-[0.3em] font-bold border-b border-white/5 pb-2">Technologies I Work With</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(technologies).map(([category, items], catIdx) => (
                <div key={category} className="space-y-3 scroll-reveal reveal-fade-up" style={{ transitionDelay: `${0.7 + (catIdx * 0.15)}s` }}>
                  <span className="text-white font-bold text-sm tracking-widest uppercase opacity-50">{category}</span>
                  <div className="flex flex-wrap gap-2">
                    {items.map((tech, techIdx) => (
                      <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-slate-300 hover:border-orange-500/50 hover:text-white hover:bg-orange-500/10 transition-all duration-300 cursor-default">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Link */}
          <div className="pt-8 scroll-reveal reveal-fade-up" style={{ transitionDelay: '1s' }}>
            <a href="#contact" className="inline-flex items-center gap-4 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-full transition-all group overflow-hidden relative shadow-[0_0_20px_rgba(234,88,12,0.3)]">
              <span className="relative z-10 uppercase tracking-widest text-xs">Let's build something</span>
              <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

        </div>
      </div>

      <style>{`
        .stroke-text { -webkit-text-stroke: 1px rgba(255,255,255,0.3); }

        /* SCROLL REVEAL CORE */
        .scroll-reveal {
          opacity: 0;
          transition-duration: 1000ms;
          transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
          transition-property: opacity, transform, filter, clip-path;
          will-change: opacity, transform, filter;
        }

        .scroll-reveal.is-visible {
          opacity: 1;
          transform: translate(0, 0) scale(1);
          filter: blur(0);
          clip-path: inset(0 0 0 0);
        }

        /* REVEAL TYPES */
        .reveal-fade-up { transform: translateY(30px); }
        .reveal-fade-right { transform: translateX(-30px); }
        .reveal-slide-up { transform: translateY(60px); filter: blur(10px); }
        
        .reveal-clip-left {
          clip-path: inset(0 100% 0 0);
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-reveal {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default About;