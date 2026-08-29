import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, AlertCircle } from 'lucide-react';
import { formatBytes } from '../utils/formatters';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export default function UploadBox({
  onImageSelected,
  isAnalyzing = false,
  uploadProgress = 0
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const validateAndProcessFile = (file) => {
    setErrorMessage(null);

    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setErrorMessage('Unsupported format. Please upload JPG, PNG, or WEBP.');
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setErrorMessage(`File is too large (${formatBytes(file.size)}). Max allowed is 25MB.`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = objectUrl;

    img.onload = () => {
      onImageSelected({
        file,
        previewUrl: objectUrl,
        name: file.name,
        size: file.size,
        formattedSize: formatBytes(file.size),
        type: file.type,
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: (img.naturalWidth / img.naturalHeight).toFixed(2)
      });
    };

    img.onerror = () => {
      setErrorMessage('Failed to read image data.');
    };
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    const handlePaste = (e) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (ALLOWED_MIME_TYPES.includes(file.type)) {
          validateAndProcessFile(file);
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <div className="w-full space-y-3">
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/60 dark:border-rose-500/40 dark:text-rose-200 text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-600 dark:text-rose-300 font-semibold px-2 py-0.5"
          >
            Dismiss
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full rounded-2xl border-2 border-dashed py-12 px-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 scale-[1.005]'
            : 'border-slate-200 bg-slate-50/70 hover:border-indigo-400 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#070b14]/70 dark:hover:border-slate-700 dark:hover:bg-[#070b14]'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400 flex items-center justify-center mb-3.5 shadow-sm">
          <UploadCloud className="w-7 h-7" />
        </div>

        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
          Drop your image here, or <span className="text-indigo-600 dark:text-indigo-400 underline">browse</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-mono">
          Supports JPG, PNG, WebP • Paste with Ctrl+V • Up to 25 MB
        </p>

        <div className="flex items-center gap-2">
          {['JPG', 'PNG', 'WEBP'].map((fmt) => (
            <span
              key={fmt}
              className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-[10px] font-mono font-medium text-slate-600 dark:text-slate-400 shadow-2xs"
            >
              {fmt}
            </span>
          ))}
        </div>

        {isAnalyzing && (
          <div className="absolute inset-0 bg-white/95 dark:bg-[#0b0f19]/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 space-y-3 z-10 animate-fade-in">
            <div className="w-6 h-6 border-2 border-indigo-600 dark:border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">Inspecting image...</p>
            <div className="w-48 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
