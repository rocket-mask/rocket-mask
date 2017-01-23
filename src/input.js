import Core from './core';

const KEYS = {
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

const getClipboardData = e => (e.clipboardData || window.clipboardData).getData('Text');

export default class MaskedInput extends Core {

  constructor(element, mask, options = {}) {

    options = Object.assign({
      placeholder: null,
      showOnFocus: false,
      hideOnBlur: false,
      showAlways: false
    }, options);

    super(mask, options.placeholder);

    this.options = options;
    this._element = element;
    this.onChange = this.onChange.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onPaste = this.onPaste.bind(this);
    this.onCut = this.onCut.bind(this);

    this._element.addEventListener('change', this.onChange);
    this._element.addEventListener('keydown', this.onKeydown);
    this._element.addEventListener('paste', this.onPaste);
    this._element.addEventListener('cut', this.onCut);

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this._element.addEventListener('focus', this.onFocus);
    this._element.addEventListener('blur', this.onBlur);

    if (options.showAlways) {
      this._model = this._model || '';
    }
  }
  get viewValue() {
    return this._element.value;
  }
  set viewValue(value) {
    this._element.value = value;
  }

  get model() {
    return this._modelGetter();
  }
  set model(modelValue) {
    this._modelSetter(modelValue);
    this.options.onModelChange && this.options.onModelChange(modelValue);
  }

  onChange(e) {
    const { value } = e.target;

    this._model = value;
  }
  onKeydown(e) {
    e = e || window.event;
    const keyCode = e.keyCode || e.which;

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
    if (e.ctrlKey || e.altKey || e.metaKey ||
      (keyCode < 46 && [KEYS.backspace, KEYS.space].indexOf(keyCode) === -1)
    ) return null;

    e.preventDefault();

    const selection = this.selection;

    if (keyCode === KEYS.backspace) {
      this.cursor = selection.start === selection.end ?
        this.backspace(selection.start) :
        this.remove(selection.start, selection.end);
    } else if (keyCode === KEYS.delete) {
      this.cursor = selection.start === selection.end ?
        this.forwardDelete(selection.start) :
        this.remove(selection.start, selection.end);
    } else {
      if (selection.start !== selection.end) this.remove(selection.start, selection.end);
      this.cursor = this.add(String.fromCharCode(keyCode), selection.start);
    }
  }
  onPaste(e) {
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    const pastedData = getClipboardData(e);
    const selection = this.selection;

    if (selection.start !== selection.end) this.remove(selection.start, selection.end);
    this.cursor = this.add(pastedData, selection.start);
  }
  onCut(e) {
    const selection = this.selection;
    const value = this.value;

    setTimeout(() => {
      this.value = value;
      this.cursor = this.remove(selection.start, selection.end);
    });
  }

  onFocus(e) {
    if (this.options.showOnFocus) {
      e.preventDefault(); // input will be focused while setting cursor
      this._model = this._model || '';
      setTimeout(() => {
        this.cursor = this._getCursorPosition(this._model.length - 1);
      }, 0);
    }
  }
  onBlur(e) {
    if (!this.options.showAlways && this.options.hideOnBlur && this._model.length === 0) {
      this.viewValue = '';
    }
  }
  get cursor() {
    return this.selection.start;
  }
  set cursor(position) {
    this.selection = { start: position, end: position };
  }
  get selection() {
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
      } catch (e) { /* not focused or not visible */ }
    }

    return { start, end };
  }
  set selection(selection) {
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
}
