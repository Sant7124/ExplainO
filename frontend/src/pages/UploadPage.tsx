import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, AlertCircle, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils/constants';

// Assets
import scanNodeImg from '../assets/images/upload_scan_node.png';
import secureLockImg from '../assets/images/upload_secure_lock.png';
import dataFlowImg from '../assets/images/upload_data_flow.png';
import aiBrainImg from '../assets/images/upload_ai_brain.png';

const UploadPage: React.FC = () => {
    const navigate = useNavigate();

    const [file, setFile] = useState<File | null>(null);
    const [inputText, setInputText] = useState("");
    const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setError(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'image/*': ['.jpeg', '.jpg', '.png']
        }
    });

    const handleUpload = async (directText?: string) => {
        if (!file && !(typeof directText === 'string' && directText.trim())) return;

        setStatus('uploading');
        const formData = new FormData();

        if (typeof directText === 'string' && directText.trim()) {
            // Unify the way we create the file from text
            const blob = new Blob([directText], { type: 'text/plain' });
            formData.append('file', blob, "direct_input.txt");
        } else if (file) {
            formData.append('file', file);
        }

        try {
            // Use axios and localhost for consistency
            const response = await axios.post(`${API_URL}/api/v1/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000 // 30s timeout
            });

            setStatus('success');
            const data = response.data;

            setTimeout(() => {
                navigate(`/analysis/${data.document_id}`);
            }, 1000);

        } catch (err: any) {
            console.error("Upload Error:", err);
            setStatus('error');
            const errorMsg = err.response?.data?.detail || err.message || 'System interference detected. Analysis failed.';
            setError(errorMsg);
        }
    };

    return (
        <div className="relative pt-32 pb-24 px-6 overflow-hidden min-h-screen flex flex-col items-center justify-center bg-[#020617] text-white">
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

            <div className="relative z-10 w-full max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Secure Lab Entry</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black font-montserrat tracking-tight mb-8 leading-[0.95] text-white">
                        Upload & Analyze <span className="text-gradient">Your Document.</span>
                    </h1>
                    <p className="text-white/40 text-lg max-w-lg mx-auto">
                        Supported formats: Intelligence PDF, DOCX, and Imagery scans (Max 5MB).
                    </p>
                </motion.div>

                {/* Direct Text Input Bar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 }}
                    className="mb-8 relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-[30px] blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative glass rounded-[25px] border border-white/10 flex items-center p-2 shadow-xl backdrop-blur-2xl">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Paste the text and let me analyze....."
                            className="bg-transparent border-none outline-none flex-1 px-8 py-4 text-white placeholder:text-white/20 font-montserrat font-medium text-lg resize-none scrollbar-hide min-h-[70px] max-h-[200px]"
                            rows={1}
                        />
                        <button
                            onClick={() => {
                                if (inputText.trim()) {
                                    handleUpload(inputText);
                                }
                            }}
                            disabled={status !== 'idle' || !inputText.trim()}
                            className="ml-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-navy-900 font-black rounded-2xl transition-all uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(0,255,255,0.2)] active:scale-95 disabled:opacity-30 disabled:grayscale"
                        >
                            Analyze Now
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass-dark p-10 rounded-[40px] border border-white/10 shadow-2xl overflow-hidden"
                >
                    <div
                        {...getRootProps()}
                        className={`relative border-2 border-dashed rounded-3xl p-16 transition-all text-center cursor-pointer group
                        ${isDragActive ? 'border-cyan-400 bg-cyan-500/10' : 'border-white/10 hover:border-cyan-400/50 hover:bg-white/5'}
                        ${status !== 'idle' ? 'pointer-events-none opacity-20' : ''}
                        `}
                    >
                        <input {...getInputProps()} />

                        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 group-hover:bg-cyan-500 group-hover:shadow-[0_0_20px_rgba(0,201,255,1)]">
                            <Upload className="w-10 h-10 text-white transition-colors group-hover:text-navy-900" />
                        </div>

                        <h3 className="text-2xl font-bold font-montserrat mb-2 text-white">
                            {file ? file.name : 'Target Selection'}
                        </h3>
                        <p className="text-white/40 font-medium">
                            {isDragActive ? 'Release to initiate scan' : 'Drag file or click to browse repositories'}
                        </p>
                    </div>

                    <div className="mt-10">
                        {file && status === 'idle' && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center justify-between p-6 glass rounded-2xl border-white/10 mb-6"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                                        <File className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white truncate max-w-[200px] md:max-w-md">{file.name}</p>
                                        <p className="text-xs font-bold text-white/30 lowercase tracking-widest animate-pulse">Ready for ingestion ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                                    </div>
                                </div>
                                <button onClick={() => setFile(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-red-400">
                                    <X className="w-6 h-6" />
                                </button>
                            </motion.div>
                        )}

                        <AnimatePresence>
                            {(status === 'uploading' || status === 'processing') && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center justify-center gap-6 py-10"
                                >
                                    <div className="relative">
                                        <div className="w-20 h-20 border-4 border-white/10 border-t-cyan-500 rounded-full animate-spin" />
                                        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400 w-8 h-8 animate-pulse" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl font-bold font-montserrat tracking-tight mb-2 text-white italic">Decrypting Intelligence...</p>
                                        <p className="text-xs font-bold text-white/30 uppercase tracking-[0.3em]">Processing Neural Nodes</p>
                                    </div>
                                </motion.div>
                            )}

                            {status === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-4 p-6 glass border-red-500/20 text-red-400 rounded-3xl"
                                >
                                    <AlertCircle className="w-8 h-8 shrink-0" />
                                    <span className="font-bold text-lg">{error}</span>
                                </motion.div>
                            )}

                            {status === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center gap-4 py-10 text-green-400"
                                >
                                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30 animate-bounce">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <span className="font-bold text-2xl font-montserrat italic">Scan Succeeded!</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {file && status === 'idle' && (
                            <button
                                onClick={() => handleUpload()}
                                className="w-full bg-cyan-500 hover:bg-cyan-400 text-navy-900 font-bold py-6 rounded-3xl shadow-[0_0_40px_rgba(0,201,255,0.3)] transition-all text-xl uppercase tracking-widest transform active:scale-95 translate-y-0 hover:-translate-y-1"
                            >
                                Initiate Scanning Now
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Security Badge */}
                <div className="mt-12 flex items-center justify-center gap-8 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    <ShieldCheck className="w-10 h-10 text-white" />
                    <Zap className="w-10 h-10 text-white" />
                    <File className="w-10 h-10 text-white" />
                </div>
            </div>

            {/* Intelligence Features */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative z-10 max-w-6xl w-full mx-auto mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
                {[
                    { title: "Zero-Knowledge Storage", desc: "Military-grade encryption ensures your documents are processed strictly in memory and never retained.", img: secureLockImg },
                    { title: "Deep Neural Scan", desc: "Advanced semantic parsing extracts profound meaning from even the most convoluted technical texts.", img: scanNodeImg },
                    { title: "Data Flow Mapping", desc: "Intelligently organizes chaotic information into structured, actionable, and searchable data points.", img: dataFlowImg },
                    { title: "Contextual Synthesis", desc: "Our proprietary AI engine synthesizes context to provide human-like understanding of your files.", img: aiBrainImg },
                ].map((feature, idx) => (
                    <div key={idx} className="glass p-8 rounded-[30px] border border-white/5 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500 hover:bg-white/5">
                        <div className="w-24 h-24 mb-8 rounded-2xl overflow-hidden glass-dark border border-white/10 p-2 shadow-2xl relative cursor-pointer">
                            <div className="absolute inset-0 bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <img src={feature.img} alt={feature.title} className="w-full h-full object-cover rounded-xl relative z-10" />
                        </div>
                        <h4 className="text-xl font-bold font-montserrat tracking-tight mb-3 text-white group-hover:text-cyan-400 transition-colors">{feature.title}</h4>
                        <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default UploadPage;
