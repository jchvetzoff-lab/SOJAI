'use client';

import dynamic from 'next/dynamic';
import SmoothScroll from '@/components/layout/SmoothScroll';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AnimationSpacer from '@/components/sections/AnimationSpacer';
import SolutionSection from '@/components/sections/SolutionSection';
import AudienceCards from '@/components/sections/AudienceCards';
import WorkSmarter from '@/components/sections/WorkSmarter';
import Collaboration from '@/components/sections/Collaboration';
import Partners from '@/components/sections/Partners';
import FounderVideo from '@/components/sections/FounderVideo';
import FeaturesGrid from '@/components/sections/FeaturesGrid';
import AIDetection from '@/components/sections/AIDetection';
import Experience3D from '@/components/sections/Experience3D';
import PDFReports from '@/components/sections/PDFReports';
import Integrations from '@/components/sections/Integrations';
import Testimonials from '@/components/sections/Testimonials';
import WhitePapers from '@/components/sections/WhitePapers';
import BlogNews from '@/components/sections/BlogNews';
import BookDemo from '@/components/sections/BookDemo';
import FeatureCards from '@/components/sections/FeatureCards';
import BackgroundOrbs from '@/components/ui/BackgroundOrbs';
import ChatBot from '@/components/ui/ChatBot';
import FadeInSection from '@/components/ui/FadeInSection';

// Dynamic import for Three.js canvas (SSR disabled)
const SceneCanvas = dynamic(() => import('@/components/three/SceneCanvas'), {
  ssr: false,
});

export default function Home() {
  return (
    <SmoothScroll>
      {/* Fixed 3D canvas behind everything */}
      <SceneCanvas />

      {/* Background orbs - hidden during tooth animation, visible after */}
      <BackgroundOrbs />

      {/* ChatBot - appears after tooth animation */}
      <ChatBot />

      {/* Feature cards that appear during scroll */}
      <FeatureCards />

      {/* Navbar */}
      <Navbar />

      {/* Scrollable content */}
      <main className="scroll-content">
        {/* Hero + 3D animation scroll */}
        <HeroSection />
        <AnimationSpacer />

        {/* Post-animation sections with fade-in effect */}
        <FadeInSection><SolutionSection /></FadeInSection>
        <FadeInSection><AudienceCards /></FadeInSection>
        <FadeInSection><WorkSmarter /></FadeInSection>
        <FadeInSection><Collaboration /></FadeInSection>
        <FadeInSection><Partners /></FadeInSection>
        <FadeInSection><FounderVideo /></FadeInSection>
        <FadeInSection><FeaturesGrid /></FadeInSection>
        <FadeInSection><AIDetection /></FadeInSection>
        <FadeInSection><Experience3D /></FadeInSection>
        <FadeInSection><PDFReports /></FadeInSection>
        <FadeInSection><Integrations /></FadeInSection>
        <FadeInSection><Testimonials /></FadeInSection>
        <FadeInSection><WhitePapers /></FadeInSection>
        <FadeInSection><BlogNews /></FadeInSection>
        <FadeInSection><BookDemo /></FadeInSection>
      </main>

      <FadeInSection><Footer /></FadeInSection>
    </SmoothScroll>
  );
}
