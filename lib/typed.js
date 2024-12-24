/*!
 * 
 *   typed.js-extra - A JavaScript Typing Animation Library
 *   Author: Jeecabs
 *   Version: v2.0.26
 *   Url: https://github.com/Jeecabs/typed.js
 *   License(s): MIT
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Typed"] = factory();
	else
		root["Typed"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _initializerJs = __webpack_require__(1);
	
	var _htmlParserJs = __webpack_require__(3);
	
	/**
	 * The main Typed class, orchestrating typing/backspacing via requestAnimationFrame
	 */
	
	var Typed = (function () {
	  function Typed(elementId, options) {
	    var _this = this;
	
	    _classCallCheck(this, Typed);
	
	    _initializerJs.initializer.load(this, options, elementId);
	
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
	      setTimeout(function () {
	        _this.startAnimationLoop();
	      }, this.startDelay);
	    } else {
	      this.startAnimationLoop();
	    }
	  }
	
	  /**
	   * Begin the requestAnimationFrame loop
	   * @private
	   */
	
	  _createClass(Typed, [{
	    key: 'startAnimationLoop',
	    value: function startAnimationLoop() {
	      this.lastTimestamp = performance.now();
	      this.nextActionTime = this.lastTimestamp + this.humanizer(this.typeSpeed);
	      this.rafId = requestAnimationFrame(this.rafLoop);
	    }
	
	    /**
	     * The main animation loop using requestAnimationFrame
	     * @param {number} timestamp
	     */
	  }, {
	    key: 'rafLoop',
	    value: function rafLoop(timestamp) {
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
	  }, {
	    key: 'doTypeForward',
	    value: function doTypeForward() {
	      var curString = this.strings[this.sequence[this.arrayPos]];
	      var curStrPos = this.strPos;
	
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
	
	      var _checkSpecialCharacters = this.checkSpecialCharacters(curString, curStrPos);
	
	      var newString = _checkSpecialCharacters.newString;
	      var jump = _checkSpecialCharacters.jump;
	      var pauseTime = _checkSpecialCharacters.pauseTime;
	
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
	        this.appendToElement(curString.substring(curStrPos, curStrPos + jump), true);
	        this.strPos += jump;
	      } else {
	        // Normal single character typed
	        // Account for HTML if contentType=html
	        this.strPos = _htmlParserJs.htmlParser.typeHtmlChars(curString, this.strPos, this);
	        var nextChar = curString.charAt(this.strPos);
	        this.appendToElement(nextChar, false);
	        this.strPos += 1;
	      }
	
	      // Humanize the next step
	      this.nextActionTime = performance.now() + this.humanizer(this.typeSpeed);
	    }
	
	    /**
	     * Perform one step of backspacing
	     * @private
	     */
	  }, {
	    key: 'doBackspace',
	    value: function doBackspace() {
	      var curString = this.strings[this.sequence[this.arrayPos]];
	      var curStrPos = this.strPos;
	
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
	      this.strPos = _htmlParserJs.htmlParser.backSpaceHtmlChars(curString, this.strPos - 1, this);
	
	      // Grab the new current text
	      var textNow = curString.substring(0, this.strPos);
	      // Remove 1 char from DOM
	      this.removeFromElement();
	      // If using smartBackspace
	      if (this.smartBackspace) {
	        var nextString = this.strings[this.arrayPos + 1];
	        if (nextString && textNow === nextString.substring(0, this.strPos)) {
	          this.stopNum = this.strPos;
	        } else {
	          this.stopNum = 0;
	        }
	      }
	
	      this.nextActionTime = performance.now() + this.humanizer(this.backSpeed);
	    }
	
	    /**
	     * Check for `^` (pause) or `` ` `` (instant) at the current position
	     * @param {string} str
	     * @param {number} pos
	     */
	  }, {
	    key: 'checkSpecialCharacters',
	    value: function checkSpecialCharacters(str, pos) {
	      var pauseTime = 0;
	      var jump = 0;
	      var newString = str;
	      var substring = str.substring(pos);
	
	      // Handle ^ pause
	      if (substring.charAt(0) === '^') {
	        var match = /^\^\d+/.exec(substring);
	        if (match) {
	          pauseTime = parseInt(match[0].slice(1), 10);
	          // Remove that chunk from the string
	          var skipCount = 1 + match[0].slice(1).length;
	          newString = str.substring(0, pos) + str.substring(pos + skipCount);
	        }
	      }
	
	      // Handle ` backticks for instant
	      else if (substring.charAt(0) === '`') {
	          jump = 0;
	          var idx = 1;
	          while (pos + idx < str.length && str.charAt(pos + idx) !== '`') {
	            idx++;
	          }
	          jump = idx - 1; // The amount of text inside the backticks
	          // Also remove the backticks from the original string
	          newString = str.substring(0, pos) + str.substring(pos + 1, pos + idx) + // text inside backticks
	          str.substring(pos + idx + 1);
	        }
	
	      return { newString: newString, jump: jump, pauseTime: pauseTime };
	    }
	
	    /**
	     * Pause for a certain time
	     * @param {number} ms
	     */
	  }, {
	    key: 'pauseTyping',
	    value: function pauseTyping(ms) {
	      var _this2 = this;
	
	      this.pause.status = true;
	      this.options.onTypingPaused && this.options.onTypingPaused(this.arrayPos, this);
	      setTimeout(function () {
	        _this2.pause.status = false;
	        _this2.options.onTypingResumed && _this2.options.onTypingResumed(_this2.arrayPos, _this2);
	      }, ms);
	    }
	
	    /**
	     * Fade out animation
	     * @private
	     */
	  }, {
	    key: 'initFadeOut',
	    value: function initFadeOut() {
	      var _this3 = this;
	
	      this.el.classList.add(this.fadeOutClass);
	      if (this.cursor) this.cursor.classList.add(this.fadeOutClass);
	      setTimeout(function () {
	        _this3.arrayPos++;
	        _this3.replaceText('');
	        if (_this3.arrayPos >= _this3.strings.length) {
	          _this3.arrayPos = 0;
	        }
	        _this3.typingForward = true;
	        _this3.strPos = 0;
	      }, this.fadeOutDelay);
	    }
	
	    /**
	     * Mark the typing as complete
	     * @private
	     */
	  }, {
	    key: 'complete',
	    value: function complete() {
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
	  }, {
	    key: 'insertCursor',
	    value: function insertCursor() {
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
	  }, {
	    key: 'replaceText',
	    value: function replaceText(str) {
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
	  }, {
	    key: 'appendToElement',
	    value: function appendToElement(chars, instant) {
	      var current = this._getCurrentContent();
	      this.replaceText(current + chars);
	
	      // Fire onCharAppended callback for each typed character
	      if (instant) {
	        for (var i = 0; i < chars.length; i++) {
	          this.options.onCharAppended && this.options.onCharAppended(chars[i], this);
	        }
	      } else if (chars.length === 1) {
	        this.options.onCharAppended && this.options.onCharAppended(chars, this);
	      } else {
	        // If somehow more than 1 character typed at once, we could iterate them
	        for (var i = 0; i < chars.length; i++) {
	          this.options.onCharAppended && this.options.onCharAppended(chars[i], this);
	        }
	      }
	    }
	
	    /**
	     * Remove a single character from the target
	     * @private
	     */
	  }, {
	    key: 'removeFromElement',
	    value: function removeFromElement() {
	      var current = this._getCurrentContent();
	      if (current.length > 0) {
	        var removedChar = current.slice(-1);
	        this.replaceText(current.slice(0, -1));
	        this.options.onCharRemoved && this.options.onCharRemoved(removedChar, this);
	      }
	    }
	
	    /**
	     * Helper to get the current text content or attribute
	     */
	  }, {
	    key: '_getCurrentContent',
	    value: function _getCurrentContent() {
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
	  }, {
	    key: 'humanizer',
	    value: function humanizer(speed) {
	      // e.g., random ± half of speed
	      return Math.round(Math.random() * speed * 0.5) + speed;
	    }
	
	    /**
	     * Shuffle the array of strings if needed
	     * @private
	     */
	  }, {
	    key: 'shuffleStringsIfNeeded',
	    value: function shuffleStringsIfNeeded() {
	      if (!this.shuffle) return;
	      this.sequence.sort(function () {
	        return Math.random() - 0.5;
	      });
	    }
	
	    /**
	     * Bind focus/blur if needed
	     * @private
	     */
	  }, {
	    key: 'bindFocusEvents',
	    value: function bindFocusEvents() {
	      var _this4 = this;
	
	      if (!this.isInput) return;
	      this.el.addEventListener('focus', function () {
	        _this4.stop();
	      });
	      this.el.addEventListener('blur', function () {
	        if (_this4.el.value && _this4.el.value.length !== 0) {
	          return;
	        }
	        _this4.start();
	      });
	    }
	
	    // ------------------
	    // Public Methods
	    // ------------------
	
	    /**
	     * Toggle start() and stop()
	     * @public
	     */
	  }, {
	    key: 'toggle',
	    value: function toggle() {
	      this.pause.status ? this.start() : this.stop();
	    }
	
	    /**
	     * Stop typing/backspacing
	     * @public
	     */
	  }, {
	    key: 'stop',
	    value: function stop() {
	      if (this.typingComplete) return;
	      if (this.pause.status) return;
	      this.pause.status = true;
	      this.options.onStop && this.options.onStop(this.arrayPos, this);
	    }
	
	    /**
	     * Resume typing/backspacing
	     * @public
	     */
	  }, {
	    key: 'start',
	    value: function start() {
	      if (this.typingComplete) return;
	      if (!this.pause.status) return;
	      this.pause.status = false;
	      this.options.onStart && this.options.onStart(this.arrayPos, this);
	    }
	
	    /**
	     * Destroy the instance
	     * @public
	     */
	  }, {
	    key: 'destroy',
	    value: function destroy() {
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
	  }, {
	    key: 'reset',
	    value: function reset() {
	      var restart = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	
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
	  }]);
	
	  return Typed;
	})();
	
	exports['default'] = Typed;
	module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _defaultsJs = __webpack_require__(2);
	
	var _defaultsJs2 = _interopRequireDefault(_defaultsJs);
	
	var Initializer = (function () {
	  function Initializer() {
	    _classCallCheck(this, Initializer);
	  }
	
	  _createClass(Initializer, [{
	    key: 'load',
	
	    /**
	     * Load defaults & options onto the Typed instance
	     * @param {Typed} self
	     * @param {object} options
	     * @param {string|HTMLElement} elementId
	     */
	    value: function load(self, options, elementId) {
	      self.el = typeof elementId === 'string' ? document.querySelector(elementId) : elementId;
	
	      self.options = _extends({}, _defaultsJs2['default'], options);
	
	      self.isInput = self.el.tagName.toLowerCase() === 'input';
	      self.attr = self.options.attr;
	      self.bindInputFocusEvents = self.options.bindInputFocusEvents;
	      // If the element is an input, we hide the cursor by default
	      self.showCursor = self.isInput ? false : self.options.showCursor;
	      self.cursorChar = self.options.cursorChar;
	      self.cursorBlinking = true;
	      self.elContent = self.attr ? self.el.getAttribute(self.attr) : self.el.textContent;
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
	      self.strings = self.options.strings.map(function (s) {
	        return s.trim();
	      });
	      if (typeof self.options.stringsElement === 'string') {
	        self.stringsElement = document.querySelector(self.options.stringsElement);
	      } else {
	        self.stringsElement = self.options.stringsElement;
	      }
	      if (self.stringsElement) {
	        self.strings = [];
	        self.stringsElement.style.display = 'none';
	        var foundStrings = Array.from(self.stringsElement.children);
	        for (var i = 0; i < foundStrings.length; i++) {
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
	      for (var i = 0; i < self.strings.length; i++) {
	        self.sequence[i] = i;
	      }
	
	      self.currentElContent = this.getCurrentElContent(self);
	      self.autoInsertCss = self.options.autoInsertCss;
	
	      // Append CSS if needed
	      this.appendAnimationCss(self);
	    }
	  }, {
	    key: 'getCurrentElContent',
	    value: function getCurrentElContent(self) {
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
	  }, {
	    key: 'appendAnimationCss',
	    value: function appendAnimationCss(self) {
	      var cssDataName = 'data-typed-js-css';
	      if (!self.autoInsertCss) return;
	      if (!self.showCursor && !self.fadeOut) return;
	      if (document.querySelector('[' + cssDataName + ']')) return;
	
	      var styleEl = document.createElement('style');
	      styleEl.type = 'text/css';
	      styleEl.setAttribute(cssDataName, 'true');
	
	      var innerCss = '';
	      if (self.showCursor) {
	        innerCss += '\n.typed-cursor {\n  opacity: 1;\n}\n.typed-cursor.typed-cursor--blink {\n  animation: typedjsBlink 0.7s infinite;\n}\n@keyframes typedjsBlink {\n  50% { opacity: 0.0; }\n}\n';
	      }
	      if (self.fadeOut) {
	        innerCss += '\n.typed-fade-out {\n  opacity: 0;\n  transition: opacity .25s;\n}\n.typed-cursor.typed-cursor--blink.typed-fade-out {\n  animation: none;\n}\n';
	      }
	      if (innerCss.trim().length > 0) {
	        styleEl.innerHTML = innerCss;
	        document.body.appendChild(styleEl);
	      }
	    }
	  }]);
	
	  return Initializer;
	})();
	
	var initializer = new Initializer();
	exports.initializer = initializer;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

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
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var defaults = {
	  strings: ['These are the default values...', 'You know what you should do?', 'Use your own!', 'Have a great day!'],
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
	  onBegin: function onBegin(self) {},
	  onComplete: function onComplete(self) {},
	  preStringTyped: function preStringTyped(arrayPos, self) {},
	  onStringTyped: function onStringTyped(arrayPos, self) {},
	  onLastStringBackspaced: function onLastStringBackspaced(self) {},
	  onTypingPaused: function onTypingPaused(arrayPos, self) {},
	  onTypingResumed: function onTypingResumed(arrayPos, self) {},
	  onReset: function onReset(self) {},
	  onStop: function onStop(arrayPos, self) {},
	  onStart: function onStart(arrayPos, self) {},
	  onDestroy: function onDestroy(self) {},
	
	  // Unique to this fork
	  onCharAppended: function onCharAppended(char, self) {},
	  onCharRemoved: function onCharRemoved(char, self) {}
	};
	
	exports['default'] = defaults;
	module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/**
	 * HTMLParser helps handle HTML tags or entities when contentType = 'html'
	 */
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var HTMLParser = (function () {
	  function HTMLParser() {
	    _classCallCheck(this, HTMLParser);
	  }
	
	  _createClass(HTMLParser, [{
	    key: 'typeHtmlChars',
	
	    /**
	     * Move forward in `curString` to skip through an HTML tag or entity (e.g. <span> or &amp;).
	     * @param {string} curString
	     * @param {number} curStrPos
	     * @param {Typed} self
	     * @returns {number}
	     */
	    value: function typeHtmlChars(curString, curStrPos, self) {
	      if (self.contentType !== 'html') return curStrPos;
	      var curChar = curString.charAt(curStrPos);
	      if (curChar === '<' || curChar === '&') {
	        var endTag = curChar === '<' ? '>' : ';';
	        while (curString.charAt(curStrPos + 1) !== endTag) {
	          curStrPos++;
	          if (curStrPos + 1 > curString.length) break;
	        }
	        curStrPos++;
	      }
	      return curStrPos;
	    }
	
	    /**
	     * Move backward in `curString` to skip through an HTML tag or entity if backspacing
	     * @param {string} curString
	     * @param {number} curStrPos
	     * @param {Typed} self
	     * @returns {number}
	     */
	  }, {
	    key: 'backSpaceHtmlChars',
	    value: function backSpaceHtmlChars(curString, curStrPos, self) {
	      if (self.contentType !== 'html') return curStrPos;
	      var curChar = curString.charAt(curStrPos);
	      if (curChar === '>' || curChar === ';') {
	        var startTag = curChar === '>' ? '<' : '&';
	        while (curString.charAt(curStrPos - 1) !== startTag) {
	          curStrPos--;
	          if (curStrPos < 0) break;
	        }
	        curStrPos--;
	      }
	      return curStrPos;
	    }
	  }]);
	
	  return HTMLParser;
	})();
	
	var htmlParser = new HTMLParser();
	exports.htmlParser = htmlParser;

/***/ })
/******/ ])
});
;