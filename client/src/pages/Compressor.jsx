import React, { useState, useEffect } from 'react';
import { Target, AlertCircle } from 'lucide-react';
import UploadBox from '../components/UploadBox';
import CompressionControls from '../components/CompressionControls';
import ComparisonView from '../components/ComparisonView';
import SeoHead from '../components/SeoHead';
import { inspectImageApi, compressImageApi } from '../services/api';

export default function Compressor() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [serverMetadata, setServerMetadata] = useState(null);
  const [compressionResult, setCompressionResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorToast, setErrorToast] = useState(null);

  const [compressConfig, setCompressConfig] = useState({
    targetMode: 'target_size',
    targetSizeKb: 100,
    manualQuality: 80,
    outputFormat: 'original'
  });

  const handleReset = () => {
    setSelectedImage(null);
    setServerMetadata(null);
    setCompressionResult(null);
    setUploadProgress(0);
    setErrorToast(null);
  };

  useEffect(() => {
    const onResetHome = () => handleReset();
    window.addEventListener('imageinkb:reset-home', onResetHome);
    return () => window.removeEventListener('imageinkb:reset-home', onResetHome);
  }, []);

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
    } catch (err) {
      console.warn('Metadata inspect note:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfigChange = (field, value) => {
    setCompressConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleCompress = async () => {
    if (!selectedImage?.file) return;
    setIsCompressing(true);
    setErrorToast(null);

    try {
      const response = await compressImageApi(selectedImage.file, compressConfig);
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

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 animate-fade-in text-slate-700 dark:text-slate-300 transition-colors duration-200">
      <SeoHead
        title="Target Size Compressor — Reduce Image to Exact KB | Image In Kb"
        description="Compress JPG, PNG, and WebP images to exact target KB sizes (50KB, 100KB, 200KB, 500KB) using binary search quality tuning."
        canonicalUrl="https://imageinkb.com/compress"
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300 text-xs font-semibold">
          <Target className="w-3.5 h-3.5" /> Target KB Compressor
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Target Size <span className="text-indigo-600 dark:text-indigo-400">Compressor</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Reduce images to exact KB targets (50KB, 100KB, 200KB, etc.) without downscaling dimensions.
        </p>
      </div>

      {/* Main Container */}
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
              <div className="max-h-[340px] w-full flex items-center justify-center bg-slate-200/50 dark:bg-slate-900/40 rounded-xl p-3 overflow-hidden">
                <img
                  src={selectedImage.previewUrl}
                  alt="Original"
                  className="max-h-[320px] w-auto object-contain rounded-lg shadow-sm"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400 px-1">
                <span>{serverMetadata?.formattedSize || selectedImage.formattedSize}</span>
                <span>{serverMetadata?.width || selectedImage.width} × {serverMetadata?.height || selectedImage.height} px</span>
                <span className="uppercase">{serverMetadata?.format || selectedImage.type.split('/')[1]}</span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <CompressionControls
                config={compressConfig}
                onChange={handleConfigChange}
                onCompress={handleCompress}
                isCompressing={isCompressing}
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
