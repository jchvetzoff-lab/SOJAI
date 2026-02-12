// SVG paths for realistic tooth shapes (FDI notation)
// Each path is designed for a 24x32 viewBox, centered at (12, 16)

// Upper teeth (roots point UP)
const UPPER_CENTRAL_INCISOR = 'M8 28 C8 28 6 18 7 10 C7.5 6 9 3 12 2 C15 3 16.5 6 17 10 C18 18 16 28 16 28 C14 30 10 30 8 28Z';
const UPPER_LATERAL_INCISOR = 'M9 28 C9 28 7 18 8 10 C8.5 6 10 3 12 2.5 C14 3 15.5 6 16 10 C17 18 15 28 15 28 C14 29.5 10 29.5 9 28Z';
const UPPER_CANINE = 'M9 28 C9 28 7 16 8 9 C8.5 5 10 2 12 1 C14 2 15.5 5 16 9 C17 16 15 28 15 28 C14 30 10 30 9 28Z';
const UPPER_PREMOLAR = 'M7 28 C7 28 6 20 7 14 C7 10 8 6 10 4 L12 2 L14 4 C16 6 17 10 17 14 C18 20 17 28 17 28 C15 30 9 30 7 28Z';
const UPPER_MOLAR = 'M5 28 C5 28 4 20 5 14 C5 10 7 6 9 4 L10 2 L12 3 L14 2 L15 4 C17 6 19 10 19 14 C20 20 19 28 19 28 C17 30 7 30 5 28Z';

// Lower teeth (roots point DOWN)
const LOWER_CENTRAL_INCISOR = 'M9 4 C9 4 7 14 8 22 C8.5 26 10 29 12 30 C14 29 15.5 26 16 22 C17 14 15 4 15 4 C14 2.5 10 2.5 9 4Z';
const LOWER_LATERAL_INCISOR = 'M8.5 4 C8.5 4 7 14 7.5 22 C8 26 9.5 29 12 30 C14.5 29 16 26 16.5 22 C17 14 15.5 4 15.5 4 C14 2 10 2 8.5 4Z';
const LOWER_CANINE = 'M9 4 C9 4 7 16 8 23 C8.5 27 10 30 12 31 C14 30 15.5 27 16 23 C17 16 15 4 15 4 C14 2 10 2 9 4Z';
const LOWER_PREMOLAR = 'M7 4 C7 4 6 12 7 18 C7 22 8 26 10 28 L12 30 L14 28 C16 26 17 22 17 18 C18 12 17 4 17 4 C15 2 9 2 7 4Z';
const LOWER_MOLAR = 'M5 4 C5 4 4 12 5 18 C5 22 7 26 9 28 L10 30 L12 29 L14 30 L15 28 C17 26 19 22 19 18 C20 12 19 4 19 4 C17 2 7 2 5 4Z';

interface ToothSvgInfo {
  path: string;
  viewBox: string;
  width: number;
  height: number;
}

export function getToothSvg(toothNumber: number): ToothSvgInfo {
  const quadrant = Math.floor(toothNumber / 10);
  const position = toothNumber % 10;
  const isUpperTooth = quadrant === 1 || quadrant === 2;

  let path: string;

  if (isUpperTooth) {
    if (position === 1) path = UPPER_CENTRAL_INCISOR;
    else if (position === 2) path = UPPER_LATERAL_INCISOR;
    else if (position === 3) path = UPPER_CANINE;
    else if (position === 4 || position === 5) path = UPPER_PREMOLAR;
    else path = UPPER_MOLAR;
  } else {
    if (position === 1) path = LOWER_CENTRAL_INCISOR;
    else if (position === 2) path = LOWER_LATERAL_INCISOR;
    else if (position === 3) path = LOWER_CANINE;
    else if (position === 4 || position === 5) path = LOWER_PREMOLAR;
    else path = LOWER_MOLAR;
  }

  const isMolar = position >= 6;
  const width = isMolar ? 24 : 24;
  const height = 32;

  return { path, viewBox: `0 0 ${width} ${height}`, width, height };
}
