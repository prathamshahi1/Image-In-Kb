import React, { useState } from 'react';
import { Layers, Download, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Trash2 } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import { formatBytes } from '../utils/formatters';
import { processBatchApi } from '../services/api';

const MAX_BATCH_FILES = 20;

export default function Batch() {
  const [files, setFiles] = useState([]);
  const [targetKb, setTargetKb] = useState(100);
  const [outputFormat, setOutputFormat] = useState('jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchResult, setBatchResult] = useState(null);
  const [errorToast, setErrorToast] = useState(null);

  const handleFilesSelected = (e) => {
    const selected = Array.from(e.target.files);
    if (files.length + selected.length > MAX_BATCH_FILES) {
      setErrorToast(`Maximum ${MAX_BATCH_FILES} files allowed per batch.`);
      return;
    }
    const mapped = selected.map((file) => ({
      file,
      name: file.name,
      size: file.size,
      formattedSize: formatBytes(file.size),
      previewUrl: URL.createObjectURL(file)
    }));
    setFiles((prev) => [...prev, ...mapped]);
    setErrorToast(null);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProcessBatch = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setErrorToast(null);

    try {
      const fileObjects = files.map((f) => f.file);
      const options = {
        targetSizeKb: targetKb,
        outputFormat
      };

      const result = await batchProcessApi(fileObjects, options);
      if (result.success) {
        setBatchResult(result.data);
      } else {
        setErrorToast(result.message || 'Batch processing failed.');
      }
    } catch (err) {
      setErrorToast(err.response?.data?.message || err.message || 'Batch error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadZip = () => {
    if (!batchResult?.zipBase64) return;
    const link = document.createElement('a');
    link.href = `data:application/zip;base64,${batchResult.zipBase64}`;
    link.download = batchResult.zipFilename || `imageinkb-batch-${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFiles([]);
    setBatchResult(null);
    setErrorToast(null);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 animate-fade-in text-slate-700 dark:text-slate-300 transition-colors duration-200">
      <SeoHead
        title="Batch Image Processor — Compress Multiple Images to ZIP | Image In Kb"
        description="Process up to 20 images concurrently in parallel in-memory streams and download a compressed ZIP archive in seconds."
        canonicalUrl="https://imageinkb.com/batch"
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" /> High-Throughput Batch Engine
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Batch Image <span className="text-indigo-600 dark:text-indigo-400">Processor</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Upload up to 20 images to compress in parallel and download a unified ZIP archive.
        </p>
      </div>

      {/* Main Container */}
      <div className="p-4 sm:p-8 rounded-3xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl space-y-6">
        {errorToast && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/60 dark:border-rose-500/40 dark:text-rose-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{errorToast}</span>
            </div>
            <button onClick={() => setErrorToast(null)} className="px-2 py-1 bg-rose-100 dark:bg-rose-900/50 rounded text-rose-700 dark:text-rose-300 text-xs font-semibold">
              Dismiss
            </button>
          </div>
        )}

        {batchResult ? (
          <div className="space-y-6 animate-fade-in text-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Batch Processed Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Processed {files.length} images into a single ZIP archive.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={handleDownloadZip}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download ZIP Archive</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-800 transition-colors"
              >
                Process Another Batch
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Upload Zone */}
            <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-slate-700 rounded-2xl p-8 text-center bg-slate-50/70 dark:bg-[#070b14]/70 transition-colors">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFilesSelected}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-2 pointer-events-none">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <Layers className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Drop up to 20 images here, or <span className="text-indigo-600 dark:text-indigo-400 underline">browse</span>
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  {files.length} / {MAX_BATCH_FILES} files selected
                </p>
              </div>
            </div>

            {/* Selected Files List */}
            {files.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {files.map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 text-center overflow-hidden"
                    >
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        className="h-20 w-full object-cover rounded-lg mb-1"
                      />
                      <p className="text-[11px] font-medium text-slate-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {item.formattedSize}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="absolute top-3 right-3 p-1 rounded-md bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Batch Settings Row */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Target Size:
                    </label>
                    <select
                      value={targetKb}
                      onChange={(e) => setTargetKb(parseInt(e.target.value, 10))}
                      className="clean-input text-xs"
                    >
                      <option value="50">50 KB</option>
                      <option value="100">100 KB</option>
                      <option value="200">200 KB</option>
                      <option value="500">500 KB</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Format:
                    </label>
                    <select
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      className="clean-input text-xs"
                    >
                      <option value="jpeg">JPG</option>
                      <option value="png">PNG</option>
                      <option value="webp">WEBP</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleProcessBatch}
                    disabled={isProcessing}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                        <span>Processing Batch...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Process & Download ZIP ({files.length})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
