import React from 'react';
import { Download, RefreshCcw, CheckCircle2, Sliders, ArrowUpRight } from 'lucide-react';
import ComparisonSlider from './ComparisonSlider';

export default function ComparisonView({
  result,
  onReset,
  onReconfigure
}) {
  const { original, compressed } = result;
  const isEnlarged = compressed.isEnlarged || compressed.sizeBytes > original.sizeBytes;
  const percentIncrease = isEnlarged && original.sizeBytes > 0
    ? (((compressed.sizeBytes - original.sizeBytes) / original.sizeBytes) * 100).toFixed(1)
    : 0;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = compressed.dataUri;
    link.download = compressed.filename || `optimized-${original.name || 'image.jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Success Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {isEnlarged ? 'Target Optimization Complete' : 'Optimization Complete'}
              </h4>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30 flex items-center gap-1">
                {isEnlarged ? (
                  <>
                    <ArrowUpRight className="w-3 h-3" />
                    +{percentIncrease}% Size Adjusted
                  </>
                ) : (
                  `${compressed.savingsPercent}% Smaller`
                )}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-mono mt-0.5">
              {original.formattedSize} ({original.width}×{original.height}px) → <strong className="text-emerald-600 dark:text-emerald-300">{compressed.formattedSize}</strong> ({compressed.width}×{compressed.height}px)
            </p>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Download Image
        </button>
      </div>

      {/* Visual Split Comparison Slider */}
      <div className="space-y-2">
        <ComparisonSlider
          originalUrl={original.previewUrl || original.dataUri}
          compressedUrl={compressed.dataUri}
          originalLabel={`Original (${original.formattedSize} • ${original.width}×${original.height}px)`}
          compressedLabel={`Processed (${compressed.formattedSize} • ${compressed.width}×${compressed.height}px)`}
        />
        <p className="text-center text-[11px] text-slate-500 font-mono">
          Drag the center divider to compare visual quality side-by-side.
        </p>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          Process Another Image
        </button>

        {onReconfigure && (
          <button
            onClick={onReconfigure}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <Sliders className="w-3.5 h-3.5" />
            Adjust Settings
          </button>
        )}
      </div>

    </div>
  );
}
