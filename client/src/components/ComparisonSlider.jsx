import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, MoveHorizontal } from 'lucide-react';

export default function ComparisonSlider({
  originalUrl,
  processedUrl,
  originalLabel = 'Original',
  processedLabel = 'Processed'
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

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
      className="relative w-full h-[360px] sm:h-[400px] overflow-hidden rounded-2xl bg-slate-950/90 border border-slate-800 select-none cursor-ew-resize group"
    >
      {/* Background Image: Processed (Right side full base) */}
      <img
        src={processedUrl}
        alt={processedLabel}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />
      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-700/80 text-[11px] font-mono text-emerald-400 font-semibold pointer-events-none z-10">
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
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-700/80 text-[11px] font-mono text-slate-300 font-semibold pointer-events-none z-10">
          {originalLabel}
        </div>
      </div>

      {/* Sliding Divider Line & Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-400 via-cyan-400 to-brand-400 z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={() => setIsDragging(true)}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-cyan-400 shadow-xl shadow-cyan-500/30 flex items-center justify-center text-cyan-300 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
        >
          <MoveHorizontal className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
