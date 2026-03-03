import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import AnalysisDashboard from './pages/AnalysisDashboard';
import ContactPage from './pages/ContactPage';
import AboutDeveloper from './pages/AboutDeveloper';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-navy-900 text-white font-inter selection:bg-cyan-500/30">
        <CustomCursor />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/analysis/:sessionId" element={<AnalysisDashboard />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/developer" element={<AboutDeveloper />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="py-4 border-t border-white/20 bg-[#020617] relative z-20">
          <div className="max-w-7xl mx-auto flex justify-center items-center px-4">
            <p className="text-white/40 text-sm font-medium tracking-wide">
              © 2026 ExplainO AI. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
