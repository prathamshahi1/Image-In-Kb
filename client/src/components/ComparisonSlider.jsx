import React, { useState, useRef, useCallback } from 'react';
import { MoveHorizontal } from 'lucide-react';

export default function ComparisonSlider({
  originalUrl,
  processedUrl,
  compressedUrl,
  originalLabel = 'Original',
  processedLabel = 'Processed'
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  // Accept either processedUrl or compressedUrl prop
  const rightImageUrl = processedUrl || compressedUrl;

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    percentage = Math.max(0, Math.min(100, percentage));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      className="relative w-full h-[380px] sm:h-[460px] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 select-none cursor-ew-resize group shadow-inner"
    >
      {/* Background Image: Processed (Right side) */}
      <img
        src={rightImageUrl}
        alt={processedLabel}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />
      <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-700 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold pointer-events-none z-10 shadow-sm backdrop-blur-xs">
        {processedLabel}
      </div>

      {/* Foreground Image: Original (Left side clipped by slider position) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={originalUrl}
          alt={originalLabel}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{
            width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
            maxWidth: 'none'
          }}
        />
        <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 font-bold pointer-events-none z-10 shadow-sm backdrop-blur-xs">
          {originalLabel}
        </div>
      </div>

      {/* Sliding Divider Line & Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-cyan-400 to-indigo-500 z-20 shadow-md"
        style={{ left: `${sliderPosition}%` }}
      >
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={() => setIsDragging(true)}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-600 dark:border-cyan-400 shadow-xl shadow-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-cyan-300 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
        >
          <MoveHorizontal className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
