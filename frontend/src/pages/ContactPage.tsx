import React, { useState } from 'react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../utils/constants';

// Assets
import contactAiSupportImg from '../assets/images/contact_ai_support.png';
import contactDataNexusImg from '../assets/images/contact_data_nexus.png';

const ContactPage: React.FC = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await axios.post(`${API_URL}/contact`, form);
            setStatus('success');
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <div className="relative pt-32 pb-24 px-6 overflow-hidden min-h-screen bg-[#020617] text-white">
            {/* Background Layer - Animated Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.1, 0.15, 0.1]
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]"
                />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row gap-20">
                <div className="flex-1 lg:pt-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-6xl md:text-8xl font-black font-montserrat tracking-tight mb-8 leading-[0.95] text-white">
                            Connect with <br />
                            <span className="text-gradient">the Lab.</span>
                        </h1>
                        <p className="text-white/50 text-xl mb-12 leading-relaxed max-w-md">
                            Have questions about our AI document intelligence? Reach out to our research and development team.
                        </p>

                        <div className="space-y-12">
                            <div className="flex flex-col md:flex-row items-start gap-6 group">
                                <div className="w-28 h-28 md:w-36 md:h-36 shrink-0 rounded-[20px] overflow-hidden glass-dark border border-white/10 p-2 shadow-2xl relative cursor-pointer">
                                    <div className="absolute inset-0 bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <img src={contactAiSupportImg} alt="Send a signal" className="w-full h-full object-cover rounded-xl relative z-10" />
                                </div>
                                <div className="pt-2">
                                    <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-cyan-400 mb-1">Send a signal</p>
                                    <p className="text-xl md:text-2xl font-bold font-montserrat tracking-tight text-white group-hover:text-cyan-400 transition-colors cursor-pointer mb-2">sant7124@gmail.com</p>
                                    <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-sm">Transmit inquiries directly to our secure servers. AI routing guarantees a priority response.</p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-start gap-6 group">
                                <div className="w-28 h-28 md:w-36 md:h-36 shrink-0 rounded-[20px] overflow-hidden glass-dark border border-white/10 p-2 shadow-2xl relative cursor-pointer">
                                    <div className="absolute inset-0 bg-blue-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <img src={contactDataNexusImg} alt="Global HQ" className="w-full h-full object-cover rounded-xl relative z-10" />
                                </div>
                                <div className="pt-2">
                                    <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-blue-400 mb-1">Global HQ</p>
                                    <p className="text-xl md:text-2xl font-bold font-montserrat tracking-tight text-white mb-2 leading-tight">Greater Noida, UP,<br />INDIA</p>
                                    <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-sm">The physical origin node of our global operations and advanced research facilities.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 lg:max-w-lg"
                >
                    <div className="glass-dark p-10 rounded-[40px] border border-white/10 shadow-2xl">
                        {status === 'success' ? (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30">
                                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                                </div>
                                <h3 className="text-3xl font-bold font-montserrat mb-4 text-white">Transmission Successful</h3>
                                <p className="text-white/50 mb-10 text-lg">Your msg is sent to the developer, soon he will be contact to U.</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="px-8 py-4 glass border-white/10 text-cyan-400 font-bold rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-sm"
                                >
                                    Send New Signal
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2 ml-1">Identity</label>
                                        <input
                                            type="text" required
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all placeholder:text-white/20"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2 ml-1">Email Address</label>
                                        <input
                                            type="email" required
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all placeholder:text-white/20"
                                            placeholder="john@research.io"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2 ml-1">Frequency/Subject</label>
                                    <input
                                        type="text" required
                                        value={form.subject}
                                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all placeholder:text-white/20"
                                        placeholder="Intelligence Request"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2 ml-1">Transmission/Msg</label>
                                    <textarea
                                        required rows={4}
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all placeholder:text-white/20 resize-none"
                                        placeholder="How can we assist your research?"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-navy-900 font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/20 active:scale-95"
                                >
                                    {status === 'loading' ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
                                    Initiate Transmission
                                </button>
                                {status === 'error' && (
                                    <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">Encryption Error. Try again.</p>
                                )}
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactPage;
