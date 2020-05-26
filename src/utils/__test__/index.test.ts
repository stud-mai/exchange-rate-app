import * as utils from '../index';

describe('Utils tests', () => {
	it('should return value which was provided to function', () => {
		expect(utils.identity([1, '2', { a: 1 }])).toEqual([1, '2', { a: 1 }]);
	});

	it('should transform number to float number with 2 digits after dot', () => {
		expect(utils.toHundredths(123.456)).toEqual(123.46);
		expect(utils.toHundredths(999)).toEqual(999.00);
		expect(utils.toHundredths(.123456)).toEqual(0.12);
	});
});