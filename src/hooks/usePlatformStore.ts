import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PathologyCategory, SeverityLevel, ToothStatus } from '@/lib/platform-constants';

// ---- Types ----

export interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
}

export interface UploadedImage {
  base64: string; // data URL
  filename: string;
  type: string; // panoramic, periapical, cbct, bitewing, cephalometric
  width: number;
  height: number;
}

export interface PathologyResult {
  id: string;
  name: string;
  category: PathologyCategory;
  severity: SeverityLevel;
  confidence: number;
  affectedTeeth: number[];
  description: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
}

export interface ToothChartData {
  number: number;
  status: ToothStatus;
  findings: string[];
  hasPathology: boolean;
}

export interface PerioToothData {
  pocketDepths: number[]; // 6 values: MB, B, DB, ML, L, DL
  boneLoss: number;
}

export interface CephalometricMeasurement {
  name: string;
  value: number;
  unit: string;
  normalRange: string;
  status: 'normal' | 'elevated' | 'reduced';
}

export interface AnalysisResult {
  summary: string;
  pathologies: PathologyResult[];
  dentalChart: Record<number, ToothChartData>;
  periodontalData: Record<number, PerioToothData>;
  recommendations: string[];
  measurements: {
    cephalometric: CephalometricMeasurement[];
  };
  analyzedAt: string; // ISO timestamp
  imageType: string;
  analysisTimeMs: number;
}

export interface AnalysisHistoryEntry {
  id: string;
  patientName: string;
  imageType: string;
  pathologyCount: number;
  analyzedAt: string;
  summary: string;
}

export interface ViewerSettings {
  zoom: number;
  panX: number;
  panY: number;
  brightness: number;
  contrast: number;
  invert: boolean;
}

// ---- Store ----

interface PlatformState {
  // Patient
  currentPatient: PatientInfo;
  setCurrentPatient: (patient: Partial<PatientInfo>) => void;

  // Image (not persisted)
  uploadedImage: UploadedImage | null;
  setUploadedImage: (image: UploadedImage | null) => void;

  // Analysis
  analysisResult: AnalysisResult | null;
  analysisLoading: boolean;
  analysisError: string | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setAnalysisLoading: (loading: boolean) => void;
  setAnalysisError: (error: string | null) => void;

  // History (persisted)
  analysisHistory: AnalysisHistoryEntry[];
  addToHistory: (entry: AnalysisHistoryEntry) => void;
  clearHistory: () => void;

  // Demo mode
  isDemo: boolean;
  setIsDemo: (demo: boolean) => void;

  // Viewer settings
  viewerSettings: ViewerSettings;
  setViewerSettings: (settings: Partial<ViewerSettings>) => void;
  resetViewerSettings: () => void;

  // Reset all
  resetPlatform: () => void;
}

const defaultViewerSettings: ViewerSettings = {
  zoom: 1,
  panX: 0,
  panY: 0,
  brightness: 100,
  contrast: 100,
  invert: false,
};

const defaultPatient: PatientInfo = {
  id: 'PAT-001',
  name: 'Patient',
  age: 35,
  gender: 'M',
};

export const usePlatformStore = create<PlatformState>()(
  persist(
    (set) => ({
      // Patient
      currentPatient: defaultPatient,
      setCurrentPatient: (patient) =>
        set((state) => ({ currentPatient: { ...state.currentPatient, ...patient } })),

      // Image
      uploadedImage: null,
      setUploadedImage: (image) => set({ uploadedImage: image }),

      // Analysis
      analysisResult: null,
      analysisLoading: false,
      analysisError: null,
      setAnalysisResult: (result) => set({ analysisResult: result, analysisError: null }),
      setAnalysisLoading: (loading) => set({ analysisLoading: loading }),
      setAnalysisError: (error) => set({ analysisError: error, analysisLoading: false }),

      // History
      analysisHistory: [],
      addToHistory: (entry) =>
        set((state) => ({
          analysisHistory: [entry, ...state.analysisHistory].slice(0, 50),
        })),
      clearHistory: () => set({ analysisHistory: [] }),

      // Demo
      isDemo: true,
      setIsDemo: (demo) => set({ isDemo: demo }),

      // Viewer
      viewerSettings: defaultViewerSettings,
      setViewerSettings: (settings) =>
        set((state) => ({
          viewerSettings: { ...state.viewerSettings, ...settings },
        })),
      resetViewerSettings: () => set({ viewerSettings: defaultViewerSettings }),

      // Reset
      resetPlatform: () =>
        set({
          uploadedImage: null,
          analysisResult: null,
          analysisLoading: false,
          analysisError: null,
          isDemo: true,
          viewerSettings: defaultViewerSettings,
        }),
    }),
    {
      name: 'sojai-platform',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentPatient: state.currentPatient,
        analysisHistory: state.analysisHistory,
        isDemo: state.isDemo,
      }),
    }
  )
);
