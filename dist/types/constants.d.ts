import type { KeyMap } from './types';
/**
 * Musical notes in order starting from A
 */
export declare const NOTE_NAMES: readonly ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
/**
 * White keys in order starting from C
 */
export declare const WHITE_NOTES: readonly ["C", "D", "E", "F", "G", "A", "B"];
/**
 * Notes that have sharps
 */
export declare const NOTES_WITH_SHARPS: readonly ["C", "D", "F", "G", "A"];
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
export declare const DEFAULT_KEY_MAP: KeyMap;
/**
 * Default settings values
 */
export declare const DEFAULT_SETTINGS: {
    readonly id: "keyboard";
    readonly octaves: 3;
    readonly width: 600;
    readonly height: 150;
    readonly margin: 0;
    readonly startNote: "A3";
    readonly whiteKeyColour: "#fff";
    readonly blackKeyColour: "#000";
    readonly activeColour: "yellow";
    readonly borderColour: "#000";
    readonly keyboardLayout: "en";
    readonly musicalTyping: true;
};
