/**
 * User-provided settings for QwertyHancock constructor
 */
export interface QwertyHancockSettings {
    /** DOM element ID for the keyboard container (default: 'keyboard') */
    id?: string;
    /** Number of octaves to display (default: 3) */
    octaves?: number;
    /** Width of the keyboard in pixels */
    width?: number;
    /** Height of the keyboard in pixels */
    height?: number;
    /** CSS margin for the keyboard container */
    margin?: number | string;
    /** Starting note with octave (default: 'A3') */
    startNote?: string;
    /** Color of white keys (default: '#fff') */
    whiteKeyColour?: string;
    /** Color of black keys (default: '#000') */
    blackKeyColour?: string;
    /** Color of active/pressed keys (default: 'yellow') */
    activeColour?: string;
    /** Color of key borders (default: '#000') */
    borderColour?: string;
    /** Keyboard layout for musical typing (default: 'en') */
    keyboardLayout?: 'en' | 'de' | string;
    /** Enable musical typing with computer keyboard (default: true) */
    musicalTyping?: boolean;
    /** Starting octave for keyboard input */
    keyOctave?: number;
}
/**
 * Internal resolved settings with all defaults applied
 */
export interface ResolvedSettings {
    id: string;
    octaves: number;
    width: number;
    height: number;
    margin: number | string;
    startNote: string;
    startOctave: number;
    keyOctave: number;
    whiteKeyColour: string;
    blackKeyColour: string;
    activeColour: string;
    borderColour: string;
    keyboardLayout: string;
    musicalTyping: boolean;
    keyPressOffset: number;
}
/**
 * Callback function type for keyDown and keyUp events
 */
export type NoteCallback = (note: string, frequency: number) => void;
/**
 * Key map mapping keyboard keys (event.key) to note identifiers
 * Note identifiers use 'l' for lower octave and 'u' for upper octave
 */
export type KeyMap = Record<string, string>;
/**
 * Internal representation of a keyboard key element
 */
export interface KeyElement {
    el: HTMLLIElement;
    colour: 'white' | 'black';
    octave: number;
    width: number;
    id: string;
    noteNumber: number;
}
/**
 * Internal keyboard structure
 */
export interface Keyboard {
    container: HTMLElement;
    el: HTMLUListElement;
    keys: HTMLLIElement[];
    whiteNotes: string[];
    notesWithSharps: string[];
    totalWhiteKeys: number;
}
