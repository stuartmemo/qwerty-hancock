describe('Qwerty Hancock tests', function () {
    'use strict';

    var element;

    beforeEach(function () {
        element = document.createElement('div');
        element.id = 'keyboard';
        document.body.appendChild(element);
    });

    it('Can create keyboard without any user settings', function () {
        var qh = new QwertyHancock();

        expect(element.id).toBe('keyboard');
        expect(element.querySelectorAll('li').length).toBeGreaterThan(0);
    });

    it('Can create keyboard with user specified dimensions', function () {
        var qh = new QwertyHancock({width: 500, height: 300});

        expect(element.offsetWidth).toBe(500);
        expect(element.offsetHeight).toBe(300);
    });

    it('Keyboard without specified dimensions uses element dimensions', function () {
        var qh;

        element.style.width = '200px';
        element.style.height = '100px';

        qh = new QwertyHancock(); 

        expect(element.querySelector('ul').style.width).toBe(element.style.width);
        expect(element.querySelector('ul').style.height).toBe(element.style.height);
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

    it('When user presses key on computer keyboard, related keyboard key should change colour', function () {
        var qh = new QwertyHancock(),
            c4_key = document.querySelector('#C4');

        pressKey(65);

        expect(c4_key.style.backgroundColor).toBe('yellow');
    });

    afterEach(function () {
        document.body.removeChild(element);
    });
});
