import type { Keyboard, ResolvedSettings } from './types';
/**
 * Create the keyboard DOM structure.
 *
 * @param settings - Resolved keyboard settings
 * @returns The keyboard structure with container, element, and keys
 */
export declare function createKeyboard(settings: ResolvedSettings): Keyboard;
/**
 * Calculate the key press offset based on the starting note.
 * This determines the octave adjustment for keyboard input.
 *
 * @param whiteNotes - Ordered array of white note names
 * @returns 0 if starting from C, 1 otherwise
 */
export declare function getKeyPressOffset(whiteNotes: string[]): number;
