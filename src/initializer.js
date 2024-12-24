import defaults from './defaults.js';

class Initializer {
  /**
   * Load defaults & options onto the Typed instance
   * @param {Typed} self
   * @param {object} options
   * @param {string|HTMLElement} elementId
   */
  load(self, options, elementId) {
    self.el =
      typeof elementId === 'string'
        ? document.querySelector(elementId)
        : elementId;

    self.options = { ...defaults, ...options };

    self.isInput = self.el.tagName.toLowerCase() === 'input';
    self.attr = self.options.attr;
    self.bindInputFocusEvents = self.options.bindInputFocusEvents;
    // If the element is an input, we hide the cursor by default
    self.showCursor = self.isInput ? false : self.options.showCursor;
    self.cursorChar = self.options.cursorChar;
    self.cursorBlinking = true;
    self.elContent = self.attr
      ? self.el.getAttribute(self.attr)
      : self.el.textContent;
    self.contentType = self.options.contentType;
    self.typeSpeed = self.options.typeSpeed;
    self.startDelay = self.options.startDelay;
    self.backSpeed = self.options.backSpeed;
    self.smartBackspace = self.options.smartBackspace;
    self.backDelay = self.options.backDelay;
    self.fadeOut = self.options.fadeOut;
    self.fadeOutClass = self.options.fadeOutClass;
    self.fadeOutDelay = self.options.fadeOutDelay;
    self.isPaused = false;

    // Prepare strings
    self.strings = self.options.strings.map((s) => s.trim());
    if (typeof self.options.stringsElement === 'string') {
      self.stringsElement = document.querySelector(self.options.stringsElement);
    } else {
      self.stringsElement = self.options.stringsElement;
    }
    if (self.stringsElement) {
      self.strings = [];
      self.stringsElement.style.display = 'none';
      const foundStrings = Array.from(self.stringsElement.children);
      for (let i = 0; i < foundStrings.length; i++) {
        self.strings.push(foundStrings[i].innerHTML.trim());
      }
    }

    // State
    self.strPos = 0;
    self.arrayPos = 0;
    self.stopNum = 0;
    self.loop = self.options.loop;
    self.loopCount = self.options.loopCount;
    self.curLoop = 0;
    self.shuffle = self.options.shuffle;
    self.sequence = [];
    self.typingComplete = false;

    // Pause info
    self.pause = {
      status: false,
      typewrite: true,
      curString: '',
      curStrPos: 0
    };

    // Build the initial sequence
    for (let i = 0; i < self.strings.length; i++) {
      self.sequence[i] = i;
    }

    self.currentElContent = this.getCurrentElContent(self);
    self.autoInsertCss = self.options.autoInsertCss;

    // Append CSS if needed
    this.appendAnimationCss(self);
  }

  getCurrentElContent(self) {
    if (self.attr) {
      return self.el.getAttribute(self.attr) || '';
    } else if (self.isInput) {
      return self.el.value || '';
    } else if (self.contentType === 'html') {
      return self.el.innerHTML;
    } else {
      return self.el.textContent;
    }
  }

  appendAnimationCss(self) {
    const cssDataName = 'data-typed-js-css';
    if (!self.autoInsertCss) return;
    if (!self.showCursor && !self.fadeOut) return;
    if (document.querySelector(`[${cssDataName}]`)) return;

    const styleEl = document.createElement('style');
    styleEl.type = 'text/css';
    styleEl.setAttribute(cssDataName, 'true');

    let innerCss = '';
    if (self.showCursor) {
      innerCss += `
.typed-cursor {
  opacity: 1;
}
.typed-cursor.typed-cursor--blink {
  animation: typedjsBlink 0.7s infinite;
}
@keyframes typedjsBlink {
  50% { opacity: 0.0; }
}
`;
    }
    if (self.fadeOut) {
      innerCss += `
.typed-fade-out {
  opacity: 0;
  transition: opacity .25s;
}
.typed-cursor.typed-cursor--blink.typed-fade-out {
  animation: none;
}
`;
    }
    if (innerCss.trim().length > 0) {
      styleEl.innerHTML = innerCss;
      document.body.appendChild(styleEl);
    }
  }
}

export const initializer = new Initializer();
