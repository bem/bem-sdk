const expect = require('chai').expect;

const { Key, ParamedKey, PluralKey } = require('..');


describe('Key', () => {

it('should return an function', () => {
    expect(Key).to.be.an('Function');
});

describe('Simple Key', () => {
    it('should create simple key', () => {
        const key = new Key('Time difference', 'Разница во времени');
        expect(key.name).to.eql('Time difference');
        expect(key.value).to.eql('Разница во времени');
    });

    it('should throw with wrong type of key_name', () => {
        expect(() => {
            new Key({ 42: 42}, 'Разница во времени');
        }).to.throw();

        expect(() => {
            new Key(42, 'Разница во времени');
        }).to.throw();
    });
});

describe('Paramed Key', () => {
    it('should create paramed key', () => {
        const key = new ParamedKey('Time in {city}', 'Точное время {city}', ['city']);
        expect(key.name).to.eql('Time in {city}');
        expect(key.value).to.eql('Точное время {city}');
        expect(key.params).to.be.an('array');
        expect(key.params[0]).to.eql('city');
    });

    it('should throw if value doesn\'t include param', () => {
        expect(() => {
            new ParamedKey('Time in {city}', 'Точное время {city} {val}', ['city', 'town']);
        }).to.throw('Key: value should include param: town');
    });
});

describe('Plural Key', () => {
    it('should create plural key', () => {
        const key = new PluralKey('{count} minute', {
            one: "{count} минута",
            some: "{count} минуты",
            many: "{count} минут",
            none: "нет минут"
        });

        expect(key.name).to.eql('{count} minute');
        expect(key.forms.one).to.eql('{count} минута');
    });
});

});
