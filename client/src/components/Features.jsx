import React from 'react';
import {
  Target,
  Scaling,
  RefreshCw,
  Crop,
  Layers,
  ShieldCheck,
  Zap,
  Sliders
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Target KB Compression',
    description: 'Compress images to exact target sizes like 50 KB, 100 KB, or 200 KB using our binary-search iterative quality optimizer.',
    badge: 'Core Engine'
  },
  {
    icon: Scaling,
    title: 'Smart Resizing',
    description: 'Resize by exact pixel width/height or percentage scaling while locking aspect ratio to prevent image distortion.',
    badge: 'Pro Feature'
  },
  {
    icon: RefreshCw,
    title: 'Multi-Format Conversion',
    description: 'Instantly convert between modern formats: JPG, PNG, and next-gen WEBP for fast web delivery and SEO.',
    badge: 'Zero Loss'
  },
  {
    icon: Crop,
    title: 'Passport & Signature Tools',
    description: 'Specialized presets for passport photos, exam portals, and signature compressors with strict upload size limits.',
    badge: 'Gov & Jobs'
  },
  {
    icon: Layers,
    title: 'Batch Image Processing',
    description: 'Process multiple images simultaneously with single-click ZIP archive downloads for maximum efficiency.',
    badge: 'Batch ZIP'
  },
  {
    icon: ShieldCheck,
    title: 'Privacy & In-Memory Processing',
    description: 'Files are processed in memory using Node.js & Sharp. Images are never permanently retained or shared.',
    badge: '100% Private'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 border-t border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-400">
            <Zap className="w-3.5 h-3.5" /> High Performance Suite
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Precision & Speed
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Everything you need to optimize, resize, convert, and crop images for web apps, government forms, e-commerce, and high-density displays.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-brand-500/40 hover:bg-slate-900/90 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-brand-500/10"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 group-hover:scale-110 group-hover:bg-brand-500/20 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
