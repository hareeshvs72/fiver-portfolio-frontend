import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ExternalLink, Github, Filter,
  ChevronLeft, ChevronRight, Layout, Code,
  Globe, Server, Cpu, Palette, Zap
} from 'lucide-react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_BACKEND_API;
console.log("api url " , apiUrl);

// --- Utility Functions ---
function hexToRgba(hex, alpha = 1) {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h.split('').map(c => c + c).join('');
  }
  const int = parseInt(h, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// --- Interactive Background Component ---
const CyberBackground = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);



  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Dynamic Grid */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff10 1px, transparent 1px), linear-gradient(to bottom, #ffffff10 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          transform: `translate(${(mousePos.x * -0.02)}px, ${(mousePos.y * -0.02)}px)`
        }}
      />

      {/* Radial Glow follow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #f97316 0%, transparent 70%)',
          left: mousePos.x - 300,
          top: mousePos.y - 300,
          transition: 'left 0.15s ease-out, top 0.15s ease-out'
        }}
      />

      {/* Floating Elements */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            opacity: Math.random() * 0.3
          }}
          animate={{
            y: [null, (Math.random() * 100) + "%"],
            opacity: [0.1, 0.4, 0.1]
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute w-[1px] h-20 bg-gradient-to-b from-transparent via-orange-500/50 to-transparent"
        />
      ))}
    </div>
  );
};

// --- ElectricBorder Component ---
const ElectricBorder = ({
  children,
  color = '#f97316',
  speed = 1,
  chaos = 0.12,
  borderRadius = 16,
  className,
  style
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);

  const random = useCallback(x => (Math.sin(x * 12.9898) * 43758.5453) % 1, []);

  const noise2D = useCallback((x, y) => {
    const i = Math.floor(x);
    const j = Math.floor(y);
    const fx = x - i;
    const fy = y - j;
    const a = random(i + j * 57);
    const b = random(i + 1 + j * 57);
    const c = random(i + (j + 1) * 57);
    const d = random(i + 1 + (j + 1) * 57);
    const ux = fx * fx * (3.0 - 2.0 * fx);
    const uy = fy * fy * (3.0 - 2.0 * fy);
    return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
  }, [random]);

  const octavedNoise = useCallback((x, octaves, lacunarity, gain, baseAmplitude, baseFrequency, time, seed, baseFlatness) => {
    let y = 0;
    let amplitude = baseAmplitude;
    let frequency = baseFrequency;
    for (let i = 0; i < octaves; i++) {
      let octaveAmplitude = amplitude;
      if (i === 0) octaveAmplitude *= baseFlatness;
      y += octaveAmplitude * noise2D(frequency * x + seed * 100, time * frequency * 0.3);
      frequency *= lacunarity;
      amplitude *= gain;
    }
    return y;
  }, [noise2D]);

  const getCornerPoint = useCallback((centerX, centerY, radius, startAngle, arcLength, progress) => {
    const angle = startAngle + progress * arcLength;
    return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
  }, []);

  const getRoundedRectPoint = useCallback((t, left, top, width, height, radius) => {
    const straightWidth = width - 2 * radius;
    const straightHeight = height - 2 * radius;
    const cornerArc = (Math.PI * radius) / 2;
    const totalPerimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc;
    const distance = t * totalPerimeter;
    let accumulated = 0;

    if (distance <= accumulated + straightWidth) {
      const progress = (distance - accumulated) / straightWidth;
      return { x: left + radius + progress * straightWidth, y: top };
    }
    accumulated += straightWidth;
    if (distance <= accumulated + cornerArc) {
      const progress = (distance - accumulated) / cornerArc;
      return getCornerPoint(left + width - radius, top + radius, radius, -Math.PI / 2, Math.PI / 2, progress);
    }
    accumulated += cornerArc;
    if (distance <= accumulated + straightHeight) {
      const progress = (distance - accumulated) / straightHeight;
      return { x: left + width, y: top + radius + progress * straightHeight };
    }
    accumulated += straightHeight;
    if (distance <= accumulated + cornerArc) {
      const progress = (distance - accumulated) / cornerArc;
      return getCornerPoint(left + width - radius, top + height - radius, radius, 0, Math.PI / 2, progress);
    }
    accumulated += cornerArc;
    if (distance <= accumulated + straightWidth) {
      const progress = (distance - accumulated) / straightWidth;
      return { x: left + width - radius - progress * straightWidth, y: top + height };
    }
    accumulated += straightWidth;
    if (distance <= accumulated + cornerArc) {
      const progress = (distance - accumulated) / cornerArc;
      return getCornerPoint(left + radius, top + height - radius, radius, Math.PI / 2, Math.PI / 2, progress);
    }
    accumulated += cornerArc;
    if (distance <= accumulated + straightHeight) {
      const progress = (distance - accumulated) / straightHeight;
      return { x: left, y: top + height - radius - progress * straightHeight };
    }
    accumulated += straightHeight;
    const progress = (distance - accumulated) / cornerArc;
    return getCornerPoint(left + radius, top + radius, radius, Math.PI, Math.PI / 2, progress);
  }, [getCornerPoint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const octaves = 10, lacunarity = 1.6, gain = 0.7, amplitude = chaos, frequency = 10, baseFlatness = 0, displacement = 40, borderOffset = 40;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width + borderOffset * 2;
      const height = rect.height + borderOffset * 2;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      return { width, height };
    };

    let { width, height } = updateSize();

    const draw = currentTime => {
      const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000;
      timeRef.current += deltaTime * speed;
      lastFrameTimeRef.current = currentTime;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const left = borderOffset, top = borderOffset;
      const bW = width - 2 * borderOffset, bH = height - 2 * borderOffset;
      const rad = Math.min(borderRadius, Math.min(bW, bH) / 2);
      const approxPerim = 2 * (bW + bH) + 2 * Math.PI * rad;
      const samples = Math.floor(approxPerim / 3);

      ctx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const p = i / samples;
        const pt = getRoundedRectPoint(p, left, top, bW, bH, rad);
        const xN = octavedNoise(p * 8, octaves, lacunarity, gain, amplitude, frequency, timeRef.current, 0, baseFlatness);
        const yN = octavedNoise(p * 8, octaves, lacunarity, gain, amplitude, frequency, timeRef.current, 1, baseFlatness);
        i === 0 ? ctx.moveTo(pt.x + xN * displacement, pt.y + yN * displacement) : ctx.lineTo(pt.x + xN * displacement, pt.y + yN * displacement);
      }
      ctx.closePath();
      ctx.stroke();
      animationRef.current = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(() => {
      const s = updateSize();
      width = s.width; height = s.height;
    });
    ro.observe(container);
    animationRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animationRef.current); ro.disconnect(); };
  }, [color, speed, chaos, borderRadius, octavedNoise, getRoundedRectPoint]);

  return (
    <div ref={containerRef} className={`relative overflow-visible isolate ${className ?? ''}`} style={{ borderRadius, ...style }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[2]">
        <canvas ref={canvasRef} className="block" />
      </div>
      <div className="absolute inset-0 rounded-[inherit] pointer-events-none z-0">
        <div className="absolute inset-0 rounded-[inherit] border-[1px] border-orange-500/20" />
        <div className="absolute inset-0 rounded-[inherit] pointer-events-none" style={{ border: `1px solid ${hexToRgba(color, 0.4)}`, filter: 'blur(2px)' }} />
        <div className="absolute inset-0 rounded-[inherit] pointer-events-none -z-[1] scale-105 opacity-10" style={{ filter: 'blur(20px)', background: `radial-gradient(circle, ${color}, transparent)` }} />
      </div>
      <div className="relative rounded-[inherit] z-[1] h-full">{children}</div>
    </div>
  );
};


// const PROJECTS = [
//   { id: 1, title: "Neural Dashboard", category: "Frontend", description: "Real-time AI monitoring interface with advanced data viz.", live: "#", code: "#", tags: ["React", "ThreeJS"], image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80" },
//   { id: 2, title: "Quantum API", category: "Backend", description: "High-throughput data processing engine with Rust.", live: "#", code: "#", tags: ["Node.js", "Redis"], image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" },
//   { id: 3, title: "E-Commerce Core", category: "Fullstack", description: "Modular commerce engine for distributed scale.", live: "#", code: "#", tags: ["Next.js", "Postgres"], image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80" },
//   { id: 4, title: "Synth Design", category: "UI/UX", description: "Experimental glassmorphic design system library.", live: "#", code: "#", tags: ["Figma", "Tailwind"], image: "https://images.unsplash.com/photo-1614332284683-51bbe903048a?auto=format&fit=crop&w=800&q=80" },
//   { id: 5, title: "Cyber Security Pad", category: "Frontend", description: "Security analysis tool with interactive shell.", live: "#", code: "#", tags: ["TypeScript", "D3"], image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80" },
//   { id: 6, title: "Vault Keeper", category: "Fullstack", description: "End-to-end encrypted password manager solution.", live: "#", code: "#", tags: ["React Native", "Firebase"], image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&w=800&q=80" },
// ];

const Project = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [project, setProject] = useState([])
  // get all projects
  useEffect(() => {
  handileProjects();
}, []);

  // --- Mock Data ---
const categories = useMemo(() => {
  const uniqueCategories = [
    ...new Set(
      project
        .map(p => p.category)
        .filter(cat => cat && cat.trim() !== "")
    )
  ];
  return ["All", ...uniqueCategories];
}, [project]);

const handileProjects = async () => {
  try {
        console.log("api url inside " , apiUrl);
    const res = await axios.get(`${apiUrl}/api/projects`);
    setProject(res.data.project || []);

  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};


  useEffect(() => {
    console.log("projects", project);

  }, [project])

  const itemsPerPage = 6;

  const filteredProjects = useMemo(() => {
    return project.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory,project]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentItems = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => setCurrentPage(1), [search, activeCategory]);

  return (
    <section id='projects' className="min-h-screen bg-[#050505] text-white py-12 md:py-24 px-4 sm:px-6 relative overflow-hidden font-sans">
      {/* Interactive Background */}
      <CyberBackground />

      {/* Static Top Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-12 md:mb-20 flex flex-col gap-10 md:gap-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-8 h-8 md:w-10 md:h-10 bg-orange-500 rounded-lg flex items-center justify-center text-black shadow-lg shadow-orange-500/20"
                >
                  <Zap fill="currentColor" size={20} className="md:w-6 md:h-6" />
                </motion.div>
                <span className="text-orange-500 font-mono tracking-widest text-xs md:text-sm uppercase">/Core.Project_Index</span>
              </div>
              <h2 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-none text-center md:text-left">
                PROJECTS
              </h2>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-xl hover:border-orange-500 disabled:opacity-30 transition-all bg-white/5"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-mono text-xs text-orange-500/60 uppercase tracking-widest">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-xl hover:border-orange-500 disabled:opacity-30 transition-all bg-white/5"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 w-full">
            <div className="relative group w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500/50 group-focus-within:text-orange-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search database..."
                className="bg-white/5 border border-white/10 pl-12 pr-4 py-3 md:py-4 rounded-2xl outline-none focus:border-orange-500/50 w-full transition-all backdrop-blur-md text-sm md:text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar backdrop-blur-md scroll-smooth">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 text-[10px] md:text-xs font-bold uppercase transition-all rounded-xl whitespace-nowrap ${activeCategory === cat ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/30' : 'hover:bg-white/10 text-white/60'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {currentItems.map((project) => (
              <motion.div
                key={project?._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <ElectricBorder color="#f97316" chaos={0.05} speed={0.6} borderRadius={28} className="h-full">
                  <div className="bg-[#0a0a0a]/80 backdrop-blur-md rounded-[28px] flex flex-col h-full group overflow-hidden border border-white/5 shadow-2xl">
                    <div className="relative h-44 md:h-52 overflow-hidden bg-[#111]">
                      <img
                        src={project?.imageUrl}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[50%] group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />

                      <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-orange-500 shadow-xl">
                        {project?.category}
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center gap-4 md:opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/40 backdrop-blur-[2px]">
                        <a
                          href={project?.codeUrl}
                          rel="noopener noreferrer"

                          title="Source Code"
                          className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-2xl hover:bg-orange-500 transition-all transform hover:scale-110 shadow-xl active:scale-95"
                        >
                          <Github size={22} />
                        </a>
                        <a
                          href={project?.liveUrl}
                          rel="noopener noreferrer"

                          target='_blank'
                          title="Live Demo"
                          className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-2xl hover:bg-orange-500 transition-all transform hover:scale-110 shadow-xl active:scale-95"
                        >
                          <ExternalLink size={22} />
                        </a>
                      </div>
                    </div>

                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                      <h3 className="text-xl md:text-2xl font-black mb-3 group-hover:text-orange-500 transition-colors tracking-tighter uppercase leading-tight">
                        {project.title}
                      </h3>

                      <p className="text-white/50 text-xs md:text-sm mb-8 flex-grow leading-relaxed line-clamp-3">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                        {project.tags.map(tag => (
                          <span key={tag} className="text-[9px] md:text-[10px] font-mono font-bold text-orange-500/60 bg-orange-500/5 px-2.5 py-1 rounded-lg uppercase tracking-wider border border-orange-500/10">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </ElectricBorder>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 md:mt-24 flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-14 h-14 flex items-center justify-center border border-white/10 rounded-2xl hover:border-orange-500 disabled:opacity-20 transition-all bg-white/5 active:scale-95"
              >
                <ChevronLeft size={28} />
              </button>

              <div className="flex gap-2 px-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-14 h-14 rounded-2xl font-black transition-all border hidden sm:flex items-center justify-center ${currentPage === i + 1
                      ? 'bg-orange-500 border-orange-500 text-black shadow-xl shadow-orange-500/20'
                      : 'border-white/10 hover:border-white/30 text-white bg-white/5'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <div className="sm:hidden font-mono text-sm text-orange-500 bg-orange-500/10 px-4 py-3 rounded-xl border border-orange-500/20">
                  {currentPage} / {totalPages}
                </div>
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-14 h-14 flex items-center justify-center border border-white/10 rounded-2xl hover:border-orange-500 disabled:opacity-20 transition-all bg-white/5 active:scale-95"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 md:py-32"
          >
            <div className="inline-block p-6 md:p-8 border border-red-500/20 bg-red-500/5 rounded-[2rem] mb-8 shadow-2xl">
              <p className="text-red-500 font-mono uppercase tracking-widest text-sm md:text-base font-black italic animate-pulse">
                !! ERROR: 404_NULL_POINTER_TO_ARCHIVE !!
              </p>
            </div>
            <p className="text-white/30 text-sm md:text-lg max-w-md mx-auto leading-relaxed">
              No matching encrypted entries found in the current archive segment.
            </p>
          </motion.div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 md:hidden pointer-events-none opacity-40">
        <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-transparent rounded-full" />
      </div>
    </section>
  );
};

export default Project;