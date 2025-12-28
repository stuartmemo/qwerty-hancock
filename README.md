# Qwerty Hancock

Need an instant musical keyboard for your web audio project? Qwerty Hancock is just the thing.

Specify the number of octaves you want, give it a height and a width, then you're ready to use your mouse or keyboard to have the time of your life.

For a demo, and to see how else you can customise your keyboard, visit the [Qwerty Hancock homepage](http://stuartmemo.com/qwerty-hancock).

## Installation

```bash
npm install qwerty-hancock
```

## Usage

### ES Modules (Recommended)

```typescript
import { QwertyHancock } from 'qwerty-hancock';

const keyboard = new QwertyHancock({
  id: 'keyboard',
  width: 600,
  height: 150,
  octaves: 2,
  startNote: 'A3',
  whiteKeyColour: '#fff',
  blackKeyColour: '#000',
  activeColour: 'yellow',
});

keyboard.keyDown = (note, frequency) => {
  console.log(`Note: ${note}, Frequency: ${frequency}Hz`);
};

keyboard.keyUp = (note, frequency) => {
  console.log(`Released: ${note}`);
};
```

### CommonJS

```javascript
const { QwertyHancock } = require('qwerty-hancock');

const keyboard = new QwertyHancock({
  id: 'keyboard',
  octaves: 2,
});
```

### Script Tag (UMD)

```html
<script src="https://unpkg.com/qwerty-hancock/dist/index.umd.min.js"></script>
<script>
  const keyboard = new QwertyHancock.QwertyHancock({
    id: 'keyboard',
    octaves: 2,
  });
</script>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | string | `'keyboard'` | ID of the container element |
| `width` | number | `600` | Width in pixels |
| `height` | number | `150` | Height in pixels |
| `octaves` | number | `3` | Number of octaves to display |
| `startNote` | string | `'A3'` | First note (note + octave) |
| `whiteKeyColour` | string | `'#fff'` | Color of white keys |
| `blackKeyColour` | string | `'#000'` | Color of black keys |
| `activeColour` | string | `'yellow'` | Color when key is pressed |
| `borderColour` | string | `'#000'` | Color of key borders |
| `keyboardLayout` | string | `'en'` | Keyboard layout (`'en'` or `'de'`) |
| `musicalTyping` | boolean | `true` | Enable computer keyboard input |

## API

### Callbacks

```typescript
keyboard.keyDown = (note: string, frequency: number) => void;
keyboard.keyUp = (note: string, frequency: number) => void;
```

### Methods

```typescript
keyboard.setKeyOctave(octave: number): number;  // Set keyboard input octave
keyboard.getKeyOctave(): number;                 // Get current octave
keyboard.keyOctaveUp(): number;                  // Increment octave
keyboard.keyOctaveDown(): number;                // Decrement octave
keyboard.getKeyMap(): KeyMap;                    // Get keyboard-to-note mapping
keyboard.setKeyMap(keyMap: KeyMap): KeyMap;      // Set custom key mapping
keyboard.destroy(): void;                        // Clean up event listeners
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import { QwertyHancock } from 'qwerty-hancock';
import type { QwertyHancockSettings, NoteCallback, KeyMap } from 'qwerty-hancock';

const settings: QwertyHancockSettings = {
  id: 'keyboard',
  octaves: 2,
};

const keyboard = new QwertyHancock(settings);
```

## Browser Support

Supports all modern browsers (ES2020+):
- Chrome 80+
- Firefox 74+
- Safari 14+
- Edge 80+

## License

MIT License - Copyright 2012-2025 Stuart Memo
