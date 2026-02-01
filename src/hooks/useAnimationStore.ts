import { create } from 'zustand';

interface AnimationState {
  // Scroll progress 0-1
  scrollProgress: number;
  // 3D scene visibility
  sceneOpacity: number;
  // Tooth transform
  toothScale: number;
  toothRotationY: number;
  toothPositionX: number;
  toothPositionY: number;
  // Camera
  cameraZ: number;
  // Material
  toothOpacity: number;
  toothTranslucency: number;
  internalVisible: boolean;
  // Color phase (0 = white, 1 = purple, 2 = cyan, 3 = pink)
  colorPhase: number;
  colorTransition: number;
  // Feature cards - now with smooth opacity per feature
  feature1Opacity: number;
  feature2Opacity: number;
  feature3Opacity: number;
  // Hero text
  heroOpacity: number;
  // Setters
  setScrollProgress: (progress: number) => void;
  updateFromScroll: (progress: number) => void;
}

// Smooth interpolation helper
function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

// Clamp value between 0 and 1
function clamp01(t: number): number {
  return Math.max(0, Math.min(1, t));
}

// Smooth step for fade transitions
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export const useAnimationStore = create<AnimationState>((set) => ({
  scrollProgress: 0,
  sceneOpacity: 1,
  toothScale: 0.6,
  toothRotationY: 0,
  toothPositionX: 0,
  toothPositionY: -1.5,
  cameraZ: 5,
  toothOpacity: 1,
  toothTranslucency: 0,
  internalVisible: false,
  feature1Opacity: 0,
  feature2Opacity: 0,
  feature3Opacity: 0,
  heroOpacity: 1,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  updateFromScroll: (progress) => {
    const p = clamp01(progress);

    // === HERO FADE (instant: 0-0.5%) ===
    const heroOpacity = 1 - smoothstep(0, 0.005, p);

    // === FEATURE OPACITIES (fade in/out smoothly) ===
    // Feature 1: fade in 0.005-0.03, visible 0.03-0.28, fade out 0.28-0.33
    const feature1Opacity =
      smoothstep(0.005, 0.03, p) * (1 - smoothstep(0.28, 0.33, p));

    // Feature 2: fade in 0.31-0.38, visible 0.38-0.55, fade out 0.55-0.60
    const feature2Opacity =
      smoothstep(0.31, 0.38, p) * (1 - smoothstep(0.55, 0.60, p));

    // Feature 3: fade in 0.58-0.65, visible 0.65-0.82, fade out 0.82-0.88
    const feature3Opacity =
      smoothstep(0.58, 0.65, p) * (1 - smoothstep(0.82, 0.88, p));

    // === TOOTH TRANSFORMS (continuous interpolation) ===

    // Scale: starts at 0.6, grows to 0.85 during feature phases
    const toothScale = lerp(0.6, 0.85, smoothstep(0.02, 0.15, p))
      - lerp(0, 0.15, smoothstep(0.85, 1, p)); // shrink at end

    // Position Y: starts low (-1.5), moves up to -0.5
    const toothPositionY = lerp(-1.5, -0.5, smoothstep(0.02, 0.12, p));

    // Position X: smooth wave motion (center -> left -> right -> left -> center)
    let toothPositionX = 0;
    if (p < 0.30) {
      // Move to left
      toothPositionX = lerp(0, -1.5, smoothstep(0.05, 0.15, p));
    } else if (p < 0.55) {
      // Move from left to right
      toothPositionX = lerp(-1.5, 1.5, smoothstep(0.30, 0.50, p));
    } else if (p < 0.85) {
      // Move from right to left
      toothPositionX = lerp(1.5, -1.5, smoothstep(0.55, 0.75, p));
    } else {
      // Return to center
      toothPositionX = lerp(-1.5, 0, smoothstep(0.85, 0.95, p));
    }

    // Rotation: continuous smooth rotation throughout
    const toothRotationY = p * 1.8;

    // Camera Z: gets closer during features, pulls back at end
    const cameraZ = 5
      - lerp(0, 0.5, smoothstep(0.05, 0.20, p))
      + lerp(0, 2, smoothstep(0.85, 1, p));

    // === MATERIALS ===

    // Opacity: gradually becomes more translucent
    const toothOpacity = 1 - lerp(0, 0.3, smoothstep(0.10, 0.30, p))
      - lerp(0, 0.7, smoothstep(0.85, 1, p)); // fade out at end

    // Translucency: increases through the animation
    const toothTranslucency = lerp(0, 0.8, smoothstep(0.10, 0.60, p))
      - lerp(0, 0.8, smoothstep(0.85, 1, p)); // reset at end

    // Internal structures visibility
    const internalVisible = p > 0.25 && p < 0.88;

    // Scene opacity (fade out at very end)
    const sceneOpacity = 1 - smoothstep(0.90, 1, p);

    set({
      scrollProgress: p,
      sceneOpacity,
      toothScale,
      toothRotationY,
      toothPositionX,
      toothPositionY,
      cameraZ,
      toothOpacity,
      toothTranslucency,
      internalVisible,
      feature1Opacity,
      feature2Opacity,
      feature3Opacity,
      heroOpacity,
    });
  },
}));
