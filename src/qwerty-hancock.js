/*
 * Qwerty Hancock keyboard library v0.3
 * Copyright 2012-14, Stuart Memo
 *
 * Licensed under the MIT License
 * http://opensource.org/licenses/mit-license.php
 *
 * http://stuartmemo.com/qwerty-hancock
 */

(function (window, undefined) {
    var version = '0.3',
        settings = {},
        mouse_is_down = false,
        keysDown = {},
        key_map = {
            65: 'Cl',
            87: 'C#l',
            83: 'Dl',
            69: 'D#l',
            68: 'El',
            70: 'Fl',
            84: 'F#l',
            71: 'Gl',
            89: 'G#l',
            72: 'Al',
            85: 'A#l',
            74: 'Bl',
            75: 'Cu',
            79: 'C#u',
            76: 'Du',
            80: 'D#u',
            59: 'Eu',
            186: 'Eu',
            222: 'Fu',
            221: 'F#u',
            220: 'Gu',
            90: 'G#l'
        },
        keyDownCallback,
        keyUpCallback;

    /**
     * Calculate width of white key.
     * @return {number} Width of a single white key in pixels.
     */
    var getWhiteKeyWidth = function (number_of_white_keys) {
        return Math.floor((settings.width - number_of_white_keys) / number_of_white_keys);
    };

    /**
     * Merge user settings with defaults.
     * @param  {object} user_settings
     */
    var init = function (us) {
        user_settings = us || {};

        settings = {
            id:             user_settings.id || 'keyboard',
            octaves:        user_settings.octaves || 3,
            width:          user_settings.width || 600,
            height:         user_settings.height || 150,
            startNote:      user_settings.startNote || 'A3',
            whiteKeyColour: user_settings.whiteKeyColour || '#fff',
            blackKeyColour: user_settings.blackKeyColour || '#000',
            activeColour:   user_settings.activeColour || 'yellow',
            borderColour:   user_settings.borderColour || '#000',
            keyboardLayout: user_settings.keyboardLayout || 'en',
        };

        settings.startOctave = parseInt(settings.startNote.charAt(1), 10);
        createKeyboard(settings);
        return settings;
    };

    /**
     * Get frequency of a given note.
     * @param  {string} note Musical note to convert into hertz.
     * @return {number} Frequency of note in hertz.
     */
    var getFrequencyOfNote = function (note) {
        var notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
            key_number,
            octave;

        if (note.length === 3) {
            octave = note.charAt(2);
        } else {
            octave = note.charAt(1);
        }

        key_number = notes.indexOf(note.slice(0, -1));

        if (key_number < 3) {
            key_number = key_number + 12 + ((octave - 1) * 12) + 1;
        } else {
            key_number = key_number + ((octave - 1) * 12) + 1;
        }

        return 440 * Math.pow(2, (key_number - 49) / 12);
    };

    /**
     * Change colour of key.
     * @param  {element} el DOM element to change colour of.
     */
    var lightenUp = function lightenUp (el) {
        if (el !== null || typeof el === undefined) {
            el.style.backgroundColor = settings.activeColour;
        }
    };

    /**
     * Revert key to original colour.
     * @param  {element} el DOM element to change colour of.
     */
    var darkenDown = function darkenDown (el) {
        if (el !== null) {
            if (el.getAttribute('data-note-type') === 'white') {
                el.style.backgroundColor = settings.whiteKeyColour;
            } else {
                el.style.backgroundColor = settings.blackKeyColour;
            }
        }
    };

    /**
     * Order notes into order defined by starting key in settings.
     * @param {array} notes_to_order Notes to be ordered.
     * @return {array{ ordered_notes Ordered notes.
     */
    var orderNotes = function (notes_to_order) {
        var i = 0,
            keyOffset = 0,
            ordered_notes = [],
            number_of_notes_to_order = notes_to_order.length;

        for (i = 0; i < number_of_notes_to_order; i++) {
            if (settings.startNote.charAt(0) === notes_to_order[i]) {
                keyOffset = i;
                break;
            }
        }

        for (i = 0; i < number_of_notes_to_order; i++) {
            if (i + keyOffset > number_of_notes_to_order - 1) {
                ordered_notes[i] = notes_to_order[i + keyOffset - number_of_notes_to_order];
            } else {
                ordered_notes[i] = notes_to_order[i + keyOffset];
            }
        }

        return ordered_notes;
    };

    /**
     * Add styling to individual white key.
     * @param  {element} el White key DOM element.
     */
    var styleWhiteKey = function (key) {
        key.el.style.backgroundColor = settings.whiteKeyColour;
        key.el.style.border = '1px solid ' + settings.borderColour;
        key.el.style.borderRight = 0;
        key.el.style.height = settings.height + 'px';
        key.el.style.width = key.width + 'px';
    }

    /**
     * Add styling to individual black key.
     * @param  {element} el Black key DOM element.
     */
    var styleBlackKey = function (key) {
        var white_key_width = getWhiteKeyWidth(getTotalWhiteKeys()),
            black_key_width = Math.floor(white_key_width / 2);

        key.el.style.backgroundColor = settings.blackKeyColour;
        key.el.style.border = '1px solid ' + settings.borderColour;
        key.el.style.position = 'absolute';
        key.el.style.left = Math.floor(((white_key_width + 1) * (key.noteNumber + 1)) - (black_key_width / 2)) + 'px';
        key.el.style.width = black_key_width + 'px';
        key.el.style.height = (settings.height / 1.5) + 'px';
    };

    /**
    * Add styling to individual key on keyboard.
    * @param  {object} key Element of key.
    */
    var styleKey = function (key) {
        key.el.style.display = 'inline-block';
        key.el.style['-webkit-user-select'] = 'none';

        if (key.colour === 'white') {
            styleWhiteKey(key);
        } else {
            styleBlackKey(key);
        }
    };

    /**
    * Reset styles on keyboard container and list element.
    * @param {element} keyboard Keyboard container DOM element.
    */
    var styleKeyboard = function (keyboard) {
        var styleElement = function (el) {
            el.style.cursor = 'default';
            el.style.fontSize = '0px';
            el.style.height = settings.height + 'px';
            el.style.padding = 0;
            el.style.position = 'relative';
            el.style.listStyle = 'none';
            el.style.margin = 0;
            el.style.width = settings.width + 'px';
            el.style['-webkit-user-select'] = 'none';
        }

        styleElement(keyboard.container);
        styleElement(keyboard.el);
    };

    /**
    * Call user's mouseDown event.
    */
    var mouseDown = function (element, callback) {
        mouse_is_down = true;
        lightenUp(element);
        callback(element.title, getFrequencyOfNote(element.title));
    };

    /**
    * Call user's mouseUp event.
    */
    var mouseUp = function (element, callback) {
        mouse_is_down = false;
        darkenDown(element);
        callback(element.title, getFrequencyOfNote(element.title));
    };

    /**
    * Call user's mouseDown if required.
    */
    var mouseOver = function (element, callback) {
        if (mouse_is_down) {
            lightenUp(element);
            callback(element.title, getFrequencyOfNote(element.title));
        }
    };

    /**
    * Call user's mouseUp if required.
    */
    var mouseOut = function (element, callback) {
        if (mouse_is_down) {
            darkenDown(element);
            callback(element.title, getFrequencyOfNote(element.title));
        }
    };
 
    /**
    * Add click/touch event listeners.
    * @param {object} el The element to add the event listeners to.
    */
    var addListenersToKey = function (key) {
        if ('ontouchstart' in document.documentElement) {
            key.el.addEventListener('touchstart', mouseDown);
            key.el.addEventListener('touchend', mouseUp);
            key.el.addEventListener('touchleave', mouseUp);
            key.el.addEventListener('touchcancel', mouseUp);
        } 
    };

    /**
    * Create key DOM element.
    * @return {object} Key DOM element.
    */
    var createKey = function (key) {
        key.el = document.createElement('li');
        key.el.id = key.id;
        key.el.title = key.id;
        key.el.setAttribute('data-note-type', key.colour);

        styleKey(key);
        addListenersToKey(key);

        return key;
    };

    var getTotalWhiteKeys = function () {
        return settings.octaves * 7;
    };

    var createKeys = function () {
        var that = this,
            note_counter = 0,
            octave_counter = settings.startOctave,
            key,
            keys = [],
            total_white_keys = getTotalWhiteKeys();

        for (var i = 0; i < total_white_keys; i++) {

            if (i % this.whiteNotes.length === 0) {
                note_counter = 0;
            }

            bizarre_note_counter = this.whiteNotes[note_counter];

            if (bizarre_note_counter === 'C') {
                octave_counter++;
            }

            key = createKey({
                colour: 'white',
                octave: octave_counter,
                width: getWhiteKeyWidth(total_white_keys),
                id: this.whiteNotes[note_counter] + octave_counter,
                noteNumber: i
            });

            keys.push(key.el);

            if (i !== total_white_keys - 1) {
                this.notesWithSharps.forEach(function (note, index) {
                    if (note === that.whiteNotes[note_counter]) {
                        key = createKey({
                            colour: 'black',
                            octave: octave_counter,
                            width: getWhiteKeyWidth(total_white_keys) / 2,
                            id: that.whiteNotes[note_counter] + '#' + octave_counter,
                            noteNumber: i
                        });

                        keys.push(key.el);
                    }
                });
            }
            note_counter++;
        }

        return keys;
    };

    var addKeysToKeyboard = function (keyboard) {
        keyboard.keys.forEach(function (key) {
            keyboard.el.appendChild(key);
        });
    };
    
    var createKeyboard = function () {
        var keyboard = {
            container: document.getElementById(settings.id),
            el: document.createElement('ul'),
            whiteNotes: orderNotes(['C', 'D', 'E', 'F', 'G', 'A', 'B']),
            notesWithSharps: orderNotes(['C', 'D', 'F', 'G', 'A'])
        };

        keyboard.keys = createKeys.call(keyboard);
        styleKeyboard(keyboard);

        // Add keys to keyboard, and keyboard to container.
        addKeysToKeyboard(keyboard);

        keyboard.container.appendChild(keyboard.el);

        return keyboard;
    };

    var getKeyPressed = function (keyCode) {
        return key_map[keyCode]
                .replace('l', settings.startOctave)
                .replace('u', (parseInt(settings.startOctave, 10) + 1)
                .toString());
    };

    /**
     * Handle a keyboard key being pressed.
     * @param {object} key The keyboard event of the currently pressed key.
     * @param {callback} callback The user's noteDown function.
     */
    var keyboardDown = function (key, callback) {
        var key_pressed;

        if (key.keyCode in keysDown) {
           return;
        }

       keysDown[key.keyCode] = true;

       if (typeof key_map[key.keyCode] !== 'undefined') {
            key_pressed = getKeyPressed(key.keyCode);

            // Call user's noteDown function.
            callback(key_pressed, getFrequencyOfNote(key_pressed));
            lightenUp(document.getElementById(key_pressed));
       }
    };
 
    /**
     * Handle a keyboard key being released.
     * @param {element} key The DOM element of the key that was released.
     * @param {callback} callback The user's noteDown function.
     */
    var keyboardUp = function (key, callback) {
        var key_pressed;

        delete keysDown[key.keyCode];

        if (typeof key_map[key.keyCode] !== 'undefined') {
            key_pressed = getKeyPressed(key.keyCode);
            // Call user's noteDown function.
            callback(key_pressed, getFrequencyOfNote(key_pressed));
            darkenDown(document.getElementById(key_pressed));
        }
    };

    /**
     * Qwerty Hancock constructor.
     * @param {object} settings Optional user settings.
     */
    var QwertyHancock = function (settings) {
        var that = this,
            keyboard_element;

        this.version = version;
        settings = init(settings);

        keyboard_element = document.getElementById(settings.id);

        window.addEventListener('keydown', function (key) {
            keyboardDown(key, that.keyDown);
        });
 
        window.addEventListener('keyup', function (key) {
            keyboardUp(key, that.keyUp);
        });

        keyboard_element.addEventListener('mousedown', function (event) {
            mouseDown(event.target, that.keyDown);
        });

        keyboard_element.addEventListener('mouseup', function (event) {
            mouseUp(event.target, that.keyUp);
        });

        keyboard_element.addEventListener('mouseover', function (event) {
            mouseOver(event.target, that.keyDown);
        });

        keyboard_element.addEventListener('mouseout', function (event) {
            mouseOut(event.target, that.keyUp);
        });


        this.keyDown = function () {
            // Placeholder function.
        };

        this.keyUp = function () {
            // Placeholder function.
        };
    };

    window.QwertyHancock = QwertyHancock;
})(window);

/**
var midiSuccess = function (access) {
    var midi_input = access.inputs()[0];
        midi_notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    midi_input.onmidimessage = function (event) {
        var data = event.data,
            key_pressed = midi_notes[data[1] % 12] + parseInt(data[1] / 12, 10);

        if (data[0] == 0x90) {
            this.keyDown(key_pressed, getFrequencyOfNote(key_pressed));
            if (el === document.getElementById(key_pressed)) {
                lightenUp.call(el);
            } 
        } else if (data[0] == 0x80) {
            this.keyUp(key_pressed, getFrequencyOfNote(key_pressed));
            if (el === document.getElementById(key_pressed)) {
                darkenDown.call(el);
            }
        }
    };
};

var midiError = function (err) {
    console.info('Midi not available:', err.code);
};

if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(midiSuccess, midiError);
}
*/
