import React from 'react';
import { FileText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import SeoHead from '../components/SeoHead';

export default function Terms() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 animate-fade-in text-slate-700 dark:text-slate-300 transition-colors duration-200">
      <SeoHead
        title="Terms of Service — Image In Kb"
        description="Review the terms, conditions, and acceptable use policy for Image In Kb image optimization platform."
        canonicalUrl="https://imageinkb.com/terms"
      />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5" /> Legal Agreement
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono">
          Last updated: August 29, 2026
        </p>
      </div>

      {/* Terms Body */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0e1424]/90 border border-slate-200 dark:border-slate-800 space-y-8 text-xs sm:text-sm leading-relaxed shadow-xs">
        
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Image In Kb (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Permitted & Acceptable Use</h2>
          <p>
            Image In Kb is provided for personal, academic, and commercial image optimization. You agree not to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
            <li>Use the service to process unlawful, defamatory, malicious, or abusive content.</li>
            <li>Attempt to bypass rate limits or compromise server infrastructure through automated denial-of-service (DDoS) scripts.</li>
            <li>Reverse engineer or disrupt our memory pipelines and API endpoints.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Intellectual Property Rights</h2>
          <p>
            You retain 100% full ownership and intellectual property rights over all images, photography, artwork, and signatures you process through Image In Kb. We claim zero ownership or licensing rights over your files.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Disclaimer of Warranties & Limitation of Liability</h2>
          <p>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. While we utilize industry-leading Libvips algorithms, Image In Kb is not liable for data loss, service interruptions, or consequences of using compressed files.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">5. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of Image In Kb following any changes constitutes your acceptance of the updated terms.
          </p>
        </section>

      </div>

    </div>
  );
}
