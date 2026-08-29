import React from 'react';
import { Lock, Unlock, ArrowRight, Sparkles } from 'lucide-react';

const PERCENT_PRESETS = [25, 50, 75, 100];

export default function ResizeControls({
  config,
  onChange,
  onResize,
  originalDimensions,
  isProcessing = false
}) {
  const { width = 1000, height = 1000 } = originalDimensions || {};

  const handleWidthChange = (val) => {
    const w = parseInt(val, 10) || 1;
    onChange('targetWidth', w);
    if (config.maintainAspectRatio && width > 0) {
      const ratio = height / width;
      onChange('targetHeight', Math.round(w * ratio));
    }
  };

  const handleHeightChange = (val) => {
    const h = parseInt(val, 10) || 1;
    onChange('targetHeight', h);
    if (config.maintainAspectRatio && height > 0) {
      const ratio = width / height;
      onChange('targetWidth', Math.round(h * ratio));
    }
  };

  return (
    <div className="space-y-5 p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      
      {/* Tabs: Pixels vs Percentage */}
      <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => onChange('resizeMode', 'pixels')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
            config.resizeMode === 'pixels'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Exact Pixels (W × H)
        </button>
        <button
          type="button"
          onClick={() => onChange('resizeMode', 'percentage')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
            config.resizeMode === 'percentage'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Scale Percentage (%)
        </button>
      </div>

      {config.resizeMode === 'pixels' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Width (px)</label>
              <input
                type="number"
                min="1"
                max="10000"
                value={config.targetWidth || width}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="w-full clean-input text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Height (px)</label>
              <input
                type="number"
                min="1"
                max="10000"
                value={config.targetHeight || height}
                onChange={(e) => handleHeightChange(e.target.value)}
                className="w-full clean-input text-xs font-mono"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChange('maintainAspectRatio', !config.maintainAspectRatio)}
            className={`w-full py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
              config.maintainAspectRatio
                ? 'bg-indigo-50 border-indigo-600 text-indigo-700 dark:bg-indigo-600/20 dark:border-indigo-500 dark:text-indigo-300'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {config.maintainAspectRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{config.maintainAspectRatio ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Select Scale Preset</label>
          <div className="grid grid-cols-4 gap-2">
            {PERCENT_PRESETS.map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => onChange('percentage', pct)}
                className={`py-2 rounded-xl text-xs font-mono font-medium border transition-all ${
                  config.percentage === pct
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-1 ring-indigo-600/30 dark:bg-indigo-600/20 dark:border-indigo-500 dark:text-indigo-300'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>

          <div className="pt-2">
            <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 mb-1">
              <span>Custom Scale</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{config.percentage}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              value={config.percentage}
              onChange={(e) => onChange('percentage', parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
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
          <option value="webp">WEBP</option>
        </select>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={onResize}
        disabled={isProcessing}
        className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
            <span>Resizing with Lanczos3...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Resize Image</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

    </div>
  );
}
