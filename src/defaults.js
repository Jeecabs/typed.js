/**
 * Defaults & options for Typed.js (Fork)
 * @typedef {Object} TypedOptions
 * @property {string[]} strings - Strings to be typed
 * @property {string|null} stringsElement - ID of element containing string children
 * @property {number} typeSpeed - Type speed in milliseconds
 * @property {number} startDelay - Time before typing starts in milliseconds
 * @property {number} backSpeed - Backspacing speed in milliseconds
 * @property {boolean} smartBackspace - Only backspace what doesn't match the previous string
 * @property {boolean} shuffle - Shuffle the strings
 * @property {number} backDelay - Time before backspacing in milliseconds
 * @property {boolean} fadeOut - Fade out instead of backspace
 * @property {string} fadeOutClass - CSS class for fade animation
 * @property {number} fadeOutDelay - Fade out delay in milliseconds
 * @property {boolean} loop - Loop strings
 * @property {number} loopCount - Amount of loops
 * @property {boolean} showCursor - Show cursor
 * @property {string} cursorChar - Character for cursor
 * @property {boolean} autoInsertCss - Insert CSS for cursor and fadeOut into HTML <head>
 * @property {string|null} attr - Attribute for typing (e.g., 'placeholder')
 * @property {boolean} bindInputFocusEvents - Bind to focus and blur if el is a text input
 * @property {('html'|'null')} contentType - 'html' or 'null' for plaintext
 * @property {function(Typed):void} onBegin - Before it begins typing
 * @property {function(Typed):void} onComplete - All typing is complete
 * @property {function(number, Typed):void} preStringTyped - Before each string is typed
 * @property {function(number, Typed):void} onStringTyped - After each string is typed
 * @property {function(Typed):void} onLastStringBackspaced - During looping, after last string is typed
 * @property {function(number, Typed):void} onTypingPaused - Typing has been stopped
 * @property {function(number, Typed):void} onTypingResumed - Typing has started after being stopped
 * @property {function(Typed):void} onReset - After reset
 * @property {function(number, Typed):void} onStop - After stop
 * @property {function(number, Typed):void} onStart - After start
 * @property {function(Typed):void} onDestroy - After destroy
 * @property {function(string, Typed):void} onCharAppended - After a character has been appended
 * @property {function(string, Typed):void} onCharRemoved - After a character has been removed
 */

/** @type {TypedOptions} */
const defaults = {
  strings: [
    'These are the default values...',
    'You know what you should do?',
    'Use your own!',
    'Have a great day!'
  ],
  stringsElement: null,
  typeSpeed: 0,
  startDelay: 0,
  backSpeed: 0,
  smartBackspace: true,
  shuffle: false,
  backDelay: 700,
  fadeOut: false,
  fadeOutClass: 'typed-fade-out',
  fadeOutDelay: 500,
  loop: false,
  loopCount: Infinity,
  showCursor: true,
  cursorChar: '|',
  autoInsertCss: true,
  attr: null,
  bindInputFocusEvents: false,
  contentType: 'html',
  onBegin: (self) => { },
  onComplete: (self) => { },
  preStringTyped: (arrayPos, self) => { },
  onStringTyped: (arrayPos, self) => { },
  onLastStringBackspaced: (self) => { },
  onTypingPaused: (arrayPos, self) => { },
  onTypingResumed: (arrayPos, self) => { },
  onReset: (self) => { },
  onStop: (arrayPos, self) => { },
  onStart: (arrayPos, self) => { },
  onDestroy: (self) => { },
  onCharAppended: (char, self) => { },
  onCharRemoved: (char, self) => { }
};

export default defaults;
