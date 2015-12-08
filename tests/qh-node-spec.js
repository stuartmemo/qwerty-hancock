/* jshint browser: true, jasmine: true, node: true */
'use strict';

var testDom = require('./helpers/test-dom');

describe('QwertyHancock', function () {
    var element, QwertyHancock;

    beforeEach(function () {
        testDom('<html><body></body></html>');
        element = document.createElement('div');
        element.id = 'keyboard';
        document.body.appendChild(element);
        QwertyHancock = require('../src/qwerty-hancock');
    });

    it('is node requirable', function () {
        expect(QwertyHancock).toExist;
    });

    it('Can create keyboard without any user settings', function () {
        var qh = new QwertyHancock();

        expect(element.id).toBe('keyboard');
        expect(element.querySelectorAll('li').length).toBeGreaterThan(0);
    });

    it('Can create keyboard with user specified dimensions', function () {
        var qh = new QwertyHancock({width: 500, height: 300});

        expect(element.style.width).toBe('500px');
        expect(element.style.height).toBe('300px');
    });

    it('White keys should be white by default', function () {
        var qh = new QwertyHancock(),
        white_keys = element.querySelectorAll('li[data-note-type="white"]');

        for (var i = 0; i < white_keys.length; i++) {
            expect(white_keys[i].style.backgroundColor).toBe('rgb(255, 255, 255)');
        }
    });

    it('Black keys should be black by default', function () {
        var qh = new QwertyHancock(),
        black_keys = element.querySelectorAll('li[data-note-type="black"]');

        for (var i = 0; i < black_keys.length; i++) {
            expect(black_keys[i].style.backgroundColor).toBe('rgb(0, 0, 0)');
        }
    });

    it('White keys should be user defined colour', function () {
        var qh = new QwertyHancock({whiteKeyColour: '#333'}),
        white_keys = element.querySelectorAll('li[data-note-type="white"]');

        for (var i = 0; i < white_keys.length; i++) {
            expect(white_keys[i].style.backgroundColor).toBe('rgb(51, 51, 51)');
        }
    });

    it('Black keys should be user defined colour', function () {
        var qh = new QwertyHancock({blackKeyColour: 'red'}),
        black_keys = element.querySelectorAll('li[data-note-type="black"]');

        for (var i = 0; i < black_keys.length; i++) {
            expect(black_keys[i].style.backgroundColor).toBe('red');
        }
    });

    it('First key on keyboard should be user defined note', function () {
        var qh = new QwertyHancock({startNote: 'C4'}),
        first_white_key = element.querySelector('li[data-note-type="white"]');

        expect(first_white_key.id).toBe('C4');
    });

    afterEach(function () {
        document.body.removeChild(element);
        delete global.document;
        delete global.window;
    });
});
