import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, Target, Scaling, RefreshCw, Layers, ArrowRight } from 'lucide-react';
import SeoHead from '../components/SeoHead';

export default function NotFound() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center space-y-8 animate-fade-in text-slate-700 dark:text-slate-300 transition-colors duration-200">
      <SeoHead
        title="404 — Page Not Found | Image In Kb"
        description="The page you were looking for does not exist on Image In Kb. Discover our free image optimization tools."
        canonicalUrl="https://imageinkb.com/404"
      />

      {/* 404 Visual */}
      <div className="space-y-3">
        <span className="text-6xl sm:text-8xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight font-mono">
          404
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          The link you followed may be broken or the page may have been moved. Jump straight into one of our image tools below:
        </p>
      </div>

      {/* Quick Tool Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/compress"
          className="p-3 rounded-2xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 text-slate-900 dark:text-white text-xs font-semibold flex flex-col items-center gap-1.5 transition-all shadow-xs"
        >
          <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Compress</span>
        </Link>
        <Link
          to="/resize"
          className="p-3 rounded-2xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 text-slate-900 dark:text-white text-xs font-semibold flex flex-col items-center gap-1.5 transition-all shadow-xs"
        >
          <Scaling className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Resize</span>
        </Link>
        <Link
          to="/convert"
          className="p-3 rounded-2xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 text-slate-900 dark:text-white text-xs font-semibold flex flex-col items-center gap-1.5 transition-all shadow-xs"
        >
          <RefreshCw className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Convert</span>
        </Link>
        <Link
          to="/batch"
          className="p-3 rounded-2xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 text-slate-900 dark:text-white text-xs font-semibold flex flex-col items-center gap-1.5 transition-all shadow-xs"
        >
          <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Batch ZIP</span>
        </Link>
      </div>

      <div className="pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>

    </div>
  );
}
