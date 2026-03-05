import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { motion, useMotionValue, useTransform } from "framer-motion";
import PageTransition from "../components/PageTransition";

export default function Contact() {
  const { register, handleSubmit } = useForm();
  const [isVerified, setIsVerified] = useState(false);
  const dragX = useMotionValue(0);
  const constraintsRef = useRef(null);

  // CAPTCHA Logic
  const handleDragEnd = (event, info) => {
    const trackWidth = constraintsRef.current.offsetWidth;
    if (info.point.x >= trackWidth * 0.75) {
      setIsVerified(true);
      dragX.set(trackWidth - 50); 
    } else {
      dragX.set(0); 
    }
  };

  const bgVerify = useTransform(dragX, [0, 200], ["rgba(255,255,255,0.05)", "rgba(34,197,94,0.3)"]);
  const textOpacity = useTransform(dragX, [0, 150], [1, 0]);

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-32 pb-12 pointer-events-auto">
        
        {/* Two-Column Grid Layout */}
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* LEFT COLUMN: Contact Information */}
          <div className="relative group">
            {/* Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-green-500 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative bg-[#020502]/80 backdrop-blur-2xl border border-white/10 p-10 sm:p-12 rounded-[2.5rem] shadow-2xl">
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-2">Micro<span className="text-orange-500">Vision</span></h1>
              <p className="text-green-400 mb-10 font-mono text-sm uppercase tracking-widest">// Headquarters_Data</p>

              <div className="space-y-8">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0">
                    <span className="text-orange-400 text-xl">📞</span>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Direct Line</p>
                    <a href="tel:+917709861765" className="text-xl sm:text-2xl font-bold text-white hover:text-orange-400 transition-colors">
                      +91 77098 61765
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center shrink-0">
                    <span className="text-green-400 text-xl">✉️</span>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Digital Comm</p>
                    <a href="mailto:shubhamraskar69@gmail.com" className="text-lg sm:text-xl font-bold text-white hover:text-green-400 transition-colors break-all">
                      shubhamraskar69@gmail.com
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <span className="text-white text-xl">📍</span>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Physical Location</p>
                    <p className="text-base sm:text-lg font-medium text-gray-300 leading-relaxed max-w-[280px]">
                      Shop No 1, Riviera Estates CHS (Omega Building), <br/>
                      <span className="text-white font-bold">Khopoli, MH 410203</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact Form */}
          <div className="relative rounded-[2.5rem] bg-[#050a05]/90 border border-green-500/20 shadow-2xl p-8 sm:p-10 overflow-hidden backdrop-blur-xl">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Initiate Signal</h2>
            <p className="text-gray-400 mb-8 font-mono text-sm">// SECURE_CHANNEL</p>

            <form onSubmit={handleSubmit(d => alert("Message Transmitted Successfully!"))} className="space-y-6">
              
              <div className="relative">
                <input required {...register("name")} className="w-full bg-black border border-gray-800 text-white px-5 py-4 rounded-xl focus:border-green-400 outline-none transition-all peer placeholder-transparent" placeholder="Name" id="name" />
                <label htmlFor="name" className="absolute left-5 top-4 text-gray-500 transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-green-400 peer-focus:bg-black peer-focus:px-2 peer-valid:-top-3 peer-valid:text-xs peer-valid:bg-black peer-valid:px-2">Identity (Name)</label>
              </div>

              <div className="relative">
                <input required type="email" {...register("email")} className="w-full bg-black border border-gray-800 text-white px-5 py-4 rounded-xl focus:border-green-400 outline-none transition-all peer placeholder-transparent" placeholder="Email" id="email" />
                <label htmlFor="email" className="absolute left-5 top-4 text-gray-500 transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-green-400 peer-focus:bg-black peer-focus:px-2 peer-valid:-top-3 peer-valid:text-xs peer-valid:bg-black peer-valid:px-2">Return Address (Email)</label>
              </div>

              <div className="relative">
                <textarea required rows="3" {...register("message")} className="w-full bg-black border border-gray-800 text-white px-5 py-4 rounded-xl focus:border-green-400 outline-none transition-all peer placeholder-transparent resize-none" placeholder="Message" id="message"></textarea>
                <label htmlFor="message" className="absolute left-5 top-4 text-gray-500 transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-green-400 peer-focus:bg-black peer-focus:px-2 peer-valid:-top-3 peer-valid:text-xs peer-valid:bg-black peer-valid:px-2">Transmission Data (Message)</label>
              </div>

              {/* Custom Interactive CAPTCHA Slider */}
              <div className="mt-8">
                <label className="text-xs font-mono text-gray-400 mb-2 block uppercase tracking-widest">Human Verification Protocol</label>
                <motion.div 
                  ref={constraintsRef}
                  style={{ background: isVerified ? "rgba(34,197,94,0.2)" : bgVerify }}
                  className={`w-full h-16 rounded-2xl flex items-center p-2 relative overflow-hidden transition-colors border ${isVerified ? 'border-green-500' : 'border-gray-800'}`}
                >
                  {!isVerified && (
                    <motion.span style={{ opacity: textOpacity }} className="absolute w-full text-center text-gray-500 font-mono text-sm pointer-events-none">
                      Slide to initialize
                    </motion.span>
                  )}
                  {isVerified && (
                    <span className="absolute w-full text-center text-green-400 font-bold tracking-widest pointer-events-none">
                      ACCESS GRANTED
                    </span>
                  )}
                  
                  <motion.div
                    drag={!isVerified ? "x" : false}
                    dragConstraints={constraintsRef}
                    dragElastic={0.1}
                    dragMomentum={false}
                    onDragEnd={handleDragEnd}
                    style={{ x: dragX }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing z-10 ${isVerified ? 'bg-green-500 text-black' : 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]'}`}
                  >
                    {isVerified ? "✓" : "❯❯"}
                  </motion.div>
                </motion.div>
              </div>

              {/* Submit Button (Disabled until verified) */}
              <button 
                disabled={!isVerified}
                className={`w-full py-5 font-black uppercase tracking-widest transition-all rounded-xl relative overflow-hidden ${isVerified ? 'bg-white text-black hover:bg-green-400 hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] cursor-pointer' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
              >
                {isVerified ? 'Transmit Signal' : 'Awaiting Verification'}
              </button>

            </form>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}