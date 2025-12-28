import type { ResolvedSettings } from './types';

/**
 * Style properties that can be applied to elements
 */
export interface StyleProperties {
  backgroundColor?: string;
  border?: string;
  borderRight?: string;
  height?: string;
  width?: string;
  borderRadius?: string;
  position?: string;
  zIndex?: string;
  boxSizing?: string;
  display?: string;
  left?: string;
  cursor?: string;
  fontSize?: string;
  padding?: string;
  listStyle?: string;
  margin?: string;
  userSelect?: string;
}

/**
 * Apply style properties to an HTML element.
 *
 * @param element - The element to style
 * @param styles - Object containing CSS properties to apply
 */
export function applyStyles(element: HTMLElement, styles: StyleProperties): void {
  Object.assign(element.style, styles);
  // Handle vendor prefixes for user-select
  if (styles.userSelect !== undefined) {
    (element.style as unknown as Record<string, string>)['-webkit-user-select'] = styles.userSelect;
  }
}

/**
 * Get styles for the keyboard container element.
 *
 * @param settings - Resolved keyboard settings
 * @returns Style properties for the container
 */
export function getContainerStyles(settings: ResolvedSettings): StyleProperties {
  return {
    width: `${settings.width}px`,
    height: `${settings.height}px`,
    display: 'block',
    position: 'relative',
    boxSizing: 'content-box',
  };
}

/**
 * Get styles for the keyboard list element.
 *
 * @param settings - Resolved keyboard settings
 * @returns Style properties for the keyboard list
 */
export function getKeyboardStyles(settings: ResolvedSettings): StyleProperties {
  return {
    cursor: 'default',
    fontSize: '0px',
    height: `${settings.height}px`,
    width: `${settings.width}px`,
    padding: '0',
    position: 'relative',
    listStyle: 'none',
    margin: typeof settings.margin === 'number' ? `${settings.margin}px` : settings.margin as string,
    boxSizing: 'content-box',
    userSelect: 'none',
  };
}

/**
 * Get styles for a white key.
 *
 * @param settings - Resolved keyboard settings
 * @param width - Width of the key in pixels
 * @param isLastKey - Whether this is the last key (affects border)
 * @returns Style properties for the white key
 */
export function getWhiteKeyStyles(
  settings: ResolvedSettings,
  width: number,
  isLastKey: boolean
): StyleProperties {
  return {
    backgroundColor: settings.whiteKeyColour,
    border: `1px solid ${settings.borderColour}`,
    borderRight: isLastKey ? `1px solid ${settings.borderColour}` : '0',
    height: `${settings.height}px`,
    width: `${width}px`,
    borderRadius: '0 0 5px 5px',
    position: 'relative',
    zIndex: '1',
    boxSizing: 'content-box',
    display: 'inline-block',
    userSelect: 'none',
  };
}

/**
 * Get styles for a black key.
 *
 * @param settings - Resolved keyboard settings
 * @param width - Width of the key in pixels
 * @param leftPosition - Left offset in pixels
 * @returns Style properties for the black key
 */
export function getBlackKeyStyles(
  settings: ResolvedSettings,
  width: number,
  leftPosition: number
): StyleProperties {
  return {
    backgroundColor: settings.blackKeyColour,
    border: `1px solid ${settings.borderColour}`,
    position: 'absolute',
    left: `${leftPosition}px`,
    width: `${width}px`,
    height: `${Math.floor(settings.height / 1.5)}px`,
    borderRadius: '0 0 3px 3px',
    zIndex: '2',
    boxSizing: 'content-box',
    display: 'inline-block',
    userSelect: 'none',
  };
}

/**
 * Highlight a key with the active color.
 *
 * @param element - The key element to highlight
 * @param activeColour - The color to use for highlighting
 */
export function lightenUp(element: HTMLElement | null, activeColour: string): void {
  if (element) {
    element.style.backgroundColor = activeColour;
  }
}

/**
 * Restore a key to its original color.
 *
 * @param element - The key element to restore
 * @param settings - Resolved keyboard settings
 */
export function darkenDown(element: HTMLElement | null, settings: ResolvedSettings): void {
  if (element) {
    const noteType = element.getAttribute('data-note-type');
    element.style.backgroundColor =
      noteType === 'white' ? settings.whiteKeyColour : settings.blackKeyColour;
  }
}
