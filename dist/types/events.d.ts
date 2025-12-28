import type { KeyMap, NoteCallback, ResolvedSettings } from './types';
/**
 * State interface for event handling
 */
export interface EventState {
    mouseIsDown: boolean;
    keysDown: Set<string>;
}
/**
 * Callbacks interface for event handling
 */
export interface EventCallbacks {
    keyDown: NoteCallback;
    keyUp: NoteCallback;
}
/**
 * Add all event listeners to the keyboard.
 *
 * @param container - The keyboard container element
 * @param settings - Resolved keyboard settings
 * @param keyMap - The keyboard-to-note mapping
 * @param callbacks - The keyDown and keyUp callback functions
 * @param state - The shared event state
 * @returns A cleanup function to remove all listeners
 */
export declare function addListeners(container: HTMLElement, settings: ResolvedSettings, keyMap: KeyMap, callbacks: EventCallbacks, state: EventState): () => void;
