import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Clock, Calendar, Tag, Sparkles, Search, ShieldCheck } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import { GUIDES } from '../data/guidesData';

export default function GuidesHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(GUIDES.map((g) => g.category)))];

  const filteredGuides = GUIDES.filter((guide) => {
    const matchesSearch =
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || guide.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12 animate-fade-in text-slate-700 dark:text-slate-300 transition-colors duration-200">
      <SeoHead
        title="Guides & Tutorials — Image Optimization, Form Specs & Passport Photo Rules | Image In Kb"
        description="Comprehensive guides on photo and signature size rules for SSC, UPSC, and government exams, passport photo dimension guidelines by country, and PDF conversion tutorials."
        canonicalUrl="https://imageinkb.com/guides"
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" /> Learning Hub & Tutorials
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Guides & <span className="text-indigo-600 dark:text-indigo-400">Tutorials</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Step-by-step guides on technical upload specifications for competitive exams, passport photos, DPI settings, and image compression best practices.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guides (e.g. SSC, 20KB, Passport)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGuides.map((guide) => (
          <article
            key={guide.slug}
            className="p-6 rounded-3xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold">
                  {guide.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {guide.readTime}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                <Link to={`/guides/${guide.slug}`}>{guide.title}</Link>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {guide.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5 flex-wrap">
                {guide.tags.slice(0, 2).map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-[10px] text-slate-500 dark:text-slate-400 font-mono"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <Link
                to={`/guides/${guide.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 group-hover:translate-x-1 transition-transform"
              >
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filteredGuides.length === 0 && (
        <div className="text-center py-12 p-8 rounded-3xl bg-white dark:bg-[#0e1424] border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-sm text-slate-500">No guides matching "{searchTerm}" found.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
