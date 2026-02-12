'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlatformStore, type PathologyResult } from '@/hooks/usePlatformStore';

interface CanvasViewerProps {
  showMarkers?: boolean;
  onMarkerClick?: (pathology: PathologyResult) => void;
}

export default function CanvasViewer({ showMarkers = true, onMarkerClick }: CanvasViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const [hoveredPathology, setHoveredPathology] = useState<string | null>(null);

  const { uploadedImage, analysisResult, viewerSettings, setViewerSettings } = usePlatformStore();

  // Load image
  useEffect(() => {
    if (!uploadedImage?.base64) return;
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      drawCanvas();
    };
    img.src = uploadedImage.base64;
  }, [uploadedImage?.base64]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const img = imageRef.current;
    if (!canvas || !container || !img) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Apply zoom and pan
    const { zoom, panX, panY } = viewerSettings;
    ctx.translate(canvas.width / 2 + panX, canvas.height / 2 + panY);
    ctx.scale(zoom, zoom);

    // Fit image
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.95;
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, -w / 2, -h / 2, w, h);

    ctx.restore();
  }, [viewerSettings]);

  // Redraw on settings change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas, viewerSettings]);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => drawCanvas());
    observer.observe(container);
    return () => observer.disconnect();
  }, [drawCanvas]);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(8, Math.max(0.2, viewerSettings.zoom * delta));
    setViewerSettings({ zoom: newZoom });
  }, [viewerSettings.zoom, setViewerSettings]);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isPanning.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setViewerSettings({
      panX: viewerSettings.panX + dx,
      panY: viewerSettings.panY + dy,
    });
  }, [viewerSettings.panX, viewerSettings.panY, setViewerSettings]);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  // CSS filters for brightness/contrast/invert
  const filterStyle = {
    filter: `brightness(${viewerSettings.brightness}%) contrast(${viewerSettings.contrast}%)${viewerSettings.invert ? ' invert(1)' : ''}`,
  };

  const pathologies = analysisResult?.pathologies || [];

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#0a0a1a] rounded-2xl overflow-hidden">
      <canvas
        ref={canvasRef}
        style={filterStyle}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Pathology markers overlay */}
      {showMarkers && pathologies.map((p) => {
        if (!p.boundingBox) return null;
        const { x, y, width, height } = p.boundingBox;
        const catColor = p.category === 'endodontic' ? '#FF3254'
          : p.category === 'restorative' ? '#4A39C0'
          : p.category === 'periodontal' ? '#F59E0B'
          : '#10B981';
        const isHovered = hoveredPathology === p.id;

        return (
          <motion.div
            key={p.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute cursor-pointer"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${width}%`,
              height: `${height}%`,
            }}
            onMouseEnter={() => setHoveredPathology(p.id)}
            onMouseLeave={() => setHoveredPathology(null)}
            onClick={() => onMarkerClick?.(p)}
          >
            {/* Bounding box */}
            <div
              className="absolute inset-0 rounded border-2 transition-opacity"
              style={{ borderColor: catColor, opacity: isHovered ? 1 : 0.6 }}
            />
            {/* Dot */}
            <div
              className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full border border-white shadow-lg"
              style={{ backgroundColor: catColor }}
            />
            {/* Pulse */}
            {isHovered && (
              <div
                className="absolute -top-3 -left-3 w-6 h-6 rounded-full animate-ping opacity-30"
                style={{ backgroundColor: catColor }}
              />
            )}
            {/* Tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-1/2 -translate-x-1/2 -top-10 bg-white rounded-lg shadow-xl px-3 py-1.5 whitespace-nowrap z-20"
                >
                  <span className="text-xs font-medium text-[#1A1A2E]">{p.name}</span>
                  <span className="text-[10px] text-gray-400 ml-1">{p.confidence}%</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* No image placeholder */}
      {!uploadedImage && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <p className="text-sm">No image loaded</p>
        </div>
      )}
    </div>
  );
}
