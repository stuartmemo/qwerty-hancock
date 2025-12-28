/**
 * User-provided settings for QwertyHancock constructor
 */
interface QwertyHancockSettings {
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
 * Callback function type for keyDown and keyUp events
 */
type NoteCallback = (note: string, frequency: number) => void;
/**
 * Key map mapping keyboard keys (event.key) to note identifiers
 * Note identifiers use 'l' for lower octave and 'u' for upper octave
 */
type KeyMap = Record<string, string>;

/**
 * Qwerty Hancock keyboard library v1.0.0
 * The web keyboard for now people.
 * Copyright 2012-2025, Stuart Memo
 *
 * Licensed under the MIT License
 * http://opensource.org/licenses/mit-license.php
 *
 * http://stuartmemo.com/qwerty-hancock
 */

/**
 * QwertyHancock - An interactive HTML keyboard for web audio projects.
 *
 * @example
 * ```typescript
 * import { QwertyHancock } from 'qwerty-hancock';
 *
 * const keyboard = new QwertyHancock({
 *   id: 'keyboard',
 *   octaves: 3,
 *   width: 600,
 *   height: 150,
 * });
 *
 * keyboard.keyDown = (note, frequency) => {
 *   console.log(`Note: ${note}, Frequency: ${frequency}Hz`);
 * };
 * ```
 */
declare class QwertyHancock {
    /** Library version */
    readonly version = "1.0.0";
    /** Callback triggered when a key is pressed */
    keyDown: NoteCallback;
    /** Callback triggered when a key is released */
    keyUp: NoteCallback;
    private settings;
    private keyMap;
    private eventState;
    private cleanupListeners;
    /**
     * Create a new QwertyHancock keyboard instance.
     *
     * @param userSettings - Optional configuration settings
     */
    constructor(userSettings?: QwertyHancockSettings);
    /**
     * Resolve user settings with defaults.
     */
    private resolveSettings;
    /**
     * Set the octave for keyboard input.
     *
     * @param octave - The octave number to set
     * @returns The new octave value
     */
    setKeyOctave(octave: number): number;
    /**
     * Get the current octave for keyboard input.
     *
     * @returns The current octave value
     */
    getKeyOctave(): number;
    /**
     * Increment the keyboard input octave by one.
     *
     * @returns The new octave value
     */
    keyOctaveUp(): number;
    /**
     * Decrement the keyboard input octave by one.
     *
     * @returns The new octave value
     */
    keyOctaveDown(): number;
    /**
     * Get the current keyboard-to-note mapping.
     *
     * @returns The current key map
     */
    getKeyMap(): KeyMap;
    /**
     * Set a custom keyboard-to-note mapping.
     *
     * @param newKeyMap - The new key map to use
     * @returns The updated key map
     */
    setKeyMap(newKeyMap: KeyMap): KeyMap;
    /**
     * Clean up the keyboard instance and remove all event listeners.
     * Call this method when removing the keyboard from the DOM or
     * when the component is unmounted in a framework like React.
     */
    destroy(): void;
}

export { QwertyHancock, QwertyHancock as default };
export type { KeyMap, NoteCallback, QwertyHancockSettings };
