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
    currentPatient, setUploadedImage, setAnalysisResult, setAnalysisLoading,
    setAnalysisError, setIsDemo, addToHistory, analysisLoading, analysisError,
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
        setUploadedImage({ base64, filename: file.name, type: imageType, width: img.width, height: img.height });
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
        id: `AH-${Date.now()}`, patientName: currentPatient.name, imageType,
        pathologyCount: result.pathologies.length, analyzedAt: result.analyzedAt, summary: result.summary,
      });
      setAnalysisLoading(false);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : 'Analysis failed');
    }
  };

  return (
    <div className="space-y-3">
      {/* Image type selector */}
      <div>
        <label className="text-[12px] font-medium text-[#8B8B8E] block mb-1.5">Image Type</label>
        <div className="flex flex-wrap gap-1.5">
          {IMAGE_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setImageType(t.value)}
              className={`px-2.5 py-1 rounded-md text-[12px] font-medium transition-colors ${
                imageType === t.value
                  ? 'bg-[#5B5BD6] text-white'
                  : 'bg-white/[0.04] text-[#8B8B8E] hover:bg-white/[0.08]'
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
        className={`relative border border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-[#5B5BD6] bg-[#5B5BD6]/10'
            : preview
            ? 'border-[#30A46C]/30 bg-[#30A46C]/5'
            : 'border-white/[0.08] hover:border-white/[0.15] bg-white/[0.02]'
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => { const file = e.target.files?.[0]; if (file) processFile(file); }}
        />
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              <img src={preview} alt="Preview" className="max-h-36 mx-auto rounded-md object-contain" />
              <p className="text-[12px] text-[#8B8B8E] truncate">{fileName}</p>
              <p className="text-[11px] text-[#30A46C] font-medium">Ready for analysis</p>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1.5">
              <svg className="w-10 h-10 mx-auto text-[#333338]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-[13px] text-[#8B8B8E] font-medium">Drop your dental X-ray here or click to browse</p>
              <p className="text-[11px] text-[#5C5C5F]">PNG, JPEG, WebP — Max 20MB</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {analysisError && (
        <div className="bg-[#E5484D]/10 border border-[#E5484D]/20 rounded-md p-2.5 text-[12px] text-[#E5484D]">
          {analysisError}
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={!preview || analysisLoading}
        className={`w-full py-2.5 rounded-md text-[13px] font-semibold transition-all ${
          !preview || analysisLoading
            ? 'bg-white/[0.04] text-[#5C5C5F] cursor-not-allowed'
            : 'bg-[#5B5BD6] text-white hover:bg-[#6E6ADE]'
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
        ) : 'Analyze with AI'}
      </button>
    </div>
  );
}
