import type { KeyMap, NoteCallback, ResolvedSettings } from './types';
import { getFrequencyOfNote, getKeyPressed } from './utils';
import { lightenUp, darkenDown } from './styles';

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
 * Check if a keyboard event has modifier keys pressed.
 *
 * @param event - The keyboard event
 * @returns true if any modifier key is pressed
 */
function isModifierKey(event: KeyboardEvent): boolean {
  return event.ctrlKey || event.metaKey || event.altKey;
}

/**
 * Handle mouse down on a key element.
 */
function handleMouseDown(
  element: HTMLElement,
  state: EventState,
  settings: ResolvedSettings,
  callback: NoteCallback
): void {
  if (element.tagName.toLowerCase() !== 'li') return;

  state.mouseIsDown = true;
  lightenUp(element, settings.activeColour);
  callback(element.title, getFrequencyOfNote(element.title));
}

/**
 * Handle mouse up on a key element.
 */
function handleMouseUp(
  element: HTMLElement,
  state: EventState,
  settings: ResolvedSettings,
  callback: NoteCallback
): void {
  if (element.tagName.toLowerCase() !== 'li') return;

  state.mouseIsDown = false;
  darkenDown(element, settings);
  callback(element.title, getFrequencyOfNote(element.title));
}

/**
 * Handle mouse over on a key element (for drag behavior).
 */
function handleMouseOver(
  element: HTMLElement,
  state: EventState,
  settings: ResolvedSettings,
  callback: NoteCallback
): void {
  if (!state.mouseIsDown) return;

  lightenUp(element, settings.activeColour);
  callback(element.title, getFrequencyOfNote(element.title));
}

/**
 * Handle mouse out on a key element (for drag behavior).
 */
function handleMouseOut(
  element: HTMLElement,
  state: EventState,
  settings: ResolvedSettings,
  callback: NoteCallback
): void {
  if (!state.mouseIsDown) return;

  darkenDown(element, settings);
  callback(element.title, getFrequencyOfNote(element.title));
}

/**
 * Handle keyboard key down event.
 */
function handleKeyDown(
  event: KeyboardEvent,
  state: EventState,
  settings: ResolvedSettings,
  keyMap: KeyMap,
  callback: NoteCallback
): void {
  if (isModifierKey(event)) return;

  const key = event.key;
  if (!(key in keyMap)) return;
  if (state.keysDown.has(key)) return;

  event.preventDefault();
  state.keysDown.add(key);

  const note = getKeyPressed(key, keyMap, settings);
  const element = document.getElementById(note);

  lightenUp(element, settings.activeColour);
  callback(note, getFrequencyOfNote(note));
}

/**
 * Handle keyboard key up event.
 */
function handleKeyUp(
  event: KeyboardEvent,
  state: EventState,
  settings: ResolvedSettings,
  keyMap: KeyMap,
  callback: NoteCallback
): void {
  if (isModifierKey(event)) return;

  const key = event.key;
  if (!(key in keyMap)) return;

  state.keysDown.delete(key);

  const note = getKeyPressed(key, keyMap, settings);
  const element = document.getElementById(note);

  darkenDown(element, settings);
  callback(note, getFrequencyOfNote(note));
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
export function addListeners(
  container: HTMLElement,
  settings: ResolvedSettings,
  keyMap: KeyMap,
  callbacks: EventCallbacks,
  state: EventState
): () => void {
  const cleanupFunctions: Array<() => void> = [];

  // Mouse events on container
  const onMouseDown = (event: MouseEvent) => {
    handleMouseDown(event.target as HTMLElement, state, settings, callbacks.keyDown);
  };
  const onMouseUp = (event: MouseEvent) => {
    handleMouseUp(event.target as HTMLElement, state, settings, callbacks.keyUp);
  };
  const onMouseOver = (event: MouseEvent) => {
    handleMouseOver(event.target as HTMLElement, state, settings, callbacks.keyDown);
  };
  const onMouseOut = (event: MouseEvent) => {
    handleMouseOut(event.target as HTMLElement, state, settings, callbacks.keyUp);
  };

  container.addEventListener('mousedown', onMouseDown);
  container.addEventListener('mouseup', onMouseUp);
  container.addEventListener('mouseover', onMouseOver);
  container.addEventListener('mouseout', onMouseOut);

  cleanupFunctions.push(() => {
    container.removeEventListener('mousedown', onMouseDown);
    container.removeEventListener('mouseup', onMouseUp);
    container.removeEventListener('mouseover', onMouseOver);
    container.removeEventListener('mouseout', onMouseOut);
  });

  // Touch events (if supported)
  if ('ontouchstart' in document.documentElement) {
    const onTouchStart = (event: TouchEvent) => {
      handleMouseDown(event.target as HTMLElement, state, settings, callbacks.keyDown);
    };
    const onTouchEnd = (event: TouchEvent) => {
      handleMouseUp(event.target as HTMLElement, state, settings, callbacks.keyUp);
    };
    const onTouchLeave = (event: TouchEvent) => {
      handleMouseOut(event.target as HTMLElement, state, settings, callbacks.keyUp);
    };

    container.addEventListener('touchstart', onTouchStart);
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('touchleave' as keyof HTMLElementEventMap, onTouchLeave as EventListener);
    container.addEventListener('touchcancel', onTouchLeave);

    cleanupFunctions.push(() => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchleave' as keyof HTMLElementEventMap, onTouchLeave as EventListener);
      container.removeEventListener('touchcancel', onTouchLeave);
    });
  }

  // Keyboard events (if musical typing is enabled)
  if (settings.musicalTyping) {
    const onKeyDown = (event: KeyboardEvent) => {
      handleKeyDown(event, state, settings, keyMap, callbacks.keyDown);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      handleKeyUp(event, state, settings, keyMap, callbacks.keyUp);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    cleanupFunctions.push(() => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    });
  }

  // Return cleanup function
  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
  };
}
