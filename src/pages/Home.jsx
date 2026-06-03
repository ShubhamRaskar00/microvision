import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import api from '../api';

gsap.registerPlugin(ScrollTrigger);

// --- ANIMATED COUNT UP COMPONENT ---
const AnimatedNumber = ({ value, suffix }) => {
  const nodeRef = useRef();
  
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    
    // Animate from 0 to target value when in view
    const controls = animate(0, value, {
      duration: 2.5,
      ease: "easeOut",
      onUpdate(v) { node.textContent = Math.round(v) + (suffix || ""); }
    });
    return () => controls.stop();
  }, [value, suffix]);

  return <span ref={nodeRef} className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-orange-500">0</span>;
};

// --- SHATTERING LETTER COMPONENT ---
const ShatterLetter = ({ char, isGradient }) => {
  const [isDestroyed, setIsDestroyed] = useState(false);
  const shatterX = (Math.random() - 0.5) * 800;
  const shatterY = (Math.random() - 0.5) * 800;
  const shatterRotate = (Math.random() - 0.5) * 720;

  return (
    <motion.span
      onClick={() => setIsDestroyed(true)}
      whileHover={!isDestroyed ? { scale: 1.3, y: -15, rotate: (Math.random() - 0.5) * 30 } : {}}
      animate={isDestroyed ? { x: shatterX, y: shatterY, rotate: shatterRotate, opacity: 0, scale: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
      transition={{ duration: isDestroyed ? 0.8 : 0.2, type: isDestroyed ? "tween" : "spring" }}
      className={`inline-block cursor-crosshair transition-colors duration-300 ${isGradient ? 'text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-green-500' : 'text-white hover:text-green-400'}`}
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
};

// --- PHYSICS CARD ---
const PhysicsCard = ({ title, color, desc, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove} onMouseLeave={() => { x.set(0); y.set(0); }}
      className="reveal-card relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl cursor-pointer group shadow-2xl"
    >
      <div style={{ transform: "translateZ(60px)" }} className="relative z-10">
        <h3 className="text-2xl font-black text-white mb-4">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
};

// --- MAIN HOME COMPONENT ---
export default function Home() {
  const scrollRef = useRef(null);
  const [stats, setStats] = useState([{ label: "Active Displays", value: 300, suffix: "+" }, { label: "Happy Clients", value: 50, suffix: "+" }]);
  const [clients, setClients] = useState([]);
  const [technologies, setTechnologies] = useState([]);

  useEffect(() => {
    // Fetch dynamic backend data
    api.get('/stats').then(res => res.data.length && setStats(res.data)).catch(console.error);
    api.get('/clients').then(res => setClients(res.data)).catch(console.error);
    api.get('/technologies').then(res => setTechnologies(res.data)).catch(console.error);

    // Scroll reveal animation
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal-card').forEach((card) => {
        gsap.from(card, { scrollTrigger: { trigger: card, start: "top 85%" }, y: 80, opacity: 0, duration: 1, ease: "power4.out" });
      });
    }, scrollRef);
    return () => ctx.revert();
  }, []);

  return (
    <PageTransition>
      <div ref={scrollRef} className="w-full overflow-hidden">
        
        {/* === HERO SECTION === */}
        <div className="min-h-[90vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 relative pt-20">
          <motion.div initial={{ scale: 0.8, filter: "blur(10px)", opacity: 0 }} animate={{ scale: 1, filter: "blur(0px)", opacity: 1 }} transition={{ duration: 1.2 }}>
            
            <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-black tracking-tighter flex flex-col md:flex-row items-center justify-center md:gap-6 leading-none mb-4 z-10 relative">
              <div className="flex drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                {"MICRO".split("").map((char, i) => <ShatterLetter key={'m'+i} char={char} isGradient={false} />)}
              </div>
              <div className="flex drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                {"VISION".split("").map((char, i) => <ShatterLetter key={'v'+i} char={char} isGradient={true} />)}
              </div>
            </h1>
            
            {/* RESTORED SUBTITLE */}
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-lg sm:text-2xl md:text-3xl text-green-400 mt-4 font-bold tracking-widest uppercase px-2 text-shadow-sm">
              Innovative Tech Solutions <br className="md:hidden"/> for Modern Needs
            </motion.p>
            <p className="text-xs text-gray-500 font-mono tracking-widest mt-6 animate-pulse">[ Click letters to shatter systems ]</p>
          </motion.div>
        </div>

        {/* === EXPERTISE & CARDS === */}
        <div className="py-24 sm:py-32 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24 reveal-card">
              <p className="text-orange-500 font-mono tracking-[0.4em] uppercase mb-4 text-xs sm:text-sm font-bold">Our Expertise</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
                Empowering Khopoli & Beyond <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-orange-400">With Next-Gen Hardware.</span>
              </h2>
              {/* RESTORED PARAGRAPH */}
              <p className="mt-8 text-gray-400 max-w-3xl mx-auto text-lg sm:text-xl leading-relaxed font-light">
                As Maharashtra's premier professional LED solution provider, we handle everything from physical display manufacturing to complex software architecture and industrial logic repair.
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-10 perspective-[2000px] mb-32">
              <PhysicsCard index={0} title="Commercial LED" color="orange" desc="High-brightness P10 & P6 displays engineered to survive extreme outdoor industrial environments." />
              <PhysicsCard index={1} title="Video Walls" color="green" desc="Ultra-HD indoor matrices (P1.5 - P4) designed for high-end weddings, and command centers." />
              <PhysicsCard index={2} title="Panel Repair" color="orange" desc="Component-level diagnosis, logic correction, and repair for deep-water borewell panels." />
              <PhysicsCard index={3} title="Web Architecture" color="green" desc="Full-stack software engineering. We build the stunning digital environments for your displays." />
            </div>

            {/* === NEW ABOUT US SECTION === */}
            <div className="mb-40 reveal-card grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-orange-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <img src="https://5.imimg.com/data5/SELLER/Default/2025/7/527471155/MS/QV/SS/133440862/indoor-lead-video-wall-manufacturer-in-delhi.png" alt="About MicroVision" className="relative rounded-3xl border border-white/10 shadow-2xl object-cover h-[500px] w-full" />
              </div>
              <div>
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">ABOUT <span className="text-orange-500">US</span></h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  At Micro Vision, we specialize in high-performance LED display manufacturing and industrial automation systems. With over 3 years of hands-on expertise in advanced hardware integration, we design, assemble, and deliver cutting-edge visual solutions tailored to your business needs.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed border-l-4 border-green-500 pl-4 bg-white/5 py-4 rounded-r-xl">
                  Our modern infrastructure is equipped to handle precision assembly, meticulous custom wiring, and rigorous quality testing. From single-color scrolling boards to massive indoor and outdoor video walls, we ensure every display is built for maximum brightness, durability, and seamless performance.
                </p>
              </div>
            </div>

            {/* === DYNAMIC COUNT-UP SYSTEM STATUS === */}
            <div className="mb-40 bg-black/40 border border-white/5 rounded-3xl p-12 reveal-card relative overflow-hidden text-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
              <h2 className="text-3xl font-bold text-white mb-12 tracking-widest uppercase font-mono">System_Status</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                  <div key={i} className="flex flex-col items-center">
                    {/* The count up component */}
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                    <span className="text-gray-400 mt-2 font-mono uppercase tracking-widest text-sm">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* === SEPARATE CLIENT MARQUEE (IMAGES ONLY) === */}
            {clients.length > 0 && (
              <div className="mb-20 overflow-hidden reveal-card relative">
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#020502] to-transparent z-10"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#020502] to-transparent z-10"></div>
                <h3 className="text-center text-gray-500 font-mono tracking-widest mb-8 text-sm uppercase">Trusted By</h3>
                <div className="flex w-max animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] items-center">
                  {[...clients, ...clients, ...clients].map((client, i) => (
                    <img key={i} src={client.image} alt={client.name} title={client.name} className="mx-10 h-16 md:h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                  ))}
                </div>
              </div>
            )}

            {/* === SEPARATE TECHNOLOGIES MARQUEE (IMAGES ONLY) === */}
            {technologies.length > 0 && (
              <div className="mb-32 overflow-hidden reveal-card relative">
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#020502] to-transparent z-10"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#020502] to-transparent z-10"></div>
                <h3 className="text-center text-gray-500 font-mono tracking-widest mb-8 text-sm uppercase">Technologies We Support</h3>
                <div className="flex w-max animate-[marquee_20s_linear_infinite_reverse] hover:[animation-play-state:paused] items-center">
                  {[...technologies, ...technologies, ...technologies].map((tech, i) => (
                    <img key={i} src={tech.image} alt={tech.name} title={tech.name} className="mx-10 h-16 md:h-20 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-110 transition-transform duration-300" />
                  ))}
                </div>
              </div>
            )}

            {/* === CATALOG DOWNLOAD BANNER === */}
            <motion.div whileHover={{ scale: 1.02 }} className="reveal-card bg-gradient-to-br from-green-900/40 to-orange-900/40 border border-green-500/30 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">OFFICIAL HARDWARE CATALOG</h2>
                <p className="text-gray-300 mb-10 max-w-2xl mx-auto font-mono">Download our latest specifications sheet. Includes technical data for all LED Modules, Video Walls, and Pricing Matrices.</p>
                <a href="/Micro Vision Catlog.pdf" download="MicroVision_Catalog.pdf">
                  <button className="px-10 py-5 bg-white text-black font-black rounded-full hover:bg-green-400 transition-colors shadow-[0_0_40px_rgba(34,197,94,0.3)] flex items-center gap-4 mx-auto group-hover:scale-110 duration-300">
                    <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    DOWNLOAD PDF
                  </button>
                </a>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
      `}</style>
    </PageTransition>
  );
}