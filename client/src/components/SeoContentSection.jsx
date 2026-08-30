import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Zap, CheckCircle2, FileType, Cpu, Upload, Download, ArrowRight } from 'lucide-react';
import { clientConvertImage } from '../services/clientImageEngine';

export default function SeoContentSection() {
  const [testFile, setTestFile] = useState(null);
  const [testPreview, setTestPreview] = useState(null);
  const [formatResults, setFormatResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTestUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTestFile(file);
    setTestPreview(URL.createObjectURL(file));
    setIsProcessing(true);

    try {
      // Generate JPG, WebP, and PNG versions in real-time in the browser
      const [jpgRes, webpRes, pngRes] = await Promise.all([
        clientConvertImage(file, { targetFormat: 'jpeg', quality: 85 }),
        clientConvertImage(file, { targetFormat: 'webp', quality: 85 }),
        clientConvertImage(file, { targetFormat: 'png', quality: 85 })
      ]);

      setFormatResults({
        originalSize: file.size,
        jpg: jpgRes.data.converted,
        webp: webpRes.data.converted,
        png: pngRes.data.converted
      });
    } catch (err) {
      console.warn('Format test note:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadFormat = (dataUri, filename) => {
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-12 border-t border-slate-200 dark:border-slate-800/80 space-y-12 animate-fade-in text-slate-700 dark:text-slate-300 transition-colors duration-200">
      
      {/* Main Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300 text-xs font-semibold">
          <FileType className="w-3.5 h-3.5" /> Complete Format Support
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          All 3 Formats Are 100% Supported
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Upload any photo to see how JPG, WebP, and PNG compare in size and quality, or choose the best one for your need.
        </p>
      </div>

      {/* Interactive 3-Format Playground */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Live 3-Format Converter & Comparator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload any image below to instantly convert and compare JPG, WebP, and PNG outputs.
            </p>
          </div>

          <label className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer transition-all shrink-0">
            <Upload className="w-3.5 h-3.5" />
            <span>{testFile ? 'Change Test Image' : 'Upload Image to Test All 3'}</span>
            <input type="file" accept="image/*" onChange={handleTestUpload} className="hidden" />
          </label>
        </div>

        {/* 3 Format Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: JPG */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-900 dark:text-white">JPG / JPEG</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">
                  ✓ Universal
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Accepted by 100% of websites, job application portals, passport forms, and school registrations.
              </p>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
                <div className="text-slate-500">Best For:</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">Camera photos, exams & document forms</div>
              </div>
            </div>

            {formatResults?.jpg ? (
              <div className="pt-2 space-y-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Output Size:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatResults.jpg.formattedSize}</span>
                </div>
                <button
                  onClick={() => handleDownloadFormat(formatResults.jpg.dataUri, formatResults.jpg.filename)}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download JPG
                </button>
              </div>
            ) : null}
          </div>

          {/* Card 2: WebP */}
          <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border-2 border-indigo-500/40 space-y-4 flex flex-col justify-between relative">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  WEBP
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                  ⚡ 35% Smaller
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Created by Google for the fastest web speed. Gives smaller file sizes than JPG at the same quality.
              </p>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 text-[11px] space-y-1">
                <div className="text-indigo-600 dark:text-indigo-400 font-semibold">Best For:</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">Websites, blog posts, speed & SEO ranking</div>
              </div>
            </div>

            {formatResults?.webp ? (
              <div className="pt-2 space-y-2 border-t border-indigo-200/50 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Output Size:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatResults.webp.formattedSize}</span>
                </div>
                <button
                  onClick={() => handleDownloadFormat(formatResults.webp.dataUri, formatResults.webp.filename)}
                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  <Download className="w-3.5 h-3.5" /> Download WebP
                </button>
              </div>
            ) : null}
          </div>

          {/* Card 3: PNG */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-900 dark:text-white">PNG</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300">
                  ✓ Transparent BG
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Lossless format with crystal clear sharp edges and transparent (see-through) background support.
              </p>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
                <div className="text-slate-500">Best For:</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">Logos, signatures, icons & screenshots</div>
              </div>
            </div>

            {formatResults?.png ? (
              <div className="pt-2 space-y-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Output Size:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatResults.png.formattedSize}</span>
                </div>
                <button
                  onClick={() => handleDownloadFormat(formatResults.png.dataUri, formatResults.png.filename)}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download PNG
                </button>
              </div>
            ) : null}
          </div>

        </div>
      </div>

      {/* Grid Content Blocks (Architecture & Privacy) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm leading-relaxed">
        
        {/* Block 1: Binary Search Optimization */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            1. Precision Binary-Search Quality Tuning
          </h3>
          <p>
            Standard online image compressors rely on a crude, single-pass quality slider (e.g., arbitrarily lowering quality to 60%). This frequently results in either a file that is still too large or an image ruined by heavy compression artifacts and blurred text.
          </p>
          <p>
            Image In Kb solves this by executing an automated <strong>iterative binary search algorithm</strong>. When you specify a target size like <strong>50 KB</strong> or <strong>100 KB</strong>, our engine tests quality factors ($1 \le Q \le 100$) in $\le 8$ iterations within milliseconds, converging on the absolute highest visual quality that fits your required limit.
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
            Image In Kb operates on a strict <strong>In-Memory Buffer Pipeline</strong>. Incoming images are transformed directly in volatile memory buffers with zero raw image disk storage. Your personal pictures never touch a database or hard drive.
          </p>
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
