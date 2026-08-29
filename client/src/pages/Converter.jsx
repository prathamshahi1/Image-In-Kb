import React, { useState } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import UploadBox from '../components/UploadBox';
import ConvertControls from '../components/ConvertControls';
import ComparisonView from '../components/ComparisonView';
import SeoHead from '../components/SeoHead';
import { inspectImageApi, convertImageApi } from '../services/api';

export default function Converter() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [serverMetadata, setServerMetadata] = useState(null);
  const [convertedResult, setConvertedResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorToast, setErrorToast] = useState(null);

  const [convertConfig, setConvertConfig] = useState({
    targetFormat: 'webp',
    quality: 85
  });

  const handleImageSelected = async (clientData) => {
    setSelectedImage(clientData);
    setConvertedResult(null);
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
    setConvertConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleConvert = async () => {
    if (!selectedImage?.file) return;
    setIsConverting(true);
    setErrorToast(null);

    try {
      const response = await convertImageApi(selectedImage.file, convertConfig);
      if (response && response.success) {
        const unifiedData = {
          original: {
            ...response.data.original,
            previewUrl: selectedImage.previewUrl
          },
          compressed: {
            dataUri: response.data.converted.dataUri,
            filename: response.data.converted.filename,
            formattedSize: response.data.converted.formattedSize,
            savingsFormatted: response.data.converted.savingsFormatted,
            savingsPercent: response.data.converted.savingsPercent,
            width: response.data.converted.width,
            height: response.data.converted.height
          }
        };
        setConvertedResult(unifiedData);
      } else {
        setErrorToast(response?.message || 'Conversion failed.');
      }
    } catch (err) {
      setErrorToast(err.response?.data?.message || err.message || 'Error occurred');
    } finally {
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setServerMetadata(null);
    setConvertedResult(null);
    setUploadProgress(0);
    setErrorToast(null);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 animate-fade-in text-slate-700 dark:text-slate-300 transition-colors duration-200">
      <SeoHead
        title="Format Converter — Convert to WebP, JPG, PNG | Image In Kb"
        description="Convert images between WebP, PNG, and JPG formats in milliseconds with adjustable quality factors."
        canonicalUrl="https://imageinkb.com/convert"
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300 text-xs font-semibold">
          <RefreshCw className="w-3.5 h-3.5" /> Next-Gen Converter
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Format <span className="text-indigo-600 dark:text-indigo-400">Converter</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Seamlessly convert between WebP, PNG, and JPG with instant in-memory processing.
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
        ) : convertedResult ? (
          <ComparisonView
            result={convertedResult}
            onReset={handleReset}
            onReconfigure={() => setConvertedResult(null)}
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
                <span className="uppercase font-bold text-indigo-600 dark:text-indigo-400">
                  {serverMetadata?.format || selectedImage.type.split('/')[1]}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <ConvertControls
                config={convertConfig}
                onChange={handleConfigChange}
                onConvert={handleConvert}
                isConverting={isConverting}
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
