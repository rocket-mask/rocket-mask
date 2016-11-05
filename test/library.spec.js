
import chai from 'chai';
import spies from 'chai-spies';
import simulant from 'simulant';
import Nebo15Mask from '../lib/nebo15-mask.js';

chai.use(spies);
chai.expect();

const expect = chai.expect;
const codeFromCharOrCode = charOrCode => typeof charOrCode === 'number' ? charOrCode : charOrCode.charCodeAt(0);
const fireKeydown = (element, charOrCode) => simulant.fire(element, 'keydown', {
  keyCode: codeFromCharOrCode(charOrCode)
});
const fireChange = (element, value) => {
  element.value = value;
  return simulant.fire(element, 'change');
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

describe('static methods', function () {

  describe('when I need to parse mask string', function () {
    it('should return the array of mask patterns', () => {
      expect(Nebo15Mask.parseMask('11_1')).to.be.have.length(4);
    });
  });
  describe('when I need to format string by mask', function () {
    it('should cut off over length value', () => {
      expect(Nebo15Mask.format('123456', Nebo15Mask.parseMask('11'))).to.equal('12');
    });
    it('should return formatted string, when value have been matched with mask', () => {
      expect(Nebo15Mask.format('123456', Nebo15Mask.parseMask('11 11 11'))).to.equal('12 34 56');
    });
    it('should return formatted string, while value match mask', () => {
      expect(Nebo15Mask.format('123456', Nebo15Mask.parseMask('11-wwww'))).to.equal('12-');
    });
    it('should support static symbols in start and end', () => {
      expect(Nebo15Mask.format('123456', Nebo15Mask.parseMask('(((-11-)))'))).to.equal('(((-12-)))');
    });
  });
  describe('when I need to parse string by mask', function () {
    it('should cut off over length value', () => {
      expect(Nebo15Mask.parse('123456', Nebo15Mask.parseMask('11'))).to.equal('12');
    });
    it('should return parse string, when value have been matched with mask', () => {
      expect(Nebo15Mask.parse('12 34 56', Nebo15Mask.parseMask('11 11 11'))).to.equal('123456');
    });
    it('should return parsed string, while value match mask', () => {
      expect(Nebo15Mask.parse('12 34 56', Nebo15Mask.parseMask('11 11-12'))).to.equal('1234');
    });
  });
  describe('when I call constructor', () => {
    it('should save element and mask to local scope', () => {
      var input = document.createElement('input');
      var mask = Nebo15Mask.parseMask('111');
      var inst = new Nebo15Mask(input, '111');

      expect(inst.element).to.equal(input);
      expect(inst.mask).to.deep.equal(mask);
    });
  });
  describe('when I input input element', () => {
    let instance;
    beforeEach(() => {
      instance = new Nebo15Mask(document.createElement('input'), '11-11');
    });
    it('should react on keydown event and format input by mask', () => {
      fireKeydown(instance.element, '1');
      expect(instance.element.value).to.equal('1');
      fireKeydown(instance.element, '2');
      expect(instance.element.value).to.equal('12');
      fireKeydown(instance.element, '3');
      expect(instance.element.value).to.equal('12-3');
      fireKeydown(instance.element, '4');
      expect(instance.element.value).to.equal('12-34');
    });
    it('should not overflow mask on keydown', () => {
      fireChange(instance.element, '1234');
      expect(instance.element.value).to.equal('12-34');
      fireKeydown(instance.element, '5');
      expect(instance.element.value).to.equal('12-34');
    });
    it('should react on change event and format input by mask', () => {
      fireChange(instance.element, '1234');
      expect(instance.element.value).to.equal('12-34');
    });
    it('should remove characters on backspace keydown', () => {
      fireChange(instance.element, '1234');
      expect(instance.element.value).to.equal('12-34');
      fireKeydown(instance.element, KEYS.backspace);
      expect(instance.element.value).to.equal('12-3');
      fireKeydown(instance.element, KEYS.backspace);
      expect(instance.element.value).to.equal('12');
      fireKeydown(instance.element, KEYS.backspace);
      expect(instance.element.value).to.equal('1');
      fireKeydown(instance.element, KEYS.backspace);
      expect(instance.element.value).to.equal('');
    });
  });
});
