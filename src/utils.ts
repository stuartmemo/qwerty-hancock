import { NOTE_NAMES } from './constants';
import type { KeyMap, ResolvedSettings } from './types';

/**
 * Calculate the frequency of a given note using equal temperament tuning.
 * A4 = 440 Hz is used as the reference pitch.
 *
 * @param note - Musical note with octave (e.g., 'A4', 'C#3', 'Bb5')
 * @returns Frequency in hertz
 */
export function getFrequencyOfNote(note: string): number {
  // Parse octave from the note string
  // Handle both 2-char notes (A4) and 3-char notes (C#4)
  const octave = parseInt(note.length === 3 ? note.charAt(2) : note.charAt(1), 10);
  const noteName = note.slice(0, -1);

  // Find the position in the chromatic scale
  const noteIndex = NOTE_NAMES.indexOf(noteName as typeof NOTE_NAMES[number]);

  // Calculate key number (A0 = key 1)
  // Notes A, A#, B are in the previous year's octave
  let keyNumber: number;
  if (noteIndex < 3) {
    keyNumber = noteIndex + 12 + (octave - 1) * 12 + 1;
  } else {
    keyNumber = noteIndex + (octave - 1) * 12 + 1;
  }

  // Calculate frequency using equal temperament formula
  // f = 440 * 2^((n-49)/12) where n is the key number and 49 is A4
  return 440 * Math.pow(2, (keyNumber - 49) / 12);
}

/**
 * Order notes array starting from a specific note.
 *
 * @param notes - Array of note names to order
 * @param startNote - Note to start from (e.g., 'C4' or just 'C')
 * @returns Reordered array of notes
 */
export function orderNotes(notes: readonly string[], startNote: string): string[] {
  const startNoteName = startNote.charAt(0);
  const keyOffset = notes.indexOf(startNoteName);

  if (keyOffset === -1) {
    return [...notes];
  }

  const orderedNotes: string[] = [];
  const numberOfNotes = notes.length;

  for (let i = 0; i < numberOfNotes; i++) {
    const index = (i + keyOffset) % numberOfNotes;
    orderedNotes.push(notes[index]);
  }

  return orderedNotes;
}

/**
 * Get the full note name from a key map entry and current settings.
 *
 * @param key - The keyboard key that was pressed (event.key value)
 * @param keyMap - The current key map
 * @param settings - Current resolved settings
 * @returns Full note name with octave (e.g., 'C4')
 */
export function getKeyPressed(
  key: string,
  keyMap: KeyMap,
  settings: ResolvedSettings
): string {
  const mapping = keyMap[key];
  if (!mapping) return '';

  const lowerOctave = settings.keyOctave + settings.keyPressOffset;
  const upperOctave = lowerOctave + 1;

  return mapping
    .replace('l', lowerOctave.toString())
    .replace('u', upperOctave.toString());
}

/**
 * Calculate the width of a white key based on available space.
 *
 * @param totalWidth - Total keyboard width in pixels
 * @param numberOfWhiteKeys - Number of white keys to fit
 * @returns Width of each white key in pixels
 */
export function getWhiteKeyWidth(totalWidth: number, numberOfWhiteKeys: number): number {
  return Math.floor((totalWidth - numberOfWhiteKeys) / numberOfWhiteKeys);
}

/**
 * Get the total number of white keys for a given number of octaves.
 *
 * @param octaves - Number of octaves
 * @returns Total number of white keys
 */
export function getTotalWhiteKeys(octaves: number): number {
  return octaves * 7;
}
