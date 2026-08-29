import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

const TARGET_PRESETS = [
  { label: '50 KB', value: 50 },
  { label: '100 KB', value: 100 },
  { label: '200 KB', value: 200 },
  { label: '500 KB', value: 500 },
  { label: '1 MB', value: 1024 }
];

export default function CompressionControls({
  config,
  onChange,
  onCompress,
  isCompressing = false
}) {
  const isCustom = !TARGET_PRESETS.some((p) => p.value === config.targetSizeKb) && config.targetMode === 'target_size';

  return (
    <div className="space-y-5 p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      
      {/* Mode Selector Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => onChange('targetMode', 'target_size')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
            config.targetMode === 'target_size'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Target Size (KB)
        </button>
        <button
          type="button"
          onClick={() => onChange('targetMode', 'quality')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
            config.targetMode === 'quality'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Manual Quality (%)
        </button>
      </div>

      {config.targetMode === 'target_size' ? (
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            Select Target File Size
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TARGET_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => onChange('targetSizeKb', preset.value)}
                className={`py-2 px-3 rounded-xl text-xs font-mono font-medium border transition-all ${
                  config.targetSizeKb === preset.value && !isCustom
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-1 ring-indigo-600/30 dark:bg-indigo-600/20 dark:border-indigo-500 dark:text-indigo-300'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                if (!isCustom) onChange('targetSizeKb', 75);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                isCustom
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-1 ring-indigo-600/30 dark:bg-indigo-600/20 dark:border-indigo-500 dark:text-indigo-300'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              Custom KB
            </button>
          </div>

          {isCustom && (
            <div className="pt-2">
              <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Enter Target KB</label>
              <input
                type="number"
                min="5"
                max="25000"
                value={config.targetSizeKb}
                onChange={(e) => onChange('targetSizeKb', parseInt(e.target.value, 10) || 50)}
                className="w-full clean-input text-xs font-mono"
                placeholder="e.g. 75"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
            <span>Compression Quality</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{config.manualQuality}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            value={config.manualQuality}
            onChange={(e) => onChange('manualQuality', parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
      )}

      {/* Output Format */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Export Format</label>
        <select
          value={config.outputFormat}
          onChange={(e) => onChange('outputFormat', e.target.value)}
          className="w-full clean-input text-xs"
        >
          <option value="original">Keep Original Format</option>
          <option value="jpeg">JPG / JPEG</option>
          <option value="png">PNG</option>
          <option value="webp">WEBP (Recommended for web)</option>
        </select>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={onCompress}
        disabled={isCompressing}
        className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isCompressing ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
            <span>Optimizing Buffer...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Compress Image</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

    </div>
  );
}
