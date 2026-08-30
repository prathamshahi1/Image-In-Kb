import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Trash2,
  Home,
  RefreshCcw,
  Sliders,
  Eye,
  FileCheck
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import SeoHead from '../components/SeoHead';
import { formatBytes } from '../utils/formatters';

const MAX_PDF_IMAGES = 30;

export default function ImageToPdf() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [pageSize, setPageSize] = useState('a4'); // 'a4' | 'letter' | 'fit'
  const [orientation, setOrientation] = useState('portrait'); // 'portrait' | 'landscape' | 'auto'
  const [margin, setMargin] = useState('compact'); // 'none' | 'compact' | 'normal'
  const [quality, setQuality] = useState(85); // 60 | 85 | 95
  const [isConverting, setIsConverting] = useState(false);
  const [pdfResult, setPdfResult] = useState(null);
  const [errorToast, setErrorToast] = useState(null);

  const handleFilesSelected = (e) => {
    const selected = Array.from(e.target.files || []);
    if (images.length + selected.length > MAX_PDF_IMAGES) {
      setErrorToast(`Maximum ${MAX_PDF_IMAGES} images allowed per PDF.`);
      return;
    }

    const mapped = selected.map((file) => ({
      file,
      name: file.name,
      size: file.size,
      formattedSize: formatBytes(file.size),
      previewUrl: URL.createObjectURL(file)
    }));

    setImages((prev) => [...prev, ...mapped]);
    setErrorToast(null);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGeneratePdf = async () => {
    if (images.length === 0) return;
    setIsConverting(true);
    setErrorToast(null);

    try {
      // Create jsPDF instance
      let pdfOrientation = orientation === 'landscape' ? 'landscape' : 'portrait';
      const doc = new jsPDF({
        orientation: pdfOrientation,
        unit: 'mm',
        format: pageSize === 'letter' ? 'letter' : 'a4'
      });

      const marginSizes = {
        none: 0,
        compact: 6,
        normal: 15
      };
      const marginMm = marginSizes[margin] || 0;

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        
        // Load image to measure dimensions
        const img = new Image();
        img.src = item.previewUrl;
        await new Promise((resolve) => {
          if (img.complete) resolve();
          else img.onload = resolve;
        });

        // Add page for 2nd+ image
        if (i > 0) {
          doc.addPage();
        }

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const printableWidth = pageWidth - marginMm * 2;
        const printableHeight = pageHeight - marginMm * 2;

        const imgWidth = img.naturalWidth || 800;
        const imgHeight = img.naturalHeight || 600;
        const imgRatio = imgWidth / imgHeight;

        let renderWidth = printableWidth;
        let renderHeight = printableWidth / imgRatio;

        if (renderHeight > printableHeight) {
          renderHeight = printableHeight;
          renderWidth = printableHeight * imgRatio;
        }

        // Center on page
        const xPos = marginMm + (printableWidth - renderWidth) / 2;
        const yPos = marginMm + (printableHeight - renderHeight) / 2;

        // Render to canvas to apply quality compression factor
        const canvas = document.createElement('canvas');
        canvas.width = imgWidth;
        canvas.height = imgHeight;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const imgData = canvas.toDataURL('image/jpeg', quality / 100);
        doc.addImage(imgData, 'JPEG', xPos, yPos, renderWidth, renderHeight);
      }

      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const filename = `document-${Date.now()}.pdf`;

      setPdfResult({
        blob: pdfBlob,
        url: pdfUrl,
        filename,
        sizeBytes: pdfBlob.size,
        formattedSize: formatBytes(pdfBlob.size),
        totalPages: images.length
      });
    } catch (err) {
      console.error('PDF Generation error:', err);
      setErrorToast('Failed to generate PDF. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!pdfResult?.url) return;
    const link = document.createElement('a');
    link.href = pdfResult.url;
    link.download = pdfResult.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setImages([]);
    setPdfResult(null);
    setErrorToast(null);
  };

  const handleGoHome = () => {
    handleReset();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 animate-fade-in text-slate-700 dark:text-slate-300 transition-colors duration-200">
      <SeoHead
        title="Image to PDF Converter — Convert JPG, PNG to PDF Online | Image In Kb"
        description="Convert multiple JPG, PNG, and WebP images into a high-quality PDF document for free. Customize page sizes, orientations, and margins."
        canonicalUrl="https://imageinkb.com/image-to-pdf"
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5" /> High-Resolution PDF Creator
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Image to <span className="text-indigo-600 dark:text-indigo-400">PDF</span> Converter
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Combine single or multiple JPG, PNG, and WebP photos into a clean, ready-to-print PDF document.
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
            <button onClick={() => setErrorToast(null)} className="px-2 py-1 bg-rose-100 dark:bg-rose-900/50 rounded text-rose-700 dark:text-rose-300 text-xs font-semibold cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* View 1: Success / Download Screen */}
        {pdfResult ? (
          <div className="space-y-6 animate-fade-in text-center py-8">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                PDF Document Created Successfully! 🎉
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Your <strong className="text-slate-900 dark:text-white font-semibold">{pdfResult.totalPages}-page PDF</strong> ({pdfResult.formattedSize}) is ready to download.
              </p>
            </div>

            {/* Document Info Card */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{pdfResult.filename}</p>
                <p className="text-[11px] text-slate-500 font-mono">
                  {pdfResult.totalPages} {pdfResult.totalPages === 1 ? 'Page' : 'Pages'} • {pdfResult.formattedSize} • A4 Standard
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Document</span>
              </button>

              <button
                type="button"
                onClick={handleGoHome}
                className="px-5 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Go to Home Page</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Convert Another Document</span>
              </button>
            </div>
          </div>
        ) : (
          /* View 2: Upload & Convert Studio */
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
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Drop images to convert to PDF, or <span className="text-indigo-600 dark:text-indigo-400 underline">browse</span>
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  {images.length} / {MAX_PDF_IMAGES} images selected (JPG, PNG, WebP)
                </p>
              </div>
            </div>

            {/* Selected Images Grid Preview */}
            {images.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Selected Images ({images.length})</span>
                  <button
                    onClick={() => setImages([])}
                    className="text-rose-600 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {images.map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 text-center overflow-hidden"
                    >
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-900/80 text-white font-mono text-[9px]">
                        #{idx + 1}
                      </div>
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        className="h-24 w-full object-cover rounded-lg mb-1"
                      />
                      <p className="text-[10px] font-medium text-slate-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-2 right-2 p-1 rounded-md bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* PDF Configuration Panel */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>PDF Document Layout Settings</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Page Size */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Page Format</label>
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(e.target.value)}
                        className="clean-input text-xs w-full"
                      >
                        <option value="a4">A4 (210 × 297 mm)</option>
                        <option value="letter">US Letter (8.5 × 11 in)</option>
                      </select>
                    </div>

                    {/* Orientation */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Orientation</label>
                      <select
                        value={orientation}
                        onChange={(e) => setOrientation(e.target.value)}
                        className="clean-input text-xs w-full"
                      >
                        <option value="portrait">Portrait (Vertical)</option>
                        <option value="landscape">Landscape (Horizontal)</option>
                      </select>
                    </div>

                    {/* Margin */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Page Margin</label>
                      <select
                        value={margin}
                        onChange={(e) => setMargin(e.target.value)}
                        className="clean-input text-xs w-full"
                      >
                        <option value="none">No Margin (Full Bleed)</option>
                        <option value="compact">Compact (6 mm)</option>
                        <option value="normal">Standard (15 mm)</option>
                      </select>
                    </div>
                  </div>

                  {/* Convert Action Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleGeneratePdf}
                      disabled={isConverting}
                      className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
                    >
                      {isConverting ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                          <span>Generating PDF Document...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Convert {images.length} {images.length === 1 ? 'Image' : 'Images'} to PDF →</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
