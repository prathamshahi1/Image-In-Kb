import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  BookOpen,
  ArrowLeft,
  Clock,
  Calendar,
  Sparkles,
  Share2,
  Tag,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import SeoHead from '../components/SeoHead';
import { GUIDES } from '../data/guidesData';

export default function GuideDetail() {
  const { slug } = useParams();
  const guide = GUIDES.find((g) => g.slug === slug);

  if (!guide) {
    return <Navigate to="/guides" replace />;
  }

  const relatedGuides = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 2);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.excerpt,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    author: {
      '@type': 'Organization',
      name: guide.author,
      url: 'https://imageinkb.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Image In Kb',
      url: 'https://imageinkb.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://imageinkb.com/logo.svg'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://imageinkb.com/guides/${guide.slug}`
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 animate-fade-in text-slate-700 dark:text-slate-300 transition-colors duration-200">
      <SeoHead
        title={`${guide.title} | Image In Kb Guide`}
        description={guide.excerpt}
        canonicalUrl={`https://imageinkb.com/guides/${guide.slug}`}
        ogType="article"
        structuredData={structuredData}
      />

      {/* Back to Guides Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/guides"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Guides</span>
        </Link>

        <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300 text-xs font-semibold">
          {guide.category}
        </span>
      </div>

      {/* Article Header */}
      <header className="space-y-4">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {guide.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          {guide.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono pt-2 border-y border-slate-200 dark:border-slate-800 py-3">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Updated {guide.updatedAt}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {guide.readTime}
          </span>
          <span>•</span>
          <span>By {guide.author}</span>
        </div>
      </header>

      {/* CTA Box (Embedded Tool Launcher) */}
      {guide.relatedToolPath && (
        <div className="p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Ready to optimize your photo or signature?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                100% private, free, and in-browser with zero uploads.
              </p>
            </div>
          </div>

          <Link
            to={guide.relatedToolPath}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 inline-flex items-center justify-center gap-1.5 transition-all self-start sm:self-center cursor-pointer hover:scale-105"
          >
            <span>{guide.relatedToolLabel || 'Open Tool'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Article Markdown Body */}
      <article className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
        {/* Render sections formatted */}
        <div
          className="space-y-6"
          dangerouslySetInnerHTML={{
            __html: guide.content
              .replace(/^## (.*$)/gim, '<h2 class="text-xl font-black text-slate-900 dark:text-white pt-4 pb-1 border-b border-slate-200 dark:border-slate-800">$1</h2>')
              .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-slate-900 dark:text-white pt-2">$1</h3>')
              .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/gim, '<em>$1</em>')
              .replace(/`([^`]+)`/gim, '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-indigo-600 dark:text-indigo-400">$1</code>')
              .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">$1</a>')
              .replace(/^\> (.*$)/gim, '<blockquote class="p-3.5 my-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 text-amber-900 dark:text-amber-200 text-xs">$1</blockquote>')
              .replace(/\| (.*) \|/gim, (match) => {
                return match;
              })
              .replace(/\n\n/g, '<br/><br/>')
          }}
        />
      </article>

      {/* Tags Row */}
      <div className="flex items-center gap-2 flex-wrap pt-2">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
          <Tag className="w-3.5 h-3.5" /> Tags:
        </span>
        {guide.tags.map((t) => (
          <span
            key={t}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400"
          >
            #{t}
          </span>
        ))}
      </div>

      {/* Related Guides Section */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Related Guides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {relatedGuides.map((rel) => (
            <Link
              key={rel.slug}
              to={`/guides/${rel.slug}`}
              className="p-4 rounded-2xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all space-y-2 block group shadow-xs"
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {rel.category}
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2 transition-colors">
                {rel.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2">{rel.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
