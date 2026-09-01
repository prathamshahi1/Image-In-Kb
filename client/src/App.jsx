import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Compressor from './pages/Compressor';
import Resizer from './pages/Resizer';
import Converter from './pages/Converter';
import Editor from './pages/Editor';
import Batch from './pages/Batch';
import ImageToPdf from './pages/ImageToPdf';
import Calculator from './pages/Calculator';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ToolsHub from './pages/ToolsHub';
import SeoPresetCompressor from './pages/SeoPresetCompressor';
import PassportPhoto from './pages/PassportPhoto';
import SignatureCompressor from './pages/SignatureCompressor';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans transition-colors duration-200">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Core Suite */}
                <Route path="/" element={<Home />} />
                <Route path="/compress" element={<Compressor />} />
                <Route path="/resize" element={<Resizer />} />
                <Route path="/convert" element={<Converter />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/zipimg" element={<Batch />} />
                <Route path="/batch" element={<Batch />} />
                <Route path="/image-to-pdf" element={<ImageToPdf />} />
                <Route path="/img-to-pdf" element={<ImageToPdf />} />
                <Route path="/calculator" element={<Calculator />} />

                {/* Tools Directory */}
                <Route path="/tools" element={<ToolsHub />} />

                {/* 1. Target KB Compressor Keywords */}
                <Route
                  path="/reduce-image-in-kb"
                  element={
                    <SeoPresetCompressor
                      targetKb={100}
                      title="Reduce Image Size in KB/MB Online"
                      subtitle="Reduce JPG, PNG, and WebP images to exact target KB (20KB, 50KB, 100KB, 200KB) online for free without losing quality."
                      canonicalUrl="https://imageinkb.com/reduce-image-in-kb"
                    />
                  }
                />
                <Route
                  path="/reduce-image-size-in-kb"
                  element={
                    <SeoPresetCompressor
                      targetKb={50}
                      title="Reduce Image Size in KB Online"
                      subtitle="Easily reduce image file sizes to exact KB limits for official exam portals, job forms, and websites."
                      canonicalUrl="https://imageinkb.com/reduce-image-size-in-kb"
                    />
                  }
                />
                <Route
                  path="/resize-image-to-kb"
                  element={
                    <SeoPresetCompressor
                      targetKb={100}
                      title="Resize Image to KB or MB Online for Free"
                      subtitle="Resize and compress photos to any target file size specified in KB or MB in 1 click."
                      canonicalUrl="https://imageinkb.com/resize-image-to-kb"
                    />
                  }
                />
                <Route
                  path="/compress-image-to-20kb"
                  element={
                    <SeoPresetCompressor
                      targetKb={20}
                      title="Compress Image to 20 KB"
                      subtitle="Strict 20 KB compression preset designed specifically for government signatures and exam forms."
                      canonicalUrl="https://imageinkb.com/compress-image-to-20kb"
                    />
                  }
                />
                <Route
                  path="/compress-image-to-50kb"
                  element={
                    <SeoPresetCompressor
                      targetKb={50}
                      title="Compress Image to 50 KB"
                      subtitle="Reduce image size strictly under 50 KB for official portals, exams, and job applications."
                      canonicalUrl="https://imageinkb.com/compress-image-to-50kb"
                    />
                  }
                />
                <Route
                  path="/compress-image-to-100kb"
                  element={
                    <SeoPresetCompressor
                      targetKb={100}
                      title="Compress Image to 100 KB"
                      subtitle="Optimal high-speed web compression strictly under 100 KB with razor-sharp quality."
                      canonicalUrl="https://imageinkb.com/compress-image-to-100kb"
                    />
                  }
                />
                <Route
                  path="/compress-image-to-200kb"
                  element={
                    <SeoPresetCompressor
                      targetKb={200}
                      title="Compress Image to 200 KB"
                      subtitle="Compress high-resolution photos down to 200 KB for websites, forms, and social media."
                      canonicalUrl="https://imageinkb.com/compress-image-to-200kb"
                    />
                  }
                />

                {/* 2. Resize Keywords */}
                <Route
                  path="/resize-image"
                  element={
                    <Resizer
                      title="Resize Image Online Free"
                      subtitle="Scale image pixel dimensions, width, height, and percentage with Lanczos3 anti-aliasing."
                      canonicalUrl="https://imageinkb.com/resize-image"
                    />
                  }
                />
                <Route
                  path="/image-resizer"
                  element={
                    <Resizer
                      title="Free Image Resizer Online"
                      subtitle="Easily change image dimensions in pixels or percentage without losing visual sharpness."
                      canonicalUrl="https://imageinkb.com/image-resizer"
                    />
                  }
                />
                <Route
                  path="/resize-image-pixels"
                  element={
                    <Resizer
                      title="Resize Image Pixels Online (Width & Height)"
                      subtitle="Set exact pixel width and height dimensions with aspect ratio lock."
                      canonicalUrl="https://imageinkb.com/resize-image-pixels"
                    />
                  }
                />
                <Route
                  path="/photo-resizer"
                  element={
                    <Resizer
                      title="Photo Resizer Online — Free Picture Scaler"
                      subtitle="Fast online photo resizer to change image resolution for websites, social media, and passports."
                      canonicalUrl="https://imageinkb.com/photo-resizer"
                    />
                  }
                />

                {/* 3. Convert Keywords */}
                <Route
                  path="/jpg-to-png"
                  element={
                    <Converter
                      initialTargetFormat="png"
                      title="JPG to PNG Converter Online Free"
                      subtitle="Convert JPG/JPEG images to lossless PNG format in milliseconds."
                      canonicalUrl="https://imageinkb.com/jpg-to-png"
                    />
                  }
                />
                <Route
                  path="/convert-jpg-to-png"
                  element={
                    <Converter
                      initialTargetFormat="png"
                      title="Convert JPG to PNG Online Free"
                      subtitle="Convert JPG photos to high-quality transparent PNG format."
                      canonicalUrl="https://imageinkb.com/convert-jpg-to-png"
                    />
                  }
                />
                <Route
                  path="/png-to-jpg"
                  element={
                    <Converter
                      initialTargetFormat="jpeg"
                      title="PNG to JPG Converter Online Free"
                      subtitle="Convert PNG graphics to compressed JPG format with adjustable quality."
                      canonicalUrl="https://imageinkb.com/png-to-jpg"
                    />
                  }
                />
                <Route
                  path="/convert-png-to-jpg"
                  element={
                    <Converter
                      initialTargetFormat="jpeg"
                      title="Convert PNG to JPG Online Free"
                      subtitle="Convert PNG images to JPG quickly with zero loss in clarity."
                      canonicalUrl="https://imageinkb.com/convert-png-to-jpg"
                    />
                  }
                />
                <Route
                  path="/webp-to-jpg"
                  element={
                    <Converter
                      initialTargetFormat="jpeg"
                      title="WebP to JPG Converter Online Free"
                      subtitle="Convert modern WebP images to standard JPG format for universal compatibility."
                      canonicalUrl="https://imageinkb.com/webp-to-jpg"
                    />
                  }
                />
                <Route
                  path="/convert-webp-to-jpg"
                  element={
                    <Converter
                      initialTargetFormat="jpeg"
                      title="Convert WebP to JPG Online Free"
                      subtitle="Convert WebP files to JPG online without installing any software."
                      canonicalUrl="https://imageinkb.com/convert-webp-to-jpg"
                    />
                  }
                />
                <Route
                  path="/jpg-to-webp"
                  element={
                    <Converter
                      initialTargetFormat="webp"
                      title="JPG to WebP Converter Online Free"
                      subtitle="Convert JPG photos to next-generation WebP format for 30%+ smaller file sizes."
                      canonicalUrl="https://imageinkb.com/jpg-to-webp"
                    />
                  }
                />
                <Route
                  path="/png-to-webp"
                  element={
                    <Converter
                      initialTargetFormat="webp"
                      title="PNG to WebP Converter Online Free"
                      subtitle="Convert PNG images to next-gen WebP format with preserved alpha transparency."
                      canonicalUrl="https://imageinkb.com/png-to-webp"
                    />
                  }
                />
                <Route
                  path="/image-converter"
                  element={
                    <Converter
                      initialTargetFormat="webp"
                      title="Online Image Format Converter Free (JPG, PNG, WebP)"
                      subtitle="Universal image converter between WebP, PNG, and JPG formats."
                      canonicalUrl="https://imageinkb.com/image-converter"
                    />
                  }
                />

                {/* 4. Img to PDF Keywords */}
                <Route
                  path="/jpg-to-pdf"
                  element={
                    <ImageToPdf
                      title="JPG to PDF Converter Online Free"
                      subtitle="Convert single or multiple JPG images into a high-quality PDF document."
                      canonicalUrl="https://imageinkb.com/jpg-to-pdf"
                    />
                  }
                />
                <Route
                  path="/convert-jpg-to-pdf"
                  element={
                    <ImageToPdf
                      title="Convert JPG to PDF Online Free"
                      subtitle="Easily combine JPG photos into a single downloadable PDF file."
                      canonicalUrl="https://imageinkb.com/convert-jpg-to-pdf"
                    />
                  }
                />
                <Route
                  path="/png-to-pdf"
                  element={
                    <ImageToPdf
                      title="PNG to PDF Converter Online Free"
                      subtitle="Convert PNG files into a clean PDF document with custom margins."
                      canonicalUrl="https://imageinkb.com/png-to-pdf"
                    />
                  }
                />
                <Route
                  path="/images-to-pdf"
                  element={
                    <ImageToPdf
                      title="Images to PDF Converter — Combine Photos into PDF"
                      subtitle="Merge multiple photos and images into a single PDF document in seconds."
                      canonicalUrl="https://imageinkb.com/images-to-pdf"
                    />
                  }
                />
                <Route
                  path="/photo-to-pdf"
                  element={
                    <ImageToPdf
                      title="Photo to PDF Converter Online Free"
                      subtitle="Convert photos to PDF documents for homework, official portals, and records."
                      canonicalUrl="https://imageinkb.com/photo-to-pdf"
                    />
                  }
                />

                {/* 5. Editor Keywords */}
                <Route
                  path="/crop-image"
                  element={
                    <Editor
                      title="Crop Image Online Free — Aspect Ratio Photo Cropper"
                      subtitle="Crop photos with 1:1 square, 16:9, 4:3, and freeform aspect ratios."
                      canonicalUrl="https://imageinkb.com/crop-image"
                    />
                  }
                />
                <Route
                  path="/image-cropper"
                  element={
                    <Editor
                      title="Online Image Cropper (Free Photo Cropping)"
                      subtitle="Crop images online with live aspect ratio grid and precision bounding box."
                      canonicalUrl="https://imageinkb.com/image-cropper"
                    />
                  }
                />
                <Route
                  path="/rotate-image"
                  element={
                    <Editor
                      title="Rotate Image 90 Degrees Online Free"
                      subtitle="Rotate photos 90°, 180°, or 270° clockwise with lossless orientation fixes."
                      canonicalUrl="https://imageinkb.com/rotate-image"
                    />
                  }
                />
                <Route
                  path="/photo-editor"
                  element={
                    <Editor
                      title="Free Online Photo Editor — Crop, Rotate & Flip"
                      subtitle="Instant in-browser photo editor to crop, rotate, flip, and adjust picture formats."
                      canonicalUrl="https://imageinkb.com/photo-editor"
                    />
                  }
                />
                <Route
                  path="/name-and-date-on-photo"
                  element={
                    <Editor
                      title="Add Name and Date on Photo Online Free (DOB / DOP)"
                      subtitle="Easily add Candidate Name and Date of Birth (DOB) or Date of Photo (DOP) on passport size photo for SSC, UPSC, and government exam forms."
                      canonicalUrl="https://imageinkb.com/name-and-date-on-photo"
                      badge="Exam & Passport Tool"
                    />
                  }
                />
                <Route
                  path="/add-name-and-date-on-photo"
                  element={
                    <Editor
                      title="Add Name and Date on Photo for SSC & Govt Forms"
                      subtitle="Add white strip with candidate name and date of birth at the bottom of passport size photo online."
                      canonicalUrl="https://imageinkb.com/add-name-and-date-on-photo"
                      badge="Exam & Passport Tool"
                    />
                  }
                />
                <Route
                  path="/passport-photo-name-date"
                  element={
                    <Editor
                      title="Passport Photo with Name and Date Editor"
                      subtitle="Create standard passport photos with customized candidate name and date stamp."
                      canonicalUrl="https://imageinkb.com/passport-photo-name-date"
                      badge="Exam & Passport Tool"
                    />
                  }
                />

                {/* 6. ZipImg / Bulk Keywords */}
                <Route
                  path="/bulk-image-compressor"
                  element={
                    <Batch
                      title="Bulk Image Compressor Online (Download ZIP)"
                      subtitle="Compress up to 20 images simultaneously in parallel and download a single ZIP archive."
                      canonicalUrl="https://imageinkb.com/bulk-image-compressor"
                    />
                  }
                />
                <Route
                  path="/compress-multiple-images"
                  element={
                    <Batch
                      title="Compress Multiple Images to ZIP Online Free"
                      subtitle="Batch compress multiple photos at once and download a unified ZIP archive."
                      canonicalUrl="https://imageinkb.com/compress-multiple-images"
                    />
                  }
                />
                <Route
                  path="/zip-images"
                  element={
                    <Batch
                      title="Zip Images Online — Multi Photo Compressor"
                      subtitle="Package and compress up to 20 photos into a single ZIP file in seconds."
                      canonicalUrl="https://imageinkb.com/zip-images"
                    />
                  }
                />
                <Route
                  path="/batch-image-resizer"
                  element={
                    <Batch
                      title="Batch Image Resizer & Compressor"
                      subtitle="High-throughput batch image engine with instant client-side ZIP generation."
                      canonicalUrl="https://imageinkb.com/batch-image-resizer"
                    />
                  }
                />

                {/* Government & Application Tools */}
                <Route path="/passport-photo" element={<PassportPhoto />} />
                <Route path="/signature-compressor" element={<SignatureCompressor />} />

                {/* User Account & Dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Company & Legal Pages */}
                <Route path="/about" element={<AboutUs />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/contact" element={<ContactUs />} />

                {/* 404 Catch-All */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
