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

export class MaskPlaceRegexp extends MaskPlace {
  test(char = '') {
    return this.pattern.test(char);
  }
}
export class MaskPlaceStatic extends MaskPlace {
  get placeholder() {
    return this.pattern;
  }
  test(char) {
    return this.pattern === char;
  }
}
export class MaskPlaceFunction extends MaskPlace {
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
