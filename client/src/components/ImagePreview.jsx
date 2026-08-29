import React from 'react';
import {
  Maximize2,
  HardDrive,
  Cpu,
  Layers,
  Sparkles,
  RefreshCw,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';
import { getAspectRatioString } from '../utils/formatters';
import CompressionControls from './CompressionControls';

export default function ImagePreview({
  image,
  serverMetadata,
  onReset,
  onCompress,
  isCompressing
}) {
  const name = serverMetadata?.name || image.name;
  const format = serverMetadata?.format || image.type?.split('/')[1]?.toUpperCase() || 'IMAGE';
  const width = serverMetadata?.width || image.width;
  const height = serverMetadata?.height || image.height;
  const sizeBytes = serverMetadata?.sizeBytes || image.sizeBytes;
  const formattedSize = serverMetadata?.formattedSize || image.formattedSize;
  const aspectRatio = getAspectRatioString(width, height);
  const isSharpVerified = !!serverMetadata;

  return (
    <div className="w-full space-y-6 animate-fade-in">
      
      {/* Top Banner Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white truncate max-w-xs">{name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                {format}
              </span>
            </div>
            <span className="text-xs text-slate-400">
              {isSharpVerified ? 'Verified & parsed by Sharp engine' : 'Client preview active'}
            </span>
          </div>
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Change Image
        </button>
      </div>

      {/* Main Grid: Preview on Left, Compression Controls on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: High-Resolution Image Canvas & Quick Stats (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 relative overflow-hidden group space-y-4">
          
          <div className="relative max-h-[300px] w-full flex items-center justify-center overflow-hidden rounded-xl bg-slate-900/40 p-2">
            <img
              src={image.previewUrl}
              alt="Uploaded preview"
              className="max-h-[280px] w-auto object-contain rounded-lg shadow-xl"
            />
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col">
              <span className="text-[10px] text-slate-400 font-mono">Original Size</span>
              <span className="text-sm font-bold text-white font-mono mt-0.5">{formattedSize}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col">
              <span className="text-[10px] text-slate-400 font-mono">Dimensions</span>
              <span className="text-sm font-bold text-white font-mono mt-0.5">{width} × {height}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
            <span>Aspect Ratio: {aspectRatio}</span>
            <span className="text-cyan-400">{serverMetadata?.space?.toUpperCase() || 'sRGB'}</span>
          </div>
        </div>

        {/* Right Side: Interactive Compression Engine Panel (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex flex-col justify-between">
          <CompressionControls
            onCompress={onCompress}
            isCompressing={isCompressing}
            originalSizeBytes={sizeBytes}
          />
        </div>

      </div>

    </div>
  );
}
