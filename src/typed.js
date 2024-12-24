import { initializer } from './initializer.js';
import { htmlParser } from './html-parser.js';

/**
 * The main Typed class, orchestrating typing/backspacing via requestAnimationFrame
 */
export default class Typed {
  constructor(elementId, options) {
    initializer.load(this, options, elementId);

    // We'll track the last time we updated so we can "humanize" intervals
    this.lastTimestamp = 0;
    // Next time we want to do something (type/backspace)
    this.nextActionTime = 0;

    // This indicates whether we are currently typing forward or backspacing
    this.typingForward = true;

    // Start the typing process
    this.insertCursor();
    if (this.bindInputFocusEvents) this.bindFocusEvents();

    // Shuffle strings if needed
    this.shuffleStringsIfNeeded();

    // If there's a startDelay, we wait that many ms before actually typing
    this.options.onBegin && this.options.onBegin(this);
    this.rafId = null;
    this.rafLoop = this.rafLoop.bind(this);

    // Start the animation after startDelay
    if (this.startDelay > 0) {
      setTimeout(() => {
        this.startAnimationLoop();
      }, this.startDelay);
    } else {
      this.startAnimationLoop();
    }
  }

  /**
   * Begin the requestAnimationFrame loop
   * @private
   */
  startAnimationLoop() {
    this.lastTimestamp = performance.now();
    this.nextActionTime = this.lastTimestamp + this.humanizer(this.typeSpeed);
    this.rafId = requestAnimationFrame(this.rafLoop);
  }

  /**
   * The main animation loop using requestAnimationFrame
   * @param {number} timestamp
   */
  rafLoop(timestamp) {
    if (this.typingComplete) return;

    // If paused or stopped, we just keep looping without typing
    if (this.pause.status) {
      this.rafId = requestAnimationFrame(this.rafLoop);
      return;
    }

    // Check if it's time for the next action
    if (timestamp >= this.nextActionTime) {
      if (this.typingForward) {
        this.doTypeForward();
      } else {
        this.doBackspace();
      }
    }

    this.rafId = requestAnimationFrame(this.rafLoop);
  }

  /**
   * Perform one step of typing forward
   * @private
   */
  doTypeForward() {
    const curString = this.strings[this.sequence[this.arrayPos]];
    let curStrPos = this.strPos;

    // If fadeOut is active and element is in fade-out state, remove that
    if (this.fadeOut && this.el.classList.contains(this.fadeOutClass)) {
      this.el.classList.remove(this.fadeOutClass);
      if (this.cursor) this.cursor.classList.remove(this.fadeOutClass);
    }

    // If we've finished the current string:
    if (curStrPos >= curString.length) {
      // Fire onStringTyped
      this.options.onStringTyped && this.options.onStringTyped(this.arrayPos, this);

      // If we've done all strings and don't loop, complete
      if (this.arrayPos === this.strings.length - 1) {
        if (!this.loop || this.curLoop === this.loopCount) {
          this.complete();
          return;
        }
      }

      // Delay before starting to backspace
      this.typingForward = false;
      this.nextActionTime = performance.now() + this.backDelay;
      return;
    }

    // Check for ^ pause or ` instant
    let { newString, jump, pauseTime } = this.checkSpecialCharacters(
      curString,
      curStrPos
    );

    if (pauseTime > 0) {
      // We need to pause
      this.pauseTyping(pauseTime);
      // We might have truncated the string
      if (newString !== curString) {
        this.strings[this.sequence[this.arrayPos]] = newString;
      }
      return;
    }

    // If we got an instant insertion
    if (jump > 0) {
      // This means a chunk of text (enclosed in backticks) gets inserted instantly
      this.appendToElement(
        curString.substring(curStrPos, curStrPos + jump),
        true
      );
      this.strPos += jump;
    } else {
      // Normal single character typed
      // Account for HTML if contentType=html
      this.strPos = htmlParser.typeHtmlChars(
        curString,
        this.strPos,
        this
      );
      const nextChar = curString.charAt(this.strPos);
      this.appendToElement(nextChar, false);
      this.strPos += 1;
    }

    // Humanize the next step
    this.nextActionTime =
      performance.now() + this.humanizer(this.typeSpeed);
  }

  /**
   * Perform one step of backspacing
   * @private
   */
  doBackspace() {
    const curString = this.strings[this.sequence[this.arrayPos]];
    let curStrPos = this.strPos;

    // If fadeOut is active, do that instead of backspacing
    if (this.fadeOut) {
      this.initFadeOut();
      return;
    }

    // If we've fully backspaced
    if (curStrPos <= this.stopNum) {
      this.arrayPos++;
      if (this.arrayPos === this.strings.length) {
        // We finished all strings
        this.arrayPos = 0;
        this.options.onLastStringBackspaced && this.options.onLastStringBackspaced(this);
        this.shuffleStringsIfNeeded();
        // Start over
      }
      this.typingForward = true;
      this.strPos = 0;
      // We move to the next string
      return;
    }

    // Normal backspace step
    // We check for HTML
    this.strPos = htmlParser.backSpaceHtmlChars(curString, this.strPos - 1, this);

    // Grab the new current text
    let textNow = curString.substring(0, this.strPos);
    // Remove 1 char from DOM
    this.removeFromElement();
    // If using smartBackspace
    if (this.smartBackspace) {
      const nextString = this.strings[this.arrayPos + 1];
      if (nextString && textNow === nextString.substring(0, this.strPos)) {
        this.stopNum = this.strPos;
      } else {
        this.stopNum = 0;
      }
    }

    this.nextActionTime =
      performance.now() + this.humanizer(this.backSpeed);
  }

  /**
   * Check for `^` (pause) or `` ` `` (instant) at the current position
   * @param {string} str
   * @param {number} pos
   */
  checkSpecialCharacters(str, pos) {
    let pauseTime = 0;
    let jump = 0;
    let newString = str;
    const substring = str.substring(pos);

    // Handle ^ pause
    if (substring.charAt(0) === '^') {
      const match = /^\^\d+/.exec(substring);
      if (match) {
        pauseTime = parseInt(match[0].slice(1), 10);
        // Remove that chunk from the string
        const skipCount = 1 + match[0].slice(1).length;
        newString =
          str.substring(0, pos) + str.substring(pos + skipCount);
      }
    }

    // Handle ` backticks for instant
    else if (substring.charAt(0) === '`') {
      jump = 0;
      let idx = 1;
      while (pos + idx < str.length && str.charAt(pos + idx) !== '`') {
        idx++;
      }
      jump = idx - 1; // The amount of text inside the backticks
      // Also remove the backticks from the original string
      newString =
        str.substring(0, pos) +
        str.substring(pos + 1, pos + idx) + // text inside backticks
        str.substring(pos + idx + 1);
    }

    return { newString, jump, pauseTime };
  }

  /**
   * Pause for a certain time
   * @param {number} ms
   */
  pauseTyping(ms) {
    this.pause.status = true;
    this.options.onTypingPaused && this.options.onTypingPaused(this.arrayPos, this);
    setTimeout(() => {
      this.pause.status = false;
      this.options.onTypingResumed && this.options.onTypingResumed(this.arrayPos, this);
    }, ms);
  }

  /**
   * Fade out animation
   * @private
   */
  initFadeOut() {
    this.el.classList.add(this.fadeOutClass);
    if (this.cursor) this.cursor.classList.add(this.fadeOutClass);
    setTimeout(() => {
      this.arrayPos++;
      this.replaceText('');
      if (this.arrayPos >= this.strings.length) {
        this.arrayPos = 0;
      }
      this.typingForward = true;
      this.strPos = 0;
    }, this.fadeOutDelay);
  }

  /**
   * Mark the typing as complete
   * @private
   */
  complete() {
    this.typingComplete = true;
    this.options.onComplete && this.options.onComplete(this);
    if (this.loop) {
      this.curLoop++;
    }
  }

  /**
   * Insert the cursor element into the DOM
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

  /**
   * Replace the text in this.el with the given string
   * (or set attribute if attr is specified)
   * @param {string} str
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
   * Append a single or multiple characters to the target
   * @param {string} chars
   * @param {boolean} instant
   * @private
   */
  appendToElement(chars, instant) {
    const current = this._getCurrentContent();
    this.replaceText(current + chars);

    // Fire onCharAppended callback for each typed character
    if (instant) {
      for (let i = 0; i < chars.length; i++) {
        this.options.onCharAppended && this.options.onCharAppended(chars[i], this);
      }
    } else if (chars.length === 1) {
      this.options.onCharAppended && this.options.onCharAppended(chars, this);
    } else {
      // If somehow more than 1 character typed at once, we could iterate them
      for (let i = 0; i < chars.length; i++) {
        this.options.onCharAppended && this.options.onCharAppended(chars[i], this);
      }
    }
  }

  /**
   * Remove a single character from the target
   * @private
   */
  removeFromElement() {
    const current = this._getCurrentContent();
    if (current.length > 0) {
      const removedChar = current.slice(-1);
      this.replaceText(current.slice(0, -1));
      this.options.onCharRemoved && this.options.onCharRemoved(removedChar, this);
    }
  }

  /**
   * Helper to get the current text content or attribute
   */
  _getCurrentContent() {
    if (this.attr) {
      return this.el.getAttribute(this.attr) || '';
    } else if (this.isInput) {
      return this.el.value;
    } else if (this.contentType === 'html') {
      return this.el.innerHTML;
    } else {
      return this.el.textContent;
    }
  }

  /**
   * Humanize the typing/backspacing delay
   * @private
   */
  humanizer(speed) {
    // e.g., random ± half of speed
    return Math.round(Math.random() * speed * 0.5) + speed;
  }

  /**
   * Shuffle the array of strings if needed
   * @private
   */
  shuffleStringsIfNeeded() {
    if (!this.shuffle) return;
    this.sequence.sort(() => Math.random() - 0.5);
  }

  /**
   * Bind focus/blur if needed
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

  // ------------------
  // Public Methods
  // ------------------

  /**
   * Toggle start() and stop()
   * @public
   */
  toggle() {
    this.pause.status ? this.start() : this.stop();
  }

  /**
   * Stop typing/backspacing
   * @public
   */
  stop() {
    if (this.typingComplete) return;
    if (this.pause.status) return;
    this.pause.status = true;
    this.options.onStop && this.options.onStop(this.arrayPos, this);
  }

  /**
   * Resume typing/backspacing
   * @public
   */
  start() {
    if (this.typingComplete) return;
    if (!this.pause.status) return;
    this.pause.status = false;
    this.options.onStart && this.options.onStart(this.arrayPos, this);
  }

  /**
   * Destroy the instance
   * @public
   */
  destroy() {
    // stop the animation
    cancelAnimationFrame(this.rafId);
    this.typingComplete = true;

    // Clear text
    this.replaceText('');
    if (this.cursor && this.cursor.parentNode) {
      this.cursor.parentNode.removeChild(this.cursor);
      this.cursor = null;
    }
    this.options.onDestroy && this.options.onDestroy(this);
  }

  /**
   * Reset and optionally restart
   * @param {boolean} restart
   * @public
   */
  reset(restart = true) {
    cancelAnimationFrame(this.rafId);

    this.replaceText('');
    if (this.cursor && this.cursor.parentNode) {
      this.cursor.parentNode.removeChild(this.cursor);
      this.cursor = null;
    }

    this.strPos = 0;
    this.arrayPos = 0;
    this.curLoop = 0;
    this.typingForward = true;
    this.typingComplete = false;

    if (restart) {
      this.insertCursor();
      this.options.onReset && this.options.onReset(this);
      this.startAnimationLoop();
    }
  }
}
