import { FileText, Menu, X, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'py-4 bg-navy-900/80 backdrop-blur-xl border-b border-white/5' : 'py-6 bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-cyan-500 p-2.5 rounded-xl shadow-[0_0_15px_rgba(0,201,255,0.4)]">
                            <FileText className="text-navy-900 w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold font-montserrat tracking-tight text-white flex items-center">
                            Explain<span className="text-cyan-400 text-[1.2em] ml-0.5 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] leading-none mb-0.5">O</span>
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        <a href="/" className="text-sm font-semibold text-white/70 hover:text-cyan-400 transition-colors uppercase tracking-wider">Home</a>
                        <a href="/upload" className="text-sm font-semibold text-white/70 hover:text-cyan-400 transition-colors uppercase tracking-wider">Analyze</a>
                        <a href="/contact" className="text-sm font-semibold text-white/70 hover:text-cyan-400 transition-colors uppercase tracking-wider">Contact</a>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <a
                            href="/developer"
                            className="text-sm font-semibold text-white/70 hover:text-cyan-400 px-6 py-2.5 rounded-xl glass border border-white/10 transition-all"
                        >
                            Developer
                        </a>
                        <a
                            href="/upload"
                            className="text-sm font-semibold text-white/70 hover:text-cyan-400 px-6 py-2.5 rounded-xl glass border border-white/10 transition-all flex items-center gap-2 group"
                        >
                            Get Started
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white">
                            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-navy-900 flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-300">
                    <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 p-2 text-white/70">
                        <X className="w-10 h-10" />
                    </button>
                    <a href="/" className="text-4xl font-bold font-montserrat" onClick={() => setIsOpen(false)}>Home</a>
                    <a href="/upload" className="text-4xl font-bold font-montserrat" onClick={() => setIsOpen(false)}>Analyze</a>
                    <a href="/developer" className="text-4xl font-bold font-montserrat" onClick={() => setIsOpen(false)}>Developer</a>
                    <a href="/contact" className="text-4xl font-bold font-montserrat" onClick={() => setIsOpen(false)}>Contact</a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
