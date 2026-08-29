import React, { useState } from 'react';
import { PenTool, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import UploadBox from '../components/UploadBox';
import ComparisonView from '../components/ComparisonView';
import SeoHead from '../components/SeoHead';
import { inspectImageApi, compressImageApi, resizeImageApi } from '../services/api';

const SIGNATURE_SIZE_PRESETS = [
  { id: 10, label: 'Under 10 KB', desc: 'Strict bank & exam portals' },
  { id: 20, label: 'Under 20 KB', desc: 'Govt SSC, Railway & job forms' },
  { id: 50, label: 'Under 50 KB', desc: 'Universal passport & portal upload' }
];

export default function SignatureCompressor() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [serverMetadata, setServerMetadata] = useState(null);
  const [compressedResult, setCompressedResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorToast, setErrorToast] = useState(null);

  const [targetKb, setTargetKb] = useState(20);
  const [outputFormat, setOutputFormat] = useState('jpeg');

  const handleImageSelected = async (clientData) => {
    setSelectedImage(clientData);
    setCompressedResult(null);
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

  const handleCompressSignature = async () => {
    if (!selectedImage?.file) return;
    setIsCompressing(true);
    setErrorToast(null);

    try {
      const resizeRes = await resizeImageApi(selectedImage.file, {
        resizeMode: 'pixels',
        targetWidth: 300,
        targetHeight: 120,
        maintainAspectRatio: true,
        outputFormat,
        quality: 85
      });

      if (!resizeRes.success) throw new Error(resizeRes.message || 'Resize failed');

      const byteString = atob(resizeRes.data.resized.dataUri.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const resizedFile = new File([ab], 'signature.jpg', { type: `image/${outputFormat}` });

      const compressRes = await compressImageApi(resizedFile, {
        targetMode: 'target_size',
        targetSizeKb: targetKb,
        outputFormat
      });

      if (compressRes.success) {
        compressRes.data.original.previewUrl = selectedImage.previewUrl;
        compressRes.data.compressed.filename = `signature-under-${targetKb}kb.${outputFormat === 'jpeg' ? 'jpg' : outputFormat}`;
        setCompressedResult(compressRes.data);
      } else {
        setErrorToast(compressRes.message || 'Compression failed');
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
    setCompressedResult(null);
    setUploadProgress(0);
    setErrorToast(null);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 animate-fade-in text-slate-700 dark:text-slate-300 transition-colors duration-200">
      <SeoHead
        title="Signature Compressor — Reduce Signature Under 10KB, 20KB | Image In Kb"
        description="Compress handwritten signatures strictly under 10 KB, 20 KB, or 50 KB for official online exam registration and government portals."
        canonicalUrl="https://imageinkb.com/signature-compressor"
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300 text-xs font-semibold">
          <PenTool className="w-3.5 h-3.5" /> Portal Signature Optimizer
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Signature <span className="text-indigo-600 dark:text-indigo-400">Compressor</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Compress handwritten signatures strictly under 10 KB, 20 KB, or 50 KB.
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
        ) : compressedResult ? (
          <ComparisonView
            result={compressedResult}
            onReset={handleReset}
            onReconfigure={() => setCompressedResult(null)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
              <div className="max-h-[300px] w-full flex items-center justify-center bg-white rounded-xl p-4 overflow-hidden border border-slate-200 dark:border-slate-800">
                <img
                  src={selectedImage.previewUrl}
                  alt="Signature"
                  className="max-h-[260px] w-auto object-contain"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400 px-1">
                <span>{serverMetadata?.formattedSize || selectedImage.formattedSize}</span>
                <span>{serverMetadata?.width || selectedImage.width} × {serverMetadata?.height || selectedImage.height} px</span>
              </div>
            </div>

            <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Select Size Limit
                </label>
                <div className="space-y-2">
                  {SIGNATURE_SIZE_PRESETS.map((p) => {
                    const isSelected = targetKb === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setTargetKb(p.id)}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-600 text-slate-900 ring-1 ring-indigo-600/30 dark:bg-indigo-600/20 dark:border-indigo-500 dark:text-white'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{p.label}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{p.desc}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-300">
                          {p.id} KB
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Format</label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="w-full clean-input text-xs"
                  >
                    <option value="jpeg">JPG / JPEG</option>
                    <option value="png">PNG</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCompressSignature}
                disabled={isCompressing}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isCompressing ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                    <span>Compressing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Compress Signature (&le; {targetKb} KB)</span>
                    <ArrowRight className="w-4 h-4" />
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
