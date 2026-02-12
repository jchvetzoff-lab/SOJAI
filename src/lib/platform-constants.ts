// Platform sidebar navigation
export const PLATFORM_NAV = [
  { label: 'Dashboard', href: '/platform', icon: 'dashboard' },
  { label: '2D Viewer', href: '/platform/viewer', icon: 'viewer' },
  { label: 'AI Detection', href: '/platform/detection', icon: 'detection' },
  { label: 'Reports', href: '/platform/report', icon: 'report' },
  { label: '3D Viewer', href: '/platform/3d', icon: '3d' },
  { label: 'Superimposition', href: '/platform/superimposition', icon: 'superimposition' },
  { label: 'Implant Planning', href: '/platform/implant', icon: 'implant' },
  { label: 'Orthodontic', href: '/platform/orthodontic', icon: 'orthodontic' },
  { label: 'Periodontal', href: '/platform/periodontal', icon: 'periodontal' },
  { label: 'Analytics', href: '/platform/analytics', icon: 'analytics' },
] as const;

// Pathology categories with colors
export const PATHOLOGY_CATEGORIES = {
  endodontic: { label: 'Endodontic', color: '#FF3254', bg: '#FFF0F2' },
  restorative: { label: 'Restorative', color: '#4A39C0', bg: '#E4E1FF' },
  periodontal: { label: 'Periodontal', color: '#F59E0B', bg: '#FEF3C7' },
  anatomical: { label: 'Anatomical', color: '#10B981', bg: '#D1FAE5' },
  prosthetic: { label: 'Prosthetic', color: '#6366F1', bg: '#E0E7FF' },
  surgical: { label: 'Surgical', color: '#EC4899', bg: '#FCE7F3' },
} as const;

export type PathologyCategory = keyof typeof PATHOLOGY_CATEGORIES;

// Tooth status for dental chart
export const TOOTH_STATUS = {
  healthy: { label: 'Healthy', color: '#10B981' },
  caries: { label: 'Caries', color: '#FF3254' },
  filling: { label: 'Filling', color: '#4A39C0' },
  crown: { label: 'Crown', color: '#F59E0B' },
  missing: { label: 'Missing', color: '#9CA3AF' },
  implant: { label: 'Implant', color: '#6366F1' },
  rootCanal: { label: 'Root Canal', color: '#EC4899' },
  bridge: { label: 'Bridge', color: '#8B5CF6' },
} as const;

export type ToothStatus = keyof typeof TOOTH_STATUS;

// Severity levels
export const SEVERITY_LEVELS = {
  critical: { label: 'Critical', color: '#EF4444', bg: '#FEE2E2' },
  high: { label: 'High', color: '#F97316', bg: '#FFEDD5' },
  medium: { label: 'Medium', color: '#F59E0B', bg: '#FEF3C7' },
  low: { label: 'Low', color: '#10B981', bg: '#D1FAE5' },
} as const;

export type SeverityLevel = keyof typeof SEVERITY_LEVELS;

// Platform colors (extending marketing palette)
export const PLATFORM_COLORS = {
  sidebar: '#1A1A2E',
  sidebarHover: '#252540',
  sidebarActive: '#4A39C0',
  contentBg: '#F9FAFB',
  headerBg: '#FFFFFF',
  cardBg: '#FFFFFF',
  border: '#E5E7EB',
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  accent: '#4A39C0',
  accentLight: '#E4E1FF',
  danger: '#FF3254',
  success: '#10B981',
  warning: '#F59E0B',
} as const;
