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
export declare function applyStyles(element: HTMLElement, styles: StyleProperties): void;
/**
 * Get styles for the keyboard container element.
 *
 * @param settings - Resolved keyboard settings
 * @returns Style properties for the container
 */
export declare function getContainerStyles(settings: ResolvedSettings): StyleProperties;
/**
 * Get styles for the keyboard list element.
 *
 * @param settings - Resolved keyboard settings
 * @returns Style properties for the keyboard list
 */
export declare function getKeyboardStyles(settings: ResolvedSettings): StyleProperties;
/**
 * Get styles for a white key.
 *
 * @param settings - Resolved keyboard settings
 * @param width - Width of the key in pixels
 * @param isLastKey - Whether this is the last key (affects border)
 * @returns Style properties for the white key
 */
export declare function getWhiteKeyStyles(settings: ResolvedSettings, width: number, isLastKey: boolean): StyleProperties;
/**
 * Get styles for a black key.
 *
 * @param settings - Resolved keyboard settings
 * @param width - Width of the key in pixels
 * @param leftPosition - Left offset in pixels
 * @returns Style properties for the black key
 */
export declare function getBlackKeyStyles(settings: ResolvedSettings, width: number, leftPosition: number): StyleProperties;
/**
 * Highlight a key with the active color.
 *
 * @param element - The key element to highlight
 * @param activeColour - The color to use for highlighting
 */
export declare function lightenUp(element: HTMLElement | null, activeColour: string): void;
/**
 * Restore a key to its original color.
 *
 * @param element - The key element to restore
 * @param settings - Resolved keyboard settings
 */
export declare function darkenDown(element: HTMLElement | null, settings: ResolvedSettings): void;
