import { QwertyHancock } from '../src/index';
import { jest } from '@jest/globals';

/**
 * Helper to simulate a keyboard key press using event.key
 */
function pressKey(
  key: string,
  options: { metaKey?: boolean; ctrlKey?: boolean; altKey?: boolean } = {}
): void {
  const event = new KeyboardEvent('keydown', {
    key,
    metaKey: options.metaKey || false,
    ctrlKey: options.ctrlKey || false,
    altKey: options.altKey || false,
    bubbles: true,
    cancelable: true,
  });
  window.dispatchEvent(event);
}

/**
 * Helper to simulate a keyboard key release
 */
function releaseKey(key: string): void {
  const event = new KeyboardEvent('keyup', {
    key,
    bubbles: true,
    cancelable: true,
  });
  window.dispatchEvent(event);
}

describe('Qwerty Hancock', () => {
  let element: HTMLElement | null;
  let keyboard: QwertyHancock;

  beforeEach(() => {
    element = document.getElementById('keyboard');
    keyboard = new QwertyHancock({
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
    // Destroy keyboard to clean up event listeners
    keyboard.destroy();

    // Clean up any existing keyboard elements
    const keyboards = document.querySelectorAll('#keyboard');
    keyboards.forEach((kb) => {
      if (kb && kb.parentNode) {
        kb.parentNode.removeChild(kb);
      }
    });

    // Create a fresh keyboard element
    const newKeyboard = document.createElement('div');
    newKeyboard.id = 'keyboard';
    document.body.appendChild(newKeyboard);
  });

  describe('Initialization', () => {
    it('creates keyboard without any user settings', () => {
      const qh = new QwertyHancock();
      element = document.getElementById('keyboard');

      expect(element?.id).toBe('keyboard');
      expect(element?.querySelectorAll('li').length).toBeGreaterThan(0);

      qh.destroy();
    });

    it('creates keyboard with user specified dimensions', () => {
      const qh = new QwertyHancock({ width: 500, height: 300 });
      element = document.getElementById('keyboard');

      expect(parseInt(element?.style.width || '0', 10)).toBe(500);
      expect(parseInt(element?.style.height || '0', 10)).toBe(300);

      qh.destroy();
    });

    it('uses element dimensions when not specified', () => {
      if (!element) return;

      element.style.width = '200px';
      element.style.height = '100px';

      const qh = new QwertyHancock();
      element = document.getElementById('keyboard');

      const keyboardElement = element?.querySelector('ul');
      expect(parseInt(keyboardElement?.style.width || '0', 10)).toBe(200);
      expect(parseInt(keyboardElement?.style.height || '0', 10)).toBe(100);

      qh.destroy();
    });
  });

  describe('Key Colors', () => {
    it('white keys are white by default', () => {
      const qh = new QwertyHancock();
      element = document.getElementById('keyboard');
      const whiteKeys = element?.querySelectorAll<HTMLElement>('li[data-note-type="white"]');

      whiteKeys?.forEach((key) => {
        expect(key.style.backgroundColor).toBe('rgb(255, 255, 255)');
      });

      qh.destroy();
    });

    it('black keys are black by default', () => {
      const qh = new QwertyHancock();
      element = document.getElementById('keyboard');
      const blackKeys = element?.querySelectorAll<HTMLElement>('li[data-note-type="black"]');

      blackKeys?.forEach((key) => {
        expect(key.style.backgroundColor).toBe('rgb(0, 0, 0)');
      });

      qh.destroy();
    });

    it('white keys use user defined colour', () => {
      const qh = new QwertyHancock({ whiteKeyColour: '#333' });
      element = document.getElementById('keyboard');
      const whiteKeys = element?.querySelectorAll<HTMLElement>('li[data-note-type="white"]');

      whiteKeys?.forEach((key) => {
        expect(key.style.backgroundColor).toBe('rgb(51, 51, 51)');
      });

      qh.destroy();
    });

    it('black keys use user defined colour', () => {
      const qh = new QwertyHancock({ blackKeyColour: 'red' });
      element = document.getElementById('keyboard');
      const blackKeys = element?.querySelectorAll<HTMLElement>('li[data-note-type="black"]');

      blackKeys?.forEach((key) => {
        expect(key.style.backgroundColor).toBe('red');
      });

      qh.destroy();
    });
  });

  describe('Start Note', () => {
    it('first key is user defined note', () => {
      const qh = new QwertyHancock({ startNote: 'C4' });
      element = document.getElementById('keyboard');
      const firstWhiteKey = element?.querySelector<HTMLElement>('li[data-note-type="white"]');

      expect(firstWhiteKey?.id).toBe('C4');

      qh.destroy();
    });
  });

  describe('Keyboard Input', () => {
    it('key changes colour when pressed via computer keyboard', () => {
      const qh = new QwertyHancock({ startNote: 'C4' });
      element = document.getElementById('keyboard');

      // Press 'a' key which maps to C in lower octave
      pressKey('a');

      const c4Key = element?.querySelector<HTMLElement>('#C4');
      expect(c4Key?.style.backgroundColor).toBe('yellow');

      releaseKey('a');
      qh.destroy();
    });

    it('modifier keys do not trigger note', () => {
      const qh = new QwertyHancock({ startNote: 'C4' });
      element = document.getElementById('keyboard');

      // Press 's' key with meta modifier (Cmd+S on Mac)
      pressKey('s', { metaKey: true });

      const d4Key = element?.querySelector<HTMLElement>('#D4');
      expect(d4Key?.style.backgroundColor).not.toBe('yellow');
      expect(d4Key?.style.backgroundColor).toBe('rgb(255, 255, 255)');

      qh.destroy();
    });

    it('calls keyDown callback with note and frequency', () => {
      const qh = new QwertyHancock({ startNote: 'C4' });
      const keyDownMock = jest.fn();
      qh.keyDown = keyDownMock;

      pressKey('a');

      expect(keyDownMock).toHaveBeenCalledWith('C4', expect.any(Number));
      expect(keyDownMock.mock.calls[0][1]).toBeCloseTo(261.63, 0); // C4 frequency

      releaseKey('a');
      qh.destroy();
    });

    it('calls keyUp callback with note and frequency', () => {
      const qh = new QwertyHancock({ startNote: 'C4' });
      const keyUpMock = jest.fn();
      qh.keyUp = keyUpMock;

      pressKey('a');
      releaseKey('a');

      expect(keyUpMock).toHaveBeenCalledWith('C4', expect.any(Number));

      qh.destroy();
    });
  });

  describe('Octave Control', () => {
    it('setKeyOctave sets the octave', () => {
      expect(keyboard.setKeyOctave(5)).toBe(5);
      expect(keyboard.getKeyOctave()).toBe(5);
    });

    it('keyOctaveUp increments octave', () => {
      const initial = keyboard.getKeyOctave();
      expect(keyboard.keyOctaveUp()).toBe(initial + 1);
    });

    it('keyOctaveDown decrements octave', () => {
      const initial = keyboard.getKeyOctave();
      expect(keyboard.keyOctaveDown()).toBe(initial - 1);
    });
  });

  describe('Key Map', () => {
    it('getKeyMap returns the key map', () => {
      const keyMap = keyboard.getKeyMap();
      expect(keyMap).toBeDefined();
      expect(keyMap['a']).toBe('Cl');
    });

    it('setKeyMap updates the key map', () => {
      const newKeyMap = { q: 'Cl', w: 'Dl' };
      const result = keyboard.setKeyMap(newKeyMap);
      expect(result).toEqual(newKeyMap);
      expect(keyboard.getKeyMap()).toEqual(newKeyMap);
    });
  });

  describe('Cleanup', () => {
    it('destroy removes event listeners', () => {
      const qh = new QwertyHancock({ startNote: 'C4' });
      const keyDownMock = jest.fn();
      qh.keyDown = keyDownMock;

      qh.destroy();

      // After destroy, key press should not trigger callback
      pressKey('a');
      expect(keyDownMock).not.toHaveBeenCalled();
    });
  });

  describe('Version', () => {
    it('exposes version string', () => {
      expect(keyboard.version).toBe('1.0.0');
    });
  });
});
