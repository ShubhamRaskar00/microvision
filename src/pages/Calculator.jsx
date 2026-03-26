import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

export default function Calculator() {
  const [width, setWidth] = useState(6);
  const [height, setHeight] = useState(4);
  const [ledType, setLedType] = useState('P10');
  const [p10Color, setP10Color] = useState('RED');

  const calculateLEDPrice = () => {
    const area = width * height;
    const oneRedSqft = 1600;
    const halfRedSqft = 1000;
    const oneRGBSqft = 2100;
    const halfRGBSqft = 1200;

    if (area <= 0) return 0;
    const fullSqft = Math.floor(area);
    const hasHalfSqft = area % 1 !== 0;

    if (ledType === 'P10') {
      if (p10Color === 'RED') return (fullSqft * oneRedSqft) + (hasHalfSqft ? halfRedSqft : 0);
      return (fullSqft * oneRGBSqft) + (hasHalfSqft ? halfRGBSqft : 0);
    }
    const rates = { 'P6': 3200, 'P5': 4000, 'P4': 4000, 'P3': 5000, 'P2.5': 8000, 'P1.5': 9000 };
    return area * rates[ledType];
  };

  const isP10 = ledType === 'P10';
  const area = width * height;

  const getSuggestion = () => {
    if (area < 15 && ['P10', 'P6'].includes(ledType)) {
      return { text: "For displays under 15 sq ft, P4 or P3 is highly recommended for crystal clear text readability at close distances.", type: "warning" };
    }
    if (area > 100 && ['P1.5', 'P2.5', 'P3'].includes(ledType)) {
      return { text: "For massive outdoor displays, P5 or P6 provides stunning quality while being highly cost-effective.", type: "warning" };
    }
    return { text: "Excellent configuration! This pixel pitch is perfectly suited for your selected dimensions.", type: "success" };
  };

  const suggestion = getSuggestion();

  // --- LED HARDWARE PHYSICS (Dot Size Mapping) ---
  // Adjusted sizes to look realistic on a computer screen while maintaining legibility
  const getDotPitchSize = () => {
    const sizes = { 
      'P10': 9,    // Slightly tightened to keep text readable
      'P6': 6,     
      'P5': 5, 
      'P4': 4, 
      'P3': 3, 
      'P2.5': 2.5,   
      'P1.5': 1.5    
    };
    return sizes[ledType] || 8;
  };

  const dotSize = getDotPitchSize();

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 max-w-7xl mx-auto text-white">
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          
          {/* Controls Panel */}
          <div className="bg-[#050a05]/90 p-6 sm:p-8 rounded-3xl backdrop-blur-xl border border-green-500/30 shadow-[0_0_40px_rgba(249,115,22,0.1)] relative overflow-hidden flex flex-col justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black mb-6 text-white border-b border-white/10 pb-4">Display Configurator</h2>
              
              <motion.div 
                key={suggestion.text}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className={`mb-8 p-4 rounded-xl border-l-4 text-sm font-medium ${suggestion.type === 'warning' ? 'bg-orange-950/50 border-orange-500 text-orange-200' : 'bg-green-950/50 border-green-500 text-green-200'}`}
              >
                💡 {suggestion.text}
              </motion.div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2 block">Width (ft)</label>
                    <input type="number" step="0.5" min="1" value={width} onChange={e => setWidth(parseFloat(e.target.value)||1)} className="w-full bg-black border-2 border-gray-800 p-3 sm:p-4 rounded-xl text-xl font-mono focus:border-orange-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2 block">Height (ft)</label>
                    <input type="number" step="0.5" min="1" value={height} onChange={e => setHeight(parseFloat(e.target.value)||1)} className="w-full bg-black border-2 border-gray-800 p-3 sm:p-4 rounded-xl text-xl font-mono focus:border-orange-500 outline-none transition-all" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3 block">Pixel Pitch (Resolution)</label>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {['P10', 'P6', 'P5', 'P4', 'P3', 'P2.5', 'P1.5'].map(t => (
                      <button key={t} onClick={() => setLedType(t)} className={`px-4 py-2 sm:px-5 sm:py-3 rounded-xl font-bold text-sm transition-all duration-300 ${ledType === t ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)] border-green-400' : 'bg-gray-900 border border-gray-700 hover:border-gray-500'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {isP10 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <label className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-3 block mt-2">Color Module</label>
                      <div className="flex gap-4">
                        <button onClick={() => setP10Color('RED')} className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${p10Color === 'RED' ? 'bg-[#ff0000] text-white shadow-[0_0_20px_rgba(255,0,0,0.5)]' : 'bg-gray-900 border border-gray-700'}`}>RED</button>
                        <button onClick={() => setP10Color('RGB')} className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${p10Color === 'RGB' ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'bg-gray-900 border border-gray-700'}`}>RGB FULL</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-8 p-4 sm:p-6 bg-gradient-to-br from-gray-900 to-black border border-orange-500/30 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-gray-400 font-mono text-xs sm:text-sm">Total Area</p>
                <p className="text-base sm:text-lg text-green-400 font-bold">{area} sq ft</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 font-mono text-xs sm:text-sm">Estimated Price</p>
                <p className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-green-500">
                  ₹{calculateLEDPrice().toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* 3D Visualizer & Marquee */}
          <div className="bg-[#050a05]/90 p-6 sm:p-8 rounded-3xl backdrop-blur-xl border border-white/5 shadow-2xl flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px] relative">
            <h3 className="absolute top-6 left-6 text-sm sm:text-base font-black text-white/50 tracking-widest uppercase z-30">Live Hardware Preview</h3>
            
            <div className="w-full h-full flex items-center justify-center p-4 sm:p-8 mt-8">
              
              {/* THE CABINET FRAME */}
              <motion.div 
                layout
                transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
                style={{ 
                  aspectRatio: `${width || 1} / ${height || 1}`, 
                  maxHeight: '100%', 
                  maxWidth: '100%', 
                  backgroundColor: '#050505',
                  // Unlit LEDs background
                  backgroundImage: `radial-gradient(circle, #1a1a1a 45%, transparent 55%)`,
                  backgroundSize: `${dotSize}px ${dotSize}px`
                }}
                className="w-full relative rounded shadow-[0_15px_50px_rgba(0,0,0,0.8),_inset_0_0_30px_rgba(0,0,0,0.8)] border-[6px] sm:border-[10px] border-[#222] ring-2 ring-gray-600 flex items-center justify-center overflow-hidden"
              >
                
                {/* LIT LED CONTENT LAYER (The Mask) */}
                <div 
                  className="absolute inset-0 z-10 w-full h-full"
                  style={{
                    // FIX: Increased the solid black circle to 60%. This makes the "lit" dots larger and closer together, vastly improving legibility.
                    WebkitMaskImage: `radial-gradient(circle, black 60%, transparent 65%)`,
                    WebkitMaskSize: `${dotSize}px ${dotSize}px`,
                    maskImage: `radial-gradient(circle, black 60%, transparent 65%)`,
                    maskSize: `${dotSize}px ${dotSize}px`,
                  }}
                >
                  {isP10 ? (
                    <div className="absolute inset-0 flex items-center overflow-hidden whitespace-nowrap">
                      <motion.div
                        animate={{ x: ['100%', '-100%'] }}
                        transition={{ repeat: Infinity, duration: Math.max(5, width * 0.6), ease: "linear" }}
                        className="font-mono font-black"
                        style={{ 
                          // FIX: Increased minimum font size from 24px to 40px so letters are made of more dots
                          fontSize: `clamp(40px, ${height * 15}px, 150px)`,
                          // FIX: Added letter spacing to prevent dots from blending adjacent letters
                          letterSpacing: "0.1em",
                          color: p10Color === 'RED' ? '#ff0000' : 'transparent',
                          backgroundImage: p10Color === 'RGB' ? 'linear-gradient(90deg, #ff0000, #00ff00, #0000ff, #ff0000)' : 'none',
                          backgroundSize: '200% auto',
                          WebkitBackgroundClip: p10Color === 'RGB' ? 'text' : 'border-box',
                          // FIX: Heavy glow (bloom) helps fill in the gaps between the physical dots
                          textShadow: p10Color === 'RED' ? '0 0 5px #ff0000, 0 0 15px #ff0000' : 'none',
                          filter: p10Color === 'RGB' ? 'drop-shadow(0 0 6px rgba(255,255,255,0.8))' : 'none'
                        }}
                      >
                        MICRO VISION • {width}W × {height}H • P10 {p10Color}
                      </motion.div>
                    </div>
                  ) : (
                    // Video Wall for P6 down to P1.5
                    <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-100 brightness-150 contrast-125">
                       <source src="https://videos.pexels.com/video-files/4916813/4916813-hd_1920_1080_30fps.mp4" type="video/mp4" />
                    </video>
                  )}
                </div>

                {/* Cabinet Panel Lines (The physical 1x1ft cabinet seams) */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.6)_1px,transparent_1px)] bg-[size:25%_25%] pointer-events-none z-20 mix-blend-overlay"></div>

              </motion.div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 px-4 py-1 rounded-full border border-gray-700 text-gray-300 font-mono text-xs sm:text-sm whitespace-nowrap z-30">
              CABINET SIZE: {width}FT (W) × {height}FT (H)
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}