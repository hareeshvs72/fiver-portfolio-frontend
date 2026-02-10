import React, { useState, useEffect, useRef } from 'react';
import { Mail, Github, Linkedin, Send, MessageSquare } from 'lucide-react';

/**
 * CONTACT COMPONENT (AURORA ANIMATED VERSION)
 * ------------------------------------------------------------------
 * Theme: Orange & Dark Gray Palette (#0F172A, #F97316)
 * Background: Enhanced with flowing Aurora Borealis effects
 */

const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef(null);

  // Intersection Observer for Scroll Reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = containerRef.current.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormState({ name: '', email: '', message: '' });
    }, 1500);
  };

  const socialLinks = [
    { icon: <Github size={20} />, href: "#", label: "GitHub" },
    { icon: <Linkedin size={20} />, href: "#", label: "LinkedIn" },
    { icon: <Mail size={20} />, href: "mailto:hello@example.com", label: "Email" }
  ];

  return (
    <section 
      ref={containerRef}
      id="contact" 
      className="relative min-h-screen w-full bg-[#0F172A] flex flex-col items-center py-24 px-6 overflow-hidden selection:bg-[#F97316]/40"
    >
      
      {/* --- AURORA BACKGROUND ANIMATION --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Deep Base Aurora */}
        <div className="absolute -top-[20%] -left-[10%] w-[120%] h-[120%] opacity-30 bg-[#0F172A]" />
        
        {/* Primary Flowing Aurora - Orange */}
        <div className="aurora-layer aurora-1" />
        
        {/* Secondary Flowing Aurora - Indigo */}
        <div className="aurora-layer aurora-2" />
        
        {/* Accent Flowing Aurora - Amber */}
        <div className="aurora-layer aurora-3" />
        
        {/* Grainy Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-[#F97316] animate-float"
            style={{
              width: `${Math.random() * 3 + 2}px`,
              height: `${Math.random() * 3 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 12 + 8}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4 reveal reveal-up">
          <span className="text-[#F97316] font-mono text-xs uppercase tracking-[0.4em] font-bold inline-block animate-bounce-subtle">
            Get In Touch
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-tight">
            Let's <span className="text-transparent stroke-text italic font-light">Connect</span>
          </h2>
          <p className="text-slate-400 max-w-md mx-auto text-lg font-light">
            Have a project in mind or just want to say hi? Feel free to reach out.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Contact Info Card */}
          <div className="lg:col-span-4 flex flex-col gap-6 reveal reveal-left">
            <div className="flex-1 p-8 rounded-[2.5rem] bg-[#1F2933]/30 border border-white/5 backdrop-blur-3xl flex flex-col justify-between shadow-2xl group/card relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#F97316]/5 rounded-full blur-3xl group-hover/card:bg-[#F97316]/10 transition-colors duration-500" />
              
              <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-[#F97316]/10 flex items-center justify-center text-[#F97316] group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Chat with me</p>
                    <p className="text-white font-medium">hareesh_vs</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-[#F97316]/10 flex items-center justify-center text-[#F97316] group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Email me</p>
                    <p className="text-white font-medium">hareesh@example.com</p>
                  </div>
                </div>
              </div>

              <div className="pt-12 relative z-10">
                <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">Follow me</p>
                <div className="flex gap-3">
                  {socialLinks.map((link, i) => (
                    <a 
                      key={i} 
                      href={link.href}
                      className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#F97316] hover:border-[#F97316]/50 hover:bg-[#F97316]/5 hover:-translate-y-1 transition-all duration-300"
                      aria-label={link.label}
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-8 reveal reveal-right">
            <form 
              onSubmit={handleSubmit}
              className="p-8 md:p-12 rounded-[2.5rem] bg-[#1F2933]/30 border border-white/5 backdrop-blur-3xl space-y-8 shadow-2xl relative group/form"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 group/input">
                  <label className="text-[10px] font-mono text-[#F97316] uppercase tracking-[0.2em] ml-1 transition-all group-focus-within/input:translate-x-1">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#F97316]/50 focus:ring-1 focus:ring-[#F97316]/20 transition-all hover:bg-black/30"
                  />
                </div>
                <div className="space-y-2 group/input">
                  <label className="text-[10px] font-mono text-[#F97316] uppercase tracking-[0.2em] ml-1 transition-all group-focus-within/input:translate-x-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                    placeholder="john@example.com"
                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#F97316]/50 focus:ring-1 focus:ring-[#F97316]/20 transition-all hover:bg-black/30"
                  />
                </div>
              </div>

              <div className="space-y-2 group/input">
                <label className="text-[10px] font-mono text-[#F97316] uppercase tracking-[0.2em] ml-1 transition-all group-focus-within/input:translate-x-1">Your Message</label>
                <textarea 
                  required
                  rows="5"
                  value={formState.message}
                  onChange={(e) => setFormState({...formState, message: e.target.value})}
                  placeholder="Tell me about your project..."
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#F97316]/50 focus:ring-1 focus:ring-[#F97316]/20 transition-all resize-none hover:bg-black/30"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-10 py-5 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-2xl transition-all group flex items-center justify-center gap-3 shadow-lg shadow-[#F97316]/20 disabled:opacity-50 overflow-hidden relative active:scale-95"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="uppercase tracking-widest text-xs relative z-10">Send Message</span>
                    <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative z-10" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>

      <style>{`
        .stroke-text { -webkit-text-stroke: 1px rgba(255,255,255,0.1); }
        
        /* Aurora Layers */
        .aurora-layer {
          position: absolute;
          filter: blur(100px);
          opacity: 0.5;
          mix-blend-mode: screen;
          width: 150%;
          height: 150%;
          top: -25%;
          left: -25%;
          border-radius: 40%;
        }

        .aurora-1 {
          background: radial-gradient(circle at 20% 30%, #F97316 0%, transparent 50%);
          animation: aurora-move 20s ease-in-out infinite alternate;
        }

        .aurora-2 {
          background: radial-gradient(circle at 80% 70%, #312E81 0%, transparent 50%);
          animation: aurora-move 25s ease-in-out infinite alternate-reverse;
          opacity: 0.3;
        }

        .aurora-3 {
          background: radial-gradient(circle at 50% 50%, #F59E0B 0%, transparent 40%);
          animation: aurora-move 30s ease-in-out infinite alternate;
          opacity: 0.2;
        }

        @keyframes aurora-move {
          0% { transform: rotate(0deg) translate(2%, 5%) scale(1); }
          50% { transform: rotate(5deg) translate(-5%, 2%) scale(1.1); }
          100% { transform: rotate(-5deg) translate(5%, -5%) scale(1); }
        }

        /* Standard Reveals */
        .reveal {
          opacity: 0;
          filter: blur(8px);
          transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.is-visible {
          opacity: 1;
          filter: blur(0);
          transform: translate(0, 0) scale(1);
        }
        .reveal-up { transform: translateY(40px); }
        .reveal-left { transform: translateX(-40px); }
        .reveal-right { transform: translateX(40px); }

        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-10px); }
        }
        .animate-shimmer { animation: shimmer 1.5s infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 3s ease-in-out infinite; }
        .animate-float { animation: float ease-in-out infinite; }
      `}</style>
    </section>
  );
};

export default Contact;