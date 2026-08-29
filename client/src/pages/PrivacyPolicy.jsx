import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server, FileText } from 'lucide-react';
import SeoHead from '../components/SeoHead';

export default function PrivacyPolicy() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 animate-fade-in text-slate-700 dark:text-slate-300 transition-colors duration-200">
      <SeoHead
        title="Privacy Policy — Image In Kb"
        description="Learn how Image In Kb protects your privacy with our strict in-memory zero-storage architecture. Your photos are never saved to disk."
        canonicalUrl="https://imageinkb.com/privacy-policy"
      />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" /> Privacy & Security Commitment
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono">
          Last updated: August 29, 2026
        </p>
      </div>

      {/* Privacy Highlight Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/20 space-y-2">
        <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          The Golden Rule: Zero Permanent File Storage
        </h3>
        <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-200/80 leading-relaxed">
          Image In Kb was engineered from day one on a zero-knowledge, in-memory pipeline. When you compress, resize, convert, or crop an image, your file is held in volatile RAM buffers solely for the duration of the request and is discarded immediately. We never store, preview, analyze, or sell your private images.
        </p>
      </div>

      {/* Policy Details */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 space-y-8 text-xs sm:text-sm leading-relaxed shadow-xs">
        
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Information We Collect</h2>
          <p>
            We collect the minimum amount of information necessary to deliver our services:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
            <li><strong>Account Information:</strong> If you voluntarily create an account, we store your name, email address, and a securely salted bcrypt password hash.</li>
            <li><strong>Processing Metadata:</strong> For authenticated users, we store processing statistics (original file size, compressed size, compression percentage, operation type, and timestamp) in your private dashboard. The actual image contents are never stored.</li>
            <li><strong>Server Logs:</strong> Standard HTTP request logs (IP address, user agent, response times) retained temporarily for security, rate-limiting, and error diagnostics.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. How We Use Your Data</h2>
          <p>
            Your information is used exclusively to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
            <li>Authenticate and maintain your personal dashboard session.</li>
            <li>Provide real-time analytics on your total bandwidth and storage savings.</li>
            <li>Prevent abuse, automated scraping, and DDoS attacks via rate limiting.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Third-Party Services & Analytics</h2>
          <p>
            We do not share, sell, rent, or monetize your personal information or processing metadata with third-party advertisers or data brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Cookies & Local Storage</h2>
          <p>
            We use browser <code>localStorage</code> solely to remember your chosen theme (Light vs. Dark mode) and your authenticated JWT session token. We do not use tracking cookies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">5. Your Data Rights (GDPR / CCPA)</h2>
          <p>
            You have full control over your data. You can delete any individual history record at any time directly from your Dashboard, or delete your entire account by contacting support.
          </p>
        </section>

      </div>

    </div>
  );
}
