/*
 * Qwerty Hancock keyboard library v0.1
 * Copyright 2012, Stuart Memo
 * 
 * Licensed under the MIT License
 * http://opensource.org/licenses/mit-license.php
 *
 */

var qwertyHancock = function (id, width, height, octaves, hoverColour) {
    var numberOfOctaves = octaves || 3,
        totalWhiteKeys = numberOfOctaves * 7,
        keyboardWidth = width || 600,
        keyboardHeight = height || 150,
        keyboardHoverColour = hoverColour || '#076cf0',
        whiteKeyWidth = keyboardWidth / totalWhiteKeys,
        blackKeyWidth = whiteKeyWidth / 2,
        paper = new Raphael(id, keyboardWidth, keyboardHeight),
        notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'], 
        notesWithSharps = ['A', 'C', 'D', 'F', 'G'], 
        noteCounter = 0;

   for (var i = 0; i < totalWhiteKeys; i++) {
        if ((i % notes.length) === 0) {
            noteCounter = 0;
        }

        paper.rect(whiteKeyWidth * i, 0, whiteKeyWidth, keyboardHeight).attr({'title': notes[noteCounter], fill: 'white'}).mousedown(function () {
            this.attr({fill: keyboardHoverColour});
        }).mouseover(function () {
            this.attr({fill: keyboardHoverColour});
        }).mouseup(function () {
            this.attr({fill: 'white'});   
        }).mouseout(function () {
            this.attr({fill: 'white'});   
        });

        noteCounter++;
   }

   for (i = 0; i < totalWhiteKeys; i++) {
        if ((i % notes.length) === 0) {
            noteCounter = 0;
        }
        for (var j = 0; j < notesWithSharps.length; j++) {
            if (notes[noteCounter] === notesWithSharps[j]) { 
                // Don't draw last black note
                if ((whiteKeyWidth * (i + 1)) < keyboardWidth) {
                    paper.rect((whiteKeyWidth * i) + (blackKeyWidth * 1.5) , 0, blackKeyWidth, (keyboardHeight / 3)* 2).attr({title: notes[noteCounter] + '#', fill: 'black'});
                }
            }
        }
        noteCounter++;
   }
};
