import React, { useState } from 'react';
import { Crop as CropIcon, RotateCw, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import UploadBox from '../components/UploadBox';
import CropCanvas from '../components/CropCanvas';
import ComparisonView from '../components/ComparisonView';
import SeoHead from '../components/SeoHead';
import { inspectImageApi, editImageApi } from '../services/api';

const ASPECT_RATIO_PRESETS = [
  { label: 'Free', value: 'free' },
  { label: '1:1 Square', value: '1:1' },
  { label: '4:3 Standard', value: '4:3' },
  { label: '16:9 Cinema', value: '16:9' },
  { label: '3:2 Photo', value: '3:2' }
];

export default function Editor() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [serverMetadata, setServerMetadata] = useState(null);
  const [editedResult, setEditedResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorToast, setErrorToast] = useState(null);

  const [aspectRatio, setAspectRatio] = useState('free');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [cropData, setCropData] = useState(null);

  const handleImageSelected = async (clientData) => {
    setSelectedImage(clientData);
    setEditedResult(null);
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

  const handleRotate = () => {
    setRotationAngle((prev) => (prev + 90) % 360);
  };

  const handleApplyEdits = async () => {
    if (!selectedImage?.file) return;
    setIsProcessing(true);
    setErrorToast(null);

    try {
      const editConfig = {
        rotation: rotationAngle,
        outputFormat: 'jpeg',
        quality: 90
      };

      if (cropData) {
        editConfig.cropLeft = cropData.left;
        editConfig.cropTop = cropData.top;
        editConfig.cropWidth = cropData.width;
        editConfig.cropHeight = cropData.height;
      }

      const response = await editImageApi(selectedImage.file, editConfig);
      if (response && response.success) {
        const unifiedData = {
          original: {
            ...response.data.original,
            previewUrl: selectedImage.previewUrl
          },
          compressed: {
            dataUri: response.data.edited.dataUri,
            filename: response.data.edited.filename,
            formattedSize: response.data.edited.formattedSize,
            savingsFormatted: response.data.edited.savingsFormatted,
            savingsPercent: response.data.edited.savingsPercent,
            width: response.data.edited.width,
            height: response.data.edited.height
          }
        };
        setEditedResult(unifiedData);
      } else {
        setErrorToast(response?.message || 'Editing failed.');
      }
    } catch (err) {
      setErrorToast(err.response?.data?.message || err.message || 'Error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setServerMetadata(null);
    setEditedResult(null);
    setUploadProgress(0);
    setErrorToast(null);
    setRotationAngle(0);
    setAspectRatio('free');
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 animate-fade-in text-slate-700 dark:text-slate-300 transition-colors duration-200">
      <SeoHead
        title="Crop & Rotate Image Editor — Free Aspect Ratio Cropper | Image In Kb"
        description="Crop images with precise aspect ratio presets (1:1, 4:3, 16:9), rotate 90 degrees, and optimize quality with in-memory Sharp processing."
        canonicalUrl="https://imageinkb.com/editor"
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300 text-xs font-semibold">
          <CropIcon className="w-3.5 h-3.5" /> Creative Editor
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Crop & Rotate <span className="text-indigo-600 dark:text-indigo-400">Editor</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Aspect ratio presets, freeform cropping, and 90° lossless rotation in memory.
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
        ) : editedResult ? (
          <ComparisonView
            result={editedResult}
            onReset={handleReset}
            onReconfigure={() => setEditedResult(null)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
              <CropCanvas
                imageUrl={selectedImage.previewUrl}
                aspectRatio={aspectRatio}
                rotation={rotationAngle}
                onCropChange={setCropData}
              />

              <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400 px-1">
                <span>{serverMetadata?.formattedSize || selectedImage.formattedSize}</span>
                <span>{serverMetadata?.width || selectedImage.width} × {serverMetadata?.height || selectedImage.height} px</span>
                <span>Rotation: {rotationAngle}°</span>
              </div>
            </div>

            <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                    Crop Aspect Ratio
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ASPECT_RATIO_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setAspectRatio(preset.value)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-medium border transition-all ${
                          aspectRatio === preset.value
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-1 ring-indigo-600/30 dark:bg-indigo-600/20 dark:border-indigo-500 dark:text-indigo-300'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                    Orientation Tools
                  </label>
                  <button
                    type="button"
                    onClick={handleRotate}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-white text-xs font-semibold border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Rotate 90° Clockwise ({rotationAngle}°)</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyEdits}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                    <span>Processing Edits...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Apply Crop & Rotation</span>
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
