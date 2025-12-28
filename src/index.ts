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

import type { QwertyHancockSettings, ResolvedSettings, NoteCallback, KeyMap } from './types';
import { DEFAULT_KEY_MAP, DEFAULT_SETTINGS } from './constants';
import { createKeyboard, getKeyPressOffset } from './keyboard';
import { addListeners, type EventState } from './events';

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
export class QwertyHancock {
  /** Library version */
  public readonly version = '1.0.0';

  /** Callback triggered when a key is pressed */
  public keyDown: NoteCallback = () => {};

  /** Callback triggered when a key is released */
  public keyUp: NoteCallback = () => {};

  private settings: ResolvedSettings;
  private keyMap: KeyMap;
  private eventState: EventState;
  private cleanupListeners: (() => void) | null = null;

  /**
   * Create a new QwertyHancock keyboard instance.
   *
   * @param userSettings - Optional configuration settings
   */
  constructor(userSettings?: QwertyHancockSettings) {
    // Initialize key map
    this.keyMap = { ...DEFAULT_KEY_MAP };

    // Initialize event state
    this.eventState = {
      mouseIsDown: false,
      keysDown: new Set(),
    };

    // Resolve settings with defaults
    this.settings = this.resolveSettings(userSettings);

    // Create the keyboard DOM
    const keyboard = createKeyboard(this.settings);

    // Calculate key press offset based on starting note
    this.settings.keyPressOffset = getKeyPressOffset(keyboard.whiteNotes);

    // Add event listeners
    this.cleanupListeners = addListeners(
      keyboard.container,
      this.settings,
      this.keyMap,
      {
        keyDown: (note, frequency) => this.keyDown(note, frequency),
        keyUp: (note, frequency) => this.keyUp(note, frequency),
      },
      this.eventState
    );
  }

  /**
   * Resolve user settings with defaults.
   */
  private resolveSettings(userSettings?: QwertyHancockSettings): ResolvedSettings {
    const us = userSettings || {};

    // Get container to determine default dimensions
    let container = document.getElementById(us.id || DEFAULT_SETTINGS.id);
    let width = us.width;
    let height = us.height;

    if (container) {
      const computedStyle = window.getComputedStyle(container);
      if (width === undefined) {
        width = parseInt(computedStyle.width, 10) || DEFAULT_SETTINGS.width;
      }
      if (height === undefined) {
        height = parseInt(computedStyle.height, 10) || DEFAULT_SETTINGS.height;
      }
    } else {
      width = width ?? DEFAULT_SETTINGS.width;
      height = height ?? DEFAULT_SETTINGS.height;
    }

    const startNote = us.startNote || DEFAULT_SETTINGS.startNote;
    const startOctave = parseInt(startNote.charAt(startNote.length - 1), 10);

    return {
      id: us.id || DEFAULT_SETTINGS.id,
      octaves: us.octaves ?? DEFAULT_SETTINGS.octaves,
      width,
      height,
      margin: us.margin ?? DEFAULT_SETTINGS.margin,
      startNote,
      startOctave,
      keyOctave: us.keyOctave ?? startOctave,
      whiteKeyColour: us.whiteKeyColour || DEFAULT_SETTINGS.whiteKeyColour,
      blackKeyColour: us.blackKeyColour || DEFAULT_SETTINGS.blackKeyColour,
      activeColour: us.activeColour || DEFAULT_SETTINGS.activeColour,
      borderColour: us.borderColour || DEFAULT_SETTINGS.borderColour,
      keyboardLayout: us.keyboardLayout || DEFAULT_SETTINGS.keyboardLayout,
      musicalTyping: us.musicalTyping !== false,
      keyPressOffset: 0, // Will be set after keyboard creation
    };
  }

  /**
   * Set the octave for keyboard input.
   *
   * @param octave - The octave number to set
   * @returns The new octave value
   */
  public setKeyOctave(octave: number): number {
    this.settings.keyOctave = octave;
    return this.settings.keyOctave;
  }

  /**
   * Get the current octave for keyboard input.
   *
   * @returns The current octave value
   */
  public getKeyOctave(): number {
    return this.settings.keyOctave;
  }

  /**
   * Increment the keyboard input octave by one.
   *
   * @returns The new octave value
   */
  public keyOctaveUp(): number {
    this.settings.keyOctave++;
    return this.settings.keyOctave;
  }

  /**
   * Decrement the keyboard input octave by one.
   *
   * @returns The new octave value
   */
  public keyOctaveDown(): number {
    this.settings.keyOctave--;
    return this.settings.keyOctave;
  }

  /**
   * Get the current keyboard-to-note mapping.
   *
   * @returns The current key map
   */
  public getKeyMap(): KeyMap {
    return this.keyMap;
  }

  /**
   * Set a custom keyboard-to-note mapping.
   *
   * @param newKeyMap - The new key map to use
   * @returns The updated key map
   */
  public setKeyMap(newKeyMap: KeyMap): KeyMap {
    this.keyMap = newKeyMap;
    return this.keyMap;
  }

  /**
   * Clean up the keyboard instance and remove all event listeners.
   * Call this method when removing the keyboard from the DOM or
   * when the component is unmounted in a framework like React.
   */
  public destroy(): void {
    if (this.cleanupListeners) {
      this.cleanupListeners();
      this.cleanupListeners = null;
    }
  }
}

// Default export for convenience
export default QwertyHancock;

// Re-export types for consumers
export type { QwertyHancockSettings, NoteCallback, KeyMap } from './types';
