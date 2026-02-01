'use client';

import { useAnimationStore } from '@/hooks/useAnimationStore';

const features = [
  {
    id: 1,
    title: 'CBCT AI Report',
    description: 'Comprehensive 3D analysis of dental structures with automated pathology detection.',
    position: 'right',
    details: [
      'Full root canal mapping',
      'Bone density analysis',
      'Pathology identification',
      'PDF export ready',
    ],
  },
  {
    id: 2,
    title: 'Caries Detection',
    description: 'AI-powered identification of caries at the earliest stages for preventive care.',
    position: 'left',
    details: [
      '98.7% detection accuracy',
      'Early stage identification',
      'Treatment recommendations',
      'Progress monitoring',
    ],
  },
  {
    id: 3,
    title: 'AI Segmentation',
    description: 'Automatic segmentation of teeth, nerves and bone structures.',
    position: 'right',
    details: [
      'Individual tooth isolation',
      'Nerve canal tracing',
      '3D model generation',
      'STL export for printing',
    ],
  },
];

function FeatureCard({
  feature,
  opacity,
}: {
  feature: (typeof features)[0];
  opacity: number;
}) {
  const isRight = feature.position === 'right';

  if (opacity < 0.01) return null;

  return (
    <div
      className={`fixed top-1/2 z-40 ${
        isRight ? 'right-8 md:right-16 lg:right-20' : 'left-8 md:left-16 lg:left-20'
      }`}
      style={{
        opacity,
        transform: `translateY(-50%) translateX(${isRight ? (1 - opacity) * 30 : (opacity - 1) * 30}px)`,
        pointerEvents: opacity > 0.5 ? 'auto' : 'none',
      }}
    >
      <div
        className="bg-white rounded-3xl border-2 border-[#4A39C0]/20"
        style={{ padding: '50px 45px', width: '340px' }}
      >
        <h3 className="text-[#4A39C0] font-bold text-xl mb-4">
          {feature.title}
        </h3>

        <p className="text-[#1A1A2E]/60 text-[15px] leading-relaxed mb-8">
          {feature.description}
        </p>

        <div className="space-y-4">
          {feature.details.map((detail, i) => (
            <div
              key={i}
              className="flex items-center gap-4"
              style={{
                opacity: opacity > 0.3 ? Math.min(1, (opacity - 0.3) * 2) : 0,
                transform: `translateX(${opacity > 0.3 ? 0 : 8}px)`,
                transition: 'all 0.2s ease-out',
                transitionDelay: `${i * 50}ms`,
              }}
            >
              <div className="w-5 h-5 rounded-full bg-[#4A39C0]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-[#4A39C0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[#1A1A2E]/70 text-sm">{detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FeatureCards() {
  const feature1Opacity = useAnimationStore((s) => s.feature1Opacity);
  const feature2Opacity = useAnimationStore((s) => s.feature2Opacity);
  const feature3Opacity = useAnimationStore((s) => s.feature3Opacity);
  const sceneOpacity = useAnimationStore((s) => s.sceneOpacity);

  if (sceneOpacity < 0.1) return null;

  return (
    <>
      <FeatureCard feature={features[0]} opacity={feature1Opacity} />
      <FeatureCard feature={features[1]} opacity={feature2Opacity} />
      <FeatureCard feature={features[2]} opacity={feature3Opacity} />
    </>
  );
}
