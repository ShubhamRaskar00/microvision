import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { Link } from 'react-router-dom';

export default function Requirements() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-32 px-6 text-white">
        
        <h1 className="text-5xl md:text-7xl font-black text-center mb-16 opacity-20">
          REQUIREMENTS
        </h1>

        <div className="max-w-4xl mx-auto space-y-10">

          {/* Job 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/60 border border-white/10 rounded-2xl p-8 backdrop-blur-md"
          >
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">
              Senior React Architect
            </h2>
            <ul className="list-disc pl-5 text-gray-300 space-y-2">
              <li>Strong knowledge of React & Three.js</li>
              <li>Experience with animations (Framer Motion)</li>
              <li>Ability to build scalable UI systems</li>
            </ul>
          </motion.div>

          {/* Job 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/60 border border-white/10 rounded-2xl p-8 backdrop-blur-md"
          >
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">
              Industrial LED Technician
            </h2>
            <ul className="list-disc pl-5 text-gray-300 space-y-2">
              <li>Experience in LED module repair</li>
              <li>Soldering & troubleshooting skills</li>
              <li>On-site installation capability</li>
            </ul>
          </motion.div>

          {/* Job 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/60 border border-white/10 rounded-2xl p-8 backdrop-blur-md"
          >
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">
              Borewell Panel Engineer
            </h2>
            <ul className="list-disc pl-5 text-gray-300 space-y-2">
              <li>Electrical panel troubleshooting</li>
              <li>Knowledge of motor control systems</li>
              <li>Field repair experience</li>
            </ul>
          </motion.div>

        </div>

        {/* CONTACT SECTION */}
        <div className="max-w-4xl mx-auto mt-20 text-center">

          <h2 className="text-2xl font-bold text-cyan-400 mb-6">
            Contact Us
          </h2>

          <div className="flex flex-col md:flex-row justify-center gap-6">

            <a href="tel:7709861765">
              <button className="px-6 py-3 rounded-xl border border-white/20 hover:border-cyan-400 hover:text-cyan-400 transition">
                📞 Call Now
              </button>
            </a>

            <a href="mailto:shubhamraskar69@gmail.com">
              <button className="px-6 py-3 rounded-xl border border-white/20 hover:border-cyan-400 hover:text-cyan-400 transition">
                ✉️ Send Email
              </button>
            </a>

            <a href="https://microvision.shop" target="_blank" rel="noopener noreferrer">
              <button className="px-6 py-3 rounded-xl border border-white/20 hover:border-cyan-400 hover:text-cyan-400 transition">
                🌐 Visit Website
              </button>
            </a>

          </div>

          <p className="text-gray-500 text-sm mt-6 font-mono">
            [ Response time: within 24 hours ]
          </p>

        </div>

        {/* BACK BUTTON */}
        <div className="text-center mt-16">
          <Link to="/careers">
            <button className="border px-6 py-2 rounded-lg hover:bg-white hover:text-black transition">
              ← Back to Careers
            </button>
          </Link>
        </div>

      </div>
    </PageTransition>
  );
}