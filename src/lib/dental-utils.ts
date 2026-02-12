// FDI tooth numbering system utilities

// Upper right: 18-11, Upper left: 21-28
// Lower left: 38-31, Lower right: 41-48
export const FDI_UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
export const FDI_UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28];
export const FDI_LOWER_LEFT = [38, 37, 36, 35, 34, 33, 32, 31];
export const FDI_LOWER_RIGHT = [41, 42, 43, 44, 45, 46, 47, 48];

export const ALL_TEETH = [
  ...FDI_UPPER_RIGHT,
  ...FDI_UPPER_LEFT,
  ...FDI_LOWER_LEFT,
  ...FDI_LOWER_RIGHT,
];

export const UPPER_TEETH = [...FDI_UPPER_RIGHT, ...FDI_UPPER_LEFT];
export const LOWER_TEETH = [...FDI_LOWER_LEFT, ...FDI_LOWER_RIGHT];

export function getQuadrant(tooth: number): 1 | 2 | 3 | 4 {
  return Math.floor(tooth / 10) as 1 | 2 | 3 | 4;
}

export function getToothPosition(tooth: number): number {
  return tooth % 10;
}

export function isUpper(tooth: number): boolean {
  const q = getQuadrant(tooth);
  return q === 1 || q === 2;
}

export function isMolar(tooth: number): boolean {
  const pos = getToothPosition(tooth);
  return pos >= 6 && pos <= 8;
}

export function isPremolar(tooth: number): boolean {
  const pos = getToothPosition(tooth);
  return pos === 4 || pos === 5;
}

export function isAnterior(tooth: number): boolean {
  const pos = getToothPosition(tooth);
  return pos >= 1 && pos <= 3;
}

export function getToothName(tooth: number): string {
  const pos = getToothPosition(tooth);
  const names: Record<number, string> = {
    1: 'Central Incisor',
    2: 'Lateral Incisor',
    3: 'Canine',
    4: 'First Premolar',
    5: 'Second Premolar',
    6: 'First Molar',
    7: 'Second Molar',
    8: 'Third Molar',
  };
  const quadrantNames: Record<number, string> = {
    1: 'Upper Right',
    2: 'Upper Left',
    3: 'Lower Left',
    4: 'Lower Right',
  };
  return `${quadrantNames[getQuadrant(tooth)]} ${names[pos]}`;
}

// Get SVG coordinates for dental chart layout
export function getToothChartPosition(
  tooth: number,
  width: number,
  height: number
): { x: number; y: number } {
  const q = getQuadrant(tooth);
  const pos = getToothPosition(tooth);
  const centerX = width / 2;
  const gap = 4;

  // Tooth spacing
  const toothWidth = (width / 2 - gap - 16) / 8;

  let x: number;
  let y: number;

  if (q === 1) {
    // Upper right: positions 8->1, from left to center
    x = centerX - gap - (9 - pos) * toothWidth - toothWidth / 2;
    y = height * 0.25;
  } else if (q === 2) {
    // Upper left: positions 1->8, from center to right
    x = centerX + gap + (pos - 1) * toothWidth + toothWidth / 2;
    y = height * 0.25;
  } else if (q === 3) {
    // Lower left: positions 8->1, from right to center
    x = centerX - gap - (9 - pos) * toothWidth - toothWidth / 2;
    y = height * 0.75;
  } else {
    // Lower right: positions 1->8, from center to right
    x = centerX + gap + (pos - 1) * toothWidth + toothWidth / 2;
    y = height * 0.75;
  }

  return { x, y };
}
