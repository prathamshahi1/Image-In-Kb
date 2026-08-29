import React, { useEffect } from 'react';

/**
 * Dynamic SEO Head component to manage Title, Meta tags, Canonical URLs, and JSON-LD schema.
 */
export default function SeoHead({
  title = 'Image In Kb — Fast, In-Memory Image Compressor & Optimizer',
  description = 'Compress images to exact KB targets (50KB, 100KB, 200KB), resize dimensions with Lanczos3, convert between JPG/PNG/WebP, and edit photos with zero server storage.',
  canonicalUrl = 'https://imageinkb.com/',
  ogType = 'website',
  structuredData = null
}) {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // 3. Update Canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = canonicalUrl;

    // 4. Update OpenGraph Tags
    const ogTags = {
      'og:title': title,
      'og:description': description,
      'og:url': canonicalUrl,
      'og:type': ogType,
      'og:site_name': 'Image In Kb'
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let ogMeta = document.querySelector(`meta[property="${property}"]`);
      if (!ogMeta) {
        ogMeta = document.createElement('meta');
        ogMeta.setAttribute('property', property);
        document.head.appendChild(ogMeta);
      }
      ogMeta.content = content;
    });

    // 5. Update Twitter Cards
    const twitterTags = {
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      let twitterMeta = document.querySelector(`meta[name="${name}"]`);
      if (!twitterMeta) {
        twitterMeta = document.createElement('meta');
        twitterMeta.setAttribute('name', name);
        document.head.appendChild(twitterMeta);
      }
      twitterMeta.content = content;
    });

    // 6. Inject JSON-LD Structured Data if provided
    let scriptTag = document.getElementById('jsonld-schema');
    if (structuredData) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'jsonld-schema';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, canonicalUrl, ogType, structuredData]);

  return null;
}
