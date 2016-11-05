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
  onInputChange(e) {
    const { value } = e.target;

    this.element.value = Mask.format(value, this.mask);
  }
  onKeydown(e) {
    const keyCode = e.keyCode;

    if (e.ctrlKey || e.altKey || e.metaKey || (keyCode < 46 && [KEYS.backspace].indexOf(keyCode) === -1)) return;
    e.preventDefault();
    if (keyCode === KEYS.backspace) this.removeChar();
    else this.addChar(String.fromCharCode(keyCode));
  }
  removeChar() {
    const position = String(this.element.value).length;
    let i = position - 1;
    let deleted = false;

    while (!deleted && this.mask[i] || this.mask[i] instanceof MaskPlaceStatic || i >= this.mask.length) {
      if (!(this.mask[i] instanceof MaskPlaceStatic)) deleted = true;
      this.element.value = this.element.value.slice(0, i);
      i--;
    }
  }
  addChar(char) {
    const position = String(this.element.value).length;
    let i = position;

    while (this.mask[i] && this.mask[i] instanceof MaskPlaceStatic) {
      this.element.value += this.mask[i].pattern;
      i++;
    }
    if (this.mask[i]) {
      this.element.value += char;
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
