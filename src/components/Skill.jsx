import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  Code2, Layers, Palette, Database, Terminal,
  Zap, Server, Smartphone, ShieldCheck,
  Zap as MotionIcon, Github, FileCode, Layout
} from 'lucide-react';

const Skill = () => {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const sectionRef = useRef(null);

  // Adjusted offset to be more precise for the progress bar length
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"]
  });

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // FIX: Monotonically non-decreasing offsets for progressOpacity
  // Using 0, 0.1, 0.9, 1 to ensure standard linear progression
  const progressOpacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  // Dynamic transforms for the pyramid content
  const scale = useTransform(smoothProgress, [0, 0.4, 0.8, 1], [0.85, 1, 1, 0.9]);
  const contentOpacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  // Logic for scrubbing the gap between items
  const rowGap = useTransform(smoothProgress, [0, 0.4], [60, 16]);
  const desktopRowGap = useTransform(smoothProgress, [0, 0.4], [120, 32]);

  const skillRows = [
  {
    id: "row-1",
    gridCols: "grid-cols-5",
    skills: [
      { name: "HTML", image: "/skills/html.png" },
      { name: "CSS", image: "/skills/css.png" },
      { name: "JavaScript", image: "/skills/js.png", highlight: true },
      { name: "Bootstrap", image: "/skills/bootstrap.jpg" },
      { name: "Tailwind", image: "/skills/tailwind.jpg" }
    ]
  },
  {
    id: "row-2",
    gridCols: "grid-cols-4",
    skills: [
      { name: "React", image: "/skills/react.png", highlight: true },
      { name: "Express.js", image: "/skills/express.jpg" },
      { name: "MongoDB", image: "/skills/mongodb.jpg" },
      { name: "Node.js", image: "/skills/node.jpg" }
    ]
  },
  {
    id: "row-3",
    gridCols: "grid-cols-3",
    skills: [
      { name: "Angular", image: "/skills/angular.jpg" },
      { name: "GSAP", image: "/skills/gsap.png" },
      { name: "Framer Motion", image: "/skills/framer.jpg" }
    ]
  },
  {
    id: "row-4",
    gridCols: "grid-cols-2",
    skills: [
      { name: "TypeScript", image: "/skills/ts.jpg", highlight: true },
      { name: "Git & GitHub", image: "/skills/github.jpg" }
    ]
  }
];


  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#050505] overflow-hidden"
      id='skills'
    >
      {/* Background HUD Layer */}
      <div className="absolute inset-0 pointer-events-none border-[1px] border-orange-500/5 m-2 md:m-6 -z-10" />

      {/* Left-Side Progress Indicator */}
      <motion.div
        style={{ opacity: progressOpacity }}
        className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 h-32 md:h-48 w-[1px] md:w-[2px] bg-orange-500/10 z-50 pointer-events-none"
      >
        <motion.div
          style={{ scaleY: smoothProgress }}
          className="w-full h-full bg-orange-500 origin-top shadow-[0_0_15px_#f97316]"
        />
        {/* Terminal dots at ends of progress bar */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full" />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full" />
      </motion.div>

      <div className="max-w-[1400px] mx-auto px-4 py-[20vh] relative flex flex-col items-center">

        {/* Header Section */}
        <motion.div
          style={{ opacity: contentOpacity, y: useTransform(smoothProgress, [0, 0.2], [30, 0]) }}
          className="text-center mb-16 md:mb-24 relative w-full"
        >
          <div className="inline-block px-3 py-1 border border-orange-500/30 bg-orange-500/5 mb-4 md:mb-6">
            <span className="tracking-[0.3em] md:tracking-[0.5em] text-[8px] md:text-[10px] uppercase font-bold animate-pulse text-orange-400">
              Tech.Matrix.Init
            </span>
          </div>

          <h2 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-2 relative inline-block text-white">
            SKILLS
            <span className="absolute -top-1 -right-4 md:-right-6 text-[10px] md:text-xs font-normal text-orange-500/40">v4.0</span>
          </h2>

          <div className="flex justify-center gap-3 md:gap-4 mt-4">
            <div className="h-[1px] md:h-[2px] w-12 md:w-20 bg-orange-500/50" />
            <div className="h-[1px] md:h-[2px] w-4 md:w-8 bg-red-600 shadow-[0_0_10px_#dc2626]" />
            <div className="h-[1px] md:h-[2px] w-12 md:w-20 bg-orange-500/50" />
          </div>
        </motion.div>

        {/* Pyramid Container */}
        <motion.div
          style={{ scale, opacity: contentOpacity }}
          className="flex flex-col items-center w-full gap-y-4 sm:gap-y-6 md:gap-y-10"
        >
          {skillRows.map((row) => (
            <motion.div
              key={row.id}
              className={`grid ${row.gridCols} justify-items-center w-fit`}
              style={{
                gap: typeof window !== 'undefined' && window.innerWidth < 768 ? rowGap : desktopRowGap
              }}
            >
              {row.skills.map((skill) => (
                <motion.div
                  key={skill.name}
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  whileHover={{ scale: 1.05, zIndex: 20 }}
                  className={`
                    relative group flex flex-col items-center justify-center 
                    w-16 h-16 sm:w-24 sm:h-24 md:w-36 md:h-36 lg:w-44 lg:h-44 
                    bg-black border-[1.5px] md:border-2 transition-all duration-300
                    ${skill.highlight
                      ? 'border-red-600 shadow-[4px_4px_0px_#dc2626] md:shadow-[8px_8px_0px_#dc2626]'
                      : 'border-orange-500/30 hover:border-orange-500 shadow-[4px_4px_0px_rgba(249,115,22,0.1)] md:shadow-[8px_8px_0px_rgba(249,115,22,0.15)]'
                    }
                  `}
                  style={{
                    clipPath: 'polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)'
                  }}
                >
                  <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 transition-colors pointer-events-none" />
                  <div className="absolute top-1 md:top-2 left-4 md:left-8 w-2 md:w-4 h-[1px] bg-orange-500/20" />

                  <div className={`
                    mb-1 md:mb-3 transition-all duration-300
                    ${skill.highlight ? 'text-red-500' : 'text-orange-500'}
                    group-hover:scale-110
                  `}>
                    <div
                      className={`
    mb-1 md:mb-3 transition-all duration-300
    group-hover:scale-110
  `}
                    >
                      <img
                        src={skill.image}
                        alt={skill.name}
                        className="w-5 h-5 md:w-8 md:h-8 object-contain"
                      />
                    </div>

                  </div>

                  <span className={`
                    font-bold text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs tracking-tighter sm:tracking-widest uppercase text-center px-1 
                    ${skill.highlight ? 'text-red-500' : 'text-orange-400 group-hover:text-orange-500'}
                  `}>
                    {skill.name}
                  </span>

                  {skill.highlight && (
                    <div className="absolute top-1 right-2 md:top-3 md:right-5">
                      <Zap size={12} className="text-red-500 fill-red-500 animate-pulse hidden sm:block" />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ))}
        </motion.div>

        {/* Background Scanlines Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] -z-20 opacity-30" />
      </div>
    </section>
  );
};

export default Skill;