import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Compressor from './pages/Compressor';
import Resizer from './pages/Resizer';
import Converter from './pages/Converter';
import Editor from './pages/Editor';
import Batch from './pages/Batch';
import ImageToPdf from './pages/ImageToPdf';
import Calculator from './pages/Calculator';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ToolsHub from './pages/ToolsHub';
import SeoPresetCompressor from './pages/SeoPresetCompressor';
import PassportPhoto from './pages/PassportPhoto';
import SignatureCompressor from './pages/SignatureCompressor';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans transition-colors duration-200">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Core Suite */}
                <Route path="/" element={<Home />} />
                <Route path="/compress" element={<Compressor />} />
                <Route path="/resize" element={<Resizer />} />
                <Route path="/convert" element={<Converter />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/zipimg" element={<Batch />} />
                <Route path="/batch" element={<Batch />} />
                <Route path="/image-to-pdf" element={<ImageToPdf />} />
                <Route path="/img-to-pdf" element={<ImageToPdf />} />
                <Route path="/calculator" element={<Calculator />} />

                {/* Tools Directory */}
                <Route path="/tools" element={<ToolsHub />} />

                {/* High-Intent SEO Landing Routes (Exact Google Search Match) */}
                <Route
                  path="/reduce-image-in-kb"
                  element={
                    <SeoPresetCompressor
                      targetKb={100}
                      title="Reduce Image Size in KB/MB Online"
                      subtitle="Reduce JPG, PNG, and WebP images to exact target KB (20KB, 50KB, 100KB, 200KB) online for free without losing quality."
                      canonicalUrl="https://imageinkb.com/reduce-image-in-kb"
                    />
                  }
                />
                <Route
                  path="/reduce-image-size-in-kb"
                  element={
                    <SeoPresetCompressor
                      targetKb={50}
                      title="Reduce Image Size in KB Online"
                      subtitle="Easily reduce image file sizes to exact KB limits for official exam portals, job forms, and websites."
                      canonicalUrl="https://imageinkb.com/reduce-image-size-in-kb"
                    />
                  }
                />
                <Route
                  path="/resize-image-to-kb"
                  element={
                    <SeoPresetCompressor
                      targetKb={100}
                      title="Resize Image to KB or MB Online for Free"
                      subtitle="Resize and compress photos to any target file size specified in KB or MB in 1 click."
                      canonicalUrl="https://imageinkb.com/resize-image-to-kb"
                    />
                  }
                />
                <Route
                  path="/compress-image-to-20kb"
                  element={
                    <SeoPresetCompressor
                      targetKb={20}
                      title="Compress Image to 20 KB"
                      subtitle="Strict 20 KB compression preset designed specifically for government signatures and exam forms."
                      canonicalUrl="https://imageinkb.com/compress-image-to-20kb"
                    />
                  }
                />
                <Route
                  path="/compress-image-to-50kb"
                  element={
                    <SeoPresetCompressor
                      targetKb={50}
                      title="Compress Image to 50 KB"
                      subtitle="Reduce image size strictly under 50 KB for official portals, exams, and job applications."
                      canonicalUrl="https://imageinkb.com/compress-image-to-50kb"
                    />
                  }
                />
                <Route
                  path="/compress-image-to-100kb"
                  element={
                    <SeoPresetCompressor
                      targetKb={100}
                      title="Compress Image to 100 KB"
                      subtitle="Optimal high-speed web compression strictly under 100 KB with razor-sharp quality."
                      canonicalUrl="https://imageinkb.com/compress-image-to-100kb"
                    />
                  }
                />
                <Route
                  path="/compress-image-to-200kb"
                  element={
                    <SeoPresetCompressor
                      targetKb={200}
                      title="Compress Image to 200 KB"
                      subtitle="Compress high-resolution photos down to 200 KB for websites, forms, and social media."
                      canonicalUrl="https://imageinkb.com/compress-image-to-200kb"
                    />
                  }
                />

                {/* Government & Application Tools */}
                <Route path="/passport-photo" element={<PassportPhoto />} />
                <Route path="/signature-compressor" element={<SignatureCompressor />} />

                {/* User Account & Dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Company & Legal Pages */}
                <Route path="/about" element={<AboutUs />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/contact" element={<ContactUs />} />

                {/* 404 Catch-All */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
