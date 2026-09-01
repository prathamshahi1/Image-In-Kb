import React from 'react';
import SeoHead from '../components/SeoHead';
import ContactSection from '../components/ContactSection';

export default function ContactUs() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 animate-fade-in text-slate-700 dark:text-slate-300 transition-colors duration-200">
      <SeoHead
        title="Contact Us & Support — Image In Kb"
        description="Have questions, suggestions, or need assistance? Reach out to the Image In Kb team."
        canonicalUrl="https://imageinkb.com/contact"
      />

      <ContactSection showHeader={true} id="contact-page" />
    </div>
  );
}
