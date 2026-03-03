import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FileText, Shield, AlertTriangle, Calendar,
    CheckCircle, MessageSquare, Download, Send,
    Loader2, ArrowLeft, RefreshCw, Zap, X, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const ShimmerLoader = () => (
    <div className="pt-32 p-6 md:p-12 max-w-6xl mx-auto w-full animate-pulse">
        <div className="flex justify-between items-end mb-12">
            <div className="w-1/3 h-12 bg-white/5 rounded-2xl" />
            <div className="w-1/4 h-12 bg-white/5 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-12 h-40 bg-white/5 rounded-[40px]" />
            <div className="lg:col-span-8 h-96 bg-white/5 rounded-[40px]" />
            <div className="lg:col-span-4 h-96 bg-white/5 rounded-[40px]" />
        </div>
    </div>
);

const AnalysisDashboard: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>(); // This is actually document_id
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [status, setStatus] = useState<string>('processing');
    const [subStatus, setSubStatus] = useState<string>('Initializing...');
    const [loading, setLoading] = useState(true);
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
    const [input, setInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchSession();
    }, [sessionId]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const fetchSession = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/documents/${sessionId}`);
            const doc = response.data;

            if (doc.status === 'ready') {
                // Parse JSON fields
                const processedData = {
                    ...doc,
                    analysis: {
                        explanation: doc.explanation,
                        points: doc.points_json ? JSON.parse(doc.points_json) : [],
                        risks: doc.risks_json ? JSON.parse(doc.risks_json) : [],
                        dates: doc.dates_json ? JSON.parse(doc.dates_json) : []
                    }
                };
                setData(processedData);
                setQuestionCount(doc.question_count || 0);
                setLoading(false);
                setStatus('ready');
            } else if (doc.status === 'failed') {
                setStatus('failed');
                setLoading(false);
            } else {
                // Keep polling
                if (doc.sub_status) setSubStatus(doc.sub_status);
                setTimeout(fetchSession, 2000);
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
            setStatus('error');
        }
    };

    const handleSend = async () => {
        if (!input.trim() || chatLoading) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setChatLoading(true);

        try {
            const response = await axios.post(`http://localhost:8000/api/v1/chat/${sessionId}`, {
                question: userMsg
            });

            setMessages(prev => [...prev, { role: 'ai', content: response.data.answer }]);
            setQuestionCount(response.data.question_count);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I couldn't process that question." }]);
        } finally {
            setChatLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            const url = `http://localhost:8000/api/v1/documents/${sessionId}/export`;
            console.log("Initiating export request to:", url);

            const response = await axios.get(url, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'text/plain' });
            const downloadUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', 'ExplainO_Intelligence_Report.txt');
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (err) {
            console.error("Export failed:", err);
            alert("Failed to export intelligence. Please try again.");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#020617] relative overflow-hidden">
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px]" />
            </div>
            <ShimmerLoader />
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 w-full px-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                <p className="text-cyan-400 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">
                    Current Directive: {subStatus}
                </p>
            </div>
        </div>
    );

    if (!data) return (
        <div className="h-screen flex flex-col items-center justify-center px-4 bg-navy-900">
            <div className="glass p-12 rounded-[40px] border-white/10 text-center max-w-md">
                <AlertTriangle className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                <h2 className="text-3xl font-bold font-montserrat mb-4">
                    {status === 'failed' ? "Analysis Failed" : "Session Expired"}
                </h2>
                <p className="text-white/50 mb-8 leading-relaxed">
                    {status === 'failed'
                        ? "Something went wrong during the intelligence extraction. Please try again."
                        : "The analysis session data is no longer available on this local instance."}
                </p>
                <button
                    onClick={() => navigate('/upload')}
                    className="w-full px-8 py-4 bg-cyan-500 text-navy-900 font-bold rounded-2xl hover:bg-cyan-400 transition-all"
                >
                    Start New Analysis
                </button>
            </div>
        </div>
    );

    const analysis = data.analysis;

    return (
        <div className="pt-24 min-h-screen bg-[#020617] text-white relative">
            {/* Background Layer - Animated Orbs */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
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

            <div className={`relative z-10 p-6 md:p-12 transition-all duration-500 ${chatOpen ? 'md:pr-[420px]' : ''}`}>
                <div className="max-w-6xl mx-auto">
                    {/* Header Controls */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <button onClick={() => navigate('/upload')} className="group flex items-center gap-2 text-white/40 hover:text-cyan-400 transition-colors mb-4 text-sm font-bold uppercase tracking-widest">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Return to Lab
                            </button>
                            <h1 className="text-4xl md:text-5xl font-bold font-montserrat flex items-center gap-4 text-white">
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                    <FileText className="text-cyan-400 w-8 h-8" />
                                </div>
                                {data.filename}
                            </h1>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-3 px-8 py-4 glass border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold text-white group"
                            >
                                <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform text-cyan-400" />
                                Export Intelligence
                            </button>
                            {!chatOpen && (
                                <button
                                    onClick={() => setChatOpen(true)}
                                    className="hidden md:flex items-center gap-3 px-8 py-4 bg-cyan-500 text-navy-900 rounded-2xl font-bold hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    Ask Document
                                </button>
                            )}
                        </motion.div>
                    </div>

                    {/* Dashboard Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Elite Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-12 glass p-10 rounded-[40px] border-white/10 group"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-green-500/10 rounded-xl">
                                    <Zap className="text-green-400 w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold font-montserrat">Executive Summary</h3>
                            </div>
                            <p className="text-2xl text-white/90 leading-relaxed font-medium italic">
                                "{analysis.explanation}"
                            </p>
                        </motion.div>

                        {/* Insights & Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="lg:col-span-8 glass p-10 rounded-[40px] border-white/10"
                        >
                            <h3 className="text-xl font-bold font-montserrat mb-8 flex items-center gap-3">
                                <CheckCircle className="text-cyan-400 w-6 h-6" /> Key Extracted Insights
                            </h3>
                            <div className="space-y-6">
                                {analysis.points?.map((p: string, i: number) => (
                                    <div key={i} className="flex gap-5 group items-start">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(0,201,255,0.8)] shrink-0" />
                                        <p className="text-white/70 leading-relaxed text-lg group-hover:text-white transition-colors">{p}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="lg:col-span-4 flex flex-col gap-8"
                        >
                            <div className="glass p-10 rounded-[40px] border-white/10 bg-red-500/[0.03]">
                                <h3 className="text-xl font-bold font-montserrat mb-6 flex items-center gap-3 text-red-400">
                                    <Shield className="w-6 h-6" /> Critical Risks
                                </h3>
                                <div className="space-y-4 text-sm">
                                    {analysis.risks?.map((r: string, i: number) => (
                                        <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-red-500/30 transition-colors">
                                            {r}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass p-10 rounded-[40px] border-white/10">
                                <h3 className="text-xl font-bold font-montserrat mb-6 flex items-center gap-3 text-blue-400">
                                    <Calendar className="w-6 h-6" /> Roadmap Dates
                                </h3>
                                <div className="space-y-4">
                                    {Array.isArray(analysis.dates) ? analysis.dates.map((d: string, i: number) => (
                                        <div key={i} className="flex items-center gap-4 text-white/60">
                                            <ChevronRight className="w-4 h-4 text-cyan-400" />
                                            {d}
                                        </div>
                                    )) : <p className="text-white/30 italic">No structured dates found</p>}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Premium Chat Sidebar */}
            <AnimatePresence>
                {chatOpen && (
                    <motion.div
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full md:w-[400px] bg-navy-900 border-l border-white/10 z-40 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] pt-20"
                    >
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div>
                                <h3 className="text-xl font-bold font-montserrat flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-cyan-400" /> AI Researcher
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                        {10 - questionCount} Queries Remaining
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setChatOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-colors">
                                <X className="w-6 h-6 text-white/40" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                            <div className="glass p-5 rounded-3xl text-sm text-cyan-100/70 leading-relaxed border-cyan-500/20">
                                Interface established. Ready to scan <strong>{data.filename}</strong> for your specific queries. Direct citations will be used.
                            </div>

                            {messages.map((m, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[90%] p-5 rounded-[24px] text-sm leading-relaxed shadow-lg ${m.role === 'user'
                                        ? 'bg-cyan-500 text-navy-900 font-bold'
                                        : 'glass border-white/10 text-white/90'
                                        }`}>
                                        {m.content}
                                    </div>
                                </motion.div>
                            ))}
                            {chatLoading && (
                                <div className="flex justify-start">
                                    <div className="glass p-5 rounded-full border-cyan-500/20">
                                        <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="p-8 bg-white/[0.02] border-t border-white/5">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={questionCount >= 10 ? "SCAN LIMIT REACHED" : "Command researchers..."}
                                    disabled={chatLoading || questionCount >= 10}
                                    className="w-full pl-6 pr-14 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all placeholder:text-white/20"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={chatLoading || questionCount >= 10 || !input.trim()}
                                    className="absolute right-2 top-2 bottom-2 aspect-square bg-cyan-500 hover:bg-cyan-400 disabled:opacity-20 text-navy-900 flex items-center justify-center rounded-xl transition-all shadow-lg active:scale-90"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Chat Button for Mobile */}
            <AnimatePresence>
                {!chatOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setChatOpen(true)}
                        className="fixed bottom-10 right-10 md:hidden z-50 w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,201,255,0.4)]"
                    >
                        <MessageSquare className="w-8 h-8 text-navy-900" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AnalysisDashboard;
