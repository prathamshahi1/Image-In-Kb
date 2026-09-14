import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, 'dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error('Error: dist/index.html not found. Run "vite build" first.');
  process.exit(1);
}

const baseTemplate = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

/**
 * Full Registry of All 60+ Routes with Target Keywords, Titles, Descriptions, and Initial Pre-Rendered HTML
 */
const ROUTES = [
  // 1. Core Suite
  {
    path: '/',
    title: 'Image In Kb — Fast, In-Memory Image Compressor & Optimizer',
    description: 'Compress images to exact KB targets (50KB, 100KB, 200KB), resize dimensions with Lanczos3, convert between JPG/PNG/WebP, and edit photos with zero server storage.',
    h1: 'Compress Images to Exact KB Online',
    subtitle: 'Fast, private, and zero-storage optimization engine. Reduce file sizes by up to 90% without visible quality loss.'
  },
  {
    path: '/compress',
    title: 'Target Size Compressor — Reduce Image to Exact KB | Image In Kb',
    description: 'Compress JPG, PNG, and WebP images to exact target KB sizes (50KB, 100KB, 200KB, 500KB) using binary search quality tuning.',
    h1: 'Target Size Image Compressor',
    subtitle: 'Reduce images to exact KB targets (50KB, 100KB, 200KB, etc.) without downscaling dimensions.'
  },
  {
    path: '/resize',
    title: 'Smart Image Resizer — Scale by Pixels or Percentage | Image In Kb',
    description: 'Resize JPG, PNG, and WebP images by exact pixel dimensions or percentage scale with Lanczos3 anti-aliasing.',
    h1: 'Smart Image Resizer',
    subtitle: 'Scale by exact pixel dimensions (width × height) or percentage with Lanczos3 anti-aliasing.'
  },
  {
    path: '/convert',
    title: 'Image Format Converter — WebP, JPG, PNG | Image In Kb',
    description: 'Convert images instantly between modern WebP, JPG, and PNG formats directly in your browser with zero server uploads.',
    h1: 'Image Format Converter',
    subtitle: 'Convert between JPG, PNG, and WebP formats instantly with high-speed in-browser conversion.'
  },
  {
    path: '/edit',
    title: 'Crop & Rotate Image — Custom Aspect Ratio Editor | Image In Kb',
    description: 'Crop photos with standard aspect ratios (1:1, 4:3, 16:9, 3:2), add Name & DOB stamps, rotate 90°, and flip vertically/horizontally.',
    h1: 'Crop & Rotate Image',
    subtitle: 'Aspect ratio cropping (Free, 1:1, 4:3, 16:9), candidate name & date stamps, and 90° rotation.'
  },
  {
    path: '/zipimg',
    title: 'ZipImg — Bulk Image Compressor Online (Download ZIP) | Image In Kb',
    description: 'Compress up to 20 images simultaneously in parallel and download a single unified ZIP archive.',
    h1: 'ZipImg Bulk Image Compressor',
    subtitle: 'Process up to 20 images concurrently in parallel streams and download a single ZIP archive.'
  },
  {
    path: '/batch',
    title: 'Bulk Image Compressor — Process Multiple Photos to ZIP | Image In Kb',
    description: 'Batch compress and convert up to 20 images concurrently and download as a ZIP archive.',
    h1: 'Batch Image Compressor',
    subtitle: 'Batch compress multiple photos at once and download a unified ZIP archive.'
  },
  {
    path: '/pdf-to-image',
    title: 'PDF to Image Converter (JPG, PNG, WebP) — Free & Fast | Image In Kb',
    description: 'Extract multi-page PDF documents into crystal-clear 150 DPI, 200 DPI, or 300 DPI JPG, PNG, or WebP images with single-click ZIP archive downloads.',
    h1: 'PDF to Image Converter',
    subtitle: 'Convert PDF pages into high-resolution JPG, PNG, or WebP images. Download individual pages or the entire document as a ZIP archive.'
  },
  {
    path: '/pdf-to-jpg',
    title: 'PDF to JPG Converter Online — Extract PDF to High-Res JPG | Image In Kb',
    description: 'Convert PDF files to high-quality JPG images online for free. Single page or bulk ZIP downloads with custom DPI resolution.',
    h1: 'PDF to JPG Converter',
    subtitle: 'Extract crystal-clear JPG photos from multi-page PDF documents with instant ZIP packaging.'
  },
  {
    path: '/pdf-to-png',
    title: 'PDF to PNG Converter Online — Lossless PDF Extraction | Image In Kb',
    description: 'Convert PDF documents to lossless PNG images. Perfect for blueprints, text documents, and invoices.',
    h1: 'PDF to PNG Converter',
    subtitle: 'Lossless PDF page extraction to PNG format with sharp text and zero compression artifacts.'
  },
  {
    path: '/image-to-pdf',
    title: 'Image to PDF Converter — Combine Photos into PDF | Image In Kb',
    description: 'Combine single or multiple JPG, PNG, and WebP photos into a clean, ready-to-print PDF document with custom margins and page sizes.',
    h1: 'Image to PDF Converter',
    subtitle: 'Combine single or multiple JPG, PNG, and WebP photos into a clean, ready-to-print PDF document.'
  },
  {
    path: '/passport-photo',
    title: 'Passport Photo Resizer & Compressor — 50KB / 100KB | Image In Kb',
    description: 'Crop and compress passport photos for US Visa (2x2"), Schengen (35x45mm), and Govt SSC/UPSC exam portals strictly under 50KB or 100KB.',
    h1: 'Passport Photo Resizer',
    subtitle: 'US 2x2", Schengen 35x45mm, and exam dimensions with strict KB limits.'
  },
  {
    path: '/signature-compressor',
    title: 'Signature Compressor — Under 20KB & 10KB Online | Image In Kb',
    description: 'Compress signatures strictly under 10KB, 20KB, or 50KB with paper background whitening for online exam and banking portals.',
    h1: 'Signature Compressor',
    subtitle: 'Compress signatures strictly under 10KB, 20KB, or 50KB with automated paper whitening.'
  },
  {
    path: '/tools',
    title: 'All Image & PDF Tools Directory | Image In Kb',
    description: 'Explore the complete directory of free image compressors, resizers, format converters, PDF tools, and passport photo editors.',
    h1: 'All Optimization Tools',
    subtitle: 'Fast, secure, in-browser image optimization and PDF conversion suite with zero data storage.'
  },

  // 2. Target KB Presets
  {
    path: '/reduce-image-in-kb',
    title: 'Reduce Image Size in KB/MB Online — Free & Fast | Image In Kb',
    description: 'Reduce JPG, PNG, and WebP images to exact target KB (20KB, 50KB, 100KB, 200KB) online for free without losing quality.',
    h1: 'Reduce Image Size in KB',
    subtitle: 'High-precision target optimizer for exam forms, websites, and portal uploads.'
  },
  {
    path: '/reduce-image-size-in-kb',
    title: 'Reduce Image Size in KB Online — Exact Target Limits | Image In Kb',
    description: 'Easily reduce image file sizes to exact KB limits for official exam portals, job forms, and websites.',
    h1: 'Reduce Image Size in KB',
    subtitle: 'Easily reduce image file sizes to exact KB limits for official exam portals, job forms, and websites.'
  },
  {
    path: '/compress-image-to-20kb',
    title: 'Compress Image to 20 KB — Free & Fast | Image In Kb',
    description: 'Strict 20 KB compression preset designed specifically for government signatures, bank portals, and official forms.',
    h1: 'Compress Image to 20 KB',
    subtitle: 'Strict 20 KB compression preset designed specifically for government signatures and exam forms.'
  },
  {
    path: '/compress-image-to-50kb',
    title: 'Compress Image to 50 KB — Free & Fast | Image In Kb',
    description: 'Compress JPG, PNG, and WebP photos under 50 KB for SSC, UPSC, IBPS, and state government online job applications.',
    h1: 'Compress Image to 50 KB',
    subtitle: 'The standard 50 KB photo preset required by competitive exam portals and job application forms.'
  },
  {
    path: '/compress-image-to-100kb',
    title: 'Compress Image to 100 KB — Free & Fast | Image In Kb',
    description: 'Compress photos and documents to 100 KB for fast email delivery, visa portals, and web publishing with crystal clear quality.',
    h1: 'Compress Image to 100 KB',
    subtitle: 'The most popular universal image compression preset for web performance and portal uploads.'
  },
  {
    path: '/compress-image-to-200kb',
    title: 'Compress Image to 200 KB — Free & Fast | Image In Kb',
    description: 'Reduce high-resolution photos and documents to 200 KB without losing clarity for official portals.',
    h1: 'Compress Image to 200 KB',
    subtitle: 'Balanced compression for high-detail photos, ID cards, and official documents.'
  },
  {
    path: '/compress-image-to-500kb',
    title: 'Compress Image to 500 KB — Free & Fast | Image In Kb',
    description: 'Compress camera photos and scanned documents to 500 KB for legal portals and email attachments.',
    h1: 'Compress Image to 500 KB',
    subtitle: 'Compress large camera photos to 500 KB while retaining full HD clarity.'
  },
  {
    path: '/compress-image-to-1mb',
    title: 'Compress Image to 1 MB — Free & Fast | Image In Kb',
    description: 'Reduce 10MB+ high megapixel photos under 1 MB for web publishing and portals.',
    h1: 'Compress Image to 1 MB',
    subtitle: 'Downscale heavy camera photos to exactly 1 MB without artifacting.'
  },

  // 3. Format Specific Presets
  {
    path: '/compress-jpeg-to-50kb',
    title: 'Compress JPEG to 50 KB Online — Free & Fast | Image In Kb',
    description: 'Compress JPG and JPEG photos strictly under 50 KB for SSC, UPSC, and online job application forms.',
    h1: 'Compress JPEG to 50 KB',
    subtitle: 'Strict 50 KB JPEG compressor for job portals and official applications.'
  },
  {
    path: '/compress-jpg-to-100kb',
    title: 'Compress JPG to 100 KB Online — Free & Fast | Image In Kb',
    description: 'Reduce JPG file size to 100 KB with binary-search quality tuning.',
    h1: 'Compress JPG to 100 KB',
    subtitle: 'Reduce JPG file size to 100 KB with binary-search quality tuning.'
  },
  {
    path: '/compress-png-to-50kb',
    title: 'Compress PNG to 50 KB Online — Free & Fast | Image In Kb',
    description: 'Compress PNG images to 50 KB with transparency preservation and adaptive scaling.',
    h1: 'Compress PNG to 50 KB',
    subtitle: 'Compress PNG images to 50 KB with transparency preservation and adaptive scaling.'
  },
  {
    path: '/compress-png-to-100kb',
    title: 'Compress PNG to 100 KB Online — Free & Fast | Image In Kb',
    description: 'Reduce PNG file sizes under 100 KB for web delivery and online submissions.',
    h1: 'Compress PNG to 100 KB',
    subtitle: 'Reduce PNG file sizes under 100 KB for web delivery and online submissions.'
  },

  // 4. Signatures & Exams
  {
    path: '/compress-signature-to-20kb',
    title: 'Compress Signature to 20 KB — Free & Fast | Image In Kb',
    description: 'Strict 20 KB signature optimizer for SSC, UPSC, Railway, and state PSC online exam applications.',
    h1: 'Compress Signature to 20 KB',
    subtitle: 'Strict 20 KB signature optimizer for government exam and banking portal uploads.'
  },
  {
    path: '/compress-signature-to-10kb',
    title: 'Compress Signature to 10 KB — Free & Fast | Image In Kb',
    description: 'Compress signatures strictly under 10 KB for strict bank exam and SBI/IBPS application portals.',
    h1: 'Compress Signature to 10 KB',
    subtitle: 'Ultra-compact signature compression strictly under 10 KB for banking portals.'
  },
  {
    path: '/ssc-signature-compressor',
    title: 'SSC Signature Compressor (Under 20 KB) | Image In Kb',
    description: 'Official 10KB–20KB signature compression tool with white background cleaning for SSC CGL, CHSL, and MTS forms.',
    h1: 'SSC Signature Compressor',
    subtitle: 'Official 10KB–20KB signature compression tool for SSC CGL, CHSL, and MTS forms.'
  },
  {
    path: '/upsc-signature-compressor',
    title: 'UPSC Signature Compressor (Under 20 KB) | Image In Kb',
    description: 'Resize and compress candidate signatures strictly for UPSC CSE, NDA, and CDS exam portals.',
    h1: 'UPSC Signature Compressor',
    subtitle: 'Resize and compress candidate signatures strictly for UPSC online exam portals.'
  },

  // 5. Name & Date on Photo
  {
    path: '/name-and-date-on-photo',
    title: 'Add Name and Date on Photo Online — Free & Fast | Image In Kb',
    description: 'Stamp candidate name and date of birth (DOB) or date of photo (DOP) on passport photos for SSC and UPSC forms.',
    h1: 'Add Name & Date on Photo',
    subtitle: 'Stamp candidate name and date of birth on passport photos for government job applications.'
  },
  {
    path: '/add-name-and-dob-on-photo',
    title: 'Add Name and Date of Birth on Photo for Govt Exams | Image In Kb',
    description: 'Add Name and Date of Birth (DOB) banner strip on passport photos for SSC, UPSC, and State PSC applications.',
    h1: 'Add Name & DOB on Photo',
    subtitle: 'Add Name and Date of Birth banner strip on passport photos for official examination forms.'
  },
  {
    path: '/text-on-image',
    title: 'Text on Image Online — Add Custom Text & Stamps | Image In Kb',
    description: 'Add custom text, captions, candidate names, and date stamps on photos online directly in your browser.',
    h1: 'Text on Image',
    subtitle: 'Add custom text, captions, and date stamps on photos online with zero server uploads.'
  },

  // 6. Format Conversion Keywords
  {
    path: '/convert-png-to-jpg',
    title: 'Convert PNG to JPG Online — Free & Fast | Image In Kb',
    description: 'Convert PNG images to high-quality JPG format online for free with instant browser conversion.',
    h1: 'Convert PNG to JPG',
    subtitle: 'Convert PNG images to high-quality JPG format online with zero uploads.'
  },
  {
    path: '/convert-jpg-to-png',
    title: 'Convert JPG to PNG Online — Free & Fast | Image In Kb',
    description: 'Convert JPG photos to lossless PNG format online for free directly in your browser.',
    h1: 'Convert JPG to PNG',
    subtitle: 'Convert JPG photos to lossless PNG format online for free directly in your browser.'
  },
  {
    path: '/convert-webp-to-jpg',
    title: 'Convert WebP to JPG Online — Free & Fast | Image In Kb',
    description: 'Convert modern WebP images to universal JPG format online for free with 1 click.',
    h1: 'Convert WebP to JPG',
    subtitle: 'Convert modern WebP images to universal JPG format online with 1 click.'
  },
  {
    path: '/convert-image-to-webp',
    title: 'Convert Image to WebP Online — Free & Fast | Image In Kb',
    description: 'Convert JPG and PNG images to ultra-compact WebP format for 30%+ faster website loading speeds.',
    h1: 'Convert Image to WebP',
    subtitle: 'Convert JPG and PNG images to ultra-compact WebP format for faster websites.'
  },

  // 7. Guides & Articles
  {
    path: '/guides',
    title: 'Guides & Tutorials — Image Optimization & Exam Specs | Image In Kb',
    description: 'Step-by-step guides on technical upload specifications for SSC, UPSC, passport photos, and image compression.',
    h1: 'Guides & Tutorials',
    subtitle: 'Step-by-step guides on technical upload specifications for competitive exams, passport photos, and image compression.'
  },
  {
    path: '/guides/ssc-photo-and-signature-upload-guide',
    title: 'SSC Photo & Signature Upload Guidelines 2026: Size & Rules | Image In Kb',
    description: 'Official guidelines for SSC CGL, CHSL, and MTS on photo dimensions (20-50KB), signature specs (10-20KB), and Name/Date stamp requirements.',
    h1: 'SSC Photo & Signature Upload Guidelines 2026',
    subtitle: 'Size, 20KB-50KB Limits & Name/Date Rules for SSC CGL, CHSL, MTS, and GD Forms.'
  },
  {
    path: '/guides/how-to-compress-image-to-20kb-or-50kb',
    title: 'How to Compress Images to Exact 20KB or 50KB | Image In Kb',
    description: 'Step-by-step tutorial on reducing JPG, PNG, and WebP file sizes to exact 20 KB or 50 KB limits without losing quality.',
    h1: 'How to Compress Images to Exact 20KB or 50KB',
    subtitle: 'Step-by-step tutorial on reducing JPG and PNG file sizes to exact KB limits for official exam portals.'
  },
  {
    path: '/guides/passport-size-photo-requirements-guide',
    title: 'Passport Photo Size Requirements by Country (India, US, Schengen) | Image In Kb',
    description: 'Detailed comparison of passport photo dimensions, pixel sizes, aspect ratios, and KB limits for India, US Visa, and Schengen.',
    h1: 'Passport Photo Size Requirements by Country',
    subtitle: 'Official dimension, pixel, and file size matrix for India, US Visa, Schengen, and UK passports.'
  },
  {
    path: '/guides/how-to-convert-pdf-to-jpg-high-resolution',
    title: 'How to Convert Multi-Page PDF to High-Resolution JPG / PNG | Image In Kb',
    description: 'Learn how to extract individual pages or entire multi-page PDF documents into crisp 150 DPI, 200 DPI, or 300 DPI JPG and PNG images.',
    h1: 'How to Convert Multi-Page PDF to High-Resolution JPG / PNG',
    subtitle: 'DPI settings, single-page vs. ZIP downloads, and lossless PDF extraction guide.'
  },
  {
    path: '/guides/add-name-and-date-of-birth-on-photo-online',
    title: 'How to Add Name and Date on Passport Size Photo for Govt Exams | Image In Kb',
    description: 'Tutorial on adding candidate name and date of birth (DOB) or date of photo (DOP) on passport photos for SSC and UPSC forms.',
    h1: 'How to Add Name and Date on Passport Size Photo',
    subtitle: 'Step-by-step tutorial for SSC, UPSC, and State PSC application form photo formatting.'
  },

  // 8. Legal & Utilities
  {
    path: '/calculator',
    title: 'Image File Size Unit Calculator (Bytes, KB, MB, GB) | Image In Kb',
    description: 'Convert between Bytes, Kilobytes (KB), Megabytes (MB), and Gigabytes (GB) in exact binary 1024 base.',
    h1: 'Size Unit Calculator',
    subtitle: 'Convert between Bytes, KB, MB, and GB in binary 1024 base.'
  },
  {
    path: '/about',
    title: 'About Us — In-Memory High-Speed Image Engine | Image In Kb',
    description: 'Learn about Image In Kb, our private zero-upload architecture, and mission to provide instant image optimization.',
    h1: 'About Image In Kb',
    subtitle: 'Fast, private, and zero-storage image optimization platform powered by client-side WebAssembly and canvas.'
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy — Zero Server File Storage | Image In Kb',
    description: 'Read the Image In Kb privacy policy. All photos are processed in temporary RAM buffers with zero external server storage.',
    h1: 'Privacy Policy',
    subtitle: '100% In-Memory Processing with Zero Server File Retention.'
  },
  {
    path: '/terms',
    title: 'Terms of Service | Image In Kb',
    description: 'Terms of service for using the Image In Kb image compression, resizing, and conversion suite.',
    h1: 'Terms of Service',
    subtitle: 'Terms and conditions for Image In Kb optimization tools.'
  },
  {
    path: '/contact',
    title: 'Contact Us & Support | Image In Kb',
    description: 'Get in touch with the Image In Kb engineering and support team for feedback, bug reports, and assistance.',
    h1: 'Contact & Support',
    subtitle: 'Reach out to our team with feedback, questions, or feature requests.'
  }
];

/**
 * Pre-Render HTML Generator
 */
console.log(`\n🚀 Starting Static Pre-Rendering (SSG) for ${ROUTES.length} routes...`);

let count = 0;
for (const route of ROUTES) {
  const cleanPath = route.path === '/' ? '' : route.path.replace(/^\//, '');
  const targetDir = path.join(DIST_DIR, cleanPath);
  const targetFile = path.join(targetDir, 'index.html');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const canonicalUrl = `https://imageinkb.com${route.path === '/' ? '' : route.path}`;

  // Structured Data Schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: route.title.split('—')[0].trim(),
    url: canonicalUrl,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'All',
    description: route.description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };

  // Replace Title, Meta, and Canonical tags in HTML template
  let html = baseTemplate;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`);

  // Replace or Insert Meta Description
  if (html.includes('<meta name="description"')) {
    html = html.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${route.description}" />`);
  } else {
    html = html.replace('</head>', `  <meta name="description" content="${route.description}" />\n</head>`);
  }

  // Canonical Tag
  const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
  if (html.includes('<link rel="canonical"')) {
    html = html.replace(/<link rel="canonical"[^>]*>/i, canonicalTag);
  } else {
    html = html.replace('</head>', `  ${canonicalTag}\n</head>`);
  }

  // OpenGraph & Twitter Tags
  const ogTags = `
  <meta property="og:title" content="${route.title}" />
  <meta property="og:description" content="${route.description}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Image In Kb" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${route.title}" />
  <meta name="twitter:description" content="${route.description}" />
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  `;
  html = html.replace('</head>', `${ogTags}\n</head>`);

  // Inject Rich Static SEO Prerender Content inside <div id="root">
  const staticRootContent = `
    <header style="padding:24px 20px;text-align:center;max-width:900px;margin:0 auto;">
      <nav style="margin-bottom:20px;display:flex;flex-wrap:wrap;justify-content:center;gap:12px;font-size:13px;">
        <a href="https://imageinkb.com/" style="font-weight:bold;color:#4f46e5;text-decoration:none;">Image In Kb</a>
        <a href="https://imageinkb.com/compress" style="text-decoration:none;color:#334155;">Compress</a>
        <a href="https://imageinkb.com/resize" style="text-decoration:none;color:#334155;">Resize</a>
        <a href="https://imageinkb.com/convert" style="text-decoration:none;color:#334155;">Convert</a>
        <a href="https://imageinkb.com/edit" style="text-decoration:none;color:#334155;">Edit</a>
        <a href="https://imageinkb.com/zipimg" style="text-decoration:none;color:#334155;">ZipImg</a>
        <a href="https://imageinkb.com/image-to-pdf" style="text-decoration:none;color:#334155;">Img to PDF</a>
        <a href="https://imageinkb.com/pdf-to-image" style="text-decoration:none;color:#334155;">PDF to Img</a>
        <a href="https://imageinkb.com/guides" style="text-decoration:none;color:#334155;">Guides</a>
      </nav>
      <h1 style="font-size:2rem;font-weight:900;color:#0f172a;margin-bottom:8px;line-height:1.2;">${route.h1}</h1>
      <p style="font-size:1.05rem;color:#475569;margin-bottom:12px;">${route.subtitle}</p>
      <p style="font-size:0.9rem;color:#64748b;max-width:700px;margin:0 auto 20px;line-height:1.5;">${route.description}</p>
    </header>
    <main style="max-width:900px;margin:0 auto;padding:0 20px 40px;font-family:system-ui,-apple-system,sans-serif;">
      <section style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:24px;margin-bottom:24px;">
        <h2 style="font-size:1.2rem;font-weight:700;color:#0f172a;margin-bottom:12px;">Fast, In-Memory Image Optimization & PDF Engine</h2>
        <p style="font-size:0.9rem;color:#334155;line-height:1.6;margin-bottom:16px;">
          Image In Kb provides browser-based, private image compression, resizing, format conversion, and cropping with zero server uploads and 100% data confidentiality.
        </p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:12px;">
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:14px;">
            <h3 style="font-size:0.9rem;font-weight:700;color:#0f172a;margin-bottom:4px;">🔒 100% Private In-Browser Engine</h3>
            <p style="font-size:0.8rem;color:#64748b;margin:0;line-height:1.4;">Photos and signatures never leave your device. Everything processes in temporary RAM buffers.</p>
          </div>
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:14px;">
            <h3 style="font-size:0.9rem;font-weight:700;color:#0f172a;margin-bottom:4px;">🎯 Exact Target KB Tuning</h3>
            <p style="font-size:0.8rem;color:#64748b;margin:0;line-height:1.4;">Binary search quality algorithms ensure your files match exact 20KB, 50KB, or 100KB portal limits.</p>
          </div>
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:14px;">
            <h3 style="font-size:0.9rem;font-weight:700;color:#0f172a;margin-bottom:4px;">📄 PDF to Image & Img to PDF</h3>
            <p style="font-size:0.8rem;color:#64748b;margin:0;line-height:1.4;">Extract multi-page PDF documents to high-resolution JPG/PNG images or create printable PDFs.</p>
          </div>
        </div>
      </section>

      <section style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:24px;margin-bottom:24px;">
        <h2 style="font-size:1.15rem;font-weight:700;color:#0f172a;margin-bottom:12px;">Popular Online Optimization Tools</h2>
        <ul style="font-size:0.85rem;color:#334155;line-height:1.8;padding-left:20px;">
          <li><a href="https://imageinkb.com/compress" style="color:#4f46e5;font-weight:600;text-decoration:none;">Target Size Compressor</a> — Compress images to exact KB limits (50KB, 100KB, 200KB)</li>
          <li><a href="https://imageinkb.com/compress-image-to-50kb" style="color:#4f46e5;font-weight:600;text-decoration:none;">Compress Image to 50KB</a> — The standard 50KB preset for online exam and job forms</li>
          <li><a href="https://imageinkb.com/compress-image-to-20kb" style="color:#4f46e5;font-weight:600;text-decoration:none;">Compress Image to 20KB</a> — Strict 20KB preset for signatures and banking portals</li>
          <li><a href="https://imageinkb.com/signature-compressor" style="color:#4f46e5;font-weight:600;text-decoration:none;">Signature Compressor</a> — Compress signatures under 10KB, 20KB with paper whitening</li>
          <li><a href="https://imageinkb.com/passport-photo" style="color:#4f46e5;font-weight:600;text-decoration:none;">Passport Photo Resizer</a> — US 2x2", Schengen 35x45mm, and exam dimensions</li>
          <li><a href="https://imageinkb.com/pdf-to-image" style="color:#4f46e5;font-weight:600;text-decoration:none;">PDF to Image Converter</a> — Extract PDF pages to 150-300 DPI JPG, PNG, and ZIP</li>
          <li><a href="https://imageinkb.com/image-to-pdf" style="color:#4f46e5;font-weight:600;text-decoration:none;">Image to PDF Converter</a> — Combine multiple images into printable PDF documents</li>
          <li><a href="https://imageinkb.com/edit" style="color:#4f46e5;font-weight:600;text-decoration:none;">Crop & Rotate Image</a> — Aspect ratio cropping, Name & DOB stamps on photos</li>
          <li><a href="https://imageinkb.com/guides" style="color:#4f46e5;font-weight:600;text-decoration:none;">Guides & Tutorials</a> — Step-by-step upload guidelines for SSC, UPSC, and passport photos</li>
        </ul>
      </section>
    </main>
    <footer style="text-align:center;padding:24px 20px;border-top:1px solid #e2e8f0;font-size:0.8rem;color:#94a3b8;font-family:system-ui,-apple-system,sans-serif;">
      <p style="margin:0 0 8px;">© ${new Date().getFullYear()} Image In Kb. Fast, private, and zero-storage image optimization platform.</p>
      <p style="margin:0;">
        <a href="https://imageinkb.com/privacy-policy" style="color:#64748b;margin:0 8px;text-decoration:none;">Privacy Policy</a> •
        <a href="https://imageinkb.com/terms" style="color:#64748b;margin:0 8px;text-decoration:none;">Terms of Service</a> •
        <a href="https://imageinkb.com/contact" style="color:#64748b;margin:0 8px;text-decoration:none;">Contact Support</a>
      </p>
    </footer>
  `;

  html = html.replace('<div id="root"></div>', `<div id="root">${staticRootContent}</div>`);

  fs.writeFileSync(targetFile, html, 'utf-8');
  count++;
}

console.log(`✅ Successfully pre-rendered static HTML files for all ${count} routes into dist/!\n`);
