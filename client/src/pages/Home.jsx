import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Scaling,
  RefreshCw,
  Crop,
  Layers,
  FileText,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import UploadBox from '../components/UploadBox';
import CompressionControls from '../components/CompressionControls';
import ComparisonView from '../components/ComparisonView';
import FaqSection from '../components/FaqSection';
import SeoContentSection from '../components/SeoContentSection';
import ContactSection from '../components/ContactSection';
import SeoHead from '../components/SeoHead';
import { inspectImageApi, compressImageApi } from '../services/api';

const QUICK_TOOLS = [
  {
    title: 'Image Resizer',
    desc: 'Scale by pixels or percentage with Lanczos3 anti-aliasing.',
    path: '/resize',
    icon: Scaling
  },
  {
    title: 'Format Converter',
    desc: 'Convert seamlessly between JPG, PNG, and WebP.',
    path: '/convert',
    icon: RefreshCw
  },
  {
    title: 'Crop & Edit Photo',
    desc: 'Aspect ratio cropping, name & date stamps, and 90° rotation.',
    path: '/edit',
    icon: Crop
  },
  {
    title: 'Image to PDF',
    desc: 'Combine multiple images into a printable PDF document.',
    path: '/image-to-pdf',
    icon: FileText
  },
  {
    title: 'ZipImg Compressor',
    desc: 'Process up to 20 images concurrently in a single ZIP.',
    path: '/zipimg',
    icon: Layers
  }
];

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [serverMetadata, setServerMetadata] = useState(null);
  const [compressionResult, setCompressionResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
  };

  // Listen to the Home / Logo click event to reset state from any step
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

    // Smart default target KB if original image is smaller than 100KB
    if (clientData.file && clientData.file.size > 0) {
      const sizeKb = clientData.file.size / 1024;
      if (sizeKb < 100) {
        const smartKb = sizeKb <= 30 ? Math.max(5, Math.round(sizeKb * 0.5)) : 50;
        setCompressConfig((prev) => ({ ...prev, targetSizeKb: smartKb }));
      }
    }

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

    try {
      const response = await compressImageApi(selectedImage.file, compressConfig);
      if (response && response.success) {
        response.data.original.previewUrl = selectedImage.previewUrl;
        setCompressionResult(response.data);
      }
    } catch (err) {
      console.error('Compression error:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  // Structured Data Schema for Google Rich Results
  const homeStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Image In Kb',
    operatingSystem: 'All',
    applicationCategory: 'MultimediaApplication',
    description:
      'Fast in-memory image compression, resizing, format conversion, and cropping platform powered by Sharp and Libvips.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };

  return (
    <div className="space-y-16 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto animate-fade-in transition-colors duration-200">
      <SeoHead
        title="Image In Kb — Fast, In-Memory Image Compressor & Optimizer"
        description="Compress images to exact KB targets (50KB, 100KB, 200KB), resize dimensions with Lanczos3, convert between JPG/PNG/WebP, and edit photos with zero server storage."
        canonicalUrl="https://imageinkb.com/"
        structuredData={homeStructuredData}
      />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" /> High-Performance In-Memory Image Optimization
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Compress Images to <span className="text-indigo-600 dark:text-indigo-400">Exact KB</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Fast, private, and zero-storage optimization engine. Reduce file sizes by up to 90% without visible quality loss.
        </p>
      </div>

      {/* Main Workbench Card */}
      <div className="p-4 sm:p-8 rounded-3xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl">
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

      {/* Quick Tools Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">More Optimization Tools</h2>
          <Link to="/tools" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
            View all tools <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.path}
                to={tool.path}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 font-medium transition-colors">
                  <span>Open tool</span>
                  <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 600+ Word Educational & SEO Content Section */}
      <SeoContentSection />

      {/* Structured FAQ Section */}
      <div id="faq">
        <FaqSection />
      </div>

      {/* Trust & Privacy Row */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <span className="font-semibold text-slate-900 dark:text-white block">100% In-Memory Privacy Guarantee</span>
            <span>Your photos are processed in temporary RAM buffers and never stored on any database or disk.</span>
          </div>
        </div>
        <Link to="/zipimg" className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white font-medium hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors whitespace-nowrap">
          Try ZipImg (ZIP)
        </Link>
      </div>

      {/* Embedded Contact & Support Section */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80">
        <ContactSection showHeader={true} id="contact" />
      </div>

    </div>
  );
}
