export class MaskPlace {
  constructor(pattern, idx) {
    this.pattern = pattern;
    this.idx = idx;
  }
  get placeholder() {
    return '_';
  }
  test() {
    throw Error('method test must be overrided');
  }
}

class MaskPlaceRegexp extends MaskPlace {
  test(char = '') {
    return this.pattern.test(char);
  }
}
class MaskPlaceStatic extends MaskPlace {
  get placeholder() {
    return this.pattern;
  }
  test(char) {
    return this.pattern === char;
  }
}
class MaskPlaceFunction extends MaskPlace {
  test(char) {
    return this.pattern(char);
  }
}

MaskPlace.create = function (test, idx) {
  if (typeof test === 'undefined' || test === null) throw new Error('undefined test char');

  if (test instanceof RegExp) return new MaskPlaceRegexp(test, idx);
  else if (typeof test === 'function') return new MaskPlaceFunction(test, idx);
  return new MaskPlaceStatic(test, idx);
};

const KEYS = {
  backspace: 8,
  'tab':	9,
  'enter': 13,
  'shift': 16,
  'ctrl':	17,
  'alt': 18,
  'pauseBreak':	19,
  'capsLock':	20,
  'escape':	27,
  'pageUp':	33,
  'pageDown':	34,
  'end':	35,
  'home':	36,
  'leftArrow':	37,
  'upArrow':	38,
  'rightArrow':	39,
  'downArrow':	40,
  'insert':	45,
  'delete':	46
};

class Mask {
  constructor(mask) {
    this._name = 'nebo15-mask';
    this._mask = Mask.parseMask(mask);
  }

  // public interfaces
  get viewValue() {
    throw new Error('get view value must me overrited');
  }
  set viewValue(value) {
    throw new Error('get view value must me overrited');
  }

  get value() {
    return this.viewValue;
  }
  set value(value) {
    this.model = Mask.parse(value, this.mask);
  }
  get model() {
    return Mask.parse(this.value, this.mask);
  }
  set model(modelValue) {
    this.viewValue = Mask.format(modelValue, this.mask);
  }

  _getModelPosition(maskPosition) {
    return this.mask.slice(0, maskPosition).reduce((sum, cur) => sum += !(cur instanceof MaskPlaceStatic), 0);
  }
  _getMaskPosition(modelPosition) {
    return this.mask.reduce(
      (sum, cur) => {
        if (modelPosition === -1) return sum;
        if (cur instanceof MaskPlaceStatic) return sum + 1;
        modelPosition--;
        return sum + 1;
      }, -1
    );
  }
  _getCursorPosition(leftPlaces) {
    let finish = false;

    return this.mask.reduce(
      (sum, cur, i) => {
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
      }
    , 0);
  }

  get __modelSize() {
    return this.mask.reduce((sum, cur) => sum += !(cur instanceof MaskPlaceStatic), 0);
  }
  /**
   * Adding string/char by cursort position.
   * By default. insert at the end of the mask
   * @param {string} char - insert string
   * @param {number} position - cursor position
   * @returns {number} cursor position
   */
  add(char = '', position = this.value.length) {
    const modelPosition = this._getModelPosition(position);
    const model = this.model;
    const leftPlaces = this.__modelSize - model.length;
    const insertChunk = char.slice(0, leftPlaces) || '';
    const newModel = model.slice(0, modelPosition) + insertChunk + model.slice(modelPosition);

    this.model = newModel;
    return this._getCursorPosition(modelPosition + (insertChunk.length - 1));
  }
  /**
   * Remove from mask by start and end selection positions
   * @param {number} start selection`s start cursor position
   * @param {number} end selection`s end cursor position
   * @throws end must be >= start
   * @returns {number} cursor position
   */
  remove(start, end) {
    const model = this.model;

    if (end < start) return start;

    const startModel = this._getModelPosition(start);
    const endModel = this._getModelPosition(end);

    this.model = model.slice(0, startModel) + model.slice(endModel);
    return start;
  }
  backspace(position) {
    if (position === 0) return position;
    const prevCharacter = this._getModelPosition(position);

    return this.remove(this._getCursorPosition(prevCharacter - 2), position);
  }
  forwardDelete(position) {
    if (position === this.mask.length) return position;
    const prevCharacter = this._getModelPosition(position);

    return this.remove(position, this._getCursorPosition(prevCharacter));
  }

  get name() {
    return this._name;
  }
  get mask() {
    return this._mask;
  }
}
Mask.maskedOptions = {
  '1': /\d/,
  'w': /[a-zA-Z]/
};
Mask.parseMask = function (mask = '') {
  return String(mask).split('').map((i, idx) => MaskPlace.create(Mask.maskedOptions[i] || i, idx));
};
Mask.format = function (value, maskArr = []) {
  value = value || '';
  return typeof maskArr[0] === 'undefined' ? '' :
  maskArr[0] instanceof MaskPlaceStatic ? (maskArr[0].pattern + Mask.format(value, maskArr.slice(1))) :
  maskArr[0].test(value[0]) ? ((value[0] || '') + Mask.format(value.slice(1), maskArr.slice(1))) : '';
};
Mask.parse = function (value, maskArr = []) {
  value = value || '';
  return typeof maskArr[0] === 'undefined' ? '' :
  maskArr[0] instanceof MaskPlaceStatic ?
  maskArr[0].test(value[0]) ?
  (Mask.parse(value.slice(1), maskArr.slice(1))) :
  '' :
  maskArr[0].test(value[0]) ? (value[0] + Mask.parse(value.slice(1), maskArr.slice(1))) : '';
};

export default class MaskedInput extends Mask {

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
