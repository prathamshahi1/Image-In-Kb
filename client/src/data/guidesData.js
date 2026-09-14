/**
 * Comprehensive SEO-Optimized Guides and Tutorials Database
 * Targeted at high-intent search queries (SSC, UPSC, Govt Exams, Image Compression, PDF, Passport Photos)
 */

export const GUIDES = [
  {
    slug: 'ssc-photo-and-signature-upload-guide',
    title: 'SSC Photo & Signature Upload Guidelines 2026: Size, 20KB-50KB Limits & Name/Date Rules',
    excerpt: 'Complete guide for SSC CGL, CHSL, MTS, and GD applicants on photo dimensions (3.5x4.5cm, 20-50KB), signature specs (10-20KB), and Name & Date of Photo (DOP) requirements.',
    category: 'Govt Exams',
    readTime: '4 min read',
    publishedAt: '2026-09-10',
    updatedAt: '2026-09-14',
    author: 'Image In Kb Editorial Team',
    relatedToolPath: '/signature-compressor',
    relatedToolLabel: 'Open SSC Signature Compressor',
    tags: ['SSC CGL', 'SSC CHSL', 'Govt Job Forms', 'Signature 20KB', 'Photo 50KB'],
    content: `
## SSC Official Photo & Signature Specifications (2026)

Staff Selection Commission (SSC) enforces strict technical criteria for candidate photograph and signature uploads in portal forms like SSC CGL, CHSL, MTS, Stenographer, and GD Constable. Submitting files outside the permissible dimensions or file size limits leads to instant application rejection.

### 1. SSC Photograph Requirements

| Specification | Official Rule | Recommended Setting |
| :--- | :--- | :--- |
| **File Format** | JPEG / JPG | \`image/jpeg\` |
| **File Size Limit** | **20 KB to 50 KB** | Target ~35 KB |
| **Dimensions** | 3.5 cm (width) × 4.5 cm (height) | **132 × 170 pixels** (or 350 × 450 px) |
| **Background** | Light / Pure White | Clean, plain background |
| **Name & Date Stamp** | Candidate Name & Date of Photo (DOP) printed clearly at the bottom | White banner strip with black text |

> **Important SSC Note:** Ensure your face occupies 70% to 80% of the photo area. Both ears must be clearly visible, and the photo must not be older than 3 months from the notification date.

---

### 2. SSC Signature Specifications

| Specification | Official Rule | Recommended Setting |
| :--- | :--- | :--- |
| **File Format** | JPEG / JPG | \`image/jpeg\` |
| **File Size Limit** | **10 KB to 20 KB** | Target ~15 KB |
| **Dimensions** | 4.0 cm (width) × 2.0 cm (height) | **150 × 75 pixels** (or 300 × 120 px) |
| **Ink & Paper** | Black or Dark Blue ink on white paper | Clean background |

---

### Step-by-Step Guide to Prepare SSC Photo & Signature

1. **Step 1:** Sign on a clean, unruled white sheet using a black ballpoint pen.
2. **Step 2:** Take a photo in good lighting or scan using your phone camera.
3. **Step 3:** Use our [SSC Signature Compressor](/signature-compressor) to automatically clean the background and resize strictly under 20 KB.
4. **Step 4:** For photograph, use the [Name & Date on Photo Tool](/edit) to stamp your name and today's date at the bottom strip.
5. **Step 5:** Download the optimized file and upload directly into the SSC application portal without errors.
    `
  },
  {
    slug: 'how-to-compress-image-to-20kb-or-50kb',
    title: 'How to Compress Images to Exact 20KB or 50KB Without Losing Quality',
    excerpt: 'Learn how to reduce JPG, PNG, and WebP file sizes to exact 20 KB, 50 KB, or 100 KB limits using binary-search quality tuning and adaptive dimension scaling.',
    category: 'Image Compression',
    readTime: '3 min read',
    publishedAt: '2026-09-08',
    updatedAt: '2026-09-14',
    author: 'Image In Kb Tech Team',
    relatedToolPath: '/compress-image-to-50kb',
    relatedToolLabel: 'Compress Image to 50KB Online',
    tags: ['Compress to 20KB', 'Compress to 50KB', 'Reduce Image Size', 'Online Optimizer'],
    content: `
## Why Do Official Portals Require Exact 20KB or 50KB Images?

Government job portals, university admissions (UPSC, IBPS, NEET, JEE, CUET), and visa applications process millions of document submissions concurrently. To conserve database bandwidth and maintain standardized processing, portals reject any photo or signature exceeding strict 20 KB or 50 KB thresholds.

### Common Compression Pitfalls to Avoid

- **Using generic image compressors:** Most standard online compressors only offer fixed quality sliders (e.g. 50%), forcing you to guess and re-upload repeatedly until the file happens to hit 48KB.
- **Extreme blurriness:** Crushing quality down to 5% without scaling resolution produces illegible signature lines.
- **Canvas PNG trap:** In standard browser canvas, PNG is lossless. Attempting to compress a PNG by lowering quality does nothing unless converted to JPG/WebP or scaled.

---

### How Image In Kb Solves This with High Precision

Image In Kb uses an in-browser **Binary Search Engine**:

1. **Iterative Quality Search:** The engine calculates the exact lossy compression factor across 8 binary search steps to land within 90%–98% of your exact requested target.
2. **Adaptive Dimension Smoothing:** If a 12-megapixel smartphone photo cannot fit into 20KB through compression alone, the engine gently rescales dimensions with Lanczos3 anti-aliasing so text remains razor-sharp.
3. **Zero-Upload Privacy:** Processing runs entirely inside your browser's RAM buffers. Your sensitive photos and signatures are never sent to external servers.

---

### Quick Preset Direct Links
- [Compress Image to 20 KB (Signatures & Bank Portals)](/compress-image-to-20kb)
- [Compress Image to 50 KB (Exam & Govt Photos)](/compress-image-to-50kb)
- [Compress Image to 100 KB (Universal Portals & Web)](/compress-image-to-100kb)
- [Compress Image to 200 KB (High-Detail Documents)](/compress-image-to-200kb)
    `
  },
  {
    slug: 'passport-size-photo-requirements-guide',
    title: 'Passport Photo Size Requirements by Country (India, US, Schengen, UK)',
    excerpt: 'Detailed comparison of passport and visa photo dimensions, pixel sizes, aspect ratios, background colors, and KB limits for India, US Visa, Schengen, and UK passport applications.',
    category: 'Passport & Visa',
    readTime: '5 min read',
    publishedAt: '2026-09-05',
    updatedAt: '2026-09-14',
    author: 'Image In Kb Editorial Team',
    relatedToolPath: '/passport-photo',
    relatedToolLabel: 'Open Passport Photo Resizer',
    tags: ['Passport Photo', 'US Visa Photo', 'Schengen Visa', '35x45mm', '2x2 inch'],
    content: `
## Global Passport & Visa Photo Dimension Standards

When applying for international visas or passport renewals, photo specifications vary widely by country. Below is the official reference guide for major destinations.

### International Passport Photo Dimension Matrix

| Country / Authority | Physical Size | Digital Pixel Dimensions | Max File Size | Background |
| :--- | :--- | :--- | :--- | :--- |
| **India Passport / Visa** | 3.5 × 4.5 cm (35 × 45 mm) | 413 × 531 px (300 DPI) | 50 KB – 300 KB | White or Light Off-White |
| **US Passport & DS-160 Visa** | 2 × 2 inches (51 × 51 mm) | **600 × 600 px** up to 1200 × 1200 px | 240 KB (Min 600x600) | Plain White |
| **Schengen Visa (Europe)** | 3.5 × 4.5 cm (35 × 45 mm) | 413 × 531 px | Under 200 KB | Plain Light Grey / White |
| **UK Passport & Visa** | 3.5 × 4.5 cm (35 × 45 mm) | 413 × 531 px | 50 KB – 10 MB | Light Grey or Cream |
| **Canada Visa** | 5.0 × 7.0 cm (50 × 70 mm) | 590 × 826 px | Under 4 MB | Pure White |

---

### Key Composition Guidelines for Visa Photos

1. **Head Size:** Your head (from crown to chin) should cover between 70% and 80% of the vertical photo height.
2. **Facial Expression:** Neutral expression with both eyes open, looking straight at the camera.
3. **Eyeglasses:** Generally prohibited for US and Schengen visa photos to avoid reflections.
4. **Lighting:** Uniform lighting with zero harsh shadows behind ears or chin.

### Create Passport Photos Online in 1 Click
Use our [Passport Photo Resizer Tool](/passport-photo) to crop to exact millimeter or pixel dimensions and compress to the required file size automatically.
    `
  },
  {
    slug: 'how-to-convert-pdf-to-jpg-high-resolution',
    title: 'How to Convert Multi-Page PDF to High-Resolution JPG / PNG for Free',
    excerpt: 'Learn how to extract individual pages or entire multi-page PDF documents into crisp 150 DPI, 200 DPI, or 300 DPI JPG and PNG images with instant ZIP downloads.',
    category: 'PDF Tools',
    readTime: '3 min read',
    publishedAt: '2026-09-09',
    updatedAt: '2026-09-14',
    author: 'Image In Kb Tech Team',
    relatedToolPath: '/pdf-to-image',
    relatedToolLabel: 'Open PDF to Image Converter',
    tags: ['PDF to JPG', 'PDF to PNG', 'PDF Extractor', 'DPI Settings'],
    content: `
## Why Convert PDF Documents to JPG or PNG Images?

PDF is the universal standard for multi-page documents, but many portals, presentation software, WhatsApp groups, and social platforms require standard image formats (JPG, PNG). Converting PDF pages into images allows effortless embedding, cropping, and sharing.

### JPG vs. PNG vs. WebP for PDF Pages

- **JPG / JPEG (Best for general documents & photos):** Offers the smallest file size with excellent balance of visual clarity and quick loading.
- **PNG (Best for text, invoices, blueprints & diagrams):** 100% lossless output where fine text lines and small fonts remain ultra-crisp without compression artifacts.
- **WebP (Best for modern web publishing):** 25%–35% smaller file sizes than JPG with identical visual quality.

---

### Choosing the Right DPI Scale

When converting PDF pages using our [PDF to Image Tool](/pdf-to-image), you can choose from three DPI rendering profiles:

1. **Standard (150 DPI - 1.5x Scale):** Ideal for email attachments and quick smartphone viewing.
2. **High HD (200 DPI - 2.0x Scale):** Recommended default for standard office documents and official submissions.
3. **Ultra HD (300 DPI - 3.0x Scale):** Maximum clarity for large prints, engineering blueprints, and legal contracts.

---

### How to Convert PDF to Images in 3 Steps

1. Visit [Image In Kb PDF to Image Converter](/pdf-to-image).
2. Drag and drop your PDF file (single or multi-page up to 100MB).
3. Select your desired pages (or all pages), pick your format (JPG/PNG), and click **"Download All as ZIP"** or save individual page images on demand.
    `
  },
  {
    slug: 'add-name-and-date-of-birth-on-photo-online',
    title: 'How to Add Name and Date on Passport Size Photo (DOB/DOP Stamp) for Govt Exams',
    excerpt: 'Step-by-step tutorial on adding candidate name and date of birth (DOB) or date of photo (DOP) at the bottom strip of passport photos for SSC, UPSC, and State PSC applications.',
    category: 'Exam Forms',
    readTime: '3 min read',
    publishedAt: '2026-09-02',
    updatedAt: '2026-09-14',
    author: 'Image In Kb Editorial Team',
    relatedToolPath: '/edit',
    relatedToolLabel: 'Add Name & Date on Photo',
    tags: ['Name on Photo', 'Date of Photo', 'SSC Photo Stamp', 'Exam Guidelines'],
    content: `
## Why Do Exam Authorities Require Name & Date Stamps on Photos?

Several major examination boards across India (including SSC, UPSC, State Public Service Commissions, Police Recruitment Boards, and Railway Recruitment Boards) mandate that candidate photographs must display:
- **Candidate's Full Name** (in capital letters)
- **Date of Photo (DOP) or Date of Birth (DOB)** printed legibly at the bottom of the photo.

This prevents the use of outdated photographs and verifies candidate identity during examination center biometric verification.

---

### Official Stamp Formatting Rules

1. **Banner Color:** Clear white strip at the bottom of the photograph (or semi-transparent black banner).
2. **Text Contrast:** Bold black text on white strip, or crisp white text on black background.
3. **Typography:** Clean sans-serif font (Inter / Arial / Helvetica). No fancy decorative or cursive scripts.
4. **Date Format:** Standard \`DD/MM/YYYY\` or \`DD-MM-YYYY\` (e.g. \`15/08/2026\`).

---

### How to Add Name and Date on Your Photo in Seconds

1. Open our [Crop & Edit Photo Tool](/edit).
2. Upload your passport size photo.
3. Scroll down to the **"Name & Date Strip (Govt & Exam Forms)"** section.
4. Enter your **Candidate Name** (e.g., \`PRATHAM KUMAR\`) and **Date** (e.g., \`15/09/2026\`).
5. Choose your strip style (White Strip with Black Text is recommended for SSC).
6. Click **Apply & Download** to save your exam-ready photograph!
    `
  }
];
