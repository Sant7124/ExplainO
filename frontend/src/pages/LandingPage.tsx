import React from 'react';
import { ArrowRight, Shield, Zap, MessageSquare, ChevronRight, FileText, BarChart3, Search } from 'lucide-react';
import { motion } from 'framer-motion';

// Asset Imports
import conceptImg from '../assets/images/concept.png';
import eli5Img from '../assets/images/eli5_feature.png';
import riskAuditImg from '../assets/images/risk_audit.png';
import activeMemoryImg from '../assets/images/active_memory.png';

const LandingPage: React.FC = () => {
    return (
        <div className="relative pt-24 pb-16 overflow-hidden min-h-screen bg-[#020617] text-white">
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

            {/* Hero Section */}
            <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 pt-16">
                <div className="flex flex-col lg:flex-row items-center gap-16 py-12">
                    <div className="flex-1 text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-cyan-400 text-sm font-bold mb-8 uppercase tracking-widest shadow-lg shadow-cyan-500/5"
                        >
                            <Zap className="w-4 h-4 fill-cyan-400" />
                            <span>Mission Critical Document Intelligence</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="text-6xl md:text-8xl font-black font-montserrat tracking-tight mb-8 leading-[0.95] text-white"
                        >
                            Decode. <br />
                            <span className="text-gradient">Protect.</span> <br />
                            Succeed.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="text-xl text-slate-400 max-w-xl mb-12 leading-relaxed"
                        >
                            ExplainO is the professional's edge in a world of complex documentation.
                            We transform dense legal, financial, and technical texts into actionable intelligence using state-of-the-art RAG technology.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="flex flex-wrap items-center gap-6"
                        >
                            <a
                                href="/upload"
                                className="px-12 py-5 glass border border-white/10 text-white font-black rounded-2xl transition-all hover:bg-white/5 hover:border-cyan-500/30 flex items-center gap-2 group transform active:scale-95 text-lg"
                            >
                                Get Started
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href="#features"
                                className="group flex items-center gap-3 text-white font-bold hover:text-cyan-400 transition-colors text-lg"
                            >
                                <div className="w-14 h-14 rounded-full glass border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors group-hover:border-cyan-500/30">
                                    <ChevronRight className="w-6 h-6" />
                                </div>
                                View Capabilities
                            </a>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="flex-1 relative group"
                    >
                        <div className="relative z-10 glass-dark rounded-[48px] p-3 lg:p-4 border border-white/10 shadow-[0_0_100px_rgba(0,201,255,0.1)] overflow-hidden transition-transform duration-700 group-hover:scale-[1.02]">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <img
                                src={conceptImg}
                                alt="AI Document Analysis Architecture"
                                className="rounded-[40px] w-full h-auto object-cover"
                            />
                        </div>
                        {/* Abstract Background Elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl mix-blend-screen animate-pulse" />
                    </motion.div>
                </div>
            </section>

            {/* Core Capabilities */}
            <section id="features" className="mt-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-32">
                <div className="text-center space-y-6">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black font-montserrat"
                    >
                        Precision-Engineered <span className="text-gradient">Features</span>
                    </motion.h2>
                    <p className="text-slate-400 text-xl max-w-3xl mx-auto">
                        We leverage the latest advancements in Large Language Models to provide document insights that were previously impossible.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-24">
                    {[
                        {
                            title: "Instant ELI5 Engine",
                            tag: "Clarity",
                            description: "Bypass the confusion of technical jargon. ExplainO breaks down high-level abstracts, complex legalities, and dense scientific data into clear, conversational English that anyone can grasp instantly.",
                            image: eli5Img,
                            reverse: false,
                            icon: <MessageSquare className="w-8 h-8 text-cyan-400" />
                        },
                        {
                            title: "Automated Risk Audit",
                            tag: "Security",
                            description: "Eliminate blind spots in your contracts and agreements. Our AI scans every clause to identify potential liabilities, one-sided terms, and hidden risks, giving you a comprehensive safety report in seconds.",
                            image: riskAuditImg,
                            reverse: true,
                            icon: <Shield className="w-8 h-8 text-emerald-400" />
                        },
                        {
                            title: "Deep Active Memory",
                            tag: "Context",
                            description: "Don't just read documents—converse with them. ExplainO maintains a high-fidelity contextual memory of your files, allowing you to ask hyper-specific questions and receive accurate, cited answers based solely on your data.",
                            image: activeMemoryImg,
                            reverse: false,
                            icon: <Zap className="w-8 h-8 text-amber-400" />
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className={`flex flex-col ${feature.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16`}
                        >
                            <div className="flex-1 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center border border-white/10 shadow-xl">
                                        {feature.icon}
                                    </div>
                                    <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-400">
                                        {feature.tag}
                                    </span>
                                </div>
                                <h3 className="text-4xl md:text-5xl font-black font-montserrat tracking-tight leading-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-xl text-slate-400 leading-relaxed font-light">
                                    {feature.description}
                                </p>
                                <ul className="space-y-4 pt-4 text-slate-300">
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
                                        <span>Industry-specific terminology mapping</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
                                        <span>Zero-data-leakage architecture</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex-1 w-full group">
                                <div className="relative glass-dark p-3 rounded-[40px] border border-white/5 shadow-2xl overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="rounded-[30px] w-full h-auto transform transition-transform duration-1000 group-hover:scale-110"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* The Process Section */}
            <section className="mt-56 py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="space-y-16"
                    >
                        <div className="space-y-6">
                            <h2 className="text-5xl md:text-7xl font-black font-montserrat">How It Works</h2>
                            <p className="text-xl text-slate-400">Seamless intelligence at your fingertips.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                {
                                    step: "01",
                                    label: "Upload",
                                    desc: "Securely upload PDF, DOCX, or text files to our high-speed ingestion engine.",
                                    icon: <FileText className="w-10 h-10 text-cyan-400" />
                                },
                                {
                                    step: "02",
                                    label: "Process",
                                    desc: "Our AI maps the document structure, identifies entities, and builds a logical index.",
                                    icon: <Search className="w-10 h-10 text-cyan-400" />
                                },
                                {
                                    step: "03",
                                    label: "Insight",
                                    desc: "Generate instant ELI5s, full risk reports, and chat with your data directly.",
                                    icon: <BarChart3 className="w-10 h-10 text-cyan-400" />
                                },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center space-y-8 glass p-12 rounded-[40px] border border-white/5 relative group hover:bg-white/5 transition-colors">
                                    <div className="text-8xl font-black text-white/5 absolute -top-4 -left-4 pointer-events-none group-hover:text-cyan-500/10 transition-colors">
                                        {item.step}
                                    </div>
                                    <div className="w-24 h-24 rounded-3xl bg-cyan-500/10 flex items-center justify-center shadow-inner">
                                        {item.icon}
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-3xl font-bold font-montserrat tracking-tight">{item.label}</h4>
                                        <p className="text-slate-400 leading-relaxed text-lg">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
