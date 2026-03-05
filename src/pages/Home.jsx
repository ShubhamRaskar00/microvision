import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import PageTransition from '../components/PageTransition';

gsap.registerPlugin(ScrollTrigger);

// --- UNEXPECTED 3D MAGNETIC PHYSICS CARD ---
const PhysicsCard = ({ title, color, desc, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for buttery 3D tilt
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  // Map mouse position to 3D rotation angles
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  // Map mouse position to the Glowing Orb's position inside the card
  const glowX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    // Calculate mouse position relative to the card's center
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Set values between -0.5 and 0.5
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    // Snap back to center when mouse leaves
    x.set(0);
    y.set(0);
  };

  // Dynamic Tailwind color classes based on the prop
  const glowColor = color === 'orange' ? 'bg-orange-500/40' : 'bg-green-500/40';
  const borderColor = color === 'orange' ? 'border-orange-500/20' : 'border-green-500/20';
  const iconBg = color === 'orange' ? 'bg-orange-500/10' : 'bg-green-500/10';
  const iconBorder = color === 'orange' ? 'border-orange-500/50' : 'border-green-500/50';
  const textColor = color === 'orange' ? 'text-orange-400' : 'text-green-400';

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`reveal-card relative p-8 rounded-3xl bg-white/5 border ${borderColor} backdrop-blur-xl overflow-hidden cursor-pointer group shadow-2xl`}
    >
      {/* Interactive Glowing Orb following the mouse */}
      <motion.div 
        className={`absolute w-40 h-40 ${glowColor} rounded-full blur-[60px] pointer-events-none z-0`}
        style={{ 
          left: glowX, 
          top: glowY, 
          x: "-50%", 
          y: "-50%",
          opacity: 0,
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* 3D Pop-out Content */}
      <div style={{ transform: "translateZ(60px)" }} className="relative z-10">
        <div className={`w-14 h-14 rounded-full ${iconBg} flex items-center justify-center mb-8 border ${iconBorder} transition-colors group-hover:bg-opacity-30`}>
          <span className={`${textColor} font-mono font-bold tracking-widest`}>0{index + 1}</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 drop-shadow-lg leading-tight">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm sm:text-base font-medium">{desc}</p>
      </div>
    </motion.div>
  );
};


// --- MAIN HOME PAGE COMPONENT ---
export default function Home() {
  const scrollRef = useRef(null);

  useEffect(() => {
    // GSAP Scroll Reveal for cards and headers
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal-card').forEach((card) => {
        gsap.from(card, {
          scrollTrigger: { 
            trigger: card, 
            start: "top 85%", // Triggers when the top of the card hits 85% of viewport height
          },
          y: 80, 
          opacity: 0, 
          duration: 1, 
          ease: "power4.out"
        });
      });
    }, scrollRef);

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  return (
    <PageTransition>
      <div ref={scrollRef} className="w-full">
        
        {/* === HERO SECTION === */}
        <div className="min-h-[90vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 relative pt-20">
          <motion.div 
            initial={{ scale: 0.8, filter: "blur(10px)", opacity: 0 }} 
            animate={{ scale: 1, filter: "blur(0px)", opacity: 1 }} 
            transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
          >
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter flex flex-col md:flex-row items-center justify-center md:gap-4 leading-none mb-4">
              <span className="text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">Micro</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-green-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                Vision
              </span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.4, duration: 0.8 }} 
            className="text-lg sm:text-2xl md:text-3xl text-green-400 mt-4 font-bold tracking-widest uppercase px-2 text-shadow-sm"
          >
            Innovative Tech Solutions <br className="md:hidden"/> for Modern Needs
          </motion.p>

          <motion.div 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.6, duration: 0.8 }} 
            className="mt-12 flex flex-col sm:flex-row gap-6 items-center"
          >
            <Link to="/calculator" className="relative group overflow-hidden px-8 py-4 bg-orange-500 text-white font-black rounded-full transition-transform hover:scale-105 shadow-[0_0_30px_rgba(249,115,22,0.4)] uppercase tracking-widest text-sm">
              <span className="relative z-10">Launch Configurator</span>
              {/* Button sweep effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-green-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0"></div>
            </Link>
            
            <button 
              onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })} 
              className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-colors uppercase tracking-widest text-sm flex items-center gap-2"
            >
              Explore Services <span className="animate-bounce">↓</span>
            </button>
          </motion.div>
        </div>

        {/* === SCROLLABLE DETAILED CONTENT SECTION === */}
        <div className="min-h-screen py-24 sm:py-32 px-4 sm:px-6 ">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-24 reveal-card">
              <p className="text-orange-500 font-mono tracking-[0.4em] uppercase mb-4 text-xs sm:text-sm font-bold">Our Expertise</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
                Empowering Khopoli & Beyond <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-orange-400">With Next-Gen Hardware.</span>
              </h2>
              <p className="mt-8 text-gray-400 max-w-3xl mx-auto text-lg sm:text-xl leading-relaxed font-light">
                As Maharashtra's premier professional LED solution provider, we handle everything from physical display manufacturing to complex software architecture and industrial logic repair.
              </p>
            </div>

            {/* 3D Physics Cards Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-10 perspective-[2000px]">
              <PhysicsCard 
                index={0} 
                title="Commercial LED Boards" 
                color="orange" 
                desc="High-brightness P10 & P6 displays meticulously engineered to survive extreme outdoor industrial environments and severe weather." 
              />
              <PhysicsCard 
                index={1} 
                title="Immersive Video Walls" 
                color="green" 
                desc="Ultra-HD indoor matrices (P1.5 - P4) designed for corporate lobbies, high-end weddings, and mission-critical command centers." 
              />
              <PhysicsCard 
                index={2} 
                title="Industrial Panel Repair" 
                color="orange" 
                desc="Expert component-level diagnosis, logic correction, and repair for deep-water borewell panels and custom circuitry." 
              />
              <PhysicsCard 
                index={3} 
                title="Web Architecture" 
                color="green" 
                desc="Full-stack software engineering. We build the stunning, dynamic digital environments that connect to your physical displays." 
              />
            </div>

          </div>
        </div>
        
      </div>
    </PageTransition>
  );
}