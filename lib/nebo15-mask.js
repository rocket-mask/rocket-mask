(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Nebo15Mask", [], factory);
	else if(typeof exports === 'object')
		exports["Nebo15Mask"] = factory();
	else
		root["Nebo15Mask"] = factory();
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
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var MaskPlace = exports.MaskPlace = function () {
	  function MaskPlace(pattern, idx) {
	    _classCallCheck(this, MaskPlace);
	
	    this.pattern = pattern;
	    this.idx = idx;
	  }
	
	  _createClass(MaskPlace, [{
	    key: 'test',
	    value: function test() {
	      throw Error('method test must be overrided');
	    }
	  }, {
	    key: 'placeholder',
	    get: function get() {
	      return '_';
	    }
	  }]);
	
	  return MaskPlace;
	}();
	
	var MaskPlaceRegexp = function (_MaskPlace) {
	  _inherits(MaskPlaceRegexp, _MaskPlace);
	
	  function MaskPlaceRegexp() {
	    _classCallCheck(this, MaskPlaceRegexp);
	
	    return _possibleConstructorReturn(this, (MaskPlaceRegexp.__proto__ || Object.getPrototypeOf(MaskPlaceRegexp)).apply(this, arguments));
	  }
	
	  _createClass(MaskPlaceRegexp, [{
	    key: 'test',
	    value: function test(char) {
	      return this.pattern.test(char);
	    }
	  }]);
	
	  return MaskPlaceRegexp;
	}(MaskPlace);
	
	var MaskPlaceStatic = function (_MaskPlace2) {
	  _inherits(MaskPlaceStatic, _MaskPlace2);
	
	  function MaskPlaceStatic() {
	    _classCallCheck(this, MaskPlaceStatic);
	
	    return _possibleConstructorReturn(this, (MaskPlaceStatic.__proto__ || Object.getPrototypeOf(MaskPlaceStatic)).apply(this, arguments));
	  }
	
	  _createClass(MaskPlaceStatic, [{
	    key: 'test',
	    value: function test(char) {
	      return this.pattern === char;
	    }
	  }, {
	    key: 'placeholder',
	    get: function get() {
	      return this.pattern;
	    }
	  }]);
	
	  return MaskPlaceStatic;
	}(MaskPlace);
	
	var MaskPlaceFunction = function (_MaskPlace3) {
	  _inherits(MaskPlaceFunction, _MaskPlace3);
	
	  function MaskPlaceFunction() {
	    _classCallCheck(this, MaskPlaceFunction);
	
	    return _possibleConstructorReturn(this, (MaskPlaceFunction.__proto__ || Object.getPrototypeOf(MaskPlaceFunction)).apply(this, arguments));
	  }
	
	  _createClass(MaskPlaceFunction, [{
	    key: 'test',
	    value: function test(char) {
	      return this.pattern(char);
	    }
	  }]);
	
	  return MaskPlaceFunction;
	}(MaskPlace);
	
	MaskPlace.create = function (test, idx) {
	  if (typeof test === 'undefined' || test === null) throw new Error('undefined test char');
	
	  if (test instanceof RegExp) return new MaskPlaceRegexp(test, idx);else if (typeof test === 'function') return new MaskPlaceFunction(test, idx);
	  return new MaskPlaceStatic(test, idx);
	};
	
	var KEYS = {
	  backspace: 8,
	  'tab': 9,
	  'enter': 13,
	  'shift': 16,
	  'ctrl': 17,
	  'alt': 18,
	  'pauseBreak': 19,
	  'capsLock': 20,
	  'escape': 27,
	  'pageUp': 33,
	  'pageDown': 34,
	  'end': 35,
	  'home': 36,
	  'leftArrow': 37,
	  'upArrow': 38,
	  'rightArrow': 39,
	  'downArrow': 40,
	  'insert': 45,
	  'delete': 46
	};
	
	var Mask = function () {
	  function Mask(element, mask) {
	    _classCallCheck(this, Mask);
	
	    this._name = 'nebo15-mask';
	    this._element = element;
	    this._mask = Mask.parseMask(mask);
	    this.onInputChange = this.onInputChange.bind(this);
	    this.onKeydown = this.onKeydown.bind(this);
	
	    this._element.addEventListener('change', this.onInputChange);
	    this._element.addEventListener('keydown', this.onKeydown);
	  }
	
	  // public interfaces
	
	
	  _createClass(Mask, [{
	    key: '_getModelPosition',
	    value: function _getModelPosition(maskPosition) {
	      return this.mask.slice(0, maskPosition).reduce(function (sum, cur) {
	        return sum += !(cur instanceof MaskPlaceStatic);
	      }, 0);
	    }
	  }, {
	    key: '_getCursorPosition',
	    value: function _getCursorPosition(leftPlaces) {
	      var finish = false;
	
	      return this.mask.reduce(function (sum, cur, i) {
	        if (finish) return sum;
	        if (cur instanceof MaskPlaceStatic) {
	          return sum + 1;
	        }
	        if (leftPlaces === -1) {
	          finish = true;
	          return sum;
	        }
	        leftPlaces--;
	        return sum + 1;
	      }, 0);
	    }
	  }, {
	    key: 'add',
	
	    /**
	     * Adding string/char by cursort position.
	     * By default. insert at the end of the mask
	     * @param {string} char - insert string
	     * @param {number} position - cursor position
	     * @returns {number} cursor position
	     */
	    value: function add(char) {
	      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
	
	      var modelPosition = this._getModelPosition(position);
	      var model = this.model;
	      var leftPlaces = this.__modelSize - model.length;
	      var insertChunk = char.slice(0, leftPlaces);
	      var newModel = model.slice(0, modelPosition) + insertChunk + model.slice(modelPosition);
	
	      this.model = newModel;
	      return this._getCursorPosition(modelPosition + (insertChunk.length ? insertChunk.length - 1 : 0));
	    }
	    /**
	     * Remove from mask by start and end selection positions
	     * @param {number} start selection`s start cursor position
	     * @param {number} end selection`s end cursor position
	     * @throws end must be >= start
	     * @returns {number} cursor position
	     */
	
	  }, {
	    key: 'remove',
	    value: function remove(start, end) {
	      var model = this.model;
	
	      start = typeof start === 'number' ? start : this.mask.length;
	      end = typeof end === 'number' ? end : start + 1;
	
	      if (end < start) throw new Error('remove: end must be >= start');
	
	      var startModel = this._getModelPosition(start);
	      var endModel = this._getModelPosition(end);
	
	      this.model = model.slice(0, startModel) + model.slice(endModel);
	      return this._getCursorPosition(startModel - 1);
	    }
	  }, {
	    key: 'onInputChange',
	    value: function onInputChange(e) {
	      var value = e.target.value;
	
	
	      this.element.value = Mask.format(value, this.mask);
	    }
	  }, {
	    key: 'onKeydown',
	    value: function onKeydown(e) {
	      var keyCode = e.keyCode;
	
	      if (e.ctrlKey || e.altKey || e.metaKey || keyCode < 46 && [KEYS.backspace].indexOf(keyCode) === -1) return;
	      e.preventDefault();
	      if (keyCode === KEYS.backspace) this.removeChar();else this.addChar(String.fromCharCode(keyCode), String(this.element.value).length);
	    }
	  }, {
	    key: 'removeChar',
	    value: function removeChar() {
	      var position = String(this.element.value).length;
	      var i = position - 1;
	      var deleted = false;
	
	      while (!deleted && this.mask[i] || this.mask[i] instanceof MaskPlaceStatic || i >= this.mask.length) {
	        if (!(this.mask[i] instanceof MaskPlaceStatic)) deleted = true;
	        this.element.value = this.element.value.slice(0, i) + this.element.value.slice(i + 1);
	        i--;
	      }
	    }
	  }, {
	    key: 'addChar',
	    value: function addChar(char, position) {
	      var i = position;
	
	      while (this.mask[i] && this.mask[i] instanceof MaskPlaceStatic) {
	        this.element.value += this.mask[i].pattern;
	        i++;
	      }
	      if (this.mask[i] && this.mask[i].test(char)) {
	        this.element.value += char;
	      }
	      this.cursor = this.cursor + 1;
	    }
	  }, {
	    key: 'viewValue',
	    get: function get() {
	      return this.element.value;
	    },
	    set: function set(value) {
	      this.element.value = value;
	    }
	  }, {
	    key: 'value',
	    get: function get() {
	      return this.viewValue;
	    },
	    set: function set(value) {
	      this.model = Mask.parse(value, this.mask);
	    }
	  }, {
	    key: 'model',
	    get: function get() {
	      return Mask.parse(this.value, this.mask);
	    },
	    set: function set(modelValue) {
	      this.viewValue = Mask.format(modelValue, this.mask);
	    }
	  }, {
	    key: '__modelSize',
	    get: function get() {
	      return this.mask.reduce(function (sum, cur) {
	        return sum += !(cur instanceof MaskPlaceStatic);
	      }, 0);
	    }
	  }, {
	    key: 'cursor',
	    get: function get() {
	      return this.selection.start;
	    },
	    set: function set(position) {
	      this.selection = { start: position, end: position };
	    }
	  }, {
	    key: 'selection',
	    get: function get() {
	      var start, end, rangeEl, clone;
	
	      if (this.element.selectionStart !== undefined) {
	        start = this.element.selectionStart;
	        end = this.element.selectionEnd;
	      } else {
	        try {
	          this.element.focus();
	          rangeEl = this.element.createTextRange();
	          clone = rangeEl.duplicate();
	
	          rangeEl.moveToBookmark(document.selection.createRange().getBookmark());
	          clone.setEndPoint('EndToStart', rangeEl);
	
	          start = clone.text.length;
	          end = start + rangeEl.text.length;
	        } catch (e) {/* not focused or not visible */}
	      }
	
	      return { start: start, end: end };
	    },
	    set: function set(selection) {
	      var rangeEl;
	
	      try {
	        if (this.element.selectionStart !== undefined) {
	          this.element.focus();
	          this.element.setSelectionRange(selection.start, selection.end);
	        } else {
	          this.element.focus();
	          rangeEl = this.element.createTextRange();
	          rangeEl.collapse(true);
	          rangeEl.moveStart('character', selection.start);
	          rangeEl.moveEnd('character', selection.end - selection.start);
	          rangeEl.select();
	        }
	      } catch (e) {
	        console.log('catched on set selection');
	      }
	    }
	  }, {
	    key: 'element',
	    get: function get() {
	      return this._element;
	    }
	  }, {
	    key: 'name',
	    get: function get() {
	      return this._name;
	    }
	  }, {
	    key: 'mask',
	    get: function get() {
	      return this._mask;
	    }
	  }]);
	
	  return Mask;
	}();
	
	exports.default = Mask;
	
	Mask.maskedOptions = {
	  '1': /\d/,
	  'w': /[a-zA-Z]/
	};
	Mask.parseMask = function () {
	  var mask = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	
	  return String(mask).split('').map(function (i, idx) {
	    return MaskPlace.create(Mask.maskedOptions[i] || i, idx);
	  });
	};
	Mask.format = function (value) {
	  var maskArr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	
	  return typeof maskArr[0] === 'undefined' ? '' : maskArr[0] instanceof MaskPlaceStatic ? maskArr[0].pattern + Mask.format(value, maskArr.slice(1)) : maskArr[0].test(value[0]) ? value[0] + Mask.format(value.slice(1), maskArr.slice(1)) : '';
	};
	Mask.parse = function (value) {
	  var maskArr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	
	  return typeof maskArr[0] === 'undefined' ? '' : maskArr[0] instanceof MaskPlaceStatic ? maskArr[0].test(value[0]) ? Mask.parse(value.slice(1), maskArr.slice(1)) : '' : maskArr[0].test(value[0]) ? value[0] + Mask.parse(value.slice(1), maskArr.slice(1)) : '';
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=nebo15-mask.js.map