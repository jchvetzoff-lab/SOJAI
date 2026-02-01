// SOJAI Color Palette
export const COLORS = {
  primaryPurple: '#4A39C0',
  darkPurple: '#1A0A3E',
  darkestBg: '#0D0820',
  pinkAccent: '#FF3254',
  toothWhite: '#F5F0E8',
  pulpPink: '#FF6B8A',
  translucentBlue: '#6B5CE7',
  translucentViolet: '#8B5CF6',
  white: '#FFFFFF',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray400: '#9CA3AF',
  gray600: '#4B5563',
  gray800: '#1F2937',
} as const;

// 3D Animation phases mapped to scroll progress (0-1)
export const SCROLL_PHASES = {
  hero: { start: 0, end: 0.1 },
  zoom: { start: 0.1, end: 0.3 },
  transparency: { start: 0.3, end: 0.55 },
  overlays: { start: 0.55, end: 0.75 },
  fadeOut: { start: 0.75, end: 1.0 },
} as const;

// Diagnostic badges that appear during overlay phase
export const DIAGNOSTIC_BADGES = [
  { label: 'CBCT Analysis', color: '#4A39C0', position: [-1.5, 1.2, 0.5] as [number, number, number] },
  { label: 'Restorative', color: '#FF3254', position: [1.5, 0.8, 0.5] as [number, number, number] },
  { label: 'Periodontal', color: '#6B5CE7', position: [-1.3, -0.5, 0.5] as [number, number, number] },
  { label: 'Endodontic', color: '#FF6B8A', position: [1.4, -0.3, 0.5] as [number, number, number] },
  { label: 'Implantology', color: '#8B5CF6', position: [-0.8, -1.5, 0.5] as [number, number, number] },
  { label: 'Orthodontic', color: '#4A39C0', position: [1.0, -1.4, 0.5] as [number, number, number] },
] as const;

// Navigation links
export const NAV_LINKS = [
  { label: 'Solution', href: '#solution' },
  { label: 'Features', href: '#features' },
  { label: 'AI Detection', href: '#detection' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Resources', href: '#resources' },
] as const;

// Partner logos (placeholder data)
export const PARTNERS = [
  'Dentsply Sirona',
  'Planmeca',
  'Carestream',
  'Vatech',
  'KaVo Kerr',
  'Morita',
  'Acteon',
  'Durr Dental',
] as const;

// Features grid items
export const FEATURES = [
  {
    title: 'AI-Powered Diagnostics',
    description: 'Advanced neural networks analyze dental imagery with 99.8% accuracy across 130+ pathologies.',
    icon: 'brain',
  },
  {
    title: 'Instant CBCT Analysis',
    description: 'Full 3D volume analysis in under 60 seconds with detailed pathology mapping.',
    icon: 'scan',
  },
  {
    title: 'Smart Segmentation',
    description: 'Automatic tooth numbering and 3D segmentation of individual structures.',
    icon: 'layers',
  },
  {
    title: 'Treatment Planning',
    description: 'AI-assisted treatment plans with confidence scores and alternative options.',
    icon: 'clipboard',
  },
  {
    title: 'PDF Reports',
    description: 'Generate professional patient reports in one click with visual annotations.',
    icon: 'file',
  },
  {
    title: 'Cloud Platform',
    description: 'Secure cloud-based platform accessible from any device, anywhere.',
    icon: 'cloud',
  },
] as const;

// Testimonials
export const TESTIMONIALS = [
  {
    quote: "SOJAI has transformed our diagnostic workflow. We catch pathologies earlier and with more confidence than ever before.",
    author: 'Dr. Marie Laurent',
    role: 'Oral Surgeon, Paris',
    avatar: '/avatars/1.jpg',
  },
  {
    quote: "The AI analysis saves us hours every week. The accuracy is remarkable and our patients love the detailed reports.",
    author: 'Dr. Thomas Weber',
    role: 'Endodontist, Berlin',
    avatar: '/avatars/2.jpg',
  },
  {
    quote: "Integration with our existing CBCT equipment was seamless. SOJAI is now an indispensable part of our practice.",
    author: 'Dr. Sofia Rossi',
    role: 'Dental Clinic Director, Milan',
    avatar: '/avatars/3.jpg',
  },
] as const;
