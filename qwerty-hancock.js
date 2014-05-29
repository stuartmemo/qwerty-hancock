
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
        i = 0,
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

        start_octave = settings.startNote.charAt(1);
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
     */
    var lightenUp = function lightenUp (el) {
        el.style.backgroundColor = hover_colour;
    };

    /**
     * Revert key to original colour.
     */
    var darkenDown = function darkenDown (el) {
        if (el.getAttribute('data-note-type') === 'white') {
            el.style.backgroundColor = settings.whiteKeyColour;
        } else {
            el.style.backgroundColor = settings.blackKeyColour;
        }
    };

    /**
     * Add styling to individual white key.
     * @param  {element} el White key DOM element.
     */
    var styleWhiteKey = function (el) {
        el.style.backgroundColor = settings.whiteKeyColour;
        el.style.height = settings.height + 'px';
        el.style.width = white_key_width + 'px';
        el.style.borderRight = 0;
    };

    /**
     * Add styling to individual black key.
     * @param  {element} el Black key DOM element.
     */
    var styleBlackKey = function (el) {
        var black_key_width = Math.floor(white_key_width / 2);

        el.style.backgroundColor = settings.blackKeyColour;
        el.style.position = 'absolute';
        el.style.left = Math.floor(((white_key_width + 1) * (i + 1)) - (black_key_width / 2)) + 'px';
        el.style.width = black_key_width + 'px';
        el.style.height = (settings.height / 1.5) + 'px';
    };

    var defineScale = function () {
        // Define scale.
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

    var mouseDown = function () {
        mouse_is_down = true;
        lightenUp.call(this);
        this.keyDown(this.title, getFrequencyOfNote(this.title));
    };

    var mouseUp = function () {
        mouse_is_down = false;
        darkenDown.call(this);
        this.keyUp(this.title, getFrequencyOfNote(this.title));
    };

    var mouseOver = function () {
        if (mouse_is_down) {
            lightenUp.call(this);
            this.keyDown(this.title, getFrequencyOfNote(this.title));
        }
    };

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
    var addListeners = function (el) {
        if ('ontouchstart' in document.documentElement) {
            el.addEventListener('touchstart', mouseDown);
            el.addEventListener('touchend', mouseUp);
            el.addEventListener('touchleave', mouseUp);
            el.addEventListener('touchcancel', mouseUp);
        } else {
            el.addEventListener('mousedown', mouseDown);
            el.addEventListener('mouseup', mouseUp);
            el.addEventListener('mouseover', mouseOver);
            el.addEventListener('mouseout', mouseOut);
        }
    };

    /**
     * Add styling to individual key on keyboard.
     * @param  {object} key Element of key.
     */
    var styleKey = function (key, colour) {
        key.style.display = 'inline-block';
        key.style.border = '1px solid black';
        key.style['-webkit-user-select'] = 'none';

        if (colour === 'white') {
            styleWhiteKey(key);
        } else {
            styleBlackKey(key);
        }
    };

    /**
     * Create key DOM element.
     * @return {object} Key DOM element.
     */
    var createKey = function (colour) {
        var key = document.createElement('li');

        key.setAttribute('data-note-type', colour);
        styleKey(key, colour);

        key.addListeners = function () {

        };

        return key;
    };

    var addKeysToKeyboard = function (container) {
        container.appendChild(el);
    };

    var resetKeyboardStyle = function (keyboard) {
        keyboard.style.fontSize = '0px';
        keyboard.style.height = settings.height + 'px';
        keyboard.style.width = settings.width + 'px';
        keyboard.style.padding = 0;
        keyboard.style.position = 'relative';
        keyboard.style.cursor = 'default';
        keyboard.style['-webkit-user-select'] = 'none';
    };

    var createWhiteKeys = function () {
        var i = 0,
            note_counter = 0,
            octave_counter = start_octave,
            key,
            white_keys = [];

        for (i = 0; i < total_white_keys; i++) {
            if (i % notes.length === 0) {
                note_counter = 0;
            }

            bizarre_note_counter = new_notes[note_counter];

            if (bizarre_note_counter === 'C') {
                octave_counter++;
            }

            key = createKey('white');
            key.addAttributes();
            key.addListeners();
            key.addStyle();

            key.id = new_notes[note_counter] + (octave_counter - 1);
            key.title = new_notes[note_counter] + (octave_counter - 1);

            white_keys.push(key);

            note_counter++;
        }

        return white_keys;
    };

    var createBlackKeys = function () {
        var i = 0,
            j = 0,
            note_counter = 0,
            notes_with_sharps = ['A', 'C', 'D', 'F', 'G'],
            total_black_keys = notes_with_sharps.length * settings.octaves,
            octave_counter = start_octave,
            black_key,
            black_keys = [];

        for (i = 0; i < total_white_keys; i++) {

            if (i % notes.length === 0) {
                note_counter = 0;
            }

            for (j = 0; j < total_black_keys; j++) {

                if (new_notes[note_counter] === notes_with_sharps[j]) {

                    bizarre_note_counter = new_notes[note_counter] + '#';

                    if (bizarre_note_counter === 'C#') {
                        octave_counter++;
                    }

                    // Don't draw last black note
                    if ((white_key_width + 1) * (i + 1) < settings.width - white_key_width) {
                        black_key = createKey();
                        addListeners(black_key);
                        styleKey(black_key);

                        black_key.id = new_notes[note_counter] + '#' + (octave_counter - 1);
                        black_key.title = new_notes[note_counter] + '#' + (octave_counter - 1);
                        black_key.setAttribute('data-note-type', 'black');
                    }
                }
            }
            note_counter++;
        }

        return black_keys;
    };

    var createKeys = function (colour) {
        if (colour === 'white') {
            createWhiteKeys();
        } else {
            createBlackKeys();
        }
    };

    /*
     * Draw keyboard in element.
     *
     * @method drawKeyboard
     */
    var drawKeyboard = function () {
        var keyboard = document.createElement('ul'),
            note_counter = 0,
            bizarre_note_counter = 0,
            white_key,
            key_map = {},
            white_keys,
            black_keys;

        white_key_width = calculateWhiteKeyWidth(settings.width, total_white_keys);

        this.el = document.getElementById(settings.id);

        white_keys = createKeys('white');
        black_keys = createKeys('black');

        // Insert list of notes into container element.
        addKeysToKeyboard(keyboard);
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
    };


    var keyboardDown = function (key) {
        var key_pressed;

        if (key.keyCode in keysDown) {
           return;
        }

       keysDown[key.keyCode] = true;

       if (typeof key_map[key.keyCode] !== 'undefined') {
            key_pressed = key_map[key.keyCode]
                            .replace('l', qwerty_octave)
                            .replace('u', (parseInt(qwerty_octave, 10) + 1)
                            .toString());
            this.keyDown(key_pressed, getFrequencyOfNote(key_pressed));
            lightenUp.call(document.getElementById(key_pressed));
       }
    };

    var keyboardUp = function (key) {
        var key_pressed;

        delete keysDown[key.keyCode];

        if (typeof key_map[key.keyCode] !== 'undefined') {
            key_pressed = key_map[key.keyCode]
                            .replace('l', qwerty_octave)
                            .replace('u', (parseInt(qwerty_octave, 10) + 1)
                            .toString());
            this.keyUp(key_pressed, getFrequencyOfNote(key_pressed));
            darkenDown.call(document.getElementById(key_pressed));
        }
    };

    window.onkeydown = keyboardDown;
    window.onkeyup = keyboardUp;

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

