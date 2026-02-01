'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAnimationStore } from '@/hooks/useAnimationStore';
import {
  createCrownGeometry,
  createRootGeometry,
  createPulpChamberGeometry,
  createRootCanalGeometry,
} from '@/lib/tooth-geometry';

export default function ProceduralTooth() {
  const groupRef = useRef<THREE.Group>(null);
  const idleRotation = useRef(0);
  const lastScrollRotation = useRef(0);
  const wasOnHomepage = useRef(true);

  // Create geometries once
  const crownGeo = useMemo(() => createCrownGeometry(), []);
  const root1Geo = useMemo(() => createRootGeometry(1.0, 0.16, 0.025, 0.06), []);
  const root2Geo = useMemo(() => createRootGeometry(0.9, 0.14, 0.02, -0.05), []);
  const pulpGeo = useMemo(() => createPulpChamberGeometry(), []);
  const canal1Geo = useMemo(() => createRootCanalGeometry(0.1, -0.9, 0.06, 0.04), []);
  const canal2Geo = useMemo(() => createRootCanalGeometry(0.1, -0.8, -0.06, -0.03), []);

  // Realistic enamel material - pearly white with subtle translucency
  const enamelMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#FFFEF8'),
        roughness: 0.15,
        metalness: 0.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        reflectivity: 0.5,
        sheen: 0.5,
        sheenRoughness: 0.3,
        sheenColor: new THREE.Color('#FFF5E6'),
        transmission: 0.1,
        thickness: 0.5,
        ior: 1.6,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
        envMapIntensity: 1.0,
        emissive: new THREE.Color('#8B5CF6'),
        emissiveIntensity: 0,
      }),
    []
  );

  // Root/dentin material - slightly more yellow, matte
  const dentinMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#F5E6D3'),
        roughness: 0.5,
        metalness: 0,
        clearcoat: 0.2,
        clearcoatRoughness: 0.4,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
        emissive: new THREE.Color('#00C8C8'),
        emissiveIntensity: 0,
      }),
    []
  );

  // Pulp material - white, will highlight pink in phase 2
  const pulpMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#FFEEEE'),
        roughness: 0.3,
        metalness: 0,
        transparent: false,
        opacity: 1,
        emissive: new THREE.Color('#FF3254'),
        emissiveIntensity: 0.2,
      }),
    []
  );

  // Root canal material - white, will highlight pink in phase 2
  const canalMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#FFEEEE'),
        roughness: 0.3,
        metalness: 0,
        transparent: false,
        opacity: 1,
        emissive: new THREE.Color('#FF3254'),
        emissiveIntensity: 0.2,
      }),
    []
  );

  // Base colors
  const enamelWhite = new THREE.Color('#FFFEF8');
  const dentinColor = new THREE.Color('#F5E6D3');

  // Highlight colors for each phase
  const enamelHighlight = new THREE.Color('#8B5CF6'); // Purple for crown
  const dentinHighlight = new THREE.Color('#00C8C8'); // Cyan for roots
  const pulpHighlight = new THREE.Color('#FF3254'); // Pink for pulp

  useFrame((_, delta) => {
    const state = useAnimationStore.getState();

    // Idle rotation on homepage (when heroOpacity is high = not scrolling yet)
    const isOnHomepage = state.heroOpacity > 0.5;

    // Handle transition between homepage and scroll animation
    if (isOnHomepage && !wasOnHomepage.current) {
      // Just returned to homepage - sync idle rotation with last scroll rotation
      idleRotation.current = lastScrollRotation.current;
    }

    if (isOnHomepage) {
      idleRotation.current += delta * 0.2; // Slower rotation speed
    } else {
      // Store the scroll rotation for when we return
      lastScrollRotation.current = state.toothRotationY;
    }

    wasOnHomepage.current = isOnHomepage;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(state.toothScale);
      // Add idle rotation when on homepage, otherwise use scroll-based rotation
      const targetRotation = isOnHomepage ? idleRotation.current : state.toothRotationY;
      groupRef.current.rotation.set(0, targetRotation, 0);
      groupRef.current.position.x = state.toothPositionX;
      groupRef.current.position.y = state.toothPositionY;
    }

    // Get feature opacities to drive color phases
    const phase1 = state.feature1Opacity; // Crown highlight (purple)
    const phase2 = state.feature2Opacity; // Pulp highlight (pink)
    const phase3 = state.feature3Opacity; // Roots highlight (cyan)

    // Translucency transition
    const t = state.toothTranslucency;

    // Enamel: white -> purple during phase 1
    const enamelColor = enamelWhite.clone().lerp(enamelHighlight, phase1 * 0.6);
    enamelMat.color.copy(enamelColor);
    enamelMat.opacity = state.toothOpacity;
    enamelMat.transmission = 0.1 + t * 0.5;
    enamelMat.thickness = 0.5 + t * 1.0;
    enamelMat.clearcoat = 1.0 - t * 0.3;
    enamelMat.emissive = enamelHighlight;
    enamelMat.emissiveIntensity = phase1 * 0.15;

    // Dentin/Roots: natural -> cyan during phase 3
    const rootColor = dentinColor.clone().lerp(dentinHighlight, phase3 * 0.8);
    dentinMat.color.copy(rootColor);
    dentinMat.opacity = state.toothOpacity;
    dentinMat.transmission = t * 0.4;
    dentinMat.emissive = dentinHighlight;
    dentinMat.emissiveIntensity = phase3 * 0.5;

    // Internal structures: always visible, highlight bright pink during phase 2
    pulpMat.emissiveIntensity = 0.2 + phase2 * 1.5;
    canalMat.emissiveIntensity = 0.2 + phase2 * 1.2;
  });

  return (
    <group ref={groupRef}>
      {/* Crown (enamel) */}
      <mesh geometry={crownGeo} material={enamelMat} />

      {/* Roots (dentin) */}
      <mesh geometry={root1Geo} material={dentinMat} position={[0.08, 0, 0.02]} />
      <mesh geometry={root2Geo} material={dentinMat} position={[-0.08, 0, -0.02]} />

      {/* Internal structures */}
      <mesh geometry={pulpGeo} material={pulpMat} />
      <mesh geometry={canal1Geo} material={canalMat} position={[0.02, 0, 0]} />
      <mesh geometry={canal2Geo} material={canalMat} position={[-0.02, 0, 0]} />
    </group>
  );
}
