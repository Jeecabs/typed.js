# Typed.js (Fork)

[![Build Status](https://travis-ci.org/mattboldt/typed.js.svg?branch=typed-2.0)](https://travis-ci.org/mattboldt/typed.js)
[![Code Climate](https://codeclimate.com/github/mattboldt/typed.js/badges/gpa.svg)](https://codeclimate.com/github/mattboldt/typed.js)
[![GitHub release](https://img.shields.io/github/release/mattboldt/typed.js.svg)]()
[![npm](https://img.shields.io/npm/dt/typed.js.svg)](https://img.shields.io/npm/dt/typed.js.svg)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/mattboldt/typed.js/master/LICENSE.txt)

<img src="https://raw.githubusercontent.com/mattboldt/typed.js/master/logo-cropped.png" width="450px" title="Typed.js" />

### [Live Demo](http://www.mattboldt.com/demos/typed-js/) | [View Original Demos](http://mattboldt.github.io/typed.js/) | [Original Docs](http://mattboldt.github.io/typed.js/docs) | [mattboldt.com](http://www.mattboldt.com)

## Intention of this Fork

This fork was initially created to replicate the solution discussed here:

[Play sound at each char with typed.js on StackOverflow](https://stackoverflow.com/questions/49291904/play-sound-at-each-char-with-typedjs)

However, after reviewing the original code, the opportunity for additional improvements was too good to pass up.

**New Improvements in this Fork:**

- Implemented `requestAnimationFrame` for smoother and more performant updates instead of relying solely on `setTimeout`.
- Introduced a more modular architecture, making the code easier to maintain and extend.
- Added new callbacks for more granular control and event handling.

**New Callbacks Added:**

- **`onCharAppended`**: Triggered after a character has been appended to the typed element.
- **`onCharRemoved`**: Triggered after a character has been removed from the typed element.

With these new callbacks, you can implement custom behaviors at each character addition or removal event (e.g., playing a sound).

---

## Installation

You can still install this fork as you would the original Typed.js:

```bash
npm install typed.js
```

or

```bash
yarn add typed.js
```

CDN (original package version):

```html
<script src="https://cdn.jsdelivr.net/npm/typed.js@2.0.12"></script>
```

---

## Basic Usage

```javascript
import Typed from 'typed.js';

var options = {
  strings: ['<i>First</i> sentence.', '&amp; a second sentence.'],
  typeSpeed: 40,
  onCharAppended: (char, self) => {
    // Example: play a sound on each appended character
    console.log('Appended char:', char);
  },
  onCharRemoved: (char, self) => {
    // Example: log removed characters
    console.log('Removed char:', char);
  }
};

var typed = new Typed('.element', options);
```

---

## Changes in this Fork

1. **`requestAnimationFrame` for Better Performance**:  
   Instead of relying entirely on `setTimeout`, this fork utilizes `requestAnimationFrame` where possible, improving the performance and smoothness of the typing and backspacing animations.

2. **Additional Callbacks**:
   - `onCharAppended(char, self)`: Invoked immediately after a new character is appended to the element.
   - `onCharRemoved(char, self)`: Invoked immediately after a character is removed from the element.

These callbacks give you finer control over the typing animation. For example, you might use them to play a sound on each keystroke or trigger special effects when characters disappear.

---

## Other Features

For all other features, usage, and configuration options, refer to the original Typed.js documentation:

- [Original Documentation](http://mattboldt.github.io/typed.js/docs)

This fork maintains backward compatibility with most of the original options and callbacks, but introduces more modular code organization and tokenization steps before typing.

---

## Updated Default Options

Below is the updated `defaults` object with JSDoc-style comments for each option, including the newly introduced callbacks:

```javascript
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
```

---

## Contributing

For details on how to contribute, refer to the original [Contribution Guidelines](./.github/CONTRIBUTING.md).

---

## License

[MIT License](https://github.com/mattboldt/typed.js/blob/master/LICENSE.txt)

---

**If you're using this fork and find it useful, let me know!**  

Happy typing!