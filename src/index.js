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
  test(char) {
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

export default class Mask {
  constructor(element, mask) {
    this._name = 'nebo15-mask';
    this._element = element;
    this._mask = Mask.parseMask(mask);
    this.onInputChange = this.onInputChange.bind(this);
    this.onKeydown = this.onKeydown.bind(this);

    this._element.addEventListener('change', this.onInputChange);
    this._element.addEventListener('keydown', this.onKeydown);
  }

  // public interfaces
  get viewValue() {
    return this.element.value;
  }
  set viewValue(value) {
    this.element.value = value;
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
  add(char, position = this.value.length) {
    const modelPosition = this._getModelPosition(position);
    const model = this.model;
    const leftPlaces = this.__modelSize - model.length;
    const insertChunk = char.slice(0, leftPlaces);
    const newModel = model.slice(0, modelPosition) + insertChunk + model.slice(modelPosition);

    this.model = newModel;
    return this._getCursorPosition(modelPosition + (insertChunk.length ? (insertChunk.length - 1) : 0));
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

    start = typeof start === 'number' ? start : this.mask.length;
    end = typeof end === 'number' ? end : (start + 1);

    if (end < start) throw new Error('remove: end must be >= start');

    const startModel = this._getModelPosition(start);
    const endModel = this._getModelPosition(end);

    this.model = model.slice(0, startModel) + model.slice(endModel);
    return this._getCursorPosition(startModel - 1);
  }

  onInputChange(e) {
    const { value } = e.target;

    this.element.value = Mask.format(value, this.mask);
  }
  onKeydown(e) {
    const keyCode = e.keyCode;

    if (e.ctrlKey || e.altKey || e.metaKey || (keyCode < 46 && [KEYS.backspace].indexOf(keyCode) === -1)) return;
    e.preventDefault();
    if (keyCode === KEYS.backspace) this.removeChar();
    else this.addChar(String.fromCharCode(keyCode), String(this.element.value).length);
  }
  removeChar() {
    const position = String(this.element.value).length;
    let i = position - 1;
    let deleted = false;

    while (!deleted && this.mask[i] || this.mask[i] instanceof MaskPlaceStatic || i >= this.mask.length) {
      if (!(this.mask[i] instanceof MaskPlaceStatic)) deleted = true;
      this.element.value = this.element.value.slice(0, i) + this.element.value.slice(i + 1);
      i--;
    }
  }
  addChar(char, position) {
    let i = position;

    while (this.mask[i] && this.mask[i] instanceof MaskPlaceStatic) {
      this.element.value += this.mask[i].pattern;
      i++;
    }
    if (this.mask[i] && this.mask[i].test(char)) {
      this.element.value += char;
    }
    this.cursor = this.cursor + 1;
  }

  get cursor() {
    return this.selection.start;
  }
  set cursor(position) {
    this.selection = { start: position, end: position };
  }
  get selection() {
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
      } catch (e) { /* not focused or not visible */ }
    }

    return { start, end };
  }
  set selection(selection) {
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
  get element() {
    return this._element;
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
  return typeof maskArr[0] === 'undefined' ? '' :
  maskArr[0] instanceof MaskPlaceStatic ? (maskArr[0].pattern + Mask.format(value, maskArr.slice(1))) :
  maskArr[0].test(value[0]) ? (value[0] + Mask.format(value.slice(1), maskArr.slice(1))) : '';
};
Mask.parse = function (value, maskArr = []) {
  return typeof maskArr[0] === 'undefined' ? '' :
  maskArr[0] instanceof MaskPlaceStatic ?
  maskArr[0].test(value[0]) ?
  (Mask.parse(value.slice(1), maskArr.slice(1))) :
  '' :
  maskArr[0].test(value[0]) ? (value[0] + Mask.parse(value.slice(1), maskArr.slice(1))) : '';
};
