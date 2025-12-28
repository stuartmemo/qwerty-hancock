import type { KeyMap } from './types';

/**
 * Musical notes in order starting from A
 */
export const NOTE_NAMES = [
  'A',
  'A#',
  'B',
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
] as const;

/**
 * White keys in order starting from C
 */
export const WHITE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;

/**
 * Notes that have sharps
 */
export const NOTES_WITH_SHARPS = ['C', 'D', 'F', 'G', 'A'] as const;

/**
 * Default key map using modern event.key values
 * Maps keyboard keys to note identifiers:
 * - 'l' suffix = lower octave
 * - 'u' suffix = upper octave
 *
 * Layout matches a standard QWERTY keyboard:
 * Lower row (ASDFGHJK) -> Lower octave (C-B)
 * Upper row (WETYU) -> Sharps/flats
 * Upper row (KL;') -> Upper octave
 */
export const DEFAULT_KEY_MAP: KeyMap = {
  // Lower octave - white keys (bottom row)
  a: 'Cl',
  s: 'Dl',
  d: 'El',
  f: 'Fl',
  g: 'Gl',
  h: 'Al',
  j: 'Bl',
  // Lower octave - black keys (top row)
  w: 'C#l',
  e: 'D#l',
  t: 'F#l',
  y: 'G#l',
  u: 'A#l',
  // German keyboard layout support (Z and Y are swapped)
  z: 'G#l',
  // Upper octave - white keys
  k: 'Cu',
  l: 'Du',
  ';': 'Eu',
  "'": 'Fu',
  '\\': 'Gu',
  // Upper octave - black keys
  o: 'C#u',
  p: 'D#u',
  ']': 'F#u',
};

/**
 * Default settings values
 */
export const DEFAULT_SETTINGS = {
  id: 'keyboard',
  octaves: 3,
  width: 600,
  height: 150,
  margin: 0,
  startNote: 'A3',
  whiteKeyColour: '#fff',
  blackKeyColour: '#000',
  activeColour: 'yellow',
  borderColour: '#000',
  keyboardLayout: 'en',
  musicalTyping: true,
} as const;
