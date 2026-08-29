import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Zap, Server, Award, Target, ArrowRight, Heart, Users } from 'lucide-react';
import SeoHead from '../components/SeoHead';

export default function AboutUs() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 animate-fade-in text-slate-700 dark:text-slate-300 transition-colors duration-200">
      <SeoHead
        title="About Us — The Story Behind Image In Kb"
        description="Learn about Image In Kb's mission to provide the fastest, most private, and accessible image optimization platform on the web."
        canonicalUrl="https://imageinkb.com/about"
      />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Our Mission & Engineering Story
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Building the Fastest, Privacy-First <span className="text-indigo-600 dark:text-indigo-400">Image Platform</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          We built Image In Kb to solve a simple frustration: online image tools that are slow, ad-cluttered, privacy-invasive, and ruin image quality.
        </p>
      </div>

      {/* 3 Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Blazing Speed</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Powered by high-performance multi-threaded native C++ Libvips engines, processing images in under 100 milliseconds.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Zero-Retention Privacy</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            All files are held exclusively in temporary RAM buffers and discarded the moment your download begins.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Pixel-Perfect Precision</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Binary search algorithms dial in the exact target size you need without distorting dimensions or blurring text.
          </p>
        </div>
      </div>

      {/* Detailed Narrative */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 space-y-6 text-xs sm:text-sm leading-relaxed shadow-xs">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          Why We Built Image In Kb
        </h2>
        <p>
          Whether you are a web developer trying to shave milliseconds off your Google Core Web Vitals, a student submitting a signature under 20 KB for a government portal, or a photographer formatting a passport photo—image tools should be fast, transparent, and completely respectful of your privacy.
        </p>
        <p>
          Traditional tools upload your files to permanent Amazon S3 buckets or unencrypted server disks. Image In Kb eliminates this risk through modern volatile RAM streaming. We believe professional web utilities should be clean, ad-free, accessible, and fast.
        </p>

        <div className="pt-4 flex flex-wrap items-center gap-3">
          <Link
            to="/tools"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all inline-flex items-center gap-2"
          >
            <span>Explore All Tools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contact"
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-800 transition-colors"
          >
            Contact the Team
          </Link>
        </div>
      </div>

    </div>
  );
}
