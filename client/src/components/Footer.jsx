import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#070b14] py-12 text-slate-500 dark:text-slate-400 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Trust Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-8 border-b border-slate-200 dark:border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Image In Kb</span>
              <span className="text-xs text-slate-500 block sm:inline sm:ml-2">Fast, In-Memory Image Engine</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>100% In-Memory Processing • Zero Server File Storage</span>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-2.5">
            <span className="font-bold text-slate-900 dark:text-white">Core Tools</span>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li><Link to="/compress" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Target KB Compressor</Link></li>
              <li><Link to="/resize" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Smart Image Resizer</Link></li>
              <li><Link to="/convert" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Format Converter (WebP/JPG)</Link></li>
              <li><Link to="/editor" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Crop & Rotate Editor</Link></li>
              <li><Link to="/batch" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Batch ZIP Processor</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <span className="font-bold text-slate-900 dark:text-white">Specialized Presets</span>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li><Link to="/compress-image-to-50kb" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Compress to 50 KB</Link></li>
              <li><Link to="/compress-image-to-100kb" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Compress to 100 KB</Link></li>
              <li><Link to="/compress-image-to-200kb" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Compress to 200 KB</Link></li>
              <li><Link to="/passport-photo" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Passport Photo Resizer</Link></li>
              <li><Link to="/signature-compressor" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Signature Compressor</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <span className="font-bold text-slate-900 dark:text-white">Platform & Hub</span>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li><Link to="/tools" className="hover:text-indigo-600 dark:hover:text-white transition-colors">All Tools Directory</Link></li>
              <li><Link to="/calculator" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Size Unit Calculator</Link></li>
              <li><Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-white transition-colors">User Dashboard</Link></li>
              <li><a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-white transition-colors">XML Sitemap</a></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <span className="font-bold text-slate-900 dark:text-white">Company & Legal</span>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li><Link to="/about" className="hover:text-indigo-600 dark:hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Contact & Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Image In Kb. Fast, private, and in-memory image optimization platform.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:underline">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <span>•</span>
            <Link to="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
