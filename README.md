# Image In Kb — Full-Stack Image Optimization & Conversion Platform

**Image In Kb** is a production-grade SaaS image optimization platform built with React, Node.js, Express, Sharp, MongoDB, and Tailwind CSS. It empowers users to compress images to exact KB targets, resize dimensions, convert formats, crop and edit images, process batches into ZIP archives, and manage processing history.

---

## 🌟 Key Features

### 1. Target KB Image Compressor (`/compress`)
- Iterative binary-search quality tuning ($1 \le Q \le 100$) in $\le 8$ iterations.
- 1-Click Target Presets: **50 KB**, **100 KB**, **150 KB**, **200 KB**, **500 KB**, **1 MB**.
- Custom Target Size (KB / MB) and Min-Max Range Compression (e.g. 50–100 KB).
- Step-by-step optimization iteration history log.

### 2. Smart Image Resizer (`/resize`)
- Resize by exact pixels ($W \times H$) with aspect ratio lock.
- Resize by percentage scale ($25\%, 50\%, 75\%, 100\%$, Custom).
- Anti-aliasing interpolation using Sharp's **Lanczos3 kernel**.

### 3. Multi-Format Converter (`/convert`)
- Bidirectional conversion between **JPG/JPEG**, **PNG**, and **WEBP**.
- Quality and palette optimization for maximum web delivery performance.

### 4. Interactive Image Editor & Canvas (`/editor`)
- Precision crop rectangle with aspect ratios: **Free**, **1:1 Square**, **4:3 Standard**, **16:9 Cinema**.
- Rotate Left ($-90^\circ$), Rotate Right ($+90^\circ$), Flip Horizontal, and Flip Vertical.

### 5. Batch Image Processing (`/batch`)
- Concurrent multi-image processing for up to 20 files.
- In-memory ZIP archive generation using `archiver` streams (zero disk storage).

### 6. Government & Form Tools
- **Passport Photo Resizer** (`/passport-photo`): Presets for US 2x2", India/Schengen 35x45mm, SSC/UPSC 200x230px with strict KB limits.
- **Signature Compressor** (`/signature-compressor`): Strict < 10KB/20KB/50KB presets with high-contrast signature enhancement.

### 7. User Accounts & Analytics Dashboard (`/dashboard`)
- JWT authentication with bcrypt password hashing.
- 4 real-time analytics cards: Images Processed, Total Original Size, Total Bandwidth Saved, Average Compression Rate.
- Searchable & filterable history table with single-click delete.

---

## 🏛️ System Architecture

```text
img-resizer/
├── client/                      # React 18 + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/          # Navbar, Footer, UploadBox, ComparisonView, ComparisonSlider, CropCanvas, etc.
│   │   ├── context/             # AuthContext, ThemeContext
│   │   ├── pages/               # Home, Compressor, Resizer, Converter, Editor, Batch, Calculator, Dashboard, Login, Register, ToolsHub, PassportPhoto, SignatureCompressor, AboutUs, PrivacyPolicy, Terms, ContactUs, NotFound
│   │   ├── services/            # Axios API client
│   │   └── utils/               # Byte & dimension formatters
│   ├── public/                  # robots.txt, sitemap.xml, _redirects
│   └── package.json
│
├── server/                      # Express.js + Sharp + MongoDB Backend
│   ├── src/
│   │   ├── config/              # db.js (MongoDB), constants.js
│   │   ├── controllers/         # authController, imageController, historyController
│   │   ├── middleware/          # authMiddleware, uploadMiddleware (Multer), errorMiddleware, rateLimiter
│   │   ├── models/              # User.js (bcrypt), History.js (Mongoose)
│   │   ├── routes/              # authRoutes, imageRoutes, historyRoutes
│   │   ├── services/            # compressionService, resizeService, conversionService, editService, batchService
│   │   ├── utils/               # fileUtils
│   │   └── server.js            # Express app, Helmet, CORS, Rate Limit
│   ├── render.yaml              # Render deployment configuration
│   └── package.json
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **MongoDB**: Local MongoDB or MongoDB Atlas URI (Optional for dev — in-memory store automatically acts as offline fallback)

### 2. Start Backend Server
```bash
cd server
npm install
npm run dev
```
Backend runs on: `http://localhost:5001`
Health Check: `GET http://localhost:5001/api/health`

### 3. Start Frontend Client
```bash
cd client
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 🔑 Demo Account Credentials

A pre-configured test account is available for instant 1-click login:
- **Email**: `demo@imageinkb.com`
- **Password**: `password123`

---

## 📡 REST API Reference

### Health & Auth
- `GET  /api/health` — Service health & uptime
- `POST /api/auth/register` — Create account (`{ name, email, password }`)
- `POST /api/auth/login` — Sign in (`{ email, password }`)
- `GET  /api/auth/me` — Current user profile (Protected)

### Image Optimization
- `POST /api/images/inspect` — Extract Sharp metadata
- `POST /api/images/compress` — Target KB & Range compression
- `POST /api/images/resize` — Pixel & Percentage resizing
- `POST /api/images/convert` — Format conversion (JPG, PNG, WEBP)
- `POST /api/images/edit` — Crop, rotate, and flip
- `POST /api/images/process-batch` — Multi-image queue & ZIP download

### History & Analytics
- `GET    /api/history` — User processing history
- `GET    /api/history/stats` — User aggregation metrics
- `DELETE /api/history/:id` — Delete history record

---

## 🔒 Security & Privacy Features
- **In-Memory Buffer Processing**: Image streams are parsed in RAM buffers and never persisted to server disks.
- **Zero Raw Error Exposure**: Centralized error middleware prevents exposing internal server paths or stack traces.
- **Helmet Security Headers**: XSS protection, MIME sniffing prevention, and CSP.
- **Rate Limiting**: Rate limiter prevents API abuse (200 requests per 15 min per IP).
- **Password Hashing**: Bcrypt with 10 salt rounds.
