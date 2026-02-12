'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlatformStore } from '@/hooks/usePlatformStore';
import { analyzeImage } from '@/lib/analysis-client';

const IMAGE_TYPES = [
  { value: 'panoramic', label: 'Panoramic' },
  { value: 'periapical', label: 'Periapical' },
  { value: 'cbct', label: 'CBCT' },
  { value: 'bitewing', label: 'Bitewing' },
  { value: 'cephalometric', label: 'Cephalometric' },
];

export default function ImageUploadZone() {
  const [imageType, setImageType] = useState('panoramic');
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    currentPatient,
    setUploadedImage,
    setAnalysisResult,
    setAnalysisLoading,
    setAnalysisError,
    setIsDemo,
    addToHistory,
    analysisLoading,
    analysisError,
  } = usePlatformStore();

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);

      const img = new Image();
      img.onload = () => {
        setUploadedImage({
          base64,
          filename: file.name,
          type: imageType,
          width: img.width,
          height: img.height,
        });
      };
      img.src = base64;
    };
    reader.readAsDataURL(file);
  }, [imageType, setUploadedImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleAnalyze = async () => {
    if (!preview) return;
    setAnalysisLoading(true);
    setAnalysisError(null);

    try {
      const result = await analyzeImage(preview, imageType, currentPatient.name);
      setAnalysisResult(result);
      setIsDemo(false);
      addToHistory({
        id: `AH-${Date.now()}`,
        patientName: currentPatient.name,
        imageType,
        pathologyCount: result.pathologies.length,
        analyzedAt: result.analyzedAt,
        summary: result.summary,
      });
      setAnalysisLoading(false);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : 'Analysis failed');
    }
  };

  return (
    <div className="space-y-4">
      {/* Image type selector */}
      <div>
        <label className="text-sm font-medium text-[#E2E8F0] block mb-2">Image Type</label>
        <div className="flex flex-wrap gap-2">
          {IMAGE_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setImageType(t.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                imageType === t.value
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-white/[0.06] text-[#94A3B8] hover:bg-white/[0.1]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-[#3B82F6] bg-[#3B82F6]/10'
            : preview
            ? 'border-emerald-500/30 bg-emerald-500/5'
            : 'border-white/[0.1] hover:border-white/[0.2] bg-white/[0.02]'
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processFile(file);
          }}
        />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 mx-auto rounded-lg object-contain"
              />
              <p className="text-sm text-[#94A3B8] truncate">{fileName}</p>
              <p className="text-xs text-emerald-400 font-medium">Ready for analysis</p>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              <svg className="w-12 h-12 mx-auto text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-sm text-[#94A3B8] font-medium">
                Drop your dental X-ray here or click to browse
              </p>
              <p className="text-xs text-[#475569]">PNG, JPEG, WebP — Max 20MB</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error */}
      {analysisError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
          {analysisError}
        </div>
      )}

      {/* Analyze button */}
      <button
        onClick={handleAnalyze}
        disabled={!preview || analysisLoading}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
          !preview || analysisLoading
            ? 'bg-white/[0.06] text-[#475569] cursor-not-allowed'
            : 'bg-[#3B82F6] text-white hover:bg-[#2563EB]'
        }`}
      >
        {analysisLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
            </svg>
            Analyzing...
          </span>
        ) : (
          'Analyze with AI'
        )}
      </button>
    </div>
  );
}
