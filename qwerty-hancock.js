
/*
 * Qwerty Hancock keyboard library v0.3
 * Copyright 2012-13, Stuart Memo
 *
 * Licensed under the MIT License
 * http://opensource.org/licenses/mit-license.php
 *
 * http://stuartmemo.com/qwerty-hancock
 */

(function(window, undefined) {

    var calculateWhiteKeyWidth = function (keyboard_width, number_of_white_keys) {
        return Math.floor((keyboard_width - number_of_white_keys) / number_of_white_keys);
    };

    var applyUserSettings = function (user_settings) {
        return {
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
    };

    /*
     * Get frequency of given note.
     *
     * @method getFrequency
     * @param note
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

    var midiError = function (err) {
        console.info('Midi not available:', err.code);
    };

    var QwertyHancock = function (settings) {
        this.version = '0.3';
        settings = applyUserSettings(settings);

        var el = document.getElementById(settings.id),
            start_octave = settings.startNote.charAt(1),
            total_white_keys = settings.octaves * 7,
            white_key_width = calculateWhiteKeyWidth(settings.width, total_white_keys),
            notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
            qwerty_octave = start_octave,
            keysDown = {},
            new_notes = [],
            mouse_is_down = false;

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


        this.keyDown = function () {
            // Placeholder function.
        };

        this.keyUp = function () {
            // Placeholder function.
        };

        // Define scale.
        (function () {
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
        })();

        var lightenUp = function lightenUp () {
            this.style.backgroundColor = hover_colour;
        };

        var darkenDown = function darkenDown () {
            if (this.getAttribute('data-note-type') === 'white') {
                this.style.backgroundColor = settings.whiteKeyColour;
            } else {
                this.style.backgroundColor = settings.blackKeyColour;
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

        var addListeners = function (li) {
            if ('ontouchstart' in document.documentElement) {
                li.addEventListener('touchstart', mouseDown);
                li.addEventListener('touchend', mouseUp);
                li.addEventListener('touchleave', mouseUp);
                li.addEventListener('touchcancel', mouseUp);
            } else {
                li.addEventListener('mousedown', mouseDown);
                li.addEventListener('mouseup', mouseUp);
                li.addEventListener('mouseover', mouseOver);
                li.addEventListener('mouseout', mouseOut);
            }
        };

        /*
         * Draw keyboard in element.
         *
         * @method drawKeyboard
         */
        var drawKeyboard = function () {
            var ul = document.createElement('ul'),
                note_counter = 0,
                bizarre_note_counter = 0;

            ul.style.height = settings.height + 'px';
            ul.style.width = settings.width + 'px';
            ul.style.padding = 0;
            ul.style.position = 'relative';
            ul.style.cursor = 'default';
            ul.style['-webkit-user-select'] = 'none';

            var drawWhiteKeys = function () {
                var i = 0,
                    note_counter = 0,
                    octave_counter = start_octave;

                for (i = 0; i < total_white_keys; i++) {
                    var li = document.createElement('li');

                    if ((i % notes.length) === 0) {
                        note_counter = 0;
                    }

                    li.style.backgroundColor = settings.whiteKeyColour;
                    li.style.display = 'inline-block';
                    li.style.height = settings.height + 'px';
                    li.style.width = white_key_width + 'px';
                    li.style.border = '1px solid black';
                    li.style.borderRight = 0;
                    li.style['-webkit-user-select'] = 'none';

                    li.setAttribute('data-note-type', 'white');

                    if (i % notes.length === 0) {
                        note_counter = 0;
                    }

                    bizarre_note_counter = new_notes[note_counter];

                    if (bizarre_note_counter === 'C') {
                        octave_counter++;
                    }

                    li.id = new_notes[note_counter] + (octave_counter - 1);
                    li.title = new_notes[note_counter] + (octave_counter - 1);

                    addListeners(li);

                    ul.appendChild(li);

                    note_counter++;
                }
            };

            var drawBlackKeys = function () {
                var i = 0,
                    j = 0,
                    black_key_width = Math.floor(white_key_width / 2),
                    notes_with_sharps = ['A', 'C', 'D', 'F', 'G'],
                    total_black_keys = notes_with_sharps.length * settings.octaves,
                    note_counter = 0,
                    octave_counter = start_octave;

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
                                var li = document.createElement('li');

                                li.style.backgroundColor = settings.blackKeyColour;
                                li.style.display = 'inline-block';
                                li.style.position = 'absolute';
                                li.style.left = Math.floor(((white_key_width + 1) * (i + 1)) - (black_key_width / 2)) + 'px';
                                li.style.border = '1px solid black';
                                li.style.width = black_key_width + 'px';
                                li.style.height = (settings.height / 1.5) + 'px';

                                li.id = new_notes[note_counter] + '#' + (octave_counter - 1);
                                li.title = new_notes[note_counter] + '#' + (octave_counter - 1);

                                li.setAttribute('data-note-type', 'black');

                                addListeners(li);

                                ul.appendChild(li);
                            }
                        }
                    }
                    note_counter++;
                }
            };

            drawWhiteKeys();
            drawBlackKeys();

            // Reset div height.
            el.style.fontSize = '0px';

            // Insert list of notes into container element.
            el.appendChild(ul);
        };

        drawKeyboard();

        var key_to_key = {};

        if (settings.keyboardLayout == 'en') {
            key_to_key = {
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
                220: 'Gu'
            };
        } else if (settings.keyboardLayout == 'de') {
            key_to_key = {
                65: 'Cl',
                87: 'C#l',
                83: 'Dl',
                69: 'D#l',
                68: 'El',
                70: 'Fl',
                84: 'F#l',
                71: 'Gl',
                90: 'G#l',
                72: 'Al',
                85: 'A#l',
                74: 'Bl',
                75: 'Cu',
                79: 'C#u',
                76: 'Du',
                80: 'D#u',
                186: 'Eu',
                222: 'Fu',
                221: 'F#u',
                220: 'Gu'
            };
        }

        var keyboardDown = function (key) {
            var key_pressed;

            if (key.keyCode in keysDown) {
               return;
            }

           keysDown[key.keyCode] = true;

           if (typeof keyToKey[key.keyCode] !== 'undefined') {
                key_pressed = keyToKey[key.keyCode].replace('l', qwerty_octave).replace('u', (parseInt(qwerty_octave, 10) + 1).toString());
                this.keyDown(key_pressed, getFrequencyOfNote(key_pressed));
                lightenUp.call(document.getElementById(key_pressed));
           }
       };

        var keyboardUp = function (key) {
            var key_pressed;

            delete keysDown[key.keyCode];

            if (typeof keyToKey[key.keyCode] !== 'undefined') {
                key_pressed = keyToKey[key.keyCode].replace('l', qwerty_octave).replace('u', (parseInt(qwerty_octave, 10) + 1).toString());
                this.keyUp(key_pressed, getFrequencyOfNote(key_pressed));
                darkenDown.call(document.getElementById(key_pressed));
            }
        };
 
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then(midiSuccess, midiError);
        }

        window.onkeydown = keyboardDown;
        window.onkeyup = keyboardUp;

        return this;
    };

    window.QwertyHancock = QwertyHancock;

})(window);