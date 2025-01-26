/* jshint browser: true, jest: true, node: true */
'use strict';

const testDom = require('./helpers/test-dom');
const QwertyHancock = require('../src/qwerty-hancock');

describe('QwertyHancock', () => {
  let element;

  beforeEach(() => {
    testDom('<html><body></body></html>');
    element = document.createElement('div');
    element.id = 'keyboard';
    document.body.appendChild(element);
  });

  it('is node requirable', () => {
    expect(QwertyHancock).toBeDefined();
  });

  it('Can create keyboard without any user settings', () => {
    const qh = new QwertyHancock();

    expect(element.id).toBe('keyboard');
    expect(element.querySelectorAll('li').length).toBeGreaterThan(0);
  });

  it('Can create keyboard with user specified dimensions', () => {
    const qh = new QwertyHancock({ width: 500, height: 300 });

    expect(element.style.width).toBe('500px');
    expect(element.style.height).toBe('300px');
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
    const qh = new QwertyHancock({ whiteKeyColour: '#333' });
    const white_keys = element.querySelectorAll('li[data-note-type="white"]');

    white_keys.forEach((key) => {
      expect(key.style.backgroundColor).toBe('rgb(51, 51, 51)');
    });
  });

  it('Black keys should be user defined colour', () => {
    const qh = new QwertyHancock({ blackKeyColour: 'red' });
    const black_keys = element.querySelectorAll('li[data-note-type="black"]');

    black_keys.forEach((key) => {
      expect(key.style.backgroundColor).toBe('red');
    });
  });

  it('First key on keyboard should be user defined note', () => {
    const qh = new QwertyHancock({ startNote: 'C4' });
    const first_white_key = element.querySelector('li[data-note-type="white"]');

    expect(first_white_key.id).toBe('C4');
  });

  afterEach(() => {
    document.body.removeChild(element);
    delete global.document;
    delete global.window;
  });
});
