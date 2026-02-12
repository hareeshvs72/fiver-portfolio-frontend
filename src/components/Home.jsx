import React, { useRef, useEffect } from 'react';

/* ------------------------------------------------------------------
   WEBGL SHADER SOURCE (STABLE NATIVE VERSION)
   ------------------------------------------------------------------ */

const vertexShaderSource = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;

  void main() {
    float pixelSize = 4.0;
    vec2 pUv = floor(gl_FragCoord.xy / pixelSize) * pixelSize / uResolution;
    
    float wave = sin(pUv.x * 12.0 + uTime * 0.5) * 0.5 + 0.5;
    wave *= cos(pUv.y * 10.0 - uTime * 0.3) * 0.5 + 0.5;
    
    vec2 mPos = uMouse / uResolution;
    float dist = length(vUv - vec2(mPos.x, 1.0 - mPos.y));
    float focus = 1.0 - smoothstep(0.0, 0.5, dist);
    
    float final = clamp(wave + focus * 0.5, 0.0, 1.0);
    
    float x = mod(gl_FragCoord.x / pixelSize, 4.0);
    float y = mod(gl_FragCoord.y / pixelSize, 4.0);
    int index = int(y) * 4 + int(x);
    float limit = 0.0;
    
    if (index == 0) limit = 0.0625; else if (index == 1) limit = 0.5625;
    else if (index == 2) limit = 0.1875; else if (index == 3) limit = 0.6875;
    else if (index == 4) limit = 0.8125; else if (index == 5) limit = 0.3125;
    else if (index == 6) limit = 0.9375; else if (index == 7) limit = 0.4375;
    else if (index == 8) limit = 0.25; else if (index == 9) limit = 0.75;
    else if (index == 10) limit = 0.125; else if (index == 11) limit = 0.625;
    else if (index == 12) limit = 1.0; else if (index == 13) limit = 0.5;
    else if (index == 14) limit = 0.875; else if (index == 15) limit = 0.375;

    vec3 colorA = vec3(0.01, 0.02, 0.03); 
    vec3 colorB = vec3(0.4, 0.15, 0.05);
    vec3 color = (final > limit) ? colorB : colorA;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

const Home = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const createShader = (gl, type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexShaderSource));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'uTime');
    const uResolution = gl.getUniformLocation(program, 'uResolution');
    const uMouse = gl.getUniformLocation(program, 'uMouse');

    let animationFrame;
    const render = (time) => {
      const width = canvas.parentElement.clientWidth;
      const height = canvas.parentElement.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.uniform1f(uTime, time * 0.001);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrame = requestAnimationFrame(render);
    };
    animationFrame = requestAnimationFrame(render);

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen w-full bg-[#010203] overflow-x-hidden flex flex-col items-center justify-center py-20 lg:py-0 selection:bg-orange-500 selection:text-white">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-70 w-full h-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pointer-events-none">
        <div className="lg:col-span-8 flex flex-col items-start order-2 lg:order-1">
          <div className="pointer-events-auto flex items-center gap-3 mb-6 lg:mb-8 animate-enter" style={{ animationDelay: '0.1s' }}>
            <span className="px-2 py-0.5 border border-orange-500/50 text-orange-500 rounded text-[9px] font-mono tracking-tighter">
              FULLSTACK_ENGINEER
            </span>
            <span className="text-slate-500 font-mono tracking-widest text-[10px] hidden sm:inline">
              {">"} ENV: MERN + MEAN HYBRID
            </span>
          </div>

          <h1 className="pointer-events-auto text-[16vw] sm:text-[14vw] lg:text-[8rem] font-black tracking-tighter text-white leading-[0.8] mb-6 lg:mb-8 uppercase">
            Fullstack<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-red-600">Architect</span>
            <span className="text-orange-500 font-mono opacity-50">_</span>
          </h1>

          <div className="pointer-events-auto max-w-xl animate-enter" style={{ animationDelay: '0.3s' }}>
            <p className="text-slate-400 text-base md:text-xl leading-relaxed mb-8 lg:mb-10 font-medium">
              Specializing in both <span className="text-white">React (MERN)</span> and <span className="text-white">Angular (MEAN)</span> ecosystems. I bridge the gap between high-performance backends and intuitive, scalable frontends.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full sm:w-auto">
            <a href='https://github.com/hareeshvs72' target='_blank' className="relative z-10 ">
                <button className="group relative px-8 py-4 overflow-hidden rounded-lg bg-orange-600 text-white font-mono font-bold text-xs transition-all cursor-crosshair hover:shadow-[0_0_40px_rgba(234,88,12,0.3)] active:scale-95 text-center sm:text-left">
                  $ view_repositories
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
            </a>
              <button  >

                <a
                  className="group px-8 py-4 rounded-lg border border-white/10 text-slate-300 font-mono font-bold text-xs transition-all hover:bg-white/5 active:scale-95 text-center sm:text-left"
                  href="/Hareesh_Vs.pdf"
                  download
                >
                  download_cv.pdf

                </a>

              </button>
            </div>
          </div>
        </div>

        {/* Technical Column */}
        <div className="lg:col-span-4 flex flex-col gap-8 lg:gap-10 lg:pl-12 lg:border-l border-white/5 animate-fade-in order-1 lg:order-2" style={{ animationDelay: '0.6s' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
            <div>
              <h4 className="text-orange-500 font-mono text-[10px] uppercase tracking-widest mb-4">// mern_stack</h4>
              <div className="flex flex-wrap gap-2 text-slate-400 font-mono text-[10px]">
                <span className="px-2 py-1 bg-white/5 rounded">MongoDB</span>
                <span className="px-2 py-1 bg-white/5 rounded">Express</span>
                <span className="px-2 py-1 bg-white/5 rounded text-orange-200 border border-orange-500/20">React</span>
                <span className="px-2 py-1 bg-white/5 rounded">Node.js</span>
              </div>
            </div>
            <div>
              <h4 className="text-orange-500 font-mono text-[10px] uppercase tracking-widest mb-4">// mean_stack</h4>
              <div className="flex flex-wrap gap-2 text-slate-400 font-mono text-[10px]">
                <span className="px-2 py-1 bg-white/5 rounded">MongoDB</span>
                <span className="px-2 py-1 bg-white/5 rounded">Express</span>
                <span className="px-2 py-1 bg-white/5 rounded text-red-400 border border-red-500/20">Angular</span>
                <span className="px-2 py-1 bg-white/5 rounded">Node.js</span>
              </div>
            </div>
          </div>
          {/* devops */}
          {/* <div className="hidden sm:block">
            <h4 className="text-orange-500 font-mono text-[10px] uppercase tracking-widest mb-2">// dev_ops</h4>
            <p className="text-slate-300 font-mono text-xs">Docker, AWS, Firebase, CI/CD Pipelines</p>
          </div> */}
        </div>
      </div>

      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.05]"
        style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      {/* Responsive Footer Info */}
      <div className="absolute bottom-6 left-6 right-6 lg:left-10 lg:right-10 flex flex-col sm:flex-row justify-between items-center gap-4 pointer-events-none animate-fade-in" style={{ animationDelay: '1.2s' }}>
        <div className="flex gap-4 lg:gap-8 items-center">
          <div className="flex flex-col">
            <span className="text-slate-700 text-[8px] font-mono tracking-widest">ARCHITECTURE</span>
            <span className="text-slate-500 text-[10px] font-mono tracking-tighter">Dual-Stack Proficiency</span>
          </div>
        </div>
        <div className="text-slate-600 text-[9px] font-mono tracking-[0.2em] lg:tracking-[0.3em] text-center">
          JS_ECOSYSTEM_SPECIALIST
        </div>
      </div>

      <style>{`
        @keyframes enter {
          from { opacity: 0; transform: translateY(20px); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-enter { animation: enter 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
        .animate-fade-in { animation: fade-in 1.5s ease-out forwards; opacity: 0; }
      `}</style>
    </section>
  );
};

export default Home;