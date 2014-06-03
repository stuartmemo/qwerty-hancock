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
        notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
        new_notes = [],
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
        total_white_keys = settings.octaves * 7;
        qwerty_octave = start_octave;
    };

    /**
     * Calculate width of white key.
     * @param  {number} keyboard_width Width of whole keyboard.
     * @param  {number} number_of_white_keys Total number of white keys on keyboard.
     * @return {number} Width of a single white key in pixels.
     */
    var calculateWhiteKeyWidth = function (keyboard_width, number_of_white_keys) {
        return Math.floor((keyboard_width - number_of_white_keys) / number_of_white_keys);
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



    var defineScale = function () {
        var i = 0;

        for (i = 0; i < 7; i++) {
            if (settings.startNote.charAt(0) === notes[i]) {
                keyOffset = i;
                break;
            }
        }

        for (i = 0; i < 7; i++) {
            if (i + keyOffset > 6) {
                new_notes[i] = notes[i + keyOffset -7];
            } else {
                new_notes[i] = notes[i + keyOffset];
            }
        }
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
    var addListeners = function (key) {
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
     * Add styling to individual white key.
     * @param  {element} el White key DOM element.
     */
    var styleWhiteKey = function (key) {
        key.el.style.backgroundColor = settings.whiteKeyColour;
        key.el.style.height = settings.height + 'px';
        key.el.style.width = white_key_width + 'px';
        key.el.style.borderRight = 0;
    };

    /**
     * Add styling to individual black key.
     * @param  {element} el Black key DOM element.
     */
    var styleBlackKey = function (key) {
        var black_key_width = Math.floor(white_key_width / 2),
            start_position = (white_key_width + 1) - (black_key_width / 2);

        key.el.style.backgroundColor = settings.blackKeyColour;
        key.el.style.position = 'absolute';
        key.el.style.left = Math.floor(start_position + key.index) + 'px';
        key.el.style.width = black_key_width + 'px';
        key.el.style.height = (settings.height / 1.5) + 'px';
    };

    var createKeyboard = function () {
        var keyboard = document.createElement('ul');

        /**
        * Reset styles on keyboard container element.
        * @param {element} keyboard Keyboard container DOM element.
        */
        var resetKeyboardStyle = function (keyboard) {
            keyboard.style.cursor = 'default';
            keyboard.style.fontSize = '0px';
            keyboard.style.height = settings.height + 'px';
            keyboard.style.padding = 0;
            keyboard.style.position = 'relative';
            keyboard.style.listStyle = 'none';
            keyboard.style.margin = 0;
            keyboard.style.width = settings.width + 'px';
            keyboard.style['-webkit-user-select'] = 'none';
        };

        /**
        * Add styling to individual key on keyboard.
        * @param  {object} key Element of key.
        */
        var styleKey = function (key) {
            key.el.style.display = 'inline-block';
            key.el.style.border = '1px solid black';
            key.el.style['-webkit-user-select'] = 'none';

            if (key.colour === 'white') {
                styleWhiteKey(key);
            } else {
                styleBlackKey(key);
            }
        };

        /**
        * Create key DOM element.
        * @return {object} Key DOM element.
        */
        var createKey = function (colour, key_index) {
            var key = {};

            key.colour = colour;
            key.index = key_index; 
            key.el = document.createElement('li');
            key.el.setAttribute('data-note-type', key.colour);

            styleKey(key);
            addListeners(key);

            return key;
        };

        var addKeysToKeyboard = function (keyboard, keys) {
            keys.forEach(function (key) {
                keyboard.appendChild(key);
            });
        };
        
        var createWhiteKeys = function () {
            var note_counter = 0,
                octave_counter = start_octave,
                key,
                keys = [];

            for (var i = 0; i < total_white_keys; i++) {
                if (i % notes.length === 0) {
                    note_counter = 0;
                }

                bizarre_note_counter = new_notes[note_counter];

                key = createKey('white', note_counter * octave_counter);
                key.el.id = new_notes[note_counter] + octave_counter;
                key.el.title = new_notes[note_counter] + octave_counter;

                keys.push(key.el);

                if (bizarre_note_counter === 'B') {
                    octave_counter++;
                }

                note_counter++;
            }

            return keys;
        };

        var createBlackKeys = function () {
            var note_counter = 0,
                octave_counter = start_octave,
                notes_with_sharps = ['A', 'C', 'D', 'F', 'G'],
                total_black_keys = notes_with_sharps.length * settings.octaves,
                key,
                keys = [];

            for (i = 0; i < total_white_keys; i++) {

                if (i % notes.length === 0) {
                    note_counter = 0;
                }

                for (var j = 0; j < total_black_keys; j++) {
                    if (new_notes[note_counter] === notes_with_sharps[j]) {

                        bizarre_note_counter = new_notes[note_counter] + '#';

                        // Don't draw last black note
                        if ((white_key_width + i) * (i + 1) < settings.width - white_key_width) {

                            key = createKey('black', note_counter + octave_counter);
                            key.el.id = new_notes[note_counter] + '#' + octave_counter;
                            key.el.title = new_notes[note_counter] + '#' + octave_counter;
                            key.index = j;
                            key.offset = octave_counter - start_octave;

                            keys.push(key.el);
                            
                            if (bizarre_note_counter === 'C#') {
                                octave_counter++;
                            }
                        }
                    }
                }

                note_counter++;
            }

            return keys;
        };
    };

    var addKeyboardToContainer = function (keyboard) {
        document.getElementById(settings.id).appendChild(keyboard);
    };

    /**
     * Draw keyboard in element.
     * @method drawKeyboard
     */
    var drawKeyboard = function () {
        var note_counter = 0,
            bizarre_note_counter = 0,
            key_map = {};

        white_key_width = calculateWhiteKeyWidth(settings.width, total_white_keys);

        this.el = document.getElementById(settings.id);
        defineScale();

        keyboard.style.height = (settings.height + 2) + 'px';

        // Insert list of notes into container element.
        addKeysToKeyboard(keyboard, createWhiteKeys().concat(createBlackKeys()));
        addKeyboardToContainer(keyboard);
    };

    var getKeyPressed = function () {
        return key_map[key.keyCode]
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
            key_pressed = getKeyPressed();
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
            key_pressed = getKeyPressed();
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
        this.el = document.getElementById(settings.id);

        drawKeyboard();

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
