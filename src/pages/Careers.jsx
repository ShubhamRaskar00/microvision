import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

export default function Careers() {
  const jobs = [
    { title: "Senior React Architect", tag: "SOFTWARE", desc: "Build complex 3D web environments." },
    { title: "Industrial LED Technician", tag: "HARDWARE", desc: "Solder, repair, and deploy massive P6 outdoor matrices." },
    { title: "Borewell Panel Engineer", tag: "HARDWARE", desc: "Diagnosis and logic repair for deep-water pump panels." },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 px-6 overflow-hidden">
        <h1 className="text-6xl md:text-8xl font-black text-center text-white mb-16 opacity-20 pointer-events-none select-none">JOIN_THE_GRID</h1>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 relative z-10">
          {jobs.map((job, idx) => (
            <motion.div 
              key={idx}
              drag
              dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
              whileHover={{ scale: 1.05, rotate: Math.random() * 4 - 2 }}
              whileDrag={{ scale: 1.1, zIndex: 50, cursor: "grabbing" }}
              className="bg-black/60 border border-white/10 rounded-2xl p-8 backdrop-blur-md cursor-grab active:cursor-grabbing hover:border-cyan-500/50 shadow-xl"
            >
              <span className="text-xs font-mono text-cyan-400 tracking-widest border border-cyan-400/30 px-2 py-1 rounded-full mb-4 inline-block">{job.tag}</span>
              <h2 className="text-3xl font-bold text-white mb-4 leading-tight">{job.title}</h2>
              <p className="text-gray-400 mb-8">{job.desc}</p>
              
              <button className="text-sm font-bold text-white border-b border-transparent hover:border-white transition-colors pb-1">
                View Requirements -{'>'}
              </button>
            </motion.div>
          ))}
        </div>
        
        <p className="text-center text-gray-500 mt-20 font-mono text-sm animate-pulse">
          [ Drag cards to interact with physics engine ]
        </p>
      </div>
    </PageTransition>
  );
}