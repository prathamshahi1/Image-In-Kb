import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    question: 'How does Image In Kb compress images to exact target KB sizes?',
    answer:
      'Image In Kb utilizes a precision binary-search quality tuning algorithm powered by the C++ Libvips engine (Sharp). Instead of arbitrarily degrading your photo, our server tests quality factors (from 1 to 100) across up to 8 iterations in milliseconds until the output file is as high quality as mathematically possible while remaining strictly below your desired threshold (e.g., 50 KB, 100 KB, 200 KB).'
  },
  {
    question: 'Are my uploaded photos and signatures safe and private?',
    answer:
      'Yes, 100%. Image In Kb operates on a strict In-Memory Zero-Storage architecture. When you upload a file, it is processed directly in server RAM buffers and immediately streamed back to your browser. Your images, personal portraits, and signatures are never written to permanent disk storage or database servers.'
  },
  {
    question: 'Does compressing an image alter its pixel dimensions or resolution?',
    answer:
      'No. By default, our target-size compressor preserves the exact pixel width and height of your original photo. It achieves massive file size reductions (up to 90%+) by optimizing quantization tables, chroma subsampling, and Huffman encoding. If you explicitly want to resize pixel dimensions, you can use our dedicated Smart Image Resizer tool.'
  },
  {
    question: 'Which image format is best for website speed: JPG, PNG, or WebP?',
    answer:
      'WebP is the recommended next-generation format for the modern web. WebP provides 25% to 35% smaller file sizes compared to JPG at equivalent visual quality, while also supporting alpha transparency like PNG. Converting your JPGs and PNGs to WebP drastically improves your Google Core Web Vitals (Largest Contentful Paint).'
  },
  {
    question: 'How do I compress images for government, UPSC, SSC, and job portals?',
    answer:
      'Government and exam portals typically enforce strict upload criteria (such as "under 50 KB", "under 20 KB", or exact 200x230 pixel dimensions). You can use our dedicated "Compress to 50 KB", "Passport Photo Resizer", or "Signature Compressor" tools to automatically meet these strict limits in a single click.'
  },
  {
    question: 'Can I compress multiple images at once and download a ZIP archive?',
    answer:
      'Yes! With our Batch Image Processor, you can upload up to 20 photos simultaneously. Our backend processes the entire batch concurrently in parallel streams and packages the optimized files into a single in-memory ZIP archive for instant download.'
  },
  {
    question: 'How do I format passport photos for US, UK, and Schengen visas?',
    answer:
      'Our Passport Photo Resizer provides pre-calibrated international templates, including US Passport (2x2 inches / 600x600 px), India & Schengen Visa (35x45 mm / 413x531 px), and online exam dimensions with automatic file size caps (under 50KB or 100KB).'
  },
  {
    question: 'Is Image In Kb completely free to use?',
    answer:
      'Yes, all core tools (Compression, Resizing, Format Conversion, Cropping, Passport Photo generation, and Batch Processing) are 100% free with no watermarks, daily limits, or mandatory registration.'
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-12 border-t border-slate-200 dark:border-slate-800/80 space-y-8 animate-fade-in transition-colors duration-200">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Everything You Need to Know
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Learn how in-memory compression works, format guidelines, and privacy guarantees.
        </p>
      </div>

      {/* Accordion List */}
      <div className="max-w-4xl mx-auto space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors duration-200"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <span className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {faq.question}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
}
