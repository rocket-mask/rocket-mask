
import chai from 'chai';
import spies from 'chai-spies';
import { MaskedInput as RocketMask } from '../lib/rocket-mask.js';

chai.use(spies);
chai.expect();

const expect = chai.expect;

describe('static methods', function () {

  describe('when I need to parse mask string', function () {
    it('should return the array of mask patterns', () => {
      expect(RocketMask.parseMask('11_1')).to.be.have.length(4);
    });
  });
  describe('when I need to format string by mask', function () {
    it('should cut off over length value', () => {
      expect(RocketMask.format('123456', RocketMask.parseMask('11'))).to.equal('12');
    });
    it('should return formatted string, when value have been matched with mask', () => {
      expect(RocketMask.format('123456', RocketMask.parseMask('11 11 11'))).to.equal('12 34 56');
    });
    it('should return formatted string, while value match mask', () => {
      expect(RocketMask.format('123456', RocketMask.parseMask('11-wwww'))).to.equal('12-');
    });
    it('should support static symbols in start and end', () => {
      expect(RocketMask.format('123456', RocketMask.parseMask('(((-11-)))'))).to.equal('(((-12-)))');
    });
    it('should not throw on undefined/null/empty values', () => {
      const mask = RocketMask.parseMask('11');

      expect(RocketMask.format(undefined, mask)).to.equal('');
      expect(RocketMask.format(null, mask)).to.equal('');
      expect(RocketMask.format('', mask)).to.equal('');
    });
  });
  describe('when I need to format string by mask with placeholders', function () {
    it('should use _ as default placeholder', () => {
      expect(RocketMask.formatWithPlaceholder('12', RocketMask.parseMask('1111'))).to.equal('12__');
    });
    it('should accept custom placeholder', () => {
      expect(RocketMask.formatWithPlaceholder('12', RocketMask.parseMask('11 11 11'), '*')).to.equal('12 ** **');
    });
    it('should display static symbols', () => {
      expect(RocketMask.formatWithPlaceholder('12', RocketMask.parseMask('+-(11)-11-11'), '*'))
      .to.equal('+-(12)-**-**');
    });

  });
  describe('when I need to parse string by mask', function () {
    it('should cut off over length value', () => {
      expect(RocketMask.parse('123456', RocketMask.parseMask('11'))).to.equal('12');
    });
    it('should return parse string, when value have been matched with mask', () => {
      expect(RocketMask.parse('12 34 56', RocketMask.parseMask('11 11 11'))).to.equal('123456');
    });
    it('should return parsed string, while value match mask', () => {
      expect(RocketMask.parse('12 34 56', RocketMask.parseMask('11 11-12'))).to.equal('1234');
    });
    it('should not throw on undefined/null/empty values', () => {
      expect(RocketMask.parse(undefined, RocketMask.parseMask('11'))).to.equal('');
      expect(RocketMask.parse(null, RocketMask.parseMask('11'))).to.equal('');
      expect(RocketMask.parse('', RocketMask.parseMask('11'))).to.equal('');
    });
  });
  describe('autocomplete', () => {
    beforeEach(() => {
    });
    it('should format by mask when set formatted', () => {
      const mask = RocketMask.parseMask('+38 (011) 111 11 11');

      expect(RocketMask.autocomplete('+38 (093) 268 54-46', mask)).to.equal('+38 (093) 268 54 46');
      expect(RocketMask.autocomplete('+38 (093) 268 54', mask)).to.equal('+38 (093) 268 54');
      expect(RocketMask.autocomplete('+38 (093) 26854', mask)).to.equal('+38 (093) 268 54');
      expect(RocketMask.autocomplete('+38 (093)as26854', mask)).to.equal('+38 (093) 268 54');
      expect(RocketMask.autocomplete('+38 (093)---as26sadas854', mask)).to.equal('+38 (093) 268 54');
    });
    it('should format with mask if set clear model', () => {
      const mask = RocketMask.parseMask('+38 (011) 111 11 11');

      expect(RocketMask.autocomplete('932685446', mask)).to.equal('+38 (093) 268 54 46');
    });

    it('should format with mask if set clear model', () => {
      const mask = RocketMask.parseMask('+38 (011) 111 11 11');

      expect(RocketMask.autocomplete('932685446', mask)).to.equal('+38 (093) 268 54 46');
      expect(RocketMask.autocomplete('9326854', mask)).to.equal('+38 (093) 268 54');
    });
  });
});

describe('core', () => {
  let instance;

  beforeEach(() => {
    instance = new RocketMask(document.createElement('input'), '11-11');
  });

  describe('model change callback', () => {
    it('should change', (done) => {
      const scopedInstance = new RocketMask(document.createElement('input'), '11-11', {
        onModelChange: () => done()
      });

      scopedInstance.add('1');
    });
  });

  describe('set/get model', () => {
    it('should format by mask on set model', () => {
      instance.model = '1234';
      expect(instance.value).to.equal('12-34');
    });
    it('should format by mask on get model', () => {
      instance.value = '12-34';
      expect(instance.model).to.equal('1234');
    });
  });
  describe('set/get value', () => {
    it('should try to parse by mask on set value', () => {
      instance.value = '12-aa';
      expect(instance.model).to.equal('12');
    });
    it('should return formatted value on get', () => {
      instance.model = '1234';
      expect(instance.value).to.equal('12-34');
    });
  });
  describe('add', () => {
    it('should add characters at the end by default', () => {
      instance.add('1');
      expect(instance.value).to.equal('1');
      instance.add('2');
      expect(instance.value).to.equal('12-');
    });
    it('should test before adding', () => {
      instance.value = '';
      instance.add('w'); // 12-34
      expect(instance.value).to.equal('');
    });
    it('should do nothing on wrong char adding', () => {
      instance.value = '12-3';
      instance.add('w', 0); // 12-34
      expect(instance.value).to.equal('12-3');
    });
    it('should add characters at position', () => {
      instance.value = '12-4';
      instance.add('3', 3); // 12-34
      expect(instance.value).to.equal('12-34');
    });
    it('should add characters at position', () => {
      const instance = new RocketMask(document.createElement('input'), '1111 1111 1111 1111');

      instance.model = '2222';
      instance.add('3333', 2);
      expect(instance.value).to.equal('2233 3322 ');

      instance.model = '2222';
      instance.add('3333', 4);
      expect(instance.value).to.equal('2222 3333 ');
    });
    it('should support adding string at position', () => {
      instance.value = '14';
      instance.add('23', 1); // 12-34
      expect(instance.value).to.equal('12-34');
    });
    it('should support adding empty string', () => {
      instance.value = '12-4';
      instance.add('', 1); // 12-34
      expect(instance.value).to.equal('12-4');
    });
    it('should test char by pattern', () => {
      instance = new RocketMask(document.createElement('input'), 'ww 1111');
      instance.add('a');
      instance.add('1');
      expect(instance.value).to.equal('a');
    });
    it('should not overflow mask', () => {
      instance.value = '12-34';
      instance.add('5678', 1);
      expect(instance.value).to.equal('12-34');
    });
    it('should return cursor new position', () => {
      instance.value = '1';
      expect(instance.add('2')).to.equal(3); // 12-
      expect(instance.add('3')).to.equal(4); // 12-3
      expect(instance.add()).to.equal(4); // 12-3
      expect(instance.add('4')).to.equal(5); // 12-34
    });
  });
  describe('remove', () => {
    it('should not remove by default', () => {
      instance.value = '12-34';
      instance.remove();
      expect(instance.value).to.equal('12-34');
    });
    it('should do nothing on empty range', () => {
      instance.value = '12-34'; // 1234
      instance.remove(3, 3);
      expect(instance.value).to.equal('12-34');
    });
    it('should remove from specific position 1 character by default', () => {
      instance.value = '12-34'; // 1234
      instance.remove(1, 2);
      expect(instance.value).to.equal('13-4');
    });
    it('should remove selection', () => {
      instance.value = '12-34'; // 1234
      instance.remove(0, 3);
      expect(instance.value).to.equal('34-');
    });
    it('should remove selection', () => {
      instance.value = '12-34'; // 1234
      instance.remove(2, 3);
      expect(instance.value).to.equal('12-34');
    });
    it('should return cursor new position', () => {
      instance.value = '12-34';
      expect(instance.remove(4, 5)).to.equal(4); // 12-3[4]
      expect(instance.remove(3, 4)).to.equal(3); // 12-[3]
      expect(instance.remove(1, 2)).to.equal(1); // 1[2]
      expect(instance.remove(0, 1)).to.equal(0); // [1]
    });
  });
  describe('backspace', () => {
    it('should delete prev character', () => {
      instance.value = '12-34';
      instance.backspace(5);
      expect(instance.value).to.equal('12-3');
    });
    it('should delete static symbols and character', () => {
      instance.value = '12-34';
      instance.backspace(3); // 1[2]-34
      expect(instance.value).to.equal('13-4');
    });
    it('should do nothing at start', () => {
      instance.value = '12-34';
      instance.backspace(0);
      expect(instance.value).to.equal('12-34');
    });
  });
  describe('undo/redo', () => {
    beforeEach(() => {
      instance.add('12');
      instance.add('3');
      instance.add('4');
      expect(instance._states).to.deep.equal([
        '12',
        '123',
        '1234'
      ]);
    });
    it('should save states on add/remove actions', () => {
      expect(instance._states).to.deep.equal([
        '12',
        '123',
        '1234'
      ]);
    });
    it('should not remove state on undo action', () => {
      instance.undo();
      expect(instance._states).to.deep.equal([
        '12',
        '123',
        '1234'
      ]);
    });
    it('should change model on undo action', () => {
      instance.undo();
      expect(instance.model).to.equal('123');
    });
    it('should support redo action', () => {
      instance.undo();
      expect(instance.model).to.equal('123');
      instance.redo();
      expect(instance.model).to.equal('1234');
    });
    it('should clear state, then add new state not at the end of state machine', () => {
      instance.undo();
      instance.undo();
      expect(instance.model).to.equal('12');
      instance.add('5');
      expect(instance._states).to.deep.equal([
        '12',
        '125'
      ]);
    });
  });
});

describe('private methods', () => {
  let instance;

  beforeEach(() => {
    instance = new RocketMask(document.createElement('input'), '11-11');
  });
  describe('_getModelPosition', () => {
    it('should return model position by mask position', () => {
      expect(instance._getModelPosition(0)).to.equal(0);
      expect(instance._getModelPosition(1)).to.equal(1);
      expect(instance._getModelPosition(2)).to.equal(2);
      expect(instance._getModelPosition(3)).to.equal(2);
      expect(instance._getModelPosition(4)).to.equal(3);
      expect(instance._getModelPosition(5)).to.equal(4);
    });
  });
  describe('_getCursorPosition', () => {
    it('should return cursor position by model position', () => {
      let instance = new RocketMask(document.createElement('input'), '--11--11');

      expect(instance._getCursorPosition(0)).to.equal(3);
      expect(instance._getCursorPosition(1)).to.equal(6);
      expect(instance._getCursorPosition(2)).to.equal(7);
      expect(instance._getCursorPosition(3)).to.equal(8);
    });
  });
  describe('_getMaskPosition', () => {
    it('should return mask position by model position', () => {
      let instance = new RocketMask(document.createElement('input'), '--11--11');

      expect(instance._getMaskPosition(0)).to.equal(2);
      expect(instance._getMaskPosition(1)).to.equal(3);
      expect(instance._getMaskPosition(2)).to.equal(6);
      expect(instance._getMaskPosition(3)).to.equal(7);
    });
  });
});
