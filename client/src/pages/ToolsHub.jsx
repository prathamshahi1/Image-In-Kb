import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  Scaling,
  RefreshCw,
  Crop,
  Layers,
  FileText,
  Calculator,
  UserCheck,
  PenTool,
  Type,
  Search,
  ArrowRight
} from 'lucide-react';
import SeoHead from '../components/SeoHead';

const ALL_TOOLS = [
  {
    id: 'compress',
    title: 'Target KB Compressor',
    desc: 'Compress images to 50KB, 100KB, 200KB, or custom sizes with binary-search quality tuning.',
    path: '/compress',
    icon: Target,
    badge: 'Core'
  },
  {
    id: 'name-date-photo',
    title: 'Name & Date on Photo',
    desc: 'Add candidate name and date of birth (DOB/DOP) strip for SSC, UPSC, and exam forms.',
    path: '/name-and-date-on-photo',
    icon: Type,
    badge: 'Exam Forms'
  },
  {
    id: 'compress-50kb',
    title: 'Compress Image to 50 KB',
    desc: 'Strict 50 KB preset designed for government portals and job applications.',
    path: '/compress-image-to-50kb',
    icon: Target,
    badge: 'Preset'
  },
  {
    id: 'compress-100kb',
    title: 'Compress Image to 100 KB',
    desc: 'Optimal balance between ultra-fast web delivery and high crispness.',
    path: '/compress-image-to-100kb',
    icon: Target,
    badge: 'Preset'
  },
  {
    id: 'passport',
    title: 'Passport Photo Resizer',
    desc: 'US 2x2", Schengen 35x45mm, and exam dimensions with strict KB limits.',
    path: '/passport-photo',
    icon: UserCheck,
    badge: 'Gov & Visa'
  },
  {
    id: 'signature',
    title: 'Signature Compressor',
    desc: 'Compress signatures strictly under 10KB, 20KB, or 50KB for portal forms.',
    path: '/signature-compressor',
    icon: PenTool,
    badge: 'Forms'
  },
  {
    id: 'resizer',
    title: 'Smart Image Resizer',
    desc: 'Scale images by pixels or percentage scale with Lanczos3 anti-aliasing.',
    path: '/resize',
    icon: Scaling,
    badge: 'Core'
  },
  {
    id: 'converter',
    title: 'Format Converter',
    desc: 'Convert seamlessly between JPG, PNG, and WebP formats.',
    path: '/convert',
    icon: RefreshCw,
    badge: 'Core'
  },
  {
    id: 'editor',
    title: 'Crop & Editor',
    desc: 'Aspect ratio cropping (Free, 1:1, 4:3, 16:9), 90° rotation, and flips.',
    path: '/editor',
    icon: Crop,
    badge: 'Creative'
  },
  {
    id: 'image-to-pdf',
    title: 'Image to PDF Converter',
    desc: 'Combine single or multiple JPG, PNG, and WebP images into a high-quality PDF document.',
    path: '/image-to-pdf',
    icon: FileText,
    badge: 'PDF Document'
  },
  {
    id: 'zipimg',
    title: 'ZipImg (ZIP Archive)',
    desc: 'Process up to 20 images concurrently and download as a ZIP archive.',
    path: '/zipimg',
    icon: Layers,
    badge: 'Bulk ZIP'
  },
  {
    id: 'calculator',
    title: 'Unit Calculator',
    desc: 'Convert between Bytes, KB, MB, and GB in binary 1024 base.',
    path: '/calculator',
    icon: Calculator,
    badge: 'Utility'
  }
];

export default function ToolsHub() {
  const [search, setSearch] = useState('');

  const filteredTools = ALL_TOOLS.filter((t) => {
    return t.title.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 animate-fade-in text-slate-700 dark:text-slate-300 transition-colors duration-200">
      <SeoHead
        title="All Image Optimization Tools Directory | Image In Kb"
        description="Browse all free image compression, resizing, format conversion, cropping, passport photo, and batch processing tools on Image In Kb."
        canonicalUrl="https://imageinkb.com/tools"
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Optimization <span className="text-indigo-600 dark:text-indigo-400">Tools Directory</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          All image compression, dimension scaling, format conversion, and portal tools in one place.
        </p>
      </div>

      {/* Clean Search Input */}
      <div className="max-w-md mx-auto relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tools (e.g. 50kb, passport, webp)..."
          className="w-full clean-input pl-10 text-xs"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              to={tool.path}
              className="p-5 rounded-2xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                    {tool.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                <span>Launch tool</span>
                <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
