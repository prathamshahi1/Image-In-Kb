import React, { useState, useRef, useEffect } from 'react';
import { Crop as CropIcon, Maximize2 } from 'lucide-react';

export default function CropCanvas({
  imageUrl,
  rotation = 0,
  flipH = false,
  flipV = false,
  aspectRatio = 'free', // 'free' | '1:1' | '4:3' | '16:9'
  onCropChange
}) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  
  // Crop rectangle in percentages (0 to 100)
  const [crop, setCrop] = useState({ x: 10, y: 10, width: 80, height: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState(null); // 'move' | 'nw' | 'ne' | 'se' | 'sw'
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, cropX: 0, cropY: 0, cropW: 0, cropH: 0 });

  // Update crop aspect ratio when preset changes
  useEffect(() => {
    if (aspectRatio === 'free') return;

    let targetRatio = 1;
    if (aspectRatio === '1:1') targetRatio = 1;
    else if (aspectRatio === '4:3') targetRatio = 4 / 3;
    else if (aspectRatio === '16:9') targetRatio = 16 / 9;

    setCrop((prev) => {
      let newHeight = prev.width / targetRatio;
      if (prev.y + newHeight > 100) {
        newHeight = 100 - prev.y;
        const newWidth = newHeight * targetRatio;
        return { ...prev, width: Math.min(100 - prev.x, newWidth), height: newHeight };
      }
      return { ...prev, height: newHeight };
    });
  }, [aspectRatio]);

  // Notify parent of actual pixel coordinates
  useEffect(() => {
    if (!imageRef.current) return;
    const naturalWidth = imageRef.current.naturalWidth || 1000;
    const naturalHeight = imageRef.current.naturalHeight || 1000;

    const pixelCrop = {
      x: Math.round((crop.x / 100) * naturalWidth),
      y: Math.round((crop.y / 100) * naturalHeight),
      width: Math.round((crop.width / 100) * naturalWidth),
      height: Math.round((crop.height / 100) * naturalHeight)
    };

    onCropChange(pixelCrop);
  }, [crop, onCropChange]);

  const handleMouseDown = (e, mode) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragMode(mode);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      cropX: crop.x,
      cropY: crop.y,
      cropW: crop.width,
      cropH: crop.height
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

    setCrop((prev) => {
      let newX = prev.x;
      let newY = prev.y;
      let newW = prev.width;
      let newH = prev.height;

      if (dragMode === 'move') {
        newX = Math.max(0, Math.min(100 - dragStart.cropW, dragStart.cropX + deltaX));
        newY = Math.max(0, Math.min(100 - dragStart.cropH, dragStart.cropY + deltaY));
        return { ...prev, x: newX, y: newY };
      }

      if (dragMode === 'se') {
        newW = Math.max(10, Math.min(100 - dragStart.cropX, dragStart.cropW + deltaX));
        newH = Math.max(10, Math.min(100 - dragStart.cropY, dragStart.cropH + deltaY));
      } else if (dragMode === 'nw') {
        const potentialX = Math.max(0, Math.min(dragStart.cropX + dragStart.cropW - 10, dragStart.cropX + deltaX));
        const potentialY = Math.max(0, Math.min(dragStart.cropY + dragStart.cropH - 10, dragStart.cropY + deltaY));
        newW = dragStart.cropW + (dragStart.cropX - potentialX);
        newH = dragStart.cropH + (dragStart.cropY - potentialY);
        newX = potentialX;
        newY = potentialY;
      }

      return { x: newX, y: newY, width: newW, height: newH };
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragMode(null);
  };

  const transformStyle = {
    transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
    transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full h-[380px] sm:h-[440px] flex items-center justify-center overflow-hidden rounded-2xl bg-slate-950/90 border border-slate-800 select-none p-4"
    >
      {/* Background Checkerboard */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(45deg, #475569 25%, transparent 25%), linear-gradient(-45deg, #475569 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #475569 75%), linear-gradient(-45deg, transparent 75%, #475569 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}
      ></div>

      {/* Target Image with Rotation & Flip Transforms */}
      <div className="relative max-w-full max-h-full flex items-center justify-center">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Editable preview"
          style={transformStyle}
          className="max-h-[360px] w-auto object-contain rounded-lg pointer-events-none"
        />

        {/* Visual Crop Overlay Rectangle */}
        <div
          style={{
            left: `${crop.x}%`,
            top: `${crop.y}%`,
            width: `${crop.width}%`,
            height: `${crop.height}%`
          }}
          className="absolute border-2 border-cyan-400 bg-cyan-500/10 shadow-2xl shadow-cyan-500/20 cursor-move"
          onMouseDown={(e) => handleMouseDown(e, 'move')}
        >
          {/* Rule of thirds grid lines */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-30">
            <div className="border-r border-b border-white"></div>
            <div className="border-r border-b border-white"></div>
            <div className="border-b border-white"></div>
            <div className="border-r border-b border-white"></div>
            <div className="border-r border-b border-white"></div>
            <div className="border-b border-white"></div>
            <div className="border-r border-white"></div>
            <div className="border-r border-white"></div>
            <div></div>
          </div>

          {/* Corner Resize Handles */}
          <div
            onMouseDown={(e) => handleMouseDown(e, 'nw')}
            className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border border-cyan-500 rounded-sm cursor-nw-resize"
          ></div>
          <div
            onMouseDown={(e) => handleMouseDown(e, 'se')}
            className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border border-cyan-500 rounded-sm cursor-se-resize"
          ></div>

          {/* Center Badge */}
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-[10px] font-mono text-cyan-300 pointer-events-none">
            {aspectRatio.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
}
