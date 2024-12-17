import defaults from './defaults.js';

class Initializer {
  /**
   * Load defaults & options on the Typed instance
   * @param {Typed} self instance of Typed
   * @param {object} options options object
   * @param {string|HTMLElement} elementId HTML element or selector
   * @private
   */
  load(self, options, elementId) {
    self.el = (typeof elementId === 'string') 
      ? document.querySelector(elementId) 
      : elementId;

    self.options = { ...defaults, ...options };

    self.isInput = self.el.tagName.toLowerCase() === 'input';
    self.attr = self.options.attr;
    self.bindInputFocusEvents = self.options.bindInputFocusEvents;
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
    self.strings = self.options.strings.map((s) => s.trim());

    if (typeof self.options.stringsElement === 'string') {
      self.stringsElement = document.querySelector(self.options.stringsElement);
    } else {
      self.stringsElement = self.options.stringsElement;
    }

    if (self.stringsElement) {
      self.strings = [];
      self.stringsElement.style.display = 'none';
      const strings = Array.from(self.stringsElement.children);
      for (let i = 0; i < strings.length; i++) {
        self.strings.push(strings[i].innerHTML.trim());
      }
    }

    self.strPos = 0;
    self.arrayPos = 0;
    self.stopNum = 0;
    self.loop = self.options.loop;
    self.loopCount = self.options.loopCount;
    self.curLoop = 0;
    self.shuffle = self.options.shuffle;
    self.sequence = [];

    self.pause = {
      status: false,
      typewrite: true,
      curString: '',
      curStrPos: 0
    };

    self.typingComplete = false;

    // Set the order in which the strings are typed
    for (let i = 0; i < self.strings.length; i++) {
      self.sequence[i] = i;
    }

    self.currentElContent = this.getCurrentElContent(self);
    self.autoInsertCss = self.options.autoInsertCss;

    this.appendAnimationCss(self);
  }

  getCurrentElContent(self) {
    let elContent = '';
    if (self.attr) {
      elContent = self.el.getAttribute(self.attr);
    } else if (self.isInput) {
      elContent = self.el.value;
    } else if (self.contentType === 'html') {
      elContent = self.el.innerHTML;
    } else {
      elContent = self.el.textContent;
    }
    return elContent;
  }

  appendAnimationCss(self) {
    const cssDataName = 'data-typed-js-css';
    if (!self.autoInsertCss) return;
    if (!self.showCursor && !self.fadeOut) return;
    if (document.querySelector(`[${cssDataName}]`)) return;

    let css = document.createElement('style');
    css.type = 'text/css';
    css.setAttribute(cssDataName, 'true');

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

    // Only append if there's something to insert
    if (innerCss.trim().length > 0) {
      css.innerHTML = innerCss;
      document.body.appendChild(css);
    }
  }
}

export let initializer = new Initializer();
