import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Download,
  RefreshCcw,
  CheckCircle2,
  Sliders,
  ArrowUpRight,
  Columns,
  SplitSquareVertical,
  Sparkles,
  Home,
  ArrowRight,
  Eye
} from 'lucide-react';
import ComparisonSlider from './ComparisonSlider';

export default function ComparisonView({
  result,
  onReset,
  onReconfigure
}) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('side_by_side'); // 'side_by_side' | 'slider'
  const [isDownloaded, setIsDownloaded] = useState(false);

  const { original, compressed } = result;
  const isEnlarged = compressed?.isEnlarged || (compressed?.sizeBytes > (original?.sizeBytes || 0));
  const percentIncrease = isEnlarged && original?.sizeBytes > 0
    ? (((compressed.sizeBytes - original.sizeBytes) / original.sizeBytes) * 100).toFixed(1)
    : 0;

  const originalUrl = original?.previewUrl || original?.dataUri;
  const processedUrl = compressed?.dataUri;

  const handleDownload = () => {
    if (!processedUrl) return;
    const link = document.createElement('a');
    link.href = processedUrl;
    link.download = compressed.filename || `optimized-${original.name || 'image.jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Switch to the Downloaded Success screen as requested by user
    setIsDownloaded(true);
  };

  const handleGoHome = () => {
    if (onReset) onReset();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // =========================================================================
  // VIEW 1: POST-DOWNLOAD SUCCESS SCREEN (When user clicks Download)
  // =========================================================================
  if (isDownloaded) {
    return (
      <div className="py-8 px-4 max-w-xl mx-auto text-center space-y-6 animate-fade-in text-slate-800 dark:text-slate-200">
        
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        {/* Heading */}
        <div className="space-y-1.5">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Image Downloaded Successfully! 🎉
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Your optimized file <strong className="text-slate-900 dark:text-white font-mono">{compressed.filename || 'image.jpg'}</strong> has been saved to your downloads.
          </p>
        </div>

        {/* Summary Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs text-left">
          <div className="flex items-center gap-3">
            <img
              src={processedUrl}
              alt="Downloaded"
              className="w-16 h-16 rounded-xl object-contain bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 p-1"
            />
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {compressed.filename || 'optimized-image.jpg'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 shrink-0">
                  {compressed.savingsPercent}% Smaller
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-500">
                <span className="line-through">{original.formattedSize}</span> → <strong className="text-emerald-600 dark:text-emerald-400">{compressed.formattedSize}</strong>
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                {compressed.width} × {compressed.height} px • {compressed.format || 'OUTPUT'}
              </p>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleGoHome}
            className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01]"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home Page</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onReset}
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Optimize Another</span>
            </button>

            <button
              onClick={() => setIsDownloaded(false)}
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Comparison</span>
            </button>
          </div>
        </div>

      </div>
    );
  }

  // =========================================================================
  // VIEW 2: PRE-DOWNLOAD COMPARISON SCREEN (Side-by-Side or Slider)
  // =========================================================================
  return (
    <div className="space-y-6 animate-fade-in text-slate-800 dark:text-slate-200">
      
      {/* Top Success Banner & Download Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {isEnlarged ? 'Target Optimization Applied' : 'Optimization Complete'}
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30 flex items-center gap-1">
                {isEnlarged ? (
                  <>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    +{percentIncrease}% Adjusted
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    {compressed.savingsPercent}% Smaller
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-mono mt-1">
              <span className="line-through text-slate-400 dark:text-slate-500">{original.formattedSize}</span>
              {' → '}
              <strong className="text-emerald-600 dark:text-emerald-400 text-sm">{compressed.formattedSize}</strong>
              <span className="text-slate-400 dark:text-slate-500 ml-2">({compressed.width} × {compressed.height} px)</span>
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            onClick={handleDownload}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Download className="w-4 h-4" />
            <span>Download Image</span>
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Visual Result
        </div>
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setViewMode('side_by_side')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'side_by_side'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side by Side</span>
          </button>
          <button
            onClick={() => setViewMode('slider')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'slider'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Interactive Slider</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Side by Side Dual Cards View (Clean & Beautiful) */}
      {viewMode === 'side_by_side' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Card: Original */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">Original Photo</span>
              <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                {original.formattedSize}
              </span>
            </div>

            <div className="h-[280px] sm:h-[340px] w-full flex items-center justify-center bg-slate-200/50 dark:bg-slate-900/60 rounded-xl p-2 overflow-hidden">
              <img
                src={originalUrl}
                alt="Original"
                className="max-h-full max-w-full object-contain rounded-lg shadow-xs"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>{original.width} × {original.height} px</span>
              <span className="uppercase font-semibold">{original.format || 'ORIGINAL'}</span>
            </div>
          </div>

          {/* Right Card: Optimized */}
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border-2 border-indigo-500/40 dark:border-indigo-500/30 space-y-3 relative">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Optimized Result
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 font-mono font-bold">
                {compressed.formattedSize}
              </span>
            </div>

            <div className="h-[280px] sm:h-[340px] w-full flex items-center justify-center bg-white/70 dark:bg-slate-900/60 rounded-xl p-2 overflow-hidden border border-indigo-100 dark:border-slate-800">
              <img
                src={processedUrl}
                alt="Optimized Result"
                className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400">
              <span>{compressed.width} × {compressed.height} px</span>
              <span className="uppercase font-bold text-emerald-600 dark:text-emerald-400">
                {compressed.format || 'OUTPUT'}
              </span>
            </div>
          </div>

        </div>
      ) : (
        /* Mode 2: Interactive Slider View */
        <div className="space-y-2">
          <ComparisonSlider
            originalUrl={originalUrl}
            processedUrl={processedUrl}
            originalLabel={`Original (${original.formattedSize})`}
            processedLabel={`Optimized (${compressed.formattedSize})`}
          />
          <p className="text-center text-xs text-slate-500 font-mono">
            Drag the center divider to inspect quality side-by-side.
          </p>
        </div>
      )}

      {/* Action Buttons Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          Process Another Image
        </button>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {onReconfigure && (
            <button
              onClick={onReconfigure}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              Adjust Settings
            </button>
          )}

          <button
            onClick={handleDownload}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
        </div>
      </div>

    </div>
  );
}
