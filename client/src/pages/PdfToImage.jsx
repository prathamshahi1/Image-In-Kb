import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCcw,
  Sliders,
  FileArchive,
  Image as ImageIcon,
  Layers,
  Eye,
  Check,
  Zap,
  ShieldCheck,
  ArrowRight,
  Maximize2,
  X
} from 'lucide-react';
import SeoHead from '../components/SeoHead';
import FaqSection from '../components/FaqSection';
import { formatBytes } from '../utils/formatters';
import { inspectPdfApi, generatePdfThumbnailsApi, convertPdfToImagesApi } from '../services/api';

const DPI_OPTIONS = [
  { id: '1.5', label: 'Standard (150 DPI)', desc: 'Fast, small file size' },
  { id: '2.0', label: 'High HD (200 DPI)', desc: 'Crisp & balanced (Recommended)' },
  { id: '3.0', label: 'Ultra HD (300 DPI)', desc: 'Maximum print clarity' }
];

const FORMAT_OPTIONS = [
  { id: 'jpeg', label: 'JPG / JPEG', badge: 'Standard', desc: 'Best for general use & sharing' },
  { id: 'png', label: 'PNG', badge: 'Lossless', desc: 'Sharpest text & graphics' },
  { id: 'webp', label: 'WEBP', badge: 'Modern', desc: 'Ultra compact & fast web delivery' }
];

export default function PdfToImage({
  title = 'PDF to Image Converter (JPG, PNG, WebP)',
  subtitle = 'Extract PDF pages as high-resolution images online for free. Download individual pages or a unified ZIP archive.',
  canonicalUrl = 'https://imageinkb.com/pdf-to-image',
  badge = 'High-Resolution PDF Extractor'
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfMetadata, setPdfMetadata] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorToast, setErrorToast] = useState(null);
  const [conversionResult, setConversionResult] = useState(null);

  // Configuration options
  const [format, setFormat] = useState('jpeg'); // 'jpeg' | 'png' | 'webp'
  const [dpiScale, setDpiScale] = useState('2.0'); // '1.5' | '2.0' | '3.0'
  const [quality, setQuality] = useState(90); // 70-100
  const [customRange, setCustomRange] = useState('');

  // Lightbox Modal for Fullscreen Image Preview
  const [previewModalImg, setPreviewModalImg] = useState(null);

  // Handle PDF file selection
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorToast('Please select a valid PDF document (.pdf).');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setErrorToast('PDF exceeds maximum 100MB limit.');
      return;
    }

    setPdfFile(file);
    setConversionResult(null);
    setErrorToast(null);
    setIsAnalyzing(true);
    setProgressPercent(20);

    try {
      const inspectRes = await inspectPdfApi(file);
      if (inspectRes.success) {
        setPdfMetadata(inspectRes.data);
        // Initially select all pages
        const allPages = Array.from({ length: inspectRes.data.totalPages }, (_, i) => i + 1);
        setSelectedPages(allPages);
      }

      // Generate low-res thumbnail previews
      const thumbs = await generatePdfThumbnailsApi(file, 24);
      setThumbnails(thumbs);
    } catch (err) {
      setErrorToast(err.message || 'Failed to analyze PDF document.');
      setPdfFile(null);
    } finally {
      setIsAnalyzing(false);
      setProgressPercent(0);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const syntheticEvent = { target: { files: [file] } };
      handleFileChange(syntheticEvent);
    }
  };

  const handleTogglePage = (pageNum) => {
    setSelectedPages((prev) =>
      prev.includes(pageNum) ? prev.filter((p) => p !== pageNum) : [...prev, pageNum].sort((a, b) => a - b)
    );
  };

  const handleSelectAll = () => {
    if (!pdfMetadata) return;
    const all = Array.from({ length: pdfMetadata.totalPages }, (_, i) => i + 1);
    setSelectedPages(all);
    setCustomRange('');
  };

  const handleDeselectAll = () => {
    setSelectedPages([]);
    setCustomRange('');
  };

  // Parse custom range e.g. "1-3, 5"
  const handleRangeChange = (val) => {
    setCustomRange(val);
    if (!pdfMetadata || !val.trim()) return;

    try {
      const pages = new Set();
      const parts = val.split(',');
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.includes('-')) {
          const [startStr, endStr] = trimmed.split('-');
          const start = parseInt(startStr, 10);
          const end = parseInt(endStr, 10);
          if (!isNaN(start) && !isNaN(end)) {
            const min = Math.max(1, Math.min(start, end));
            const max = Math.min(pdfMetadata.totalPages, Math.max(start, end));
            for (let i = min; i <= max; i++) pages.add(i);
          }
        } else {
          const num = parseInt(trimmed, 10);
          if (!isNaN(num) && num >= 1 && num <= pdfMetadata.totalPages) {
            pages.add(num);
          }
        }
      }
      setSelectedPages(Array.from(pages).sort((a, b) => a - b));
    } catch (e) {}
  };

  // Run conversion
  const handleConvert = async () => {
    if (!pdfFile || selectedPages.length === 0) {
      setErrorToast('Please select at least one page to convert.');
      return;
    }

    setIsConverting(true);
    setErrorToast(null);
    setProgressPercent(10);

    try {
      const res = await convertPdfToImagesApi(
        pdfFile,
        {
          format,
          dpiScale: parseFloat(dpiScale),
          quality,
          selectedPages
        },
        (prog) => setProgressPercent(prog)
      );

      if (res && res.success) {
        setConversionResult(res.data);
      } else {
        setErrorToast(res?.message || 'Conversion failed.');
      }
    } catch (err) {
      setErrorToast(err.message || 'Error occurred while converting PDF to images.');
    } finally {
      setIsConverting(false);
      setProgressPercent(0);
    }
  };

  // Single page download trigger
  const handleDownloadSingleImage = (imgItem) => {
    const link = document.createElement('a');
    link.href = imgItem.blobUrl || imgItem.dataUri;
    link.download = imgItem.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download all as ZIP
  const handleDownloadZip = () => {
    if (!conversionResult?.zipUrl) return;
    const link = document.createElement('a');
    link.href = conversionResult.zipUrl;
    link.download = conversionResult.zipFilename || 'pdf-images.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setPdfFile(null);
    setPdfMetadata(null);
    setThumbnails([]);
    setSelectedPages([]);
    setConversionResult(null);
    setErrorToast(null);
    setCustomRange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12 animate-fade-in text-slate-700 dark:text-slate-300 transition-colors duration-200">
      <SeoHead
        title={`${title} — Fast & High Quality | Image In Kb`}
        description={subtitle}
        canonicalUrl={canonicalUrl}
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5" /> {badge}
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          PDF to <span className="text-indigo-600 dark:text-indigo-400">Image</span> Converter
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
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
            <button
              onClick={() => setErrorToast(null)}
              className="px-2 py-1 bg-rose-100 dark:bg-rose-900/50 rounded text-rose-700 dark:text-rose-300 text-xs font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View 1: Upload Box */}
        {!pdfFile ? (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-900/40 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 group space-y-4"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Choose PDF Document or Drag & Drop
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Supports single or multi-page PDF documents up to 100MB.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-600 dark:text-slate-300 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Private (Processed in Browser)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-600 dark:text-slate-300 shadow-xs">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Fast Multi-DPI Output
              </span>
            </div>

            <div className="pt-3">
              <button
                type="button"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                Select PDF File
              </button>
            </div>
          </div>
        ) : conversionResult ? (
          /* View 3: Conversion Success & Download Screen */
          <div className="space-y-6 animate-fade-in">
            {/* Top Success Banner */}
            <div className="p-4 sm:p-6 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3.5 w-full md:w-auto">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      Extraction Complete! 🎉
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30">
                      {conversionResult.extractedPagesCount} Image{conversionResult.extractedPagesCount > 1 ? 's' : ''} Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-mono mt-1">
                    Total Image Data: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{conversionResult.formattedTotalSize}</strong>
                    <span className="text-slate-400 dark:text-slate-500 ml-2">({conversionResult.format} Format • {conversionResult.dpiScale}x Scale)</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
                <button
                  onClick={handleDownloadZip}
                  className="w-full md:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download All as ZIP</span>
                </button>
              </div>
            </div>

            {/* Extracted Images Grid Gallery */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Extracted Pages ({conversionResult.images.length})</span>
                <span className="text-slate-500 font-normal">Click any image to enlarge or download individually</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {conversionResult.images.map((item) => (
                  <div
                    key={item.pageNumber}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-3 shadow-xs group"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[10px] flex items-center justify-center font-bold">
                          {item.pageNumber}
                        </span>
                        Page {item.pageNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                        {item.formattedSize}
                      </span>
                    </div>

                    {/* Image Preview Container */}
                    <div
                      onClick={() => setPreviewModalImg(item)}
                      className="relative h-56 w-full flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl p-2 overflow-hidden border border-slate-200 dark:border-slate-800/80 cursor-pointer group-hover:shadow-md transition-all"
                    >
                      <img
                        src={item.blobUrl || item.dataUri}
                        alt={`Page ${item.pageNumber}`}
                        className="max-h-full max-w-full object-contain rounded"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5 backdrop-blur-[2px] rounded-xl">
                        <Maximize2 className="w-4 h-4" /> Click to Enlarge
                      </div>
                    </div>

                    {/* Footer Stats & Download */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] font-mono text-slate-500">
                        {item.width} × {item.height} px
                      </span>

                      <button
                        onClick={() => handleDownloadSingleImage(item)}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title={`Download Page ${item.pageNumber}`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                Convert Another PDF
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => setConversionResult(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Adjust Settings
                </button>

                <button
                  onClick={handleDownloadZip}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <FileArchive className="w-3.5 h-3.5" />
                  Download ZIP
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* View 2: Workbench / Configuration & Page Selection */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Visual Page Selector & Document Info */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Document Overview Header */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[240px] sm:max-w-xs" title={pdfFile.name}>
                      {pdfFile.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {formatBytes(pdfFile.size)} • {pdfMetadata?.totalPages || '...'} Page{pdfMetadata?.totalPages > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="text-xs text-rose-600 hover:text-rose-500 font-semibold px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors self-start sm:self-center"
                >
                  Change File
                </button>
              </div>

              {/* Page Selection Controls */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Select Pages to Convert ({selectedPages.length}/{pdfMetadata?.totalPages || 0})
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                      Select All
                    </button>
                    <span className="text-slate-400">|</span>
                    <button
                      type="button"
                      onClick={handleDeselectAll}
                      className="text-slate-500 hover:underline font-medium"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                {/* Page Range Input */}
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                    Or enter page range (e.g. <span className="font-mono text-indigo-600">1-3, 5</span>):
                  </label>
                  <input
                    type="text"
                    value={customRange}
                    onChange={(e) => handleRangeChange(e.target.value)}
                    placeholder="e.g. 1-4, 7, 9"
                    className="w-full clean-input text-xs font-mono"
                  />
                </div>

                {/* Visual Thumbnail Grid */}
                <div className="pt-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[360px] overflow-y-auto p-1 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                    {Array.from({ length: pdfMetadata?.totalPages || 0 }, (_, i) => i + 1).map((pageNum) => {
                      const isSelected = selectedPages.includes(pageNum);
                      const thumb = thumbnails.find((t) => t.pageNumber === pageNum);

                      return (
                        <div
                          key={pageNum}
                          onClick={() => handleTogglePage(pageNum)}
                          className={`relative p-2 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center justify-between space-y-1.5 ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-xs'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-slate-300 opacity-60'
                          }`}
                        >
                          <div className="w-full h-24 flex items-center justify-center bg-white dark:bg-slate-900 rounded-lg overflow-hidden p-1">
                            {thumb ? (
                              <img
                                src={thumb.thumbnailUrl}
                                alt={`Page ${pageNum}`}
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <div className="flex flex-col items-center text-slate-400 text-[10px]">
                                <FileText className="w-6 h-6 mb-1" />
                                <span>Page {pageNum}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between w-full px-1 text-[11px]">
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              Page {pageNum}
                            </span>
                            <div
                              className={`w-4 h-4 rounded-md flex items-center justify-center ${
                                isSelected
                                  ? 'bg-indigo-600 text-white'
                                  : 'border border-slate-300 dark:border-slate-700'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Settings & Conversion Action */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-5">
                
                {/* 1. Export Format */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Export Image Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {FORMAT_OPTIONS.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFormat(f.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          format === f.id
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-1 ring-indigo-600/30 dark:bg-indigo-600/20 dark:border-indigo-500 dark:text-indigo-300'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <span className="block text-xs font-bold">{f.label}</span>
                        <span className="block text-[10px] text-slate-500 mt-0.5">{f.badge}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. DPI / Resolution Scale */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Resolution Quality (DPI Scale)
                  </label>
                  <div className="space-y-2">
                    {DPI_OPTIONS.map((opt) => (
                      <label
                        key={opt.id}
                        onClick={() => setDpiScale(opt.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          dpiScale === opt.id
                            ? 'bg-indigo-50/70 border-indigo-600 text-indigo-900 dark:bg-indigo-600/20 dark:border-indigo-500 dark:text-indigo-200'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-xs">
                          <span className="font-bold block">{opt.label}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">{opt.desc}</span>
                        </div>
                        <input
                          type="radio"
                          name="dpiScale"
                          checked={dpiScale === opt.id}
                          onChange={() => setDpiScale(opt.id)}
                          className="accent-indigo-600"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* 3. Quality Slider (for JPG & WebP) */}
                {format !== 'png' && (
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-semibold">Compression Quality</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                )}

                {/* Convert Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleConvert}
                    disabled={isConverting || selectedPages.length === 0}
                    className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
                  >
                    {isConverting ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                        <span>Extracting Pages ({progressPercent}%)...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Convert {selectedPages.length} Page{selectedPages.length > 1 ? 's' : ''} to {format.toUpperCase()}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                  ⚡ Generates high-resolution images & packages a ZIP archive instantly.
                </p>

              </div>
            </div>

          </div>
        )}
      </div>

      {/* Lightbox Preview Modal */}
      {previewModalImg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-slate-900 rounded-2xl p-4 flex flex-col space-y-3 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between text-white text-xs px-1">
              <span className="font-bold">Page {previewModalImg.pageNumber} — {previewModalImg.filename}</span>
              <button
                onClick={() => setPreviewModalImg(null)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center overflow-auto max-h-[70vh] bg-black/50 rounded-xl p-2">
              <img
                src={previewModalImg.blobUrl || previewModalImg.dataUri}
                alt={`Page ${previewModalImg.pageNumber}`}
                className="max-h-full max-w-full object-contain rounded"
              />
            </div>

            <div className="flex items-center justify-between text-slate-400 text-xs px-1 pt-1">
              <span>{previewModalImg.width} × {previewModalImg.height} px • {previewModalImg.formattedSize}</span>
              <button
                onClick={() => handleDownloadSingleImage(previewModalImg)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEO & Educational Content Section */}
      <section className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          High-Speed Client-Side PDF to Image Conversion
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Secure & Private
            </h3>
            <p>
              Your sensitive documents and contracts never leave your browser. All page extraction and image rendering happen entirely on your device using Mozilla PDF.js.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" /> Custom DPI & Quality
            </h3>
            <p>
              Choose standard 150 DPI for compact files or up to 300 DPI Ultra HD for crisp blueprint, invoice, and legal document extraction with flawless text sharpness.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <FileArchive className="w-4 h-4 text-amber-500" /> Instant ZIP Package
            </h3>
            <p>
              Extract multi-page PDFs with 1 click and download the whole set organized in a unified ZIP archive, or save individual pages on demand.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <FaqSection
        title="Frequently Asked Questions — PDF to Image"
        faqs={[
          {
            question: 'How do I convert a multi-page PDF into JPG or PNG images?',
            answer:
              'Simply upload your PDF file, choose your desired format (JPG, PNG, or WebP) and DPI scale, and click "Convert". You can download individual page images or get all pages bundled in a single ZIP archive.'
          },
          {
            question: 'Is my PDF uploaded to any external server?',
            answer:
              'No! Image In Kb uses an in-browser client-side engine powered by PDF.js. Your document never leaves your machine, ensuring 100% confidentiality for banking, medical, and legal documents.'
          },
          {
            question: 'What DPI resolution should I choose?',
            answer:
              'For general web viewing and WhatsApp sharing, 150 DPI or 200 DPI (High HD) is recommended. For printing, archival, or reading fine document text, select 300 DPI (Ultra HD).'
          },
          {
            question: 'Can I convert only specific pages from the PDF?',
            answer:
              'Yes! You can interactively click individual page cards or type page ranges (such as "1-3, 5") to convert only the exact pages you need.'
          }
        ]}
      />
    </div>
  );
}
