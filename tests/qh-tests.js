const { pressKey } = require('../lib/key-simulator');
const QwertyHancock = require('../src/qwerty-hancock');

describe('Qwerty Hancock tests', () => {
  'use strict';

  let element;
  let qh;

  beforeEach(() => {
    element = document.getElementById('keyboard');
    qh = new QwertyHancock({
      id: 'keyboard',
      width: 200,
      height: 100,
      startNote: 'A3',
      whiteKeyColour: 'rgb(255, 255, 255)',
      blackKeyColour: 'rgb(0, 0, 0)',
      activeColour: 'yellow',
    });
  });

  afterEach(() => {
    // Clean up any existing keyboard elements
    const keyboards = document.querySelectorAll('#keyboard');
    keyboards.forEach((keyboard) => {
      if (keyboard && keyboard.parentNode) {
        keyboard.parentNode.removeChild(keyboard);
      }
    });
    // Create a fresh keyboard element
    const newKeyboard = document.createElement('div');
    newKeyboard.id = 'keyboard';
    document.body.appendChild(newKeyboard);
  });

  it('Can create keyboard without any user settings', () => {
    const qh = new QwertyHancock();
    element = document.getElementById('keyboard');

    expect(element.id).toBe('keyboard');
    expect(element.querySelectorAll('li').length).toBeGreaterThan(0);
  });

  it('Can create keyboard with user specified dimensions', () => {
    const qh = new QwertyHancock({ width: 500, height: 300 });
    element = document.getElementById('keyboard');

    expect(parseInt(element.style.width)).toBe(500);
    expect(parseInt(element.style.height)).toBe(300);
  });

  it('Keyboard without specified dimensions uses element dimensions', () => {
    // Set dimensions before creating keyboard
    element.style.width = '200px';
    element.style.height = '100px';

    const qh = new QwertyHancock();
    element = document.getElementById('keyboard');

    const keyboardElement = element.querySelector('ul');
    expect(parseInt(keyboardElement.style.width)).toBe(200);
    expect(parseInt(keyboardElement.style.height)).toBe(100);
  });

  it('White keys should be white by default', () => {
    const qh = new QwertyHancock();
    element = document.getElementById('keyboard');
    const white_keys = element.querySelectorAll('li[data-note-type="white"]');

    white_keys.forEach((key) => {
      expect(key.style.backgroundColor).toBe('rgb(255, 255, 255)');
    });
  });

  it('Black keys should be black by default', () => {
    const qh = new QwertyHancock();
    element = document.getElementById('keyboard');
    const black_keys = element.querySelectorAll('li[data-note-type="black"]');

    black_keys.forEach((key) => {
      expect(key.style.backgroundColor).toBe('rgb(0, 0, 0)');
    });
  });

  it('White keys should be user defined colour', () => {
    const qh = new QwertyHancock({ whiteKeyColour: '#333' });
    element = document.getElementById('keyboard');
    const white_keys = element.querySelectorAll('li[data-note-type="white"]');

    white_keys.forEach((key) => {
      expect(key.style.backgroundColor).toBe('rgb(51, 51, 51)');
    });
  });

  it('Black keys should be user defined colour', () => {
    const qh = new QwertyHancock({ blackKeyColour: 'red' });
    element = document.getElementById('keyboard');
    const black_keys = element.querySelectorAll('li[data-note-type="black"]');

    black_keys.forEach((key) => {
      expect(key.style.backgroundColor).toBe('red');
    });
  });

  it('First key on keyboard should be user defined note', () => {
    const qh = new QwertyHancock({ startNote: 'C4' });
    element = document.getElementById('keyboard');
    const first_white_key = element.querySelector('li[data-note-type="white"]');

    expect(first_white_key.id).toBe('C4');
  });

  it('When user presses key on computer keyboard, related keyboard key should change colour', () => {
    const qh = new QwertyHancock();
    element = document.getElementById('keyboard');

    // Set up keyboard callbacks
    qh.keyDown = (note) => {
      const el = document.getElementById(note);
      el.style.backgroundColor = 'yellow';
    };
    qh.keyUp = (note) => {
      const el = document.getElementById(note);
      el.style.backgroundColor = 'rgb(255, 255, 255)';
    };

    // Press key and wait for event to be processed
    pressKey(65);
    const c4_key = element.querySelector('#C4');
    expect(c4_key.style.backgroundColor).toBe('yellow');
  });

  it('When user presses modifier key on computer keyboard, related keyboard key should not change colour', () => {
    const qh = new QwertyHancock();
    element = document.getElementById('keyboard');

    // Set up keyboard callbacks
    qh.keyDown = (note) => {
      const el = document.getElementById(note);
      el.style.backgroundColor = 'yellow';
    };
    qh.keyUp = (note) => {
      const el = document.getElementById(note);
      el.style.backgroundColor = 'rgb(255, 255, 255)';
    };

    // Press key with modifier
    pressKey(83, { metaKey: true });
    const d4_key = element.querySelector('#D4');
    expect(d4_key.style.backgroundColor).not.toBe('yellow');
    expect(d4_key.style.backgroundColor).toBe('rgb(255, 255, 255)');
  });

  // Add key simulation helper
  function pressKey(keyCode, options = {}) {
    const event = new window.KeyboardEvent('keydown', {
      keyCode: keyCode,
      metaKey: options.metaKey || false,
      ctrlKey: options.ctrlKey || false,
      altKey: options.altKey || false,
      shiftKey: options.shiftKey || false,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
  }
});
