import { WHITE_NOTES, NOTES_WITH_SHARPS } from './constants';
import type { Keyboard, ResolvedSettings } from './types';
import { orderNotes, getWhiteKeyWidth, getTotalWhiteKeys } from './utils';
import {
  applyStyles,
  getContainerStyles,
  getKeyboardStyles,
  getWhiteKeyStyles,
  getBlackKeyStyles,
} from './styles';

/**
 * Create a single key element.
 *
 * @param id - Note identifier (e.g., 'C4', 'C#4')
 * @param colour - Key colour ('white' or 'black')
 * @returns The created key element
 */
function createKeyElement(id: string, colour: 'white' | 'black'): HTMLLIElement {
  const el = document.createElement('li');
  el.id = id;
  el.title = id;
  el.setAttribute('data-note-type', colour);
  return el;
}

/**
 * Create all keys for the keyboard.
 *
 * @param settings - Resolved keyboard settings
 * @param whiteNotes - Ordered array of white note names
 * @param notesWithSharps - Ordered array of notes that have sharps
 * @returns Array of key elements
 */
function createKeys(
  settings: ResolvedSettings,
  whiteNotes: string[],
  notesWithSharps: string[]
): HTMLLIElement[] {
  const keys: HTMLLIElement[] = [];
  const totalWhiteKeys = getTotalWhiteKeys(settings.octaves);
  const whiteKeyWidth = getWhiteKeyWidth(settings.width, totalWhiteKeys);
  const blackKeyWidth = Math.floor(whiteKeyWidth / 2);

  let noteCounter = 0;
  let octaveCounter = settings.startOctave;

  for (let i = 0; i < totalWhiteKeys; i++) {
    // Reset note counter at the start of each octave
    if (i % whiteNotes.length === 0) {
      noteCounter = 0;
    }

    const currentNote = whiteNotes[noteCounter];

    // Increment octave when we hit C (except for the first note)
    if (currentNote === 'C' && i !== 0) {
      octaveCounter++;
    }

    // Create white key
    const whiteKeyId = `${currentNote}${octaveCounter}`;
    const whiteKey = createKeyElement(whiteKeyId, 'white');
    const isLastKey = i === totalWhiteKeys - 1;
    applyStyles(whiteKey, getWhiteKeyStyles(settings, whiteKeyWidth, isLastKey));
    keys.push(whiteKey);

    // Create black key if this note has a sharp (except for the last key)
    if (!isLastKey && notesWithSharps.includes(currentNote)) {
      const blackKeyId = `${currentNote}#${octaveCounter}`;
      const blackKey = createKeyElement(blackKeyId, 'black');
      const leftPosition = Math.floor((whiteKeyWidth + 1) * (i + 1) - blackKeyWidth / 2);
      applyStyles(blackKey, getBlackKeyStyles(settings, blackKeyWidth, leftPosition));
      keys.push(blackKey);
    }

    noteCounter++;
  }

  return keys;
}

/**
 * Create the keyboard DOM structure.
 *
 * @param settings - Resolved keyboard settings
 * @returns The keyboard structure with container, element, and keys
 */
export function createKeyboard(settings: ResolvedSettings): Keyboard {
  // Get or create the container element
  let container = document.getElementById(settings.id);
  if (!container) {
    container = document.createElement('div');
    container.id = settings.id;
    document.body.appendChild(container);
  }

  // Apply container styles
  applyStyles(container, getContainerStyles(settings));

  // Create the keyboard list element
  const keyboardEl = document.createElement('ul');
  applyStyles(keyboardEl, getKeyboardStyles(settings));

  // Order notes based on start note
  const whiteNotes = orderNotes(WHITE_NOTES, settings.startNote);
  const notesWithSharps = orderNotes(NOTES_WITH_SHARPS, settings.startNote);

  // Create all keys
  const keys = createKeys(settings, whiteNotes, notesWithSharps);

  // Add keys to keyboard
  keys.forEach((key) => keyboardEl.appendChild(key));

  // Replace existing keyboard or add new one
  const existingKeyboard = container.querySelector('ul');
  if (existingKeyboard) {
    container.replaceChild(keyboardEl, existingKeyboard);
  } else {
    container.appendChild(keyboardEl);
  }

  return {
    container,
    el: keyboardEl,
    keys,
    whiteNotes,
    notesWithSharps,
    totalWhiteKeys: getTotalWhiteKeys(settings.octaves),
  };
}

/**
 * Calculate the key press offset based on the starting note.
 * This determines the octave adjustment for keyboard input.
 *
 * @param whiteNotes - Ordered array of white note names
 * @returns 0 if starting from C, 1 otherwise
 */
export function getKeyPressOffset(whiteNotes: string[]): number {
  return whiteNotes[0] === 'C' ? 0 : 1;
}
