import type { KeyMap, ResolvedSettings } from './types';
/**
 * Calculate the frequency of a given note using equal temperament tuning.
 * A4 = 440 Hz is used as the reference pitch.
 *
 * @param note - Musical note with octave (e.g., 'A4', 'C#3', 'Bb5')
 * @returns Frequency in hertz
 */
export declare function getFrequencyOfNote(note: string): number;
/**
 * Order notes array starting from a specific note.
 *
 * @param notes - Array of note names to order
 * @param startNote - Note to start from (e.g., 'C4' or just 'C')
 * @returns Reordered array of notes
 */
export declare function orderNotes(notes: readonly string[], startNote: string): string[];
/**
 * Get the full note name from a key map entry and current settings.
 *
 * @param key - The keyboard key that was pressed (event.key value)
 * @param keyMap - The current key map
 * @param settings - Current resolved settings
 * @returns Full note name with octave (e.g., 'C4')
 */
export declare function getKeyPressed(key: string, keyMap: KeyMap, settings: ResolvedSettings): string;
/**
 * Calculate the width of a white key based on available space.
 *
 * @param totalWidth - Total keyboard width in pixels
 * @param numberOfWhiteKeys - Number of white keys to fit
 * @returns Width of each white key in pixels
 */
export declare function getWhiteKeyWidth(totalWidth: number, numberOfWhiteKeys: number): number;
/**
 * Get the total number of white keys for a given number of octaves.
 *
 * @param octaves - Number of octaves
 * @returns Total number of white keys
 */
export declare function getTotalWhiteKeys(octaves: number): number;
