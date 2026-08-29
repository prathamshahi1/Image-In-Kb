import React, { useState } from 'react';
import { Target, AlertCircle, Sparkles } from 'lucide-react';
import UploadBox from '../components/UploadBox';
import ComparisonView from '../components/ComparisonView';
import { inspectImageApi, compressImageApi } from '../services/api';

export default function SeoPresetCompressor({
  targetKb = 100,
  title = 'Compress Image to 100 KB',
  subtitle = 'Reduce image file sizes strictly under 100 KB without visible quality degradation.'
}) {
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

    try {
      const response = await compressImageApi(selectedImage.file, {
        targetMode: 'target_size',
        targetSizeKb: targetKb,
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
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 animate-fade-in">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
          <Target className="w-3.5 h-3.5" /> Exact {targetKb} KB Preset
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-slate-400">
          {subtitle}
        </p>
      </div>

      {/* Main Workbench */}
      <div className="p-5 sm:p-8 rounded-3xl bg-[#0e1424]/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
        {errorToast && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorToast}</span>
            </div>
            <button onClick={() => setErrorToast(null)} className="px-2 py-1 bg-rose-900/50 rounded text-rose-300">
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
            <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
              <div className="max-h-[320px] w-full flex items-center justify-center bg-slate-900/40 rounded-xl p-3 overflow-hidden">
                <img
                  src={selectedImage.previewUrl}
                  alt="Original"
                  className="max-h-[300px] w-auto object-contain rounded-lg shadow-sm"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                <span>Original: {serverMetadata?.formattedSize || selectedImage.formattedSize}</span>
                <span>{serverMetadata?.width || selectedImage.width} × {serverMetadata?.height || selectedImage.height} px</span>
              </div>
            </div>

            <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1">
                  <span className="font-semibold text-white block">Automatic Target Preset</span>
                  <p className="text-slate-400">
                    Binary-search tuning will optimize this image to stay strictly under <strong>{targetKb} KB</strong>.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunPresetCompress}
                disabled={isCompressing}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isCompressing ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                    <span>Optimizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Compress to &le; {targetKb} KB</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
