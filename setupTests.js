const { JSDOM } = require('jsdom');

// Create DOM with initial keyboard element and styles
const dom = new JSDOM(
  `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        #keyboard {
          width: 200px;
          height: 100px;
          display: block;
          position: relative;
        }
      </style>
    </head>
    <body>
      <div id="keyboard"></div>
    </body>
  </html>
`,
  {
    pretendToBeVisual: true,
    runScripts: 'dangerously',
    resources: 'usable',
  }
);

// Set up globals
global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;

// Mock offsetWidth/offsetHeight since JSDOM doesn't implement them
Object.defineProperties(HTMLElement.prototype, {
  offsetWidth: {
    get: function () {
      const computedStyle = window.getComputedStyle(this);
      const width = computedStyle.width;
      return width ? parseInt(width) : 0;
    },
  },
  offsetHeight: {
    get: function () {
      const computedStyle = window.getComputedStyle(this);
      const height = computedStyle.height;
      return height ? parseInt(height) : 0;
    },
  },
});

// Mock getComputedStyle
global.window.getComputedStyle = function (element) {
  if (!element) return {};

  const style = element.style || {};
  const computedStyle = {
    getPropertyValue: function (prop) {
      if (element.id === 'keyboard') {
        // Default styles for keyboard element
        const defaults = {
          width: '200px',
          height: '100px',
          position: 'relative',
          display: 'block',
        };
        return style[prop] || defaults[prop] || '';
      }
      return style[prop] || '';
    },
  };

  // Add computed style properties
  ['width', 'height', 'backgroundColor', 'position', 'display'].forEach(
    (prop) => {
      Object.defineProperty(computedStyle, prop, {
        get: function () {
          if (element.id === 'keyboard') {
            // Default styles for keyboard element
            const defaults = {
              width: '200px',
              height: '100px',
              backgroundColor: '',
              position: 'relative',
              display: 'block',
            };
            return style[prop] || defaults[prop];
          }
          return style[prop] || '';
        },
      });
    }
  );

  return computedStyle;
};

// Mock KeyboardEvent if it doesn't exist
if (typeof dom.window.KeyboardEvent !== 'function') {
  dom.window.KeyboardEvent = class KeyboardEvent {
    constructor(type, init) {
      this.type = type;
      Object.assign(this, init);
      this.preventDefault = () => {};
      this.stopPropagation = () => {};
    }
  };
}
