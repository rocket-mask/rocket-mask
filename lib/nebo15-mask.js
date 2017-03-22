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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.MaskedInput = undefined;
	
	var _core = __webpack_require__(1);
	
	var _core2 = _interopRequireDefault(_core);
	
	var _input = __webpack_require__(3);
	
	var _input2 = _interopRequireDefault(_input);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _core2.default;
	var MaskedInput = exports.MaskedInput = _input2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _places = __webpack_require__(2);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Mask = function () {
	  function Mask(mask, placeholder) {
	    _classCallCheck(this, Mask);
	
	    this._name = 'nebo15-mask';
	    this._mask = Mask.parseMask(mask);
	    this._states = [];
	    this._stateIdx = -1;
	    this._placeholder = placeholder;
	  }
	
	  // public interfaces
	
	
	  _createClass(Mask, [{
	    key: '_modelGetter',
	    value: function _modelGetter() {
	      return Mask.parse(this.value, this.mask);
	    }
	  }, {
	    key: '_modelSetter',
	    value: function _modelSetter(modelValue) {
	      this.viewValue = this._placeholder ? Mask.formatWithPlaceholder(modelValue, this.mask, this._placeholder) : Mask.format(modelValue, this.mask);
	    }
	  }, {
	    key: '_getModelPosition',
	    value: function _getModelPosition(maskPosition) {
	      return this.mask.slice(0, maskPosition).reduce(function (sum, cur) {
	        return sum += !(cur instanceof _places.MaskPlaceStatic);
	      }, 0);
	    }
	  }, {
	    key: '_getMaskPosition',
	    value: function _getMaskPosition(modelPosition) {
	      return this.mask.reduce(function (sum, cur) {
	        if (modelPosition === -1) return sum;
	        if (cur instanceof _places.MaskPlaceStatic) return sum + 1;
	        modelPosition--;
	        return sum + 1;
	      }, -1);
	    }
	  }, {
	    key: '_getCursorPosition',
	    value: function _getCursorPosition(leftPlaces) {
	      var finish = false;
	
	      return this.mask.reduce(function (sum, cur, i) {
	        if (finish) return sum;
	        if (cur instanceof _places.MaskPlaceStatic) {
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
	    value: function add() {
	      var _this = this;
	
	      var char = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
	
	      var modelPosition = this._getModelPosition(position);
	      var model = this.model;
	      var leftPlaces = this.__modelSize - model.length;
	
	      var insertChunk = char.split('').map(function (i, idx) {
	        var nextMask = _this.mask[_this._getMaskPosition(modelPosition + idx)];
	
	        return nextMask.test(i) ? i : '';
	      }).join('').slice(0, leftPlaces);
	
	      if (insertChunk.length === 0) return position;
	      var newModel = model.slice(0, modelPosition) + insertChunk + model.slice(modelPosition);
	
	      this.model = newModel;
	      this.saveState(newModel);
	
	      var newPosition = this._getCursorPosition(modelPosition + (insertChunk.length - 1));
	      var maxPosition = this._getCursorPosition(newModel.length - 1);
	
	      return newPosition > maxPosition ? maxPosition : newPosition;
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
	
	      if (end < start) return start;
	
	      var startModel = this._getModelPosition(start);
	      var endModel = this._getModelPosition(end);
	      var newModel = model.slice(0, startModel) + model.slice(endModel);
	
	      this.model = newModel;
	      this.saveState(newModel);
	
	      return start;
	    }
	  }, {
	    key: 'backspace',
	    value: function backspace(position) {
	      if (position === 0) return position;
	      var prevCharacter = this._getModelPosition(position);
	
	      if (prevCharacter === 0) return position;
	      return this.remove(this._getCursorPosition(prevCharacter - 2), position);
	    }
	  }, {
	    key: 'forwardDelete',
	    value: function forwardDelete(position) {
	      if (position === this.mask.length) return position;
	      var prevCharacter = this._getModelPosition(position);
	
	      return this.remove(position, this._getCursorPosition(prevCharacter));
	    }
	  }, {
	    key: 'undo',
	    value: function undo(position) {
	      if (this._stateIdx === -1) return position;
	
	      this._stateIdx -= 1;
	      this.model = this._states[this._stateIdx];
	      var maxPosition = this._getCursorPosition(this.model.length - 1);
	
	      return Math.min(position, maxPosition);
	    }
	  }, {
	    key: 'redo',
	    value: function redo(position) {
	      var nextState = this._states[this._stateIdx + 1];
	
	      if (!nextState) return position;
	      this._stateIdx++;
	      this.model = nextState;
	      var maxPosition = this._getCursorPosition(this.model.length - 1);
	
	      return Math.min(position, maxPosition);
	    }
	  }, {
	    key: 'saveState',
	    value: function saveState(state) {
	      this._states = this._states.slice(0, this._stateIdx + 1);
	      this._states.push(state);
	      this._stateIdx = this._states.length - 1;
	    }
	  }, {
	    key: 'viewValue',
	    get: function get() {
	      throw new Error('get view value must me overrited');
	    },
	    set: function set(value) {
	      throw new Error('get view value must me overrited');
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
	      return this._modelGetter();
	    },
	    set: function set(modelValue) {
	      this._modelSetter(modelValue);
	    }
	  }, {
	    key: '__modelSize',
	    get: function get() {
	      return this.mask.reduce(function (sum, cur) {
	        return sum += !(cur instanceof _places.MaskPlaceStatic);
	      }, 0);
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
	    return _places.MaskPlace.create(Mask.maskedOptions[i] || i, idx);
	  });
	};
	Mask.format = function (value) {
	  var maskArr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	
	  value = value || '';
	  return typeof maskArr[0] === 'undefined' ? '' : maskArr[0] instanceof _places.MaskPlaceStatic ? maskArr[0].pattern + Mask.format(value, maskArr.slice(1)) : maskArr[0].test(value[0]) ? (value[0] || '') + Mask.format(value.slice(1), maskArr.slice(1)) : '';
	};
	Mask.formatWithPlaceholder = function (value) {
	  var maskArr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	  var placeholder = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '_';
	
	  var formattedValue = Mask.format(value, maskArr);
	
	  return maskArr.slice(formattedValue.length).reduce(function (cur, i) {
	    return cur + (i instanceof _places.MaskPlaceStatic ? i.pattern : String(placeholder)[0]);
	  }, formattedValue);
	};
	Mask.parse = function (value) {
	  var maskArr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	
	  value = value || '';
	  return typeof maskArr[0] === 'undefined' ? '' : maskArr[0] instanceof _places.MaskPlaceStatic ? maskArr[0].test(value[0]) ? Mask.parse(value.slice(1), maskArr.slice(1)) : '' : maskArr[0].test(value[0]) ? value[0] + Mask.parse(value.slice(1), maskArr.slice(1)) : '';
	};
	module.exports = exports['default'];

/***/ },
/* 2 */
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
	
	var MaskPlaceRegexp = exports.MaskPlaceRegexp = function (_MaskPlace) {
	  _inherits(MaskPlaceRegexp, _MaskPlace);
	
	  function MaskPlaceRegexp() {
	    _classCallCheck(this, MaskPlaceRegexp);
	
	    return _possibleConstructorReturn(this, (MaskPlaceRegexp.__proto__ || Object.getPrototypeOf(MaskPlaceRegexp)).apply(this, arguments));
	  }
	
	  _createClass(MaskPlaceRegexp, [{
	    key: 'test',
	    value: function test() {
	      var char = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	
	      return this.pattern.test(char);
	    }
	  }]);
	
	  return MaskPlaceRegexp;
	}(MaskPlace);
	
	var MaskPlaceStatic = exports.MaskPlaceStatic = function (_MaskPlace2) {
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
	
	var MaskPlaceFunction = exports.MaskPlaceFunction = function (_MaskPlace3) {
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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _keycode = __webpack_require__(4);
	
	var _keycode2 = _interopRequireDefault(_keycode);
	
	var _core = __webpack_require__(1);
	
	var _core2 = _interopRequireDefault(_core);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var KEYS = {
	  Z: 90,
	  Y: 89,
	  backspace: 8,
	  tab: 9,
	  enter: 13,
	  shift: 16,
	  ctrl: 17,
	  alt: 18,
	  pauseBreak: 19,
	  capsLock: 20,
	  escape: 27,
	  space: 32,
	  pageUp: 33,
	  pageDown: 34,
	  end: 35,
	  home: 36,
	  leftArrow: 37,
	  upArrow: 38,
	  rightArrow: 39,
	  downArrow: 40,
	  insert: 45,
	  delete: 46
	};
	
	function isUndo(e) {
	  return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYS.Y : KEYS.Z);
	}
	
	function isRedo(e) {
	  return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYS.Z : KEYS.Y);
	}
	
	var getClipboardData = function getClipboardData(e) {
	  return (e.clipboardData || window.clipboardData).getData('Text');
	};
	
	var MaskedInput = function (_Core) {
	  _inherits(MaskedInput, _Core);
	
	  function MaskedInput(element, mask) {
	    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	
	    _classCallCheck(this, MaskedInput);
	
	    options = Object.assign({
	      placeholder: null,
	      showOnFocus: false,
	      hideOnBlur: false,
	      showAlways: false
	    }, options);
	
	    var _this = _possibleConstructorReturn(this, (MaskedInput.__proto__ || Object.getPrototypeOf(MaskedInput)).call(this, mask, options.placeholder));
	
	    _this.options = options;
	    _this._element = element;
	    _this.onChange = _this.onChange.bind(_this);
	    _this.onKeydown = _this.onKeydown.bind(_this);
	    _this.onPaste = _this.onPaste.bind(_this);
	    _this.onCut = _this.onCut.bind(_this);
	
	    _this._element.addEventListener('change', _this.onChange);
	    _this._element.addEventListener('keydown', _this.onKeydown);
	    _this._element.addEventListener('paste', _this.onPaste);
	    _this._element.addEventListener('cut', _this.onCut);
	
	    _this.onFocus = _this.onFocus.bind(_this);
	    _this.onBlur = _this.onBlur.bind(_this);
	    _this._element.addEventListener('focus', _this.onFocus);
	    _this._element.addEventListener('blur', _this.onBlur);
	
	    if (options.showAlways) {
	      _this.model = _this.model || '';
	    }
	    return _this;
	  }
	
	  _createClass(MaskedInput, [{
	    key: 'onChange',
	    value: function onChange(e) {
	      var value = e.target.value;
	
	
	      this.viewValue = value;
	    }
	  }, {
	    key: 'onKeydown',
	    value: function onKeydown(e) {
	      e = e || window.event;
	      var keyCode = e.keyCode || e.which;
	
	      if (isUndo(e)) {
	        e.preventDefault();
	        this.cursor = this.undo(this.cursor);
	        return null;
	      }
	      if (isRedo(e)) {
	        e.preventDefault();
	        this.cursor = this.redo(this.cursor);
	        return null;
	      }
	
	      if (keyCode === 0) {
	        return e.preventDefault(); // iOS Safari bug :(
	      }
	      if (e.ctrlKey || e.altKey || e.metaKey || keyCode < 46 && [KEYS.backspace, KEYS.space].indexOf(keyCode) === -1) return null;
	
	      e.preventDefault();
	
	      var selection = this.selection;
	
	      if (keyCode === KEYS.backspace) {
	        this.cursor = selection.start === selection.end ? this.backspace(selection.start) : this.remove(selection.start, selection.end);
	      } else if (keyCode === KEYS.delete) {
	        this.cursor = selection.start === selection.end ? this.forwardDelete(selection.start) : this.remove(selection.start, selection.end);
	      } else {
	        if (selection.start !== selection.end) this.remove(selection.start, selection.end);
	        this.cursor = this.add((0, _keycode2.default)(e), selection.start);
	      }
	    }
	  }, {
	    key: 'onPaste',
	    value: function onPaste(e) {
	      e.stopPropagation();
	      e.preventDefault();
	
	      // Get pasted data via clipboard API
	      var pastedData = getClipboardData(e);
	      var selection = this.selection;
	
	      if (selection.start !== selection.end) this.remove(selection.start, selection.end);
	      this.cursor = this.add(pastedData, selection.start);
	    }
	  }, {
	    key: 'onCut',
	    value: function onCut(e) {
	      var _this2 = this;
	
	      var selection = this.selection;
	      var value = this.value;
	
	      setTimeout(function () {
	        _this2.value = value;
	        _this2.cursor = _this2.remove(selection.start, selection.end);
	      });
	    }
	  }, {
	    key: 'onFocus',
	    value: function onFocus(e) {
	      var _this3 = this;
	
	      if (this.options.showOnFocus) {
	        e.preventDefault(); // input will be focused while setting cursor
	        this.model = this.model || '';
	        setTimeout(function () {
	          _this3.cursor = _this3._getCursorPosition(_this3.model.length - 1);
	        }, 0);
	      }
	    }
	  }, {
	    key: 'onBlur',
	    value: function onBlur(e) {
	      if (!this.options.showAlways && this.options.hideOnBlur && this.model.length === 0) {
	        this.viewValue = '';
	      }
	    }
	  }, {
	    key: 'viewValue',
	    get: function get() {
	      return this._element.value;
	    },
	    set: function set(value) {
	      this._element.value = value;
	    }
	  }, {
	    key: 'model',
	    get: function get() {
	      return this._modelGetter();
	    },
	    set: function set(modelValue) {
	      this._modelSetter(modelValue);
	      this.options.onModelChange && this.options.onModelChange(modelValue);
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
	
	      if (this._element.selectionStart !== undefined) {
	        start = this._element.selectionStart;
	        end = this._element.selectionEnd;
	      } else {
	        try {
	          this._element.focus();
	          rangeEl = this._element.createTextRange();
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
	        if (this._element.selectionStart !== undefined) {
	          this._element.focus();
	          this._element.setSelectionRange(selection.start, selection.end);
	        } else {
	          this._element.focus();
	          rangeEl = this._element.createTextRange();
	          rangeEl.collapse(true);
	          rangeEl.moveStart('character', selection.start);
	          rangeEl.moveEnd('character', selection.end - selection.start);
	          rangeEl.select();
	        }
	      } catch (e) {
	        console.log('catched on set selection');
	      }
	    }
	  }]);
	
	  return MaskedInput;
	}(_core2.default);
	
	exports.default = MaskedInput;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	// Source: http://jsfiddle.net/vWx8V/
	// http://stackoverflow.com/questions/5603195/full-list-of-javascript-keycodes
	
	/**
	 * Conenience method returns corresponding value for given keyName or keyCode.
	 *
	 * @param {Mixed} keyCode {Number} or keyName {String}
	 * @return {Mixed}
	 * @api public
	 */
	
	exports = module.exports = function(searchInput) {
	  // Keyboard Events
	  if (searchInput && 'object' === typeof searchInput) {
	    var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode
	    if (hasKeyCode) searchInput = hasKeyCode
	  }
	
	  // Numbers
	  if ('number' === typeof searchInput) return names[searchInput]
	
	  // Everything else (cast to string)
	  var search = String(searchInput)
	
	  // check codes
	  var foundNamedKey = codes[search.toLowerCase()]
	  if (foundNamedKey) return foundNamedKey
	
	  // check aliases
	  var foundNamedKey = aliases[search.toLowerCase()]
	  if (foundNamedKey) return foundNamedKey
	
	  // weird character?
	  if (search.length === 1) return search.charCodeAt(0)
	
	  return undefined
	}
	
	/**
	 * Get by name
	 *
	 *   exports.code['enter'] // => 13
	 */
	
	var codes = exports.code = exports.codes = {
	  'backspace': 8,
	  'tab': 9,
	  'enter': 13,
	  'shift': 16,
	  'ctrl': 17,
	  'alt': 18,
	  'pause/break': 19,
	  'caps lock': 20,
	  'esc': 27,
	  'space': 32,
	  'page up': 33,
	  'page down': 34,
	  'end': 35,
	  'home': 36,
	  'left': 37,
	  'up': 38,
	  'right': 39,
	  'down': 40,
	  'insert': 45,
	  'delete': 46,
	  'command': 91,
	  'left command': 91,
	  'right command': 93,
	  'numpad *': 106,
	  'numpad +': 107,
	  'numpad -': 109,
	  'numpad .': 110,
	  'numpad /': 111,
	  'num lock': 144,
	  'scroll lock': 145,
	  'my computer': 182,
	  'my calculator': 183,
	  ';': 186,
	  '=': 187,
	  ',': 188,
	  '-': 189,
	  '.': 190,
	  '/': 191,
	  '`': 192,
	  '[': 219,
	  '\\': 220,
	  ']': 221,
	  "'": 222
	}
	
	// Helper aliases
	
	var aliases = exports.aliases = {
	  'windows': 91,
	  '⇧': 16,
	  '⌥': 18,
	  '⌃': 17,
	  '⌘': 91,
	  'ctl': 17,
	  'control': 17,
	  'option': 18,
	  'pause': 19,
	  'break': 19,
	  'caps': 20,
	  'return': 13,
	  'escape': 27,
	  'spc': 32,
	  'pgup': 33,
	  'pgdn': 34,
	  'ins': 45,
	  'del': 46,
	  'cmd': 91
	}
	
	
	/*!
	 * Programatically add the following
	 */
	
	// lower case chars
	for (i = 97; i < 123; i++) codes[String.fromCharCode(i)] = i - 32
	
	// numbers
	for (var i = 48; i < 58; i++) codes[i - 48] = i
	
	// function keys
	for (i = 1; i < 13; i++) codes['f'+i] = i + 111
	
	// numpad keys
	for (i = 0; i < 10; i++) codes['numpad '+i] = i + 96
	
	/**
	 * Get by code
	 *
	 *   exports.name[13] // => 'Enter'
	 */
	
	var names = exports.names = exports.title = {} // title for backward compat
	
	// Create reverse mapping
	for (i in codes) names[codes[i]] = i
	
	// Add aliases
	for (var alias in aliases) {
	  codes[alias] = aliases[alias]
	}


/***/ }
/******/ ])
});
;
//# sourceMappingURL=nebo15-mask.js.map