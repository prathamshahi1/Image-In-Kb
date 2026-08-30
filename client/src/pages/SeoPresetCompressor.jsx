import React, { useState } from 'react';
import { Target, AlertCircle, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import UploadBox from '../components/UploadBox';
import ComparisonView from '../components/ComparisonView';
import SeoHead from '../components/SeoHead';
import FaqSection from '../components/FaqSection';
import { inspectImageApi, compressImageApi } from '../services/api';

export default function SeoPresetCompressor({
  targetKb = 100,
  title = 'Reduce Image Size in KB Online',
  subtitle = 'Compress and reduce JPG, PNG, and WebP images to exact target KB limits without quality loss.',
  canonicalUrl = 'https://imageinkb.com/reduce-image-in-kb'
}) {
  const [selectedTargetKb, setSelectedTargetKb] = useState(targetKb);
  const [customKb, setCustomKb] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [serverMetadata, setServerMetadata] = useState(null);
  const [compressionResult, setCompressionResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorToast, setErrorToast] = useState(null);

  const handleImageSelected = async (clientData) => {
    setSelectedImage(clientData);
    setCompressionResult(null);
    setIsAnalyzing(true);
    setUploadProgress(15);
    setErrorToast(null);

    try {
      const response = await inspectImageApi(clientData.file, (progress) => {
        setUploadProgress(progress);
      });
      if (response && response.success) {
        setServerMetadata(response.data);
      }
    } catch (error) {
      console.warn('Inspection note:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunPresetCompress = async () => {
    if (!selectedImage?.file) return;
    setIsCompressing(true);
    setErrorToast(null);

    const finalTarget = customKb ? parseFloat(customKb) : selectedTargetKb;

    try {
      const response = await compressImageApi(selectedImage.file, {
        targetMode: 'target_size',
        targetSizeKb: finalTarget,
        outputFormat: 'original'
      });

      if (response && response.success) {
        response.data.original.previewUrl = selectedImage.previewUrl;
        setCompressionResult(response.data);
      } else {
        setErrorToast(response?.message || 'Compression failed.');
      }
    } catch (err) {
      setErrorToast(err.response?.data?.message || err.message || 'Error occurred');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setServerMetadata(null);
    setCompressionResult(null);
    setUploadProgress(0);
    setErrorToast(null);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12 animate-fade-in text-slate-700 dark:text-slate-300 transition-colors duration-200">
      <SeoHead
        title={`${title} — Free & Fast | Image In Kb`}
        description={subtitle}
        canonicalUrl={canonicalUrl}
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300 text-xs font-semibold">
          <Target className="w-3.5 h-3.5" /> High-Precision Target Optimizer
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Main Workbench */}
      <div className="p-4 sm:p-8 rounded-3xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl">
        {errorToast && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/60 dark:border-rose-500/40 dark:text-rose-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{errorToast}</span>
            </div>
            <button onClick={() => setErrorToast(null)} className="px-2 py-1 bg-rose-100 dark:bg-rose-900/50 rounded text-rose-700 dark:text-rose-300 text-xs font-semibold">
              Dismiss
            </button>
          </div>
        )}

        {!selectedImage ? (
          <UploadBox
            onImageSelected={handleImageSelected}
            isAnalyzing={isAnalyzing}
            uploadProgress={uploadProgress}
          />
        ) : compressionResult ? (
          <ComparisonView
            result={compressionResult}
            onReset={handleReset}
            onReconfigure={() => setCompressionResult(null)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
              <div className="max-h-[320px] w-full flex items-center justify-center bg-slate-200/50 dark:bg-slate-900/40 rounded-xl p-3 overflow-hidden">
                <img
                  src={selectedImage.previewUrl}
                  alt="Original"
                  className="max-h-[300px] w-auto object-contain rounded-lg shadow-sm"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400 px-1">
                <span>Original: {serverMetadata?.formattedSize || selectedImage.formattedSize}</span>
                <span>{serverMetadata?.width || selectedImage.width} × {serverMetadata?.height || selectedImage.height} px</span>
              </div>
            </div>

            <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Choose Target Size:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[20, 50, 100, 200, 500].map((kb) => (
                      <button
                        key={kb}
                        type="button"
                        onClick={() => {
                          setSelectedTargetKb(kb);
                          setCustomKb('');
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          selectedTargetKb === kb && !customKb
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                        }`}
                      >
                        {kb} KB
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom KB Input */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-500">Or enter custom target size (KB):</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="e.g. 75"
                      value={customKb}
                      onChange={(e) => setCustomKb(e.target.value)}
                      className="clean-input text-xs w-full pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">KB</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunPresetCompress}
                disabled={isCompressing}
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
              >
                {isCompressing ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                    <span>Optimizing to Target Size...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Reduce Image to {customKb || selectedTargetKb} KB →</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Structured SEO FAQs */}
      <div id="faq">
        <FaqSection />
      </div>

    </div>
  );
}
