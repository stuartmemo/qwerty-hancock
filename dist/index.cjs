'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Musical notes in order starting from A
 */
const NOTE_NAMES = [
    'A',
    'A#',
    'B',
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
];
/**
 * White keys in order starting from C
 */
const WHITE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
/**
 * Notes that have sharps
 */
const NOTES_WITH_SHARPS = ['C', 'D', 'F', 'G', 'A'];
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
const DEFAULT_KEY_MAP = {
    // Lower octave - white keys (bottom row)
    a: 'Cl',
    s: 'Dl',
    d: 'El',
    f: 'Fl',
    g: 'Gl',
    h: 'Al',
    j: 'Bl',
    // Lower octave - black keys (top row)
    w: 'C#l',
    e: 'D#l',
    t: 'F#l',
    y: 'G#l',
    u: 'A#l',
    // German keyboard layout support (Z and Y are swapped)
    z: 'G#l',
    // Upper octave - white keys
    k: 'Cu',
    l: 'Du',
    ';': 'Eu',
    "'": 'Fu',
    '\\': 'Gu',
    // Upper octave - black keys
    o: 'C#u',
    p: 'D#u',
    ']': 'F#u',
};
/**
 * Default settings values
 */
const DEFAULT_SETTINGS = {
    id: 'keyboard',
    octaves: 3,
    width: 600,
    height: 150,
    margin: 0,
    startNote: 'A3',
    whiteKeyColour: '#fff',
    blackKeyColour: '#000',
    activeColour: 'yellow',
    borderColour: '#000',
    keyboardLayout: 'en'};

/**
 * Calculate the frequency of a given note using equal temperament tuning.
 * A4 = 440 Hz is used as the reference pitch.
 *
 * @param note - Musical note with octave (e.g., 'A4', 'C#3', 'Bb5')
 * @returns Frequency in hertz
 */
function getFrequencyOfNote(note) {
    // Parse octave from the note string
    // Handle both 2-char notes (A4) and 3-char notes (C#4)
    const octave = parseInt(note.length === 3 ? note.charAt(2) : note.charAt(1), 10);
    const noteName = note.slice(0, -1);
    // Find the position in the chromatic scale
    const noteIndex = NOTE_NAMES.indexOf(noteName);
    // Calculate key number (A0 = key 1)
    // Notes A, A#, B are in the previous year's octave
    let keyNumber;
    if (noteIndex < 3) {
        keyNumber = noteIndex + 12 + (octave - 1) * 12 + 1;
    }
    else {
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
function orderNotes(notes, startNote) {
    const startNoteName = startNote.charAt(0);
    const keyOffset = notes.indexOf(startNoteName);
    if (keyOffset === -1) {
        return [...notes];
    }
    const orderedNotes = [];
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
function getKeyPressed(key, keyMap, settings) {
    const mapping = keyMap[key];
    if (!mapping)
        return '';
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
function getWhiteKeyWidth(totalWidth, numberOfWhiteKeys) {
    return Math.floor((totalWidth - numberOfWhiteKeys) / numberOfWhiteKeys);
}
/**
 * Get the total number of white keys for a given number of octaves.
 *
 * @param octaves - Number of octaves
 * @returns Total number of white keys
 */
function getTotalWhiteKeys(octaves) {
    return octaves * 7;
}

/**
 * Apply style properties to an HTML element.
 *
 * @param element - The element to style
 * @param styles - Object containing CSS properties to apply
 */
function applyStyles(element, styles) {
    Object.assign(element.style, styles);
    // Handle vendor prefixes for user-select
    if (styles.userSelect !== undefined) {
        element.style['-webkit-user-select'] = styles.userSelect;
    }
}
/**
 * Get styles for the keyboard container element.
 *
 * @param settings - Resolved keyboard settings
 * @returns Style properties for the container
 */
function getContainerStyles(settings) {
    return {
        width: `${settings.width}px`,
        height: `${settings.height}px`,
        display: 'block',
        position: 'relative',
        boxSizing: 'content-box',
    };
}
/**
 * Get styles for the keyboard list element.
 *
 * @param settings - Resolved keyboard settings
 * @returns Style properties for the keyboard list
 */
function getKeyboardStyles(settings) {
    return {
        cursor: 'default',
        fontSize: '0px',
        height: `${settings.height}px`,
        width: `${settings.width}px`,
        padding: '0',
        position: 'relative',
        listStyle: 'none',
        margin: typeof settings.margin === 'number' ? `${settings.margin}px` : settings.margin,
        boxSizing: 'content-box',
        userSelect: 'none',
    };
}
/**
 * Get styles for a white key.
 *
 * @param settings - Resolved keyboard settings
 * @param width - Width of the key in pixels
 * @param isLastKey - Whether this is the last key (affects border)
 * @returns Style properties for the white key
 */
function getWhiteKeyStyles(settings, width, isLastKey) {
    return {
        backgroundColor: settings.whiteKeyColour,
        border: `1px solid ${settings.borderColour}`,
        borderRight: isLastKey ? `1px solid ${settings.borderColour}` : '0',
        height: `${settings.height}px`,
        width: `${width}px`,
        borderRadius: '0 0 5px 5px',
        position: 'relative',
        zIndex: '1',
        boxSizing: 'content-box',
        display: 'inline-block',
        userSelect: 'none',
    };
}
/**
 * Get styles for a black key.
 *
 * @param settings - Resolved keyboard settings
 * @param width - Width of the key in pixels
 * @param leftPosition - Left offset in pixels
 * @returns Style properties for the black key
 */
function getBlackKeyStyles(settings, width, leftPosition) {
    return {
        backgroundColor: settings.blackKeyColour,
        border: `1px solid ${settings.borderColour}`,
        position: 'absolute',
        left: `${leftPosition}px`,
        width: `${width}px`,
        height: `${Math.floor(settings.height / 1.5)}px`,
        borderRadius: '0 0 3px 3px',
        zIndex: '2',
        boxSizing: 'content-box',
        display: 'inline-block',
        userSelect: 'none',
    };
}
/**
 * Highlight a key with the active color.
 *
 * @param element - The key element to highlight
 * @param activeColour - The color to use for highlighting
 */
function lightenUp(element, activeColour) {
    if (element) {
        element.style.backgroundColor = activeColour;
    }
}
/**
 * Restore a key to its original color.
 *
 * @param element - The key element to restore
 * @param settings - Resolved keyboard settings
 */
function darkenDown(element, settings) {
    if (element) {
        const noteType = element.getAttribute('data-note-type');
        element.style.backgroundColor =
            noteType === 'white' ? settings.whiteKeyColour : settings.blackKeyColour;
    }
}

/**
 * Create a single key element.
 *
 * @param id - Note identifier (e.g., 'C4', 'C#4')
 * @param colour - Key colour ('white' or 'black')
 * @returns The created key element
 */
function createKeyElement(id, colour) {
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
function createKeys(settings, whiteNotes, notesWithSharps) {
    const keys = [];
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
function createKeyboard(settings) {
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
    }
    else {
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
function getKeyPressOffset(whiteNotes) {
    return whiteNotes[0] === 'C' ? 0 : 1;
}

/**
 * Check if a keyboard event has modifier keys pressed.
 *
 * @param event - The keyboard event
 * @returns true if any modifier key is pressed
 */
function isModifierKey(event) {
    return event.ctrlKey || event.metaKey || event.altKey;
}
/**
 * Handle mouse down on a key element.
 */
function handleMouseDown(element, state, settings, callback) {
    if (element.tagName.toLowerCase() !== 'li')
        return;
    state.mouseIsDown = true;
    lightenUp(element, settings.activeColour);
    callback(element.title, getFrequencyOfNote(element.title));
}
/**
 * Handle mouse up on a key element.
 */
function handleMouseUp(element, state, settings, callback) {
    if (element.tagName.toLowerCase() !== 'li')
        return;
    state.mouseIsDown = false;
    darkenDown(element, settings);
    callback(element.title, getFrequencyOfNote(element.title));
}
/**
 * Handle mouse over on a key element (for drag behavior).
 */
function handleMouseOver(element, state, settings, callback) {
    if (!state.mouseIsDown)
        return;
    lightenUp(element, settings.activeColour);
    callback(element.title, getFrequencyOfNote(element.title));
}
/**
 * Handle mouse out on a key element (for drag behavior).
 */
function handleMouseOut(element, state, settings, callback) {
    if (!state.mouseIsDown)
        return;
    darkenDown(element, settings);
    callback(element.title, getFrequencyOfNote(element.title));
}
/**
 * Handle keyboard key down event.
 */
function handleKeyDown(event, state, settings, keyMap, callback) {
    if (isModifierKey(event))
        return;
    const key = event.key;
    if (!(key in keyMap))
        return;
    if (state.keysDown.has(key))
        return;
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
function handleKeyUp(event, state, settings, keyMap, callback) {
    if (isModifierKey(event))
        return;
    const key = event.key;
    if (!(key in keyMap))
        return;
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
function addListeners(container, settings, keyMap, callbacks, state) {
    const cleanupFunctions = [];
    // Mouse events on container
    const onMouseDown = (event) => {
        handleMouseDown(event.target, state, settings, callbacks.keyDown);
    };
    const onMouseUp = (event) => {
        handleMouseUp(event.target, state, settings, callbacks.keyUp);
    };
    const onMouseOver = (event) => {
        handleMouseOver(event.target, state, settings, callbacks.keyDown);
    };
    const onMouseOut = (event) => {
        handleMouseOut(event.target, state, settings, callbacks.keyUp);
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
        const onTouchStart = (event) => {
            handleMouseDown(event.target, state, settings, callbacks.keyDown);
        };
        const onTouchEnd = (event) => {
            handleMouseUp(event.target, state, settings, callbacks.keyUp);
        };
        const onTouchLeave = (event) => {
            handleMouseOut(event.target, state, settings, callbacks.keyUp);
        };
        container.addEventListener('touchstart', onTouchStart);
        container.addEventListener('touchend', onTouchEnd);
        container.addEventListener('touchleave', onTouchLeave);
        container.addEventListener('touchcancel', onTouchLeave);
        cleanupFunctions.push(() => {
            container.removeEventListener('touchstart', onTouchStart);
            container.removeEventListener('touchend', onTouchEnd);
            container.removeEventListener('touchleave', onTouchLeave);
            container.removeEventListener('touchcancel', onTouchLeave);
        });
    }
    // Keyboard events (if musical typing is enabled)
    if (settings.musicalTyping) {
        const onKeyDown = (event) => {
            handleKeyDown(event, state, settings, keyMap, callbacks.keyDown);
        };
        const onKeyUp = (event) => {
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
class QwertyHancock {
    /**
     * Create a new QwertyHancock keyboard instance.
     *
     * @param userSettings - Optional configuration settings
     */
    constructor(userSettings) {
        /** Library version */
        this.version = '1.0.0';
        /** Callback triggered when a key is pressed */
        this.keyDown = () => { };
        /** Callback triggered when a key is released */
        this.keyUp = () => { };
        this.cleanupListeners = null;
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
        this.cleanupListeners = addListeners(keyboard.container, this.settings, this.keyMap, {
            keyDown: (note, frequency) => this.keyDown(note, frequency),
            keyUp: (note, frequency) => this.keyUp(note, frequency),
        }, this.eventState);
    }
    /**
     * Resolve user settings with defaults.
     */
    resolveSettings(userSettings) {
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
        }
        else {
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
    setKeyOctave(octave) {
        this.settings.keyOctave = octave;
        return this.settings.keyOctave;
    }
    /**
     * Get the current octave for keyboard input.
     *
     * @returns The current octave value
     */
    getKeyOctave() {
        return this.settings.keyOctave;
    }
    /**
     * Increment the keyboard input octave by one.
     *
     * @returns The new octave value
     */
    keyOctaveUp() {
        this.settings.keyOctave++;
        return this.settings.keyOctave;
    }
    /**
     * Decrement the keyboard input octave by one.
     *
     * @returns The new octave value
     */
    keyOctaveDown() {
        this.settings.keyOctave--;
        return this.settings.keyOctave;
    }
    /**
     * Get the current keyboard-to-note mapping.
     *
     * @returns The current key map
     */
    getKeyMap() {
        return this.keyMap;
    }
    /**
     * Set a custom keyboard-to-note mapping.
     *
     * @param newKeyMap - The new key map to use
     * @returns The updated key map
     */
    setKeyMap(newKeyMap) {
        this.keyMap = newKeyMap;
        return this.keyMap;
    }
    /**
     * Clean up the keyboard instance and remove all event listeners.
     * Call this method when removing the keyboard from the DOM or
     * when the component is unmounted in a framework like React.
     */
    destroy() {
        if (this.cleanupListeners) {
            this.cleanupListeners();
            this.cleanupListeners = null;
        }
    }
}

exports.QwertyHancock = QwertyHancock;
exports.default = QwertyHancock;
//# sourceMappingURL=index.cjs.map
