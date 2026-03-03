import React from 'react';
import {
    Github,
    Linkedin,
    Mail,
    Code2,
    Cpu,
    Rocket,
    ChevronRight,
    ExternalLink,
    Terminal,
    Shield,
    FileText,
    Users,
    BrainCircuit,
    Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import Assets
import santoshImg from '../assets/images/developer/santosh.jpg';
import shieldVisionImg from '../assets/images/developer/shield-vision.png';
import mindsetImg from '../assets/images/developer/mindset.png';
import digiFootprintImg from '../assets/images/developer/digi-footprint.png';
import resumeBuilderImg from '../assets/images/developer/resume-builder.png';
import internshipRecommenderImg from '../assets/images/developer/internship-recommender.png';

const AboutDeveloper: React.FC = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
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

            <div className="relative z-10 max-w-7xl mx-auto">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-16"
                >
                    {/* Left Sidebar: Profile & Quick Links */}
                    <motion.div variants={itemVariants} className="lg:col-span-4 space-y-8 lg:sticky lg:top-32 h-fit">
                        <div className="glass-dark p-10 rounded-[40px] border border-white/10 shadow-2xl">
                            {/* Profile Image with Neon Glow */}
                            <div className="relative w-48 h-48 mx-auto mb-8 group">
                                <div className="absolute inset-0 bg-cyan-400 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-500" />
                                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                                    <img
                                        src={santoshImg}
                                        alt="Santosh Yadav"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-150"
                                        style={{ objectPosition: '12% 0%', transform: 'scale(1.1)' }}
                                    />
                                </div>
                            </div>

                            <div className="text-center space-y-4">
                                <h1 className="text-3xl font-bold font-montserrat text-white">Santosh Yadav</h1>
                                <p className="text-cyan-400 font-bold uppercase tracking-widest text-xs">AI & Security Focused Developer</p>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    Computer Science Engineering student building technology that explains, protects, and simplifies.
                                </p>
                            </div>

                            <div className="mt-10 pt-10 border-t border-white/5 space-y-4">
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-tighter ml-1">Connect with me</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn", href: "https://www.linkedin.com/in/santosh-yadav-7124hb" },
                                        { icon: <Github className="w-4 h-4" />, label: "GitHub", href: "https://github.com/Sant7124" },
                                        { icon: <Mail className="w-4 h-4" />, label: "Gmail", href: "mailto:sant7124@gmail.com" },
                                        { icon: <ExternalLink className="w-4 h-4" />, label: "Portfolio", href: "#" }
                                    ].map((link, i) => (
                                        <a
                                            key={i}
                                            href={link.href}
                                            target="_blank"
                                            className="flex items-center gap-2 glass p-3 rounded-xl text-white/70 hover:text-cyan-400 hover:border-cyan-400/30 transition-all group"
                                        >
                                            {link.icon}
                                            <span className="text-xs font-semibold">{link.label}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Competitive Coding Stats */}
                        <div className="glass p-8 rounded-[30px] border border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-3 mb-6">
                                <Terminal className="text-cyan-400 w-5 h-5" />
                                <h3 className="text-white font-bold text-sm tracking-tight">Problem Solving Matrix</h3>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                {[
                                    { name: "LeetCode", url: "https://leetcode.com/u/Mr_Phikin/" },
                                    { name: "HackerRank", url: "https://www.hackerrank.com/profile/Mr_Phikin" },
                                    { name: "GFG", url: "https://www.geeksforgeeks.org/profile/santosh074?tab=activity" }
                                ].map((plat, i) => (
                                    <a
                                        key={i}
                                        href={plat.url}
                                        target="_blank"
                                        className="text-[11px] font-bold text-white/50 hover:text-white transition-colors flex items-center gap-2 group whitespace-nowrap"
                                    >
                                        <ChevronRight className="w-3 h-3 text-cyan-500 group-hover:translate-x-1 transition-transform" /> {plat.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Sidebar: Rich Content */}
                    <div className="lg:col-span-8 space-y-16">
                        {/* Section: The Core Mission */}
                        <motion.section variants={itemVariants} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 glass-dark rounded-2xl text-cyan-400">
                                    <Rocket className="w-6 h-6" />
                                </div>
                                <h2 className="text-4xl font-black font-montserrat text-white tracking-tighter uppercase">The Vision</h2>
                            </div>
                            <div className="glass p-10 rounded-[40px] bg-gradient-to-br from-cyan-500/[0.03] to-transparent">
                                <p className="text-white/70 text-lg leading-relaxed font-medium mb-6">
                                    "I build technology that helps people understand the digital world, not fear it."
                                </p>
                                <p className="text-white/50 leading-relaxed italic border-l-2 border-cyan-500/30 pl-6">
                                    I am not someone who started coding just for a degree — I started because I was curious.
                                    I always wanted to understand how technology actually helps people in daily life.
                                    That curiosity slowly turned into learning programming, then into solving problems, and eventually into building real products.
                                </p>
                            </div>
                        </motion.section>

                        {/* Section: Why I Built ExplainO */}
                        <motion.section variants={itemVariants} className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 glass-dark rounded-2xl text-cyan-400">
                                    <BrainCircuit className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold font-montserrat text-white tracking-tight">The Story Behind ExplainO</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className="space-y-6">
                                    <p className="text-white/50 leading-relaxed">
                                        ExplainO wasn’t created as a portfolio project — it came from a real frustration. I saw people receive government documents, bank notices, legal PDFs, emails, and terms they couldn’t understand. They would ignore them, trust blindly, panic, or even get scammed. Friends and family kept asking, “Just tell me what this actually means.” They didn’t need translation or summaries — they needed clarity. I realized most AI tools generate text, but people need understanding. So I built ExplainO, a system that reads information like a knowledgeable person beside you and explains what it truly means for you.
                                    </p>
                                    <div className="space-y-4">
                                        {[
                                            "Not just translation — true understanding.",
                                            "Built for normal people, not techies.",
                                            "A knowledgeable person sitting beside you."
                                        ].map((point, i) => (
                                            <div key={i} className="flex items-center gap-3 text-sm font-semibold text-white/80">
                                                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                                                {point}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative group overflow-hidden rounded-[30px] border border-white/10 shadow-2xl">
                                    <img src={mindsetImg} alt="Mindset" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-60" />
                                    <p className="absolute bottom-6 left-6 text-xs font-bold text-white uppercase tracking-widest bg-cyan-500/20 backdrop-blur-md px-4 py-2 rounded-full">Practical Logic</p>
                                </div>
                            </div>
                        </motion.section>

                        {/* Section: Project Showcase */}
                        <motion.section variants={itemVariants} className="space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 glass-dark rounded-2xl text-cyan-400">
                                    <Code2 className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold font-montserrat text-white tracking-tight">Active Deployments</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* ShieldVision */}
                                <div className="glass p-8 rounded-[40px] border-white/5 group hover:bg-white/[0.04] transition-all flex flex-col">
                                    <div className="relative h-48 mb-8 rounded-[25px] overflow-hidden">
                                        <img src={shieldVisionImg} alt="ShieldVision" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent opacity-40" />
                                        <div className="absolute top-4 right-4 p-2 bg-yellow-500/20 backdrop-blur-md rounded-xl border border-yellow-500/30">
                                            <Lock className="w-4 h-4 text-yellow-500" />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-2xl font-bold text-white tracking-tight">ShieldVision</h3>
                                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] border border-white/10 px-3 py-1 rounded-full italic">Ongoing</span>
                                        </div>
                                        <p className="text-white/40 text-sm leading-relaxed">
                                            ShieldVision is a real-time phishing detection platform powered by AI and cybersecurity analysis. It detects malicious intent in deceptive websites and emails by scanning URLs and content instantly. Using heuristic methods and live threat intelligence, it provides immediate protection and helps keep users’ online interactions safe and trustworthy.
                                        </p>
                                        <div className="pt-4 flex gap-4">
                                            <div className="text-[10px] font-bold text-yellow-500 uppercase">Heuristic Analysis</div>
                                            <div className="text-[10px] font-bold text-orange-500 uppercase">Threat Intel</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Digi_Footprint */}
                                <div className="glass p-8 rounded-[40px] border-white/5 flex flex-col group hover:bg-white/[0.04] transition-all">
                                    <div className="relative h-48 mb-8 rounded-[25px] overflow-hidden">
                                        <img src={digiFootprintImg} alt="Digi_Footprint" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent opacity-40" />
                                        <div className="absolute top-4 right-4 p-2 bg-cyan-500/20 backdrop-blur-md rounded-xl border border-cyan-500/30">
                                            <Shield className="w-4 h-4 text-cyan-400" />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <h3 className="text-2xl font-bold text-white tracking-tight">Digi_Footprint</h3>
                                        <p className="text-white/40 text-sm leading-relaxed">
                                            A privacy-first analysis engine that scans and visualizes your digital exposure. I built this to solve a common problem: people often have no idea how much of their personal data is scattered across the web. Digi_Footprint maps these links and provides actionable insights to reclaim digital privacy.
                                        </p>
                                        <div className="pt-4 flex gap-4">
                                            <div className="text-[10px] font-bold text-cyan-500 uppercase">OSINT Analysis</div>
                                            <div className="text-[10px] font-bold text-blue-500 uppercase">Privacy UX</div>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Resume Builder */}
                                <div className="glass p-8 rounded-[40px] border-white/5 flex flex-col group hover:bg-white/[0.04] transition-all">
                                    <div className="relative h-48 mb-8 rounded-[25px] overflow-hidden">
                                        <img src={resumeBuilderImg} alt="AI Resume Builder" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent opacity-40" />
                                        <div className="absolute top-4 right-4 p-2 bg-purple-500/20 backdrop-blur-md rounded-xl border border-purple-500/30">
                                            <FileText className="w-4 h-4 text-purple-400" />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <h3 className="text-2xl font-bold text-white tracking-tight">AI Resume Builder</h3>
                                        <p className="text-white/40 text-sm leading-relaxed">
                                            Creating a bridge between technical skills and professional presentation. This tool uses LLMs to help students translate their project experience into industry-standard language, ensuring that their hard work isn't lost in poor formatting or weak descriptions.
                                        </p>
                                        <div className="pt-4 flex gap-4">
                                            <div className="text-[10px] font-bold text-purple-400 uppercase">NLP Generation</div>
                                            <div className="text-[10px] font-bold text-indigo-400 uppercase">Career Tech</div>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Internship Recommender */}
                                <div className="glass p-8 rounded-[40px] border-white/5 flex flex-col group hover:bg-white/[0.04] transition-all">
                                    <div className="relative h-48 mb-8 rounded-[25px] overflow-hidden">
                                        <img src={internshipRecommenderImg} alt="AI Internship Recommender" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent opacity-40" />
                                        <div className="absolute top-4 right-4 p-2 bg-green-500/20 backdrop-blur-md rounded-xl border border-green-500/30">
                                            <Users className="w-4 h-4 text-green-400" />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <h3 className="text-2xl font-bold text-white tracking-tight">AI Internship Recommender</h3>
                                        <p className="text-white/40 text-sm leading-relaxed">
                                            A skill-mapping system designed to reduce the "choice paralysis" students face. By analyzing a user's GitHub repositories and technical interests, it identifies the most relevant internship tracks, matching their unique skill profile with market demands.
                                        </p>
                                        <div className="pt-4 flex gap-4">
                                            <div className="text-[10px] font-bold text-green-400 uppercase">Skill Mapping</div>
                                            <div className="text-[10px] font-bold text-emerald-400 uppercase">Recommendation Engine</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* Section: Academic Journey */}
                        <motion.section variants={itemVariants} className="space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 glass-dark rounded-2xl text-cyan-400">
                                    <Cpu className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold font-montserrat text-white tracking-tight">Academic Journey</h2>
                            </div>
                            <div className="glass p-10 rounded-[40px] border-white/5 space-y-12">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">B.Tech in Computer Science Engineering</h3>
                                        <p className="text-white/50 text-sm">Focusing on Cyber Security & AI Architecture</p>
                                    </div>
                                    <div className="glass px-6 py-2 rounded-full text-xs font-black text-cyan-400 border-cyan-500/20 uppercase tracking-[0.2em]">In Progress</div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {[
                                        "Cyber Security Analysis",
                                        "AI/Natural Language Processing",
                                        "Backend Systems Design",
                                        "Distributed Architecture"
                                    ].map((skill, i) => (
                                        <div key={i} className="flex items-center gap-4 group">
                                            <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-navy-900 transition-all duration-300">
                                                <ChevronRight className="w-5 h-5" />
                                            </div>
                                            <span className="text-white/70 font-semibold">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.section>

                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutDeveloper;
