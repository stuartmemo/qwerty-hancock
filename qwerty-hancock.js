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
    var QwertyHancock = function (settings) {

        var qh = {};

        qh.version = '0.3';

        var id = settings.id || 'keyboard',
            element = settings.element || document.getElementById(id),
            number_of_octaves = settings.octaves || 3,
            total_white_keys = number_of_octaves * 7,
            keyboard_width = settings.width || 600,
            keyboard_height = settings.height || 150,
            start_note = settings.startNote || 'A3',
            start_octave = start_note.charAt(1),
            white_key_colour = settings.whiteKeyColour || '#FFF',
            black_key_colour = settings.blackKeyColour || '#000',
            hover_colour = settings.hoverColour || '#076cf0',
            border_width = 1,
            white_key_width = Math.floor((keyboard_width - (total_white_keys * border_width)) / total_white_keys),
            black_key_width = settings.blackKeyWidth || Math.floor(white_key_width / 2),
            black_key_height = settings.blackKeyHeight || keyboard_height / 1.5,
            keyboardLayout = settings.keyboardLayout || "en",
            notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
            notes_with_sharps = ['A', 'C', 'D', 'F', 'G'],
            total_black_keys = notes_with_sharps.length * number_of_octaves,
            first_note = start_note.charAt(0),
            octave_counter = 0,
            qwerty_octave = start_octave,
            note_Down = false,
            keysDown = {},
            white_keys = [],
            new_notes = [],
            mouse_is_down = false,
            i = 0,
            settings = {};

        qh.keyDown = function () {
            // Placeholder function.
        };

        qh.keyUp = function () {
            // Placeholder function.
        };

        /*
         * Get frequency of given note.
         *
         * @method getFrequency
         * @param note
         */
        var getFrequency = function (note) {
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

        // Define scale.
        (function () {
            for (i = 0; i < 7; i++) {
                if (first_note === notes[i]) {
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
                this.style.backgroundColor = white_key_colour;
            } else {
                this.style.backgroundColor = black_key_colour;
            }
        };

        var mouseDown = function () {
            mouse_is_down = true;
            lightenUp.call(this);
            qh.keyDown(this.title, getFrequency(this.title));
        };

        var mouseUp = function () {
            mouse_is_down = false;
            darkenDown.call(this);
            qh.keyUp(this.title, getFrequency(this.title));
        };

        var mouseOver = function () {
            if (mouse_is_down) {
                lightenUp.call(this);
                qh.keyDown(this.title, getFrequency(this.title));
            }
        };

        var mouseOut = function () {
            if(mouse_is_down) {
                darkenDown.call(this);
                qh.keyUp(this.title, getFrequency(this.title));
            }
        };

        var addListeners = function (li) {
            li.addEventListener('mousedown', mouseDown);
            li.addEventListener('mouseup', mouseUp);
            li.addEventListener('mouseover', mouseOver);
            li.addEventListener('mouseout', mouseOut);
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

            ul.style.height = keyboard_height + 'px';
            ul.style.width = keyboard_width + 'px';
            ul.style.padding = 0;
            ul.style.position = 'relative';
            ul.style.cursor = 'default';
            ul.style['-webkit-user-select'] = 'none';

            var getWidthOfKeys = function (keyboard_width, no_keys) {
                return Math.floor(keyboard_width / no_keys);
            };

            var drawWhiteKeys = function () {
                note_counter = 0;
                octave_counter = start_octave;

                for (i = 0; i < total_white_keys; i++) {
                    var li = document.createElement('li');

                    if ((i % notes.length) === 0) {
                        note_counter = 0;
                    }

                    li.style.backgroundColor = white_key_colour;
                    li.style.display = 'inline-block';
                    li.style.height = keyboard_height + 'px';
                    li.style.width = white_key_width + 'px';
                    li.style.border = '1px solid black';
                    li.style.borderRight = 0;
                    li.style['-webkit-user-select'] = 'none';

                    li.setAttribute('data-note-type', 'white');

                    if ((i % notes.length) === 0) {
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
                note_counter = 0;
                octave_counter = start_octave;

                for (i = 0; i < total_white_keys; i++) {

                    if ((i % notes.length) === 0) {
                        note_counter = 0;
                    }

                    for (var j = 0; j < total_black_keys; j++) {

                        if (new_notes[note_counter] === notes_with_sharps[j]) {

                            bizarre_note_counter = new_notes[note_counter] + '#';

                            if (bizarre_note_counter === 'C#') {
                                octave_counter++;
                            }

                            // Don't draw last black note
                            if ((white_key_width + 1) * (i + 1) < keyboard_width - white_key_width) {
                                var li = document.createElement('li');

                                li.style.backgroundColor = black_key_colour;
                                li.style.display = 'inline-block';
                                li.style.position = 'absolute';
                                li.style.left = Math.floor(((white_key_width + 1) * (i + 1)) - (black_key_width / 2)) + 'px';
                                li.style.border = '1px solid black';
                                li.style.width = black_key_width + 'px';
                                li.style.height = black_key_height + 'px';

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
            element.style.fontSize = '0px';

            // Insert list of notes into container element.
            element.appendChild(ul);
        };

        drawKeyboard();

        if (keyboardLayout == "en") {
            var keyToKey = {
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
        } else if (keyboardLayout == "de") {
            var keyToKey = {
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
            var el,
                key_pressed;

            if (key.keyCode in keysDown) {
               return;
            }

           keysDown[key.keyCode] = true;

           if (typeof keyToKey[key.keyCode] !== 'undefined') {
                key_pressed = keyToKey[key.keyCode].replace('l', qwerty_octave).replace('u', (parseInt(qwerty_octave, 10) + 1).toString());
                qh.keyDown(key_pressed, getFrequency(key_pressed));

                el = document.getElementById(key_pressed);
                lightenUp.call(el);
           }
       };

        var keyboardUp = function (key) {
            var el,
                key_pressed;

            delete keysDown[key.keyCode];

            if (typeof keyToKey[key.keyCode] !== 'undefined') {
                key_pressed = keyToKey[key.keyCode].replace('l', qwerty_octave).replace('u', (parseInt(qwerty_octave, 10) + 1).toString());
                qh.keyUp(key_pressed, getFrequency(key_pressed));

                el = document.getElementById(key_pressed);
                darkenDown.call(el);
            }
        };

       window.onkeydown = keyboardDown;
       window.onkeyup = keyboardUp;

       return qh;
    };

    window.QwertyHancock = QwertyHancock;

})(window);