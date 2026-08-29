import React from 'react';
import { Sparkles, ShieldCheck, Zap, Server, CheckCircle2, FileType, Cpu } from 'lucide-react';

export default function SeoContentSection() {
  return (
    <section className="py-12 border-t border-slate-200 dark:border-slate-800/80 space-y-12 animate-fade-in text-slate-700 dark:text-slate-300 transition-colors duration-200">
      
      {/* Main Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300 text-xs font-semibold">
          <Cpu className="w-3.5 h-3.5" /> High-Performance Technical Architecture
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          How Image In Kb Powers Lightning-Fast Image Optimization
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Discover the algorithms, privacy architecture, and next-generation image encoding behind our lossless & lossy optimization platform.
        </p>
      </div>

      {/* Grid Content Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm leading-relaxed">
        
        {/* Block 1: Binary Search Optimization */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            1. The Science of Binary-Search Quality Tuning
          </h3>
          <p>
            Standard online image compressors rely on a crude, single-pass quality slider (e.g., arbitrarily lowering quality to 60%). This frequently results in either a file that is still too large or an image ruined by heavy compression artifacts and blurred text.
          </p>
          <p>
            Image In Kb solves this by executing an automated <strong>iterative binary search algorithm</strong> on the Sharp (Libvips) native C++ engine. When you specify a target size like <strong>50 KB</strong> or <strong>100 KB</strong>, our server mathematically searches quality factors ($1 \le Q \le 100$) in $\le 8$ iterations within milliseconds. It converges on the absolute highest visual quality that stays strictly within your byte quota—without downscaling pixel dimensions unless requested.
          </p>
        </div>

        {/* Block 2: In-Memory Privacy */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            2. In-Memory Processing & Zero-Retention Security
          </h3>
          <p>
            Most legacy tools write uploaded files to temporary storage directories on disk, exposing sensitive user photos, official government IDs, and signatures to potential leaks and file system vulnerabilities.
          </p>
          <p>
            Image In Kb operates on a strict <strong>In-Memory Buffer Pipeline</strong>. Incoming image streams are decoded into volatile RAM buffers, optimized via multi-threaded native C++ bindings, and piped directly back over HTTPS. Once the request finishes, the memory is instantly reclaimed by the Node.js garbage collector. Your private pictures never touch a database or hard drive.
          </p>
        </div>

      </div>

      {/* Format Comparison Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="space-y-1">
          <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileType className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Comparing Web Formats: WebP vs. JPG vs. PNG
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Selecting the right format is critical for Google Core Web Vitals and lightning-fast page load speeds.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                <th className="pb-3 pl-2">Format</th>
                <th className="pb-3">Compression Type</th>
                <th className="pb-3">Alpha Transparency</th>
                <th className="pb-3">Best Use Case</th>
                <th className="pb-3">Savings vs JPEG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3 pl-2 font-bold text-indigo-600 dark:text-indigo-400">WEBP</td>
                <td className="py-3">Lossy & Lossless</td>
                <td className="py-3 text-emerald-600 dark:text-emerald-400 font-semibold">✓ Supported</td>
                <td className="py-3">Modern Websites, SEO & Mobile Apps</td>
                <td className="py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">25% – 35% Smaller</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3 pl-2 font-bold text-slate-900 dark:text-white">JPG / JPEG</td>
                <td className="py-3">Lossy Quantization</td>
                <td className="py-3 text-rose-500 font-semibold">✗ Not Supported</td>
                <td className="py-3">Digital Photography & Print Media</td>
                <td className="py-3 font-mono text-slate-500">Baseline Standard</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3 pl-2 font-bold text-slate-900 dark:text-white">PNG</td>
                <td className="py-3">Lossless Deflate</td>
                <td className="py-3 text-emerald-600 dark:text-emerald-400 font-semibold">✓ Supported</td>
                <td className="py-3">Logos, Icons & Crisp Line Art</td>
                <td className="py-3 font-mono text-amber-500">Larger (Lossless)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SEO Portal & Application Guide */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-100/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-4 text-xs sm:text-sm leading-relaxed">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          3. Guide: Preparing Images for Government, UPSC, SSC & Visa Portals
        </h3>
        <p>
          Online admission forms, recruitment portals (such as UPSC, SSC, IBPS, State PSCs), and international visa applications enforce strict dimension and file size boundaries. Uploading an uncompressed high-resolution smartphone photo frequently triggers error messages like <em>"File size exceeds 50 KB"</em> or <em>"Invalid signature dimensions"</em>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block text-xs">US & Schengen Passport</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              2 × 2 inches (600 × 600 px) or 35 × 45 mm (413 × 531 px) capped strictly under 100 KB or 50 KB.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block text-xs">Government Signatures</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Must remain between 10 KB and 20 KB with crisp black-on-white contrast for document readability.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block text-xs">Web Core Web Vitals</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Serve images under 100 KB in WebP format to achieve sub-second Largest Contentful Paint (LCP) scores on Google.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
