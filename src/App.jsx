import { useEffect, useState  } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import your components and pages
import ThreeBackground from './components/ThreeBackground';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import Gallery from './pages/Gallery';
import Careers from './pages/Careers';
import Contact from './pages/Contact';

gsap.registerPlugin(ScrollTrigger);

// Inside App.jsx -> Replace old Navbar with this:
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const links = [
    { name: 'HOME', path: '/' },
    { name: 'CALCULATOR', path: '/calculator' },
    { name: 'GALLERY', path: '/gallery' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }} animate={{ y: 0 }} transition={{ type: "spring", bounce: 0.2 }}
      className="fixed w-full top-4 z-50 px-4 sm:px-6 pointer-events-none"
    >
      <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-auto flex justify-between items-center px-6 py-3">
        
        <Link to="/" className="relative group overflow-hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-orange-500 shadow-[0_0_15px_rgba(34,197,94,0.5)] animate-pulse"></div>
          <span className="text-xl font-black tracking-tighter text-white">
            Micro<span className="text-orange-500">Vision</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 text-sm font-bold tracking-widest text-gray-300">
          {links.map((link, idx) => (
            <Link key={idx} to={link.path} className="relative group py-2 hover:text-white transition-colors duration-300">
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-orange-500 to-green-500 group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white p-2">
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="md:hidden absolute top-20 left-4 right-4 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4 pointer-events-auto"
          >
            {links.map((link, idx) => (
              <Link key={idx} to={link.path} onClick={() => setIsOpen(false)} className="text-lg font-bold text-white border-b border-white/5 pb-2">
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// --- CREATIVE FOOTER ---
const Footer = () => (
  <footer className="relative bg-[#020502]/80 border-t border-green-900/30 text-gray-400 pt-20 pb-10 overflow-hidden backdrop-blur-lg mt-20 pointer-events-auto">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>
    <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-green-600/10 rounded-full blur-[120px] pointer-events-none"></div>

    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 relative z-10 text-center md:text-left">
      
      {/* Brand Column */}
      <div>
        <h3 className="text-3xl font-black text-white mb-2 tracking-tighter">
          Micro<span className="text-orange-500">Vision</span>
        </h3>
        <p className="text-sm font-bold text-green-500 mb-4 tracking-widest uppercase">Innovative Tech Solutions</p>
        <p className="text-sm leading-relaxed text-gray-400 font-mono">
          Professional LED display providers in Khopoli, Maharashtra.<br/>
          Hardware architecture, Video Walls & Display Maintenance.
        </p>
      </div>

      {/* Links Column */}
      <div className="flex flex-col space-y-3 font-mono text-sm items-center md:items-start">
        <span className="text-white font-bold tracking-widest uppercase mb-2">Systems</span>
        <Link to="/calculator" className="hover:text-orange-400 transition-colors hover:translate-x-2 inline-block transform duration-300">Hardware Configurator</Link>
        <Link to="/gallery" className="hover:text-orange-400 transition-colors hover:translate-x-2 inline-block transform duration-300">Visual Matrix</Link>
        <Link to="/contact" className="hover:text-orange-400 transition-colors hover:translate-x-2 inline-block transform duration-300">Initiate Contact</Link>
      </div>

      {/* Contact Info Column */}
      <div className="flex flex-col space-y-3 font-mono text-sm items-center md:items-end md:text-right">
        <span className="text-white font-bold tracking-widest uppercase mb-2">Headquarters</span>
        <a href="tel:+917709861765" className="hover:text-green-400 transition-colors text-lg font-bold text-white">
          +91 7709861765
        </a>
        <a href="mailto:shubhamraskar69@gmail.com" className="hover:text-orange-400 transition-colors">
          shubhamraskar69@gmail.com
        </a>
        <p className="text-gray-400 max-w-[250px] mt-2 leading-relaxed">
          Shop No 1, Riviera Estates CHS (Omega Building), Khopoli, MH 410203
        </p>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs font-mono">
      <p>© {new Date().getFullYear()} MICROVISION. ALL SYSTEMS NOMINAL.</p>
      <div className="flex space-x-4 mt-4 md:mt-0 text-green-500 font-bold">
        <span>[ STATUS: ONLINE ]</span>
      </div>
    </div>
  </footer>
);
// --- ANIMATED ROUTES WRAPPER ---
// We extract this to use `useLocation` which must be inside a <Router>
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    // AnimatePresence handles the 3D unmounting logic when pages change
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AnimatePresence>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  useEffect(() => {
    // Initialize Physics-based Smooth Scrolling (Lenis)
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    return () => { lenis.destroy(); gsap.ticker.remove(lenis.raf); };
  }, []);

  return (
    <Router>
      <div className="relative font-sans text-gray-100 min-h-screen selection:bg-orange-500 selection:text-black">
        {/* Global 3D Physics Background */}
        <ThreeBackground />
        
        {/* Navigation Layer */}
        <Navbar />
        
        {/* Page Content Layer */}
        <main className="relative z-10 w-full flex flex-col justify-between pt-20">
          <AnimatedRoutes />
          <Footer />
        </main>
      </div>
    </Router>
  );
}