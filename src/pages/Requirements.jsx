import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import api from '../api';
import toast from 'react-hot-toast';

export default function Requirements() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('id');
  const [jobs, setJobs] = useState([]);

  // Application Form State
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [resume, setResume] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Anti-Bot Protection State
  const [botTrap, setBotTrap] = useState(''); // Honeypot
  const [num1] = useState(Math.floor(Math.random() * 10) + 1);
  const [num2] = useState(Math.floor(Math.random() * 10) + 1);
  const [mathAnswer, setMathAnswer] = useState('');


  useEffect(() => {
    // If we passed an ID, we could fetch just that one, but for simplicity we fetch all and map
    api.get('/careers')
      .then(res => {
         // Filter to only show requested job if ID is passed, else show all
         if(jobId) setJobs(res.data.filter(j => j._id === jobId));
         else setJobs(res.data);
      })
      .catch(err => console.error(err));
  }, [jobId]);

  const handleApply = async (e, jobTitle) => {
    e.preventDefault();

    // 1. ANTI-BOT: Honeypot Check (If filled, it's a bot)
    if (botTrap) {
      toast.error("Bot detected. Application rejected.");
      return;
    }

    // 2. ANTI-BOT: Math Challenge Check
    if (parseInt(mathAnswer) !== num1 + num2) {
      toast.error("Incorrect math answer. Prove you are human.");
      return;
    }

    if (!resume) {
      toast.error("Please attach your PDF resume.");
      return;
    }

    setIsSubmitting(true);
    const payload = new FormData();
    payload.append('jobTitle', jobTitle);
    payload.append('name', formData.name);
    payload.append('phone', formData.phone);
    payload.append('email', formData.email);
    payload.append('resume', resume);

    try {
      await api.post('/applications', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Application Submitted Successfully!');
      setFormData({ name: '', phone: '', email: '' });
      setResume(null);
      setMathAnswer('');
    } catch (err) {
      toast.error('Failed to submit application.');
    }
    setIsSubmitting(false);
  };

  return (
     <PageTransition>
      <div className="min-h-screen pt-32 px-6 text-white pointer-events-auto pb-20">
        <h1 className="text-5xl md:text-7xl font-black text-center mb-16 opacity-20">REQUIREMENTS</h1>
        
        <div className="max-w-4xl mx-auto space-y-16">
          {jobs.map((job) => (
            <motion.div key={job._id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
              <span className="text-xs font-mono text-cyan-400 tracking-widest border border-cyan-400/30 px-2 py-1 rounded-full mb-4 inline-block">{job.tag}</span>
              <h2 className="text-3xl font-bold mb-4 text-white">{job.title}</h2>
              <p className="text-gray-400 mb-6">{job.desc}</p>
              
              <h3 className="text-xl font-bold text-cyan-400 mb-3">Required Specifications:</h3>
              <ul className="list-disc pl-5 text-gray-300 space-y-2 mb-10">
                {job.requirements && job.requirements.map((req, i) => <li key={i}>{req}</li>)}
              </ul>

              {/* APPLICATION FORM FOR THIS SPECIFIC JOB */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mt-8">
                <h3 className="text-xl font-bold text-orange-400 mb-4">Apply for {job.title}</h3>
                
                <form onSubmit={(e) => handleApply(e, job.title)} className="space-y-4">
                  
                  {/* HIDDEN HONEYPOT - BOTS WILL FILL THIS, HUMANS CANNOT SEE IT */}
                  <input type="text" name="website" value={botTrap} onChange={e => setBotTrap(e.target.value)} className="hidden" tabIndex="-1" autoComplete="off" />

                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" required placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="p-3 bg-black/50 border border-white/20 rounded text-white outline-none focus:border-cyan-400" />
                    <input type="tel" required placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="p-3 bg-black/50 border border-white/20 rounded text-white outline-none focus:border-cyan-400" />
                  </div>
                  
                  <input type="email" required placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 bg-black/50 border border-white/20 rounded text-white outline-none focus:border-cyan-400" />
                  
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">Attach Resume (PDF Only)</label>
                    <input type="file" required accept=".pdf" onChange={e => setResume(e.target.files[0])} className="w-full p-3 bg-black/50 border border-white/20 rounded text-white outline-none focus:border-cyan-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-cyan-500/20 file:text-cyan-400 hover:file:bg-cyan-500/30 transition-all cursor-pointer" />
                  </div>

                  {/* HUMAN VERIFICATION MATH CAPTCHA */}
                  <div className="bg-black/30 p-4 rounded border border-orange-500/30 flex items-center gap-4">
                    <span className="text-orange-400 font-mono font-bold whitespace-nowrap">🤖 Verify Human: {num1} + {num2} = </span>
                    <input type="number" required value={mathAnswer} onChange={e => setMathAnswer(e.target.value)} className="w-20 p-2 bg-black border border-white/20 rounded text-white outline-none focus:border-orange-500 text-center font-bold" />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 text-white font-black py-4 rounded-xl mt-4 transition-colors">
                    {isSubmitting ? 'UPLOADING RESUME...' : 'SUBMIT APPLICATION'}
                  </button>
                </form>
              </div>

            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link to="/careers"><button className="border px-6 py-2 rounded-lg hover:bg-white hover:text-black transition">← Back to Careers</button></Link>
        </div>
      </div>
    </PageTransition>
  );
}



