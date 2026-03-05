import { motion } from 'framer-motion';

export default function PageTransition({ children }) {
  return (
    <>
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[100] bg-cyan-900 origin-top flex items-center justify-center pointer-events-none"
      >
        <span className="text-5xl font-black text-white mix-blend-overlay animate-pulse">LOADING_DATA...</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, y: -50, rotateX: -20 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ perspective: '1000px' }}
      >
        {children}
      </motion.div>
    </>
  );
}