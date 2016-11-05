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
	
	var isBackspace = function isBackspace(keycode) {
	  return keycode === 8;
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
	
	  _createClass(Mask, [{
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
	      if (keyCode === KEYS.backspace) this.removeChar();else this.addChar(String.fromCharCode(keyCode));
	    }
	  }, {
	    key: 'removeChar',
	    value: function removeChar() {
	      var position = String(this.element.value).length;
	      var i = position - 1;
	      var deleted = false;
	
	      while (!deleted && this.mask[i] || this.mask[i] instanceof MaskPlaceStatic || i >= this.mask.length) {
	        if (!(this.mask[i] instanceof MaskPlaceStatic)) deleted = true;
	        this.element.value = this.element.value.slice(0, i);
	        i--;
	      }
	    }
	  }, {
	    key: 'addChar',
	    value: function addChar(char) {
	      var position = String(this.element.value).length;
	      var i = position;
	
	      while (this.mask[i] && this.mask[i] instanceof MaskPlaceStatic) {
	        this.element.value += this.mask[i].pattern;
	        i++;
	      }
	      if (this.mask[i]) {
	        this.element.value += char;
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