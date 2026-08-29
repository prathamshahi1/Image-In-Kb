import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

const FORMATS = [
  { id: 'webp', name: 'WEBP', desc: 'Optimal for web & SEO' },
  { id: 'jpeg', name: 'JPG / JPEG', desc: 'Universal compatibility' },
  { id: 'png', name: 'PNG', desc: 'Lossless with transparency' }
];

export default function ConvertControls({
  config,
  onChange,
  onConvert,
  isConverting = false
}) {
  return (
    <div className="space-y-5 p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
          Select Output Format
        </label>
        
        <div className="space-y-2">
          {FORMATS.map((fmt) => {
            const isSelected = config.targetFormat === fmt.id;
            return (
              <button
                key={fmt.id}
                type="button"
                onClick={() => onChange('targetFormat', fmt.id)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-600 text-slate-900 ring-1 ring-indigo-600/30 dark:bg-indigo-600/20 dark:border-indigo-500 dark:text-white'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{fmt.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{fmt.desc}</p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quality Slider */}
      <div className="pt-2">
        <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 mb-1">
          <span>Output Quality</span>
          <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{config.quality}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={config.quality}
          onChange={(e) => onChange('quality', parseInt(e.target.value, 10))}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={onConvert}
        disabled={isConverting}
        className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isConverting ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
            <span>Converting Format...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Convert to {config.targetFormat.toUpperCase()}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}
