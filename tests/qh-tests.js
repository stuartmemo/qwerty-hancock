'use strict';

describe('Qwerty Hancock tests', function () {
    var element;

    beforeEach(function () {
        element = document.createElement('div');
        element.id = 'keyboard';
        document.body.appendChild(element);
    });

    it('Can create keyboard without any user settings', function () {
        var qh = new QwertyHancock();

        expect(element.id).toBe('keyboard');
        expect(element.offsetWidth).toBe(600);
        expect(element.offsetHeight).toBe(150);
        expect(element.querySelector('ul').offsetWidth).toBe(600);
        expect(element.querySelector('ul').offsetHeight).toBe(150);
    });

    it('Can create keyboard with user specified dimensions', function () {
        var qh = new QwertyHancock({width: 500, height: 300});

        expect(element.offsetWidth).toBe(500);
        expect(element.offsetHeight).toBe(300);
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

    afterEach(function () {
        document.body.removeChild(element);
    });
});
