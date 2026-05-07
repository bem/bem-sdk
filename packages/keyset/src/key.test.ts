import { expect } from 'chai';

import { Key, ParamedKey, PluralKey } from './index.js';

describe('Key', () => {
  it('should be a class', () => {
    expect(Key).to.be.a('Function');
  });

  describe('Simple Key', () => {
    it('should create simple key', () => {
      const key = new Key('Time difference', 'Разница во времени');
      expect(key.name).to.eql('Time difference');
      expect(key.value).to.eql('Разница во времени');
    });

    it('should throw with wrong type of key name', () => {
      expect(() => {
        new Key(
          { 42: 42 } as unknown as string,
          'Разница во времени',
        );
      }).to.throw();

      expect(() => {
        new Key(42 as unknown as string, 'Разница во времени');
      }).to.throw();
    });
  });

  describe('Paramed Key', () => {
    it('should create paramed key', () => {
      const key = new ParamedKey(
        'Time in {city}',
        'Точное время {city}',
        ['city'],
      );
      expect(key.name).to.eql('Time in {city}');
      expect(key.value).to.eql('Точное время {city}');
      expect(key.params).to.be.an('array');
      expect(key.params[0]).to.eql('city');
    });

    it("should throw if value doesn't include param", () => {
      expect(() => {
        new ParamedKey(
          'Time in {city}',
          'Точное время {city} {val}',
          ['city', 'town'],
        );
      }).to.throw('Key: value should include param: town');
    });
  });

  describe('Plural Key', () => {
    it('should create plural key', () => {
      const key = new PluralKey('{count} minute', {
        one: new Key('{count} minute', '{count} минута'),
        some: new Key('{count} minute', '{count} минуты'),
        many: new Key('{count} minute', '{count} минут'),
        none: new Key('{count} minute', 'нет минут'),
      });

      expect(key.name).to.eql('{count} minute');
      expect(key.forms.one!.value).to.eql('{count} минута');
    });
  });
});
