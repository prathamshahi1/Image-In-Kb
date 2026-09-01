import React, { useState } from 'react';
import {
  Crop as CropIcon,
  RotateCw,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Type,
  Calendar,
  User,
  Check,
  Palette
} from 'lucide-react';
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

export default function Editor({
  title = 'Crop & Rotate Edit',
  subtitle = 'Aspect ratio presets, freeform cropping, candidate name & date stamps, and 90° lossless rotation.',
  canonicalUrl = 'https://imageinkb.com/edit',
  badge = 'Photo Edit'
}) {
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

  // New Feature: Name & Date on Photo (Passport & Exam Applications)
  const [nameDateConfig, setNameDateConfig] = useState({
    enabled: false,
    name: '',
    date: '',
    style: 'white_strip', // 'white_strip' | 'black_strip' | 'transparent'
    fontSizeRatio: 'medium' // 'small' | 'medium' | 'large'
  });

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
        quality: 92,
        nameDateConfig: nameDateConfig.enabled ? nameDateConfig : null
      };

      if (cropData) {
        editConfig.crop = cropData;
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

  const handleSetTodayDate = (prefix = 'DOP: ') => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    setNameDateConfig((prev) => ({
      ...prev,
      date: `${prefix}${dd}/${mm}/${yyyy}`
    }));
  };

  const handleReset = () => {
    setSelectedImage(null);
    setServerMetadata(null);
    setEditedResult(null);
    setUploadProgress(0);
    setErrorToast(null);
    setRotationAngle(0);
    setAspectRatio('free');
    setNameDateConfig({
      enabled: false,
      name: '',
      date: '',
      style: 'white_strip',
      fontSizeRatio: 'medium'
    });
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 animate-fade-in text-slate-700 dark:text-slate-300 transition-colors duration-200">
      <SeoHead
        title={`${title} — Free Online Tool | Image In Kb`}
        description={subtitle}
        canonicalUrl={canonicalUrl}
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300 text-xs font-semibold">
          <CropIcon className="w-3.5 h-3.5" /> {badge}
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {subtitle}
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
            <button onClick={() => setErrorToast(null)} className="px-2 py-1 bg-rose-100 dark:bg-rose-900/50 rounded text-rose-700 dark:text-rose-300 text-xs font-semibold cursor-pointer">
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
            
            {/* Left Preview & Crop Canvas */}
            <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
              <CropCanvas
                imageUrl={selectedImage.previewUrl}
                aspectRatio={aspectRatio}
                rotation={rotationAngle}
                nameDateConfig={nameDateConfig}
                onCropChange={setCropData}
              />

              <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400 px-1">
                <span>{serverMetadata?.formattedSize || selectedImage.formattedSize}</span>
                <span>{serverMetadata?.width || selectedImage.width} × {serverMetadata?.height || selectedImage.height} px</span>
                <span>Rotation: {rotationAngle}°</span>
              </div>
            </div>

            {/* Right Editing Controls Panel */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* 1. Crop Aspect Ratio Section */}
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
                        className={`py-2 px-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
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

                {/* 2. NEW FEATURE: Name & Date on Photo (Passport & Exam Applications) */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Type className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Name & Date on Photo
                      </label>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() =>
                        setNameDateConfig((prev) => ({ ...prev, enabled: !prev.enabled }))
                      }
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        nameDateConfig.enabled
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {nameDateConfig.enabled ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Enabled</span>
                        </>
                      ) : (
                        <span>+ Add Text</span>
                      )}
                    </button>
                  </div>

                  {nameDateConfig.enabled && (
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-indigo-200 dark:border-indigo-500/30 space-y-3 animate-fade-in text-xs">
                      
                      {/* Candidate Name Input */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                          <span className="font-semibold flex items-center gap-1">
                            <User className="w-3 h-3 text-indigo-500" /> Candidate Name:
                          </span>
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. PRATHAM KUMAR"
                          value={nameDateConfig.name}
                          onChange={(e) =>
                            setNameDateConfig((prev) => ({ ...prev, name: e.target.value }))
                          }
                          className="clean-input text-xs w-full uppercase"
                        />
                      </div>

                      {/* Date of Birth / Date of Photo Input */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                          <span className="font-semibold flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-indigo-500" /> Date (DOB / DOP):
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleSetTodayDate('DOP: ')}
                              className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-medium hover:underline cursor-pointer"
                            >
                              Today (DOP)
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setNameDateConfig((prev) => ({
                                  ...prev,
                                  date: prev.date ? (prev.date.startsWith('DOB:') ? prev.date : `DOB: ${prev.date}`) : 'DOB: '
                                }))
                              }
                              className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium cursor-pointer"
                            >
                              DOB
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. DOB: 15/08/2000 or DOP: 01/09/2026"
                          value={nameDateConfig.date}
                          onChange={(e) =>
                            setNameDateConfig((prev) => ({ ...prev, date: e.target.value }))
                          }
                          className="clean-input text-xs w-full"
                        />
                      </div>

                      {/* Strip Background Style */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          <Palette className="w-3 h-3 text-indigo-500" /> Strip Style:
                        </span>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setNameDateConfig((prev) => ({ ...prev, style: 'white_strip' }))
                            }
                            className={`py-1.5 px-2 rounded-lg text-[10px] font-medium border text-center transition-all cursor-pointer ${
                              nameDateConfig.style === 'white_strip'
                                ? 'bg-white text-slate-900 border-indigo-600 font-bold shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            White Strip (Exam)
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setNameDateConfig((prev) => ({ ...prev, style: 'black_strip' }))
                            }
                            className={`py-1.5 px-2 rounded-lg text-[10px] font-medium border text-center transition-all cursor-pointer ${
                              nameDateConfig.style === 'black_strip'
                                ? 'bg-black text-white border-indigo-600 font-bold shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            Black Strip
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setNameDateConfig((prev) => ({ ...prev, style: 'transparent' }))
                            }
                            className={`py-1.5 px-2 rounded-lg text-[10px] font-medium border text-center transition-all cursor-pointer ${
                              nameDateConfig.style === 'transparent'
                                ? 'bg-slate-800 text-white border-indigo-600 font-bold shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            Overlay
                          </button>
                        </div>
                      </div>

                    </div>
                  )}
                </div>

                {/* 3. Orientation Tools Section */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                    Orientation Tools
                  </label>
                  <button
                    type="button"
                    onClick={handleRotate}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-white text-xs font-semibold border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Rotate 90° Clockwise ({rotationAngle}°)</span>
                  </button>
                </div>

              </div>

              {/* Apply Edits Action Button */}
              <button
                type="button"
                onClick={handleApplyEdits}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                    <span>Applying Edits & Name Strip...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Apply Edits & Export Photo</span>
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
