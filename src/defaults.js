/**
 * Defaults & options for Typed.js (Fork)
 * @typedef {Object} TypedOptions
 *
 * @property {string[]} strings                - The strings to be typed
 * @property {string|null} stringsElement      - ID of an element containing string children
 * @property {number} typeSpeed                - Type speed in ms
 * @property {number} startDelay               - Delay before typing starts (ms)
 * @property {number} backSpeed                - Backspacing speed in ms
 * @property {boolean} smartBackspace          - Only backspace what doesn’t match the previous string
 * @property {boolean} shuffle                 - Shuffle the strings
 * @property {number} backDelay                - Time before backspacing in ms
 * @property {boolean} fadeOut                 - Fade out instead of backspace
 * @property {string} fadeOutClass             - CSS class for fade animation
 * @property {number} fadeOutDelay             - Fade out delay in ms
 * @property {boolean} loop                    - Loop strings
 * @property {number} loopCount                - Amount of loops (default Infinity)
 * @property {boolean} showCursor              - Show the cursor
 * @property {string} cursorChar               - Character for cursor
 * @property {boolean} autoInsertCss           - Insert CSS for cursor and fadeOut into <head>
 * @property {string|null} attr                - Use a specific attribute for typing (e.g. placeholder)
 * @property {boolean} bindInputFocusEvents    - Bind focus/blur if el is a text input
 * @property {('html'|'null')} contentType     - 'html' or 'null' for plaintext
 *
 * @property {(self: Typed)=>void} onBegin     - Before it begins typing
 * @property {(self: Typed)=>void} onComplete  - All typing is complete
 * @property {(arrayPos: number, self: Typed)=>void} preStringTyped     - Before each string is typed
 * @property {(arrayPos: number, self: Typed)=>void} onStringTyped      - After each string is typed
 * @property {(self: Typed)=>void} onLastStringBackspaced              - During looping, after last string is typed
 * @property {(arrayPos: number, self: Typed)=>void} onTypingPaused     - Typing has been paused
 * @property {(arrayPos: number, self: Typed)=>void} onTypingResumed    - Typing has started after being paused
 * @property {(self: Typed)=>void} onReset      - After reset
 * @property {(arrayPos: number, self: Typed)=>void} onStop            - After stop
 * @property {(arrayPos: number, self: Typed)=>void} onStart           - After start
 * @property {(self: Typed)=>void} onDestroy    - After destroy
 *
 * @property {(char: string, self: Typed)=>void} onCharAppended - After a character is appended
 * @property {(char: string, self: Typed)=>void} onCharRemoved  - After a character is removed
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
  typeSpeed: 50,
  startDelay: 0,
  backSpeed: 50,
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

  // Callbacks
  onBegin: (self) => {},
  onComplete: (self) => {},
  preStringTyped: (arrayPos, self) => {},
  onStringTyped: (arrayPos, self) => {},
  onLastStringBackspaced: (self) => {},
  onTypingPaused: (arrayPos, self) => {},
  onTypingResumed: (arrayPos, self) => {},
  onReset: (self) => {},
  onStop: (arrayPos, self) => {},
  onStart: (arrayPos, self) => {},
  onDestroy: (self) => {},

  // Unique to this fork
  onCharAppended: (char, self) => {},
  onCharRemoved: (char, self) => {}
};

export default defaults;
