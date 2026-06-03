import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import api from '../api';

export default function Careers() {

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get('/careers')
      .then(res => {setJobs(res.data); }) // Override dummy if DB has data
      .catch(err => console.error(err));
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 px-6 overflow-hidden">
        <h1 className="text-6xl md:text-8xl font-black text-center text-white mb-16 opacity-20 pointer-events-none select-none">JOIN_THE_GRID</h1>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 relative z-10">
          {jobs.map((job) => (
            <motion.div 
              key={job._id}
              drag dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
              whileHover={{ scale: 1.05, rotate: Math.random() * 4 - 2 }}
              whileDrag={{ scale: 1.1, zIndex: 50, cursor: "grabbing" }}
              className="bg-black/60 border border-white/10 rounded-2xl p-8 backdrop-blur-md cursor-grab active:cursor-grabbing hover:border-cyan-500/50 shadow-xl pointer-events-auto"
            >
              <span className="text-xs font-mono text-cyan-400 tracking-widest border border-cyan-400/30 px-2 py-1 rounded-full mb-4 inline-block">{job.tag}</span>
              <h2 className="text-3xl font-bold text-white mb-4 leading-tight">{job.title}</h2>
              <p className="text-gray-400 mb-8">{job.desc}</p>
              
              <Link to={`/requirements?id=${job._id}`}>
                <button className="text-sm font-bold text-white border-b border-transparent hover:border-white transition-colors pb-1">
                  View Requirements -{'>'}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}