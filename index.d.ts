/**
 * Declaration for typed.js-extra
 * Typed.js version: v2.0.12
 */

declare module 'typed.js-extra' {
  export interface TypedOptions {
    /**
     * Strings to be typed.
     */
    strings?: string[];
    /**
     * ID or instance of HTML element containing string children.
     */
    stringsElement?: string | Element;
    /**
     * Type speed in milliseconds.
     */
    typeSpeed?: number;
    /**
     * Time before typing starts in milliseconds.
     */
    startDelay?: number;
    /**
     * Backspacing speed in milliseconds.
     */
    backSpeed?: number;
    /**
     * Only backspace what doesn't match the previous string.
     */
    smartBackspace?: boolean;
    /**
     * Shuffle the strings.
     */
    shuffle?: boolean;
    /**
     * Time before backspacing in milliseconds.
     */
    backDelay?: number;
    /**
     * Fade out instead of backspace.
     */
    fadeOut?: boolean;
    /**
     * CSS class for fade animation.
     */
    fadeOutClass?: string;
    /**
     * Fade out delay in milliseconds.
     */
    fadeOutDelay?: number;
    /**
     * Loop strings.
     */
    loop?: boolean;
    /**
     * Amount of loops.
     */
    loopCount?: number;
    /**
     * Show the cursor.
     */
    showCursor?: boolean;
    /**
     * Character for the cursor.
     */
    cursorChar?: string;
    /**
     * Insert CSS for cursor and fadeOut into the DOM.
     */
    autoInsertCss?: boolean;
    /**
     * Attribute for typing (e.g., placeholder, value, etc.)
     */
    attr?: string;
    /**
     * Bind to focus and blur if the element is a text input.
     */
    bindInputFocusEvents?: boolean;
    /**
     * 'html' or 'null' for plaintext.
     */
    contentType?: string;

    // --------------------------------------
    // Original Callbacks
    // --------------------------------------

    /**
     * All typing is complete.
     */
    onComplete?(self: Typed): void;

    /**
     * Before each string is typed.
     */
    preStringTyped?(arrayPos: number, self: Typed): void;

    /**
     * After each string is typed.
     */
    onStringTyped?(arrayPos: number, self: Typed): void;

    /**
     * During looping, after last string is typed.
     */
    onLastStringBackspaced?(self: Typed): void;

    /**
     * Typing has been stopped (paused).
     */
    onTypingPaused?(arrayPos: number, self: Typed): void;

    /**
     * Typing has resumed after being stopped.
     */
    onTypingResumed?(arrayPos: number, self: Typed): void;

    /**
     * After reset.
     */
    onReset?(self: Typed): void;

    /**
     * After stop.
     */
    onStop?(arrayPos: number, self: Typed): void;

    /**
     * After start.
     */
    onStart?(arrayPos: number, self: Typed): void;

    /**
     * After destroy.
     */
    onDestroy?(self: Typed): void;

    /**
     * Before typing starts.
     */
    onBegin?(self: Typed): void;

    // --------------------------------------
    // New Callbacks in This Fork
    // --------------------------------------

    /**
     * After a character has been appended.
     */
    onCharAppended?: (char: string, self: Typed) => void;

    /**
     * After a character has been removed.
     */
    onCharRemoved?: (char: string, self: Typed) => void;
  }

  export default class Typed {
    constructor(elementId: string | Element, options: TypedOptions);

    /**
     * Toggle start/stop.
     */
    toggle(): void;

    /**
     * Stop typing/backspacing.
     */
    stop(): void;

    /**
     * Resume typing/backspacing.
     */
    start(): void;

    /**
     * Destroy the instance.
     */
    destroy(): void;

    /**
     * Reset and optionally restart the typing.
     */
    reset(restart?: boolean): void;
  }
}
