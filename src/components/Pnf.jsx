import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Home, ChevronRight } from 'lucide-react';

const Pnf = () => {
  const [lines, setLines] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const terminalSequence = [
    { text: "Initializing kernel recovery...", delay: 400, type: "info" },
    { text: "Scanning sector 0x404... [FAILED]", delay: 600, type: "error" },
    { text: "Locating '/requested-resource'...", delay: 400, type: "info" },
    { text: "> ERROR: NULL_POINTER", delay: 300, type: "error" },
    { text: "> STATUS: 404_NOT_FOUND", delay: 200, type: "warning" },
    { text: "---", delay: 150, type: "divider" },
    { text: "Suggested actions:", delay: 400, type: "info" },
    { text: "1. Check syntax", delay: 150, type: "item" },
    { text: "2. Reconnect to Home", delay: 150, type: "item" },
    { text: "---", delay: 200, type: "divider" },
    { text: "root@portfolio:~# _", delay: 800, type: "prompt" }
  ];

  useEffect(() => {
    let currentLineIndex = 0;
    let timeoutId;

    const addLine = () => {
      if (currentLineIndex < terminalSequence.length) {
        const nextLine = terminalSequence[currentLineIndex];
        setLines(prev => [...prev, nextLine]);
        currentLineIndex++;
        
        if (currentLineIndex < terminalSequence.length) {
          timeoutId = setTimeout(addLine, terminalSequence[currentLineIndex - 1].delay);
        } else {
          setIsComplete(true);
        }
      }
    };

    addLine();
    return () => { if (timeoutId) clearTimeout(timeoutId); };
  }, []);

  return (
    <div className="h-screen w-full bg-[#050505] text-white flex items-center justify-center p-4 md:p-6 font-mono overflow-hidden select-none">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl h-full max-h-[500px] md:max-h-[600px] bg-[#0a0a0a] border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col relative"
      >
        {/* Terminal Header */}
        <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
          </div>
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold">
            <Terminal size={10} className="text-orange-500" />
            <span>Terminal_v2.0.4</span>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-5 md:p-8 flex flex-col flex-grow overflow-hidden relative">
          <div className="space-y-1 overflow-y-auto no-scrollbar">
            {lines.map((line, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2 text-xs md:text-sm"
              >
                {line.type === 'prompt' ? (
                  <span className="text-orange-500 font-bold">$</span>
                ) : line.type === 'item' ? (
                  <ChevronRight size={12} className="mt-1 text-white/20 shrink-0" />
                ) : null}

                <span className={`
                  ${line.type === 'error' ? 'text-red-400' : ''}
                  ${line.type === 'warning' ? 'text-orange-400' : ''}
                  ${line.type === 'divider' ? 'text-white/10' : 'text-white/60'}
                  ${line.type === 'prompt' ? 'text-orange-500' : ''}
                  break-all
                `}>
                  {line.text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isComplete ? 1 : 0 }}
            className="mt-auto pt-6 flex justify-start"
          >
            <button 
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-xs font-black hover:bg-orange-500 transition-all active:scale-95 group shadow-xl"
            >
              <Home size={14} />
              <span>EXIT_TO_HOME</span>
            </button>
          </motion.div>
        </div>

        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </motion.div>

      {/* Static Branding */}
      <div className="fixed bottom-6 text-[8px] md:text-[10px] font-mono text-white/10 uppercase tracking-[0.5em] text-center w-full px-4">
        Connection Status: Offline // Auth_Required
      </div>
    </div>
  );
};

export default Pnf;