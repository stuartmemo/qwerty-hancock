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
        start_octave = 3,
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
        };

    /**
     * Calculate width of white key.
     * @return {number} Width of a single white key in pixels.
     */
    var getWhiteKeyWidth = function (number_of_white_keys) {
        return Math.floor((settings.width - number_of_white_keys) / number_of_white_keys);
    };

    /**
     * Calculate width of black key.
     * @return {number} Width of a single black key in pixels.
     */
    var getBlackKeyWidth = function () {
        return 0;
    };

    /**
     * Merge user settings with defaults.
     * @param  {object} user_settings
     */
    var init = function (user_settings) {
        settings = {
            id:             user_settings.id || 'keyboard',
            octaves:        user_settings.octaves || 3,
            width:          user_settings.width || 600,
            height:         user_settings.height || 150,
            startNote:      user_settings.startNote || 'A3',
            whiteKeyColour: user_settings.whiteKeyColour || '#fff',
            blackKeyColour: user_settings.blackKeyColour || '#000',
            activeColour:   user_settings.activeColour || '#076cf0',
            keyboardLayout: user_settings.keyboardLayout || 'en'
        };

        start_octave = parseInt(settings.startNote.charAt(1), 10);
        qwerty_octave = start_octave;
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
        el.style.backgroundColor = hover_colour;
    };

    /**
     * Revert key to original colour.
     * @param  {element} el DOM element to change colour of.
     */
    var darkenDown = function darkenDown (el) {
        if (el.getAttribute('data-note-type') === 'white') {
            el.style.backgroundColor = settings.whiteKeyColour;
        } else {
            el.style.backgroundColor = settings.blackKeyColour;
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
        key.el.style.border = '1px solid black';
        key.el.style.borderRight = 0;
        key.el.style.height = settings.height + 'px';
        key.el.style.width = key.width + 'px';
    };

    /**
     * Add styling to individual black key.
     * @param  {element} el Black key DOM element.
     */
    var styleBlackKey = function (key) {
        var black_key_width = Math.floor(white_key_width / 2),
            octave_width = 7 * (white_key_width + 1);
            octave_offset = (key.octave - start_octave) * octave_width,
            start_position = ((white_key_width + key.index + 1) - (black_key_width / 2));

        key.el.style.backgroundColor = settings.blackKeyColour;
        key.el.style.border = 0;
        key.el.style.position = 'absolute';
        key.el.style.left = Math.floor(start_position + (key.index * white_key_width)) + 'px';
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
    * Reset styles on keyboard container element.
    * @param {element} keyboard Keyboard container DOM element.
    */
    var styleKeyboard = function (keyboard) {
        keyboard.el.style.cursor = 'default';
        keyboard.el.style.fontSize = '0px';
        keyboard.el.style.height = settings.height + 'px';
        keyboard.el.style.padding = 0;
        keyboard.el.style.position = 'relative';
        keyboard.el.style.listStyle = 'none';
        keyboard.el.style.margin = 0;
        keyboard.el.style.width = settings.width + 'px';
        keyboard.el.style['-webkit-user-select'] = 'none';
    };

    /**
    * Call user's mouseDown event.
    */
    var mouseDown = function () {
        mouse_is_down = true;
        lightenUp.call(this);
        this.keyDown(this.title, getFrequencyOfNote(this.title));
    };

    /**
    * Call user's mouseUp event.
    */
    var mouseUp = function () {
        mouse_is_down = false;
        darkenDown.call(this);
        this.keyUp(this.title, getFrequencyOfNote(this.title));
    };

    /**
    * Call user's mouseDown if required.
    */
    var mouseOver = function () {
        if (mouse_is_down) {
            lightenUp.call(this);
            this.keyDown(this.title, getFrequencyOfNote(this.title));
        }
    };

    /**
    * Call user's mouseUp if required.
    */
    var mouseOut = function () {
        if (mouse_is_down) {
            darkenDown.call(this);
            this.keyUp(this.title, getFrequencyOfNote(this.title));
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
        } else {
            key.el.addEventListener('mousedown', mouseDown);
            key.el.addEventListener('mouseup', mouseUp);
            key.el.addEventListener('mouseover', mouseOver);
            key.el.addEventListener('mouseout', mouseOut);
        }
    };

    /**
    * Create key DOM element.
    * @return {object} Key DOM element.
    */
    var createKey = function (key) {
        key.el = document.createElement('li');
        key.el.setAttribute('data-note-type', key.colour);

        styleKey(key);
        addListenersToKey(key);

        return key;
    };

    var createWhiteKeys = function (notes) {
        var note_counter = 0,
            octave_counter = start_octave,
            key,
            keys = [],
            total_white_keys = settings.octaves * 7;

        for (var i = 0; i < total_white_keys; i++) {
            if (i % notes.length === 0) {
                note_counter = 0;
            }

            bizarre_note_counter = this.whiteNotes[note_counter];

            if (bizarre_note_counter === 'C') {
                octave_counter++;
            }

            key = createKey({
                colour: 'white',
                octave: octave_counter,
                width: getWhiteKeyWidth(total_white_keys)
            });

            key.el.id = notes[note_counter] + octave_counter;
            key.el.title = notes[note_counter] + octave_counter;

            keys.push(key.el);

            note_counter++;
        }

        return keys;
    };

    var createBlackKeys = function (notes) {
        var note_counter = 0,
            octave_counter = start_octave,
            total_white_keys = settings.octaves * 7,
            total_black_keys = notes.length * settings.octaves,
            white_key_width = getWhiteKeyWidth(total_white_keys),
            key,
            keys = [],
            i = 0;

        for (i = 0; i < total_black_keys; i++) {
            bizarre_note_counter = notes[note_counter] + '#';

            if (bizarre_note_counter === 'C#') {
                octave_counter++;
            }

            // Don't draw last black note
            if ((white_key_width + i) * (i + 1) < settings.width - white_key_width) {

                key = createKey({
                    colour: 'black',
                    index: note_counter,
                    octave: octave_counter
                });

                key.el.id = notes[note_counter] + '#' + octave_counter;
                key.el.title = notes[note_counter] + '#' + octave_counter;
                key.octave_counter = j;
                key.octave = octave_counter;
                key.offset = octave_counter - start_octave;

                keys.push(key.el);
            }
        }

        return keys;
    };

    var addKeysToKeyboard = function (keyboard) {
        keyboard.keys.forEach(function (key) {
            keyboard.el.appendChild(key);
        });
    };
    
    var addKeyboardToContainer = function (keyboard) {
        document.getElementById(settings.id).appendChild(keyboard);
    };

    var createKeys = function () {
        var ordered_white_notes = orderNotes(['C', 'D', 'E', 'F', 'G', 'A', 'B']),
            ordered_black_notes = orderNotes(['C#', 'D#', 'F#', 'G#', 'A#']),
            white_keys = createWhiteKeys.call(this, ordered_white_notes),
            black_keys = createBlackKeys(ordered_black_notes);
            //keys = white_keys.concat(black_keys);
 
        return white_keys;
    };

    var createKeyboard = function () {
        var keyboard = {
            container: document.getElementById(settings.id),
            el: document.createElement('ul'),
            whiteNotes: orderNotes(['C', 'D', 'E', 'F', 'G', 'A', 'B']),
            blackNotes: orderNotes(['C#', 'D#', 'F#', 'G#', 'A#'])
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
                .replace('l', qwerty_octave)
                .replace('u', (parseInt(qwerty_octave, 10) + 1)
                .toString());
    };

    /**
     * Handle a keyboard key being pressed.
     * @param {element} key The DOM element of the key being pressed.
     */
    var keyboardDown = function (key) {
        var key_pressed;

        if (key.keyCode in keysDown) {
           return;
        }

       keysDown[key.keyCode] = true;

       if (typeof key_map[key.keyCode] !== 'undefined') {
            key_pressed = getKeyPressed(key.keyCode);
            this.keyDown(key_pressed, getFrequencyOfNote(key_pressed));
            lightenUp.call(document.getElementById(key_pressed));
       }
    };

    
    /**
     * Handle a keyboard key being released.
     * @param {element} key The DOM element of the key that was released.
     */
    var keyboardUp = function (key) {
        var key_pressed;

        delete keysDown[key.keyCode];

        if (typeof key_map[key.keyCode] !== 'undefined') {
            key_pressed = getKeyPressed(key.keyCode);
            this.keyUp(key_pressed, getFrequencyOfNote(key_pressed));
            darkenDown.call(document.getElementById(key_pressed));
        }
    };

    /**
     * Qwerty Hancock constructor.
     * @param {object} settings Optional user settings.
     */
    var QwertyHancock = function (settings) {
        init(settings);

        this.version = version;

        createKeyboard();

        this.keyDown = function () {
            // Placeholder function.
        };

        this.keyUp = function () {
            // Placeholder function.
        };

        // Add event handlers to keyboard events.
        window.onkeydown = keyboardDown;
        window.onkeyup = keyboardUp;
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
**/

/**
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(midiSuccess, midiError);
}
*/
