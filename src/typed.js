import defaults from './defaults.js';
import { initializer } from './initializer.js';
import { htmlParser } from './html-parser.js';

/**
 * Typed class: handles typing and backspacing animations
 */
export default class Typed {
  constructor(elementId, options) {
    // Initialize configuration and DOM references
    initializer.load(this, options, elementId);
    // Start the typing process
    this.begin();
  }

  /**
   * Toggle start() and stop() of the Typed instance
   * @public
   */
  toggle() {
    this.pause.status ? this.start() : this.stop();
  }

  /**
   * Stop typing / backspacing and enable cursor blinking
   * @public
   */
  stop() {
    if (this.typingComplete) return;
    if (this.pause.status) return;
    this.toggleBlinking(true);
    this.pause.status = true;
    this.options.onStop && this.options.onStop(this.arrayPos, this);
  }

  /**
   * Start typing / backspacing after being stopped
   * @public
   */
  start() {
    if (this.typingComplete) return;
    if (!this.pause.status) return;
    this.pause.status = false;
    if (this.pause.typewrite) {
      this.typewrite(this.pause.curString, this.pause.curStrPos);
    } else {
      this.backspace(this.pause.curString, this.pause.curStrPos);
    }
    this.options.onStart && this.options.onStart(this.arrayPos, this);
  }

  /**
   * Destroy this instance of Typed
   * @public
   */
  destroy() {
    this.reset(false);
    this.options.onDestroy && this.options.onDestroy(this);
  }

  /**
   * Reset Typed and optionally restarts
   * @param {boolean} restart
   * @public
   */
  reset(restart = true) {
    clearTimeout(this.timeout);
    this.replaceText('');
    if (this.cursor && this.cursor.parentNode) {
      this.cursor.parentNode.removeChild(this.cursor);
      this.cursor = null;
    }
    this.strPos = 0;
    this.arrayPos = 0;
    this.curLoop = 0;
    if (restart) {
      this.insertCursor();
      this.options.onReset && this.options.onReset(this);
      this.begin();
    }
  }

  /**
   * Begins the typing animation
   * @private
   */
  begin() {
    this.options.onBegin && this.options.onBegin(this);
    this.typingComplete = false;
    this.shuffleStringsIfNeeded();
    this.insertCursor();
    if (this.bindInputFocusEvents) this.bindFocusEvents();
    this.timeout = setTimeout(() => {
      if (this.strPos === 0) {
        this.typewrite(this.strings[this.sequence[this.arrayPos]], this.strPos);
      } else {
        this.backspace(this.strings[this.sequence[this.arrayPos]], this.strPos);
      }
    }, this.startDelay);
  }

  /**
   * Typed each character
   * @param {string} curString current string
   * @param {number} curStrPos current character index
   * @private
   */
  typewrite(curString, curStrPos) {
    if (this.fadeOut && this.el.classList.contains(this.fadeOutClass)) {
      this.el.classList.remove(this.fadeOutClass);
      if (this.cursor) this.cursor.classList.remove(this.fadeOutClass);
    }

    const humanize = this.humanizer(this.typeSpeed);
    let numChars = 1;

    if (this.pause.status) {
      this.setPauseStatus(curString, curStrPos, true);
      return;
    }

    this.timeout = setTimeout(() => {
      curStrPos = htmlParser.typeHtmlChars(curString, curStrPos, this);

      let pauseTime = 0;
      let substr = curString.substring(curStrPos);
      // Handle ^ character for pauses
      if (substr.charAt(0) === '^') {
        const match = /^\^\d+/.exec(substr);
        if (match) {
          const skipCount = 1 + match[0].slice(1).length;
          pauseTime = parseInt(match[0].slice(1), 10);
          this.temporaryPause = true;
          this.options.onTypingPaused && this.options.onTypingPaused(this.arrayPos, this);
          curString = curString.substring(0, curStrPos) + curString.substring(curStrPos + skipCount);
          this.toggleBlinking(true);
        }
      }

      // Handle ` backticks for instant strings
      if (substr.charAt(0) === '`') {
        while (curString.substring(curStrPos + numChars).charAt(0) !== '`') {
          numChars++;
          if (curStrPos + numChars > curString.length) break;
        }
        const stringBeforeSkip = curString.substring(0, curStrPos);
        const stringSkipped = curString.substring(stringBeforeSkip.length + 1, curStrPos + numChars);
        const stringAfterSkip = curString.substring(curStrPos + numChars + 1);
        curString = stringBeforeSkip + stringSkipped + stringAfterSkip;
        numChars--;
      }

      // After character pause
      this.timeout = setTimeout(() => {
        this.toggleBlinking(false);
        if (curStrPos >= curString.length) {
          this.doneTyping(curString, curStrPos);
        } else {
          this.keepTyping(curString, curStrPos, numChars);
        }
        if (this.temporaryPause) {
          this.temporaryPause = false;
          this.options.onTypingResumed && this.options.onTypingResumed(this.arrayPos, this);
        }
      }, pauseTime);
    }, humanize);
  }

  /**
   * Continue typing the current string
   * @private
   */
  keepTyping(curString, curStrPos, numChars) {
    if (curStrPos === 0) {
      this.toggleBlinking(false);
      this.options.preStringTyped && this.options.preStringTyped(this.arrayPos, this);
    }
    curStrPos += numChars;
    const nextString = curString.substring(0, curStrPos);
    this.replaceText(nextString);
    this.typewrite(curString, curStrPos);
  }

  /**
   * Invoked when finished typing the current string
   * @private
   */
  doneTyping(curString, curStrPos) {
    this.options.onStringTyped && this.options.onStringTyped(this.arrayPos, this);
    this.toggleBlinking(true);
    if (this.arrayPos === this.strings.length - 1) {
      this.complete();
      if (!this.loop || this.curLoop === this.loopCount) {
        return;
      }
    }
    this.timeout = setTimeout(() => {
      this.backspace(curString, curStrPos);
    }, this.backDelay);
  }

  /**
   * Backspace characters
   * @private
   */
  backspace(curString, curStrPos) {
    if (this.pause.status) {
      this.setPauseStatus(curString, curStrPos, false);
      return;
    }
    if (this.fadeOut) return this.initFadeOut();

    this.toggleBlinking(false);
    const humanize = this.humanizer(this.backSpeed);

    this.timeout = setTimeout(() => {
      curStrPos = htmlParser.backSpaceHtmlChars(curString, curStrPos, this);
      const curStringAtPosition = curString.substring(0, curStrPos);
      this.replaceText(curStringAtPosition);

      if (this.smartBackspace) {
        const nextString = this.strings[this.arrayPos + 1];
        if (nextString && curStringAtPosition === nextString.substring(0, curStrPos)) {
          this.stopNum = curStrPos;
        } else {
          this.stopNum = 0;
        }
      }

      if (curStrPos > this.stopNum) {
        curStrPos--;
        this.backspace(curString, curStrPos);
      } else if (curStrPos <= this.stopNum) {
        this.arrayPos++;
        if (this.arrayPos === this.strings.length) {
          this.arrayPos = 0;
          this.options.onLastStringBackspaced && this.options.onLastStringBackspaced();
          this.shuffleStringsIfNeeded();
          this.begin();
        } else {
          // Ensure sequence index is valid
          const nextIndex = this.sequence[this.arrayPos];
          if (typeof nextIndex !== 'undefined') {
            this.typewrite(this.strings[nextIndex], curStrPos);
          }
        }
      }
    }, humanize);
  }

  /**
   * Typing complete
   * @private
   */
  complete() {
    this.options.onComplete && this.options.onComplete(this);
    if (this.loop) {
      this.curLoop++;
    } else {
      this.typingComplete = true;
    }
  }

  /**
   * Set pause status
   * @private
   */
  setPauseStatus(curString, curStrPos, isTyping) {
    this.pause.typewrite = isTyping;
    this.pause.curString = curString;
    this.pause.curStrPos = curStrPos;
  }

  /**
   * Toggle blinking cursor
   * @private
   */
  toggleBlinking(isBlinking) {
    if (!this.cursor) return;
    if (this.pause.status) return;
    if (this.cursorBlinking === isBlinking) return;
    this.cursorBlinking = isBlinking;
    if (isBlinking) {
      this.cursor.classList.add('typed-cursor--blink');
    } else {
      this.cursor.classList.remove('typed-cursor--blink');
    }
  }

  /**
   * Humanize typing speed
   * @private
   */
  humanizer(speed) {
    return Math.round((Math.random() * speed) / 2) + speed;
  }

  /**
   * Shuffle strings if needed
   * @private
   */
  shuffleStringsIfNeeded() {
    if (!this.shuffle) return;
    this.sequence = this.sequence.sort(() => Math.random() - 0.5);
  }

  /**
   * Fade out animation
   * @private
   */
  initFadeOut() {
    this.el.classList.add(this.fadeOutClass);
    if (this.cursor) this.cursor.classList.add(this.fadeOutClass);
    return setTimeout(() => {
      this.arrayPos++;
      this.replaceText('');
      if (this.strings.length > this.arrayPos) {
        this.typewrite(this.strings[this.sequence[this.arrayPos]], 0);
      } else {
        this.typewrite(this.strings[0], 0);
        this.arrayPos = 0;
      }
    }, this.fadeOutDelay);
  }

  /**
   * Replace text in element
   * @private
   */
  replaceText(str) {
    if (this.attr) {
      this.el.setAttribute(this.attr, str);
    } else {
      if (this.isInput) {
        this.el.value = str;
      } else if (this.contentType === 'html') {
        this.el.innerHTML = str;
      } else {
        this.el.textContent = str;
      }
    }
  }

  /**
   * Bind focus events for input elements
   * @private
   */
  bindFocusEvents() {
    if (!this.isInput) return;
    this.el.addEventListener('focus', () => {
      this.stop();
    });
    this.el.addEventListener('blur', () => {
      if (this.el.value && this.el.value.length !== 0) {
        return;
      }
      this.start();
    });
  }

  /**
   * Insert the cursor element
   * @private
   */
  insertCursor() {
    if (!this.showCursor) return;
    if (this.cursor) return;
    this.cursor = document.createElement('span');
    this.cursor.className = 'typed-cursor';
    this.cursor.setAttribute('aria-hidden', true);
    this.cursor.innerHTML = this.cursorChar;
    if (this.el.parentNode) {
      this.el.parentNode.insertBefore(this.cursor, this.el.nextSibling);
    }
  }
}
