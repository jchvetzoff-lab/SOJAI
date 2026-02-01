import * as THREE from 'three';

/**
 * Create a realistic molar tooth crown geometry
 * Based on actual molar anatomy with proper proportions
 */
export function createCrownGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();

  // Molar occlusal outline (top-down view) - more rectangular than round
  const width = 0.55;
  const depth = 0.45;
  const cornerRadius = 0.12;

  // Create rounded rectangle shape
  shape.moveTo(-width + cornerRadius, -depth);
  shape.lineTo(width - cornerRadius, -depth);
  shape.quadraticCurveTo(width, -depth, width, -depth + cornerRadius);
  shape.lineTo(width, depth - cornerRadius);
  shape.quadraticCurveTo(width, depth, width - cornerRadius, depth);
  shape.lineTo(-width + cornerRadius, depth);
  shape.quadraticCurveTo(-width, depth, -width, depth - cornerRadius);
  shape.lineTo(-width, -depth + cornerRadius);
  shape.quadraticCurveTo(-width, -depth, -width + cornerRadius, -depth);

  // Extrude settings for crown height
  const extrudeSettings = {
    steps: 12,
    depth: 0.85,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.06,
    bevelOffset: 0,
    bevelSegments: 8,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  // Modify vertices to create anatomical crown shape
  const positions = geometry.attributes.position;

  for (let i = 0; i < positions.count; i++) {
    let x = positions.getX(i);
    let y = positions.getY(i);
    let z = positions.getZ(i);

    // Z is the height (0 = cervical, 0.85 = occlusal)
    const heightRatio = z / 0.85;

    // Create cervical constriction (narrower at the neck)
    if (heightRatio < 0.2) {
      const constriction = 1 - (0.2 - heightRatio) * 0.3;
      x *= constriction;
      y *= constriction;
    }

    // Create crown bulge (maximum equator at ~40% height)
    if (heightRatio > 0.2 && heightRatio < 0.6) {
      const bulgeAmount = Math.sin((heightRatio - 0.2) / 0.4 * Math.PI) * 0.08;
      const dist = Math.sqrt(x * x + y * y);
      if (dist > 0.01) {
        x += (x / dist) * bulgeAmount;
        y += (y / dist) * bulgeAmount;
      }
    }

    // Create occlusal surface with cusps
    if (heightRatio > 0.85) {
      // Add cusp variations
      const angle = Math.atan2(y, x);
      const cuspPattern = Math.sin(angle * 4) * 0.03 + Math.sin(angle * 2) * 0.02;
      z += cuspPattern;

      // Central fossa (depression in middle)
      const distFromCenter = Math.sqrt(x * x + y * y);
      if (distFromCenter < 0.25) {
        z -= (0.25 - distFromCenter) * 0.15;
      }
    }

    // Add subtle surface irregularities for realism
    const noise = Math.sin(x * 15) * Math.cos(y * 15) * 0.008;

    positions.setX(i, x);
    positions.setY(i, y);
    positions.setZ(i, z + noise);
  }

  geometry.computeVertexNormals();

  // Rotate so crown points up (Y-axis)
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, 0.4, 0);

  return geometry;
}

/**
 * Create a realistic root geometry
 * Tapered conical shape with slight curvature
 */
export function createRootGeometry(
  length: number = 1.1,
  baseRadius: number = 0.18,
  tipRadius: number = 0.03,
  curveAmount: number = 0.08
): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  const segments = 24;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;

    // Smooth taper from base to tip
    const radius = baseRadius * (1 - t) + tipRadius * t;
    // Add slight bulge near the top for anatomical correctness
    const bulge = Math.sin(t * Math.PI) * 0.015;

    const y = -t * length;

    points.push(new THREE.Vector2(Math.max(0.005, radius + bulge), y));
  }

  const geometry = new THREE.LatheGeometry(points, 16);

  // Add slight curve to the root
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const y = positions.getY(i);
    const t = Math.abs(y) / length;
    const curve = Math.sin(t * Math.PI * 0.7) * curveAmount;
    positions.setX(i, positions.getX(i) + curve);
  }

  geometry.computeVertexNormals();
  geometry.translate(0, 0, 0);

  return geometry;
}

/**
 * Create the pulp chamber geometry (internal structure)
 * Follows the general shape of the crown but smaller
 */
export function createPulpChamberGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();

  // Pulp chamber outline - roughly follows crown shape
  shape.moveTo(0, -0.05);
  shape.bezierCurveTo(0.12, -0.05, 0.15, 0.1, 0.12, 0.25);
  shape.bezierCurveTo(0.1, 0.35, 0.05, 0.4, 0, 0.42);
  shape.bezierCurveTo(-0.05, 0.4, -0.1, 0.35, -0.12, 0.25);
  shape.bezierCurveTo(-0.15, 0.1, -0.12, -0.05, 0, -0.05);

  const extrudeSettings = {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 4,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.center();
  geometry.rotateY(Math.PI / 2);
  geometry.translate(0, 0.3, 0);

  return geometry;
}

/**
 * Create root canal geometry using TubeGeometry
 * Follows the path through each root
 */
export function createRootCanalGeometry(
  startY: number = 0.1,
  endY: number = -1.0,
  offsetX: number = 0,
  curveX: number = 0.04
): THREE.TubeGeometry {
  const points: THREE.Vector3[] = [];
  const segments = 12;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = startY + t * (endY - startY);

    // Gentle S-curve through the root
    const x = offsetX + Math.sin(t * Math.PI) * curveX;
    const z = Math.sin(t * Math.PI * 0.5) * curveX * 0.5;

    points.push(new THREE.Vector3(x, y, z));
  }

  const curve = new THREE.CatmullRomCurve3(points);

  // Canal tapers from chamber to apex
  const radiusFunction = (t: number) => {
    return 0.025 * (1 - t * 0.6);
  };

  // Create tube with varying radius approximation
  const geometry = new THREE.TubeGeometry(curve, 16, 0.02, 8, false);

  return geometry;
}
