import * as THREE from 'three';
import { COLORS } from './constants';

/**
 * Create the crown material with controllable opacity and translucency
 */
export function createCrownMaterial(opacity: number = 1, translucency: number = 0): THREE.MeshPhysicalMaterial {
  const baseColor = new THREE.Color(COLORS.toothWhite);
  const translucentColor = new THREE.Color(COLORS.translucentViolet);
  const color = baseColor.clone().lerp(translucentColor, translucency);

  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.3 - translucency * 0.15,
    metalness: translucency * 0.1,
    transmission: translucency * 0.6,
    thickness: 1.5,
    ior: 1.5,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
    clearcoat: 0.3 + translucency * 0.4,
    clearcoatRoughness: 0.2,
  });
}

/**
 * Create the root material
 */
export function createRootMaterial(opacity: number = 1, translucency: number = 0): THREE.MeshPhysicalMaterial {
  const baseColor = new THREE.Color('#E8DDD0');
  const translucentColor = new THREE.Color(COLORS.translucentBlue);
  const color = baseColor.clone().lerp(translucentColor, translucency);

  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.5 - translucency * 0.2,
    metalness: 0,
    transmission: translucency * 0.5,
    thickness: 1,
    ior: 1.4,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
  });
}

/**
 * Create pulp chamber material (internal pinkish structure)
 */
export function createPulpMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(COLORS.pulpPink),
    roughness: 0.6,
    metalness: 0,
    transparent: true,
    opacity: 0.9,
    emissive: new THREE.Color(COLORS.pulpPink),
    emissiveIntensity: 0.3,
  });
}

/**
 * Create root canal material
 */
export function createCanalMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(COLORS.pinkAccent),
    roughness: 0.4,
    metalness: 0.1,
    transparent: true,
    opacity: 0.8,
    emissive: new THREE.Color(COLORS.pinkAccent),
    emissiveIntensity: 0.2,
  });
}
