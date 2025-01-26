describe('Qwerty Hancock tests', () => {
    'use strict';

    let element;

    beforeEach(() => {
        element = document.createElement('div');
        element.id = 'keyboard';
        document.body.appendChild(element);
    });

    it('Can create keyboard without any user settings', () => {
        const qh = new QwertyHancock();

        expect(element.id).toBe('keyboard');
        expect(element.querySelectorAll('li').length).toBeGreaterThan(0);
    });

    it('Can create keyboard with user specified dimensions', () => {
        const qh = new QwertyHancock({width: 500, height: 300});

        expect(element.offsetWidth).toBe(500);
        expect(element.offsetHeight).toBe(300);
    });

    it('Keyboard without specified dimensions uses element dimensions', () => {
        let qh;

        element.style.width = '200px';
        element.style.height = '100px';

        qh = new QwertyHancock();

        expect(element.querySelector('ul').style.width).toBe(element.style.width);
        expect(element.querySelector('ul').style.height).toBe(element.style.height);
    });

    it('White keys should be white by default', () => {
        const qh = new QwertyHancock();
        const white_keys = element.querySelectorAll('li[data-note-type="white"]');

        white_keys.forEach((key) => {
            expect(key.style.backgroundColor).toBe('rgb(255, 255, 255)');
        });
    });

    it('Black keys should be black by default', () => {
        const qh = new QwertyHancock();
        const black_keys = element.querySelectorAll('li[data-note-type="black"]');

        black_keys.forEach((key) => {
            expect(key.style.backgroundColor).toBe('rgb(0, 0, 0)');
        });
    });

    it('White keys should be user defined colour', () => {
        const qh = new QwertyHancock({whiteKeyColour: '#333'});
        const white_keys = element.querySelectorAll('li[data-note-type="white"]');

        white_keys.forEach((key) => {
            expect(key.style.backgroundColor).toBe('rgb(51, 51, 51)');
        });
    });

    it('Black keys should be user defined colour', () => {
        const qh = new QwertyHancock({blackKeyColour: 'red'});
        const black_keys = element.querySelectorAll('li[data-note-type="black"]');

        black_keys.forEach((key) => {
            expect(key.style.backgroundColor).toBe('red');
        });
    });

    it('First key on keyboard should be user defined note', () => {
        const qh = new QwertyHancock({startNote: 'C4'});
        const first_white_key = element.querySelector('li[data-note-type="white"]');

        expect(first_white_key.id).toBe('C4');
    });

    it('When user presses key on computer keyboard, related keyboard key should change colour', () => {
        const qh = new QwertyHancock();
        const c4_key = document.querySelector('#C4');

        pressKey(65);

        expect(c4_key.style.backgroundColor).toBe('yellow');
    });

    it('When user presses modifier key on computer keyboard, related keyboard key should not change colour', () => {
        const qh = new QwertyHancock();
        const d4_key = document.querySelector('#D4');

        pressKey(83, { metaKey: true });

        expect(d4_key.style.backgroundColor).not.toBe('yellow');
        expect(d4_key.style.backgroundColor).toBe('rgb(255, 255, 255)');
    });

    afterEach(() => {
        document.body.removeChild(element);
    });
});
