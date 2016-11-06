import Core from './core';

const KEYS = {
  backspace: 8,
  tab:	9,
  enter: 13,
  shift: 16,
  ctrl:	17,
  alt: 18,
  pauseBreak:	19,
  capsLock:	20,
  escape:	27,
  pageUp:	33,
  pageDown:	34,
  end:	35,
  home:	36,
  leftArrow:	37,
  upArrow:	38,
  rightArrow:	39,
  downArrow:	40,
  insert:	45,
  delete:	46
};

export default class MaskedInput extends Core {

  constructor(element, mask) {
    super(mask);

    this._element = element;
    this.onInputChange = this.onInputChange.bind(this);
    this.onKeydown = this.onKeydown.bind(this);

    this._element.addEventListener('change', this.onInputChange);
    this._element.addEventListener('keydown', this.onKeydown);
  }
  get viewValue() {
    return this._element.value;
  }
  set viewValue(value) {
    this._element.value = value;
  }

  onInputChange(e) {
    const { value } = e.target;

    this.model = value;
  }
  onKeydown(e) {
    const keyCode = e.keyCode;

    if (e.ctrlKey || e.altKey || e.metaKey || (keyCode < 46 && [KEYS.backspace].indexOf(keyCode) === -1)) return;
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
