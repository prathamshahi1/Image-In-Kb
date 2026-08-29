import React, { useState } from 'react';
import { UserCheck, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import UploadBox from '../components/UploadBox';
import CropCanvas from '../components/CropCanvas';
import ComparisonView from '../components/ComparisonView';
import SeoHead from '../components/SeoHead';
import { inspectImageApi, resizeImageApi, compressImageApi } from '../services/api';

const PASSPORT_PRESETS = [
  { id: 'india_schengen', name: 'India / Schengen Visa', width: 413, height: 531, label: '35 x 45 mm', ratio: '4:3', maxKb: 50 },
  { id: 'us', name: 'US Passport / Visa', width: 600, height: 600, label: '2 x 2 in (600x600 px)', ratio: '1:1', maxKb: 100 },
  { id: 'gov_exam', name: 'Govt SSC / UPSC Exam', width: 200, height: 230, label: '200 x 230 px', ratio: '4:3', maxKb: 50 }
];

export default function PassportPhoto() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [serverMetadata, setServerMetadata] = useState(null);
  const [processedResult, setProcessedResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorToast, setErrorToast] = useState(null);

  const [selectedPreset, setSelectedPreset] = useState(PASSPORT_PRESETS[0]);
  const [maxSizeKb, setMaxSizeKb] = useState(50);
  const [cropCoords, setCropCoords] = useState(null);

  const handleImageSelected = async (clientData) => {
    setSelectedImage(clientData);
    setProcessedResult(null);
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

  const handleProcessPassport = async () => {
    if (!selectedImage?.file) return;
    setIsProcessing(true);
    setErrorToast(null);

    try {
      const resizeRes = await resizeImageApi(selectedImage.file, {
        resizeMode: 'pixels',
        targetWidth: selectedPreset.width,
        targetHeight: selectedPreset.height,
        maintainAspectRatio: false,
        outputFormat: 'jpeg',
        quality: 90
      });

      if (!resizeRes.success) throw new Error(resizeRes.message || 'Resize failed');

      const byteString = atob(resizeRes.data.resized.dataUri.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const resizedFile = new File([ab], 'passport.jpg', { type: 'image/jpeg' });

      const compressRes = await compressImageApi(resizedFile, {
        targetMode: 'target_size',
        targetSizeKb: maxSizeKb,
        outputFormat: 'jpeg'
      });

      if (compressRes.success) {
        compressRes.data.original.previewUrl = selectedImage.previewUrl;
        compressRes.data.compressed.filename = `passport-${selectedPreset.width}x${selectedPreset.height}.jpg`;
        setProcessedResult(compressRes.data);
      } else {
        setErrorToast(compressRes.message || 'Processing failed');
      }
    } catch (err) {
      setErrorToast(err.response?.data?.message || err.message || 'Error processing photo');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setServerMetadata(null);
    setProcessedResult(null);
    setUploadProgress(0);
    setErrorToast(null);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 animate-fade-in text-slate-700 dark:text-slate-300 transition-colors duration-200">
      <SeoHead
        title="Passport Photo Resizer — US, Schengen & India Visa Formats | Image In Kb"
        description="Create compliant passport and visa photos online. Pre-calibrated presets for US 2x2 inch, Schengen 35x45mm, and UPSC/SSC exams with strict 50KB limits."
        canonicalUrl="https://imageinkb.com/passport-photo"
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300 text-xs font-semibold">
          <UserCheck className="w-3.5 h-3.5" /> Passport & Visa Standards
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Passport Photo <span className="text-indigo-600 dark:text-indigo-400">Resizer</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Resize and crop portraits to standard passport and visa specifications.
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
        ) : processedResult ? (
          <ComparisonView
            result={processedResult}
            onReset={handleReset}
            onReconfigure={() => setProcessedResult(null)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3">
              <CropCanvas
                imageUrl={selectedImage.previewUrl}
                aspectRatio={selectedPreset.ratio}
                onCropChange={setCropCoords}
              />
              <p className="text-center text-[11px] text-slate-500 font-mono">
                Position and center your face inside the crop area.
              </p>
            </div>

            <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Select Dimension Standard
                </label>
                <div className="space-y-2">
                  {PASSPORT_PRESETS.map((p) => {
                    const isSelected = selectedPreset.id === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedPreset(p);
                          setMaxSizeKb(p.maxKb);
                        }}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-600 text-slate-900 ring-1 ring-indigo-600/30 dark:bg-indigo-600/20 dark:border-indigo-500 dark:text-white'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{p.label}</p>
                        </div>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-indigo-600 dark:text-indigo-300">
                          {p.width}×{p.height}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Max File Size Limit
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[30, 50, 100].map((kb) => (
                      <button
                        key={kb}
                        type="button"
                        onClick={() => setMaxSizeKb(kb)}
                        className={`py-1.5 rounded-lg text-xs font-mono font-medium border transition-all ${
                          maxSizeKb === kb
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-1 ring-indigo-600/30 dark:bg-indigo-600/20 dark:border-indigo-500 dark:text-indigo-300'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        &le; {kb} KB
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProcessPassport}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Passport Photo</span>
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
