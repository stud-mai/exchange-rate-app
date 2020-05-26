import reducer, { INITIAL_STATE } from '../reducer';
import { ActionTypes } from '../actionTypes';
import { Currencies } from '../../../constants/currencies';

describe('Wallets Reducer', () => {
	it('should be defined', () => {
		expect(reducer).toBeDefined();
	});

	it('should return the initial state', () => {
		expect(reducer(undefined, {} as any)).toEqual(INITIAL_STATE);
	});

	it('should handle updating wallets', () => {
		const from = { currency: Currencies.RUB, amount: 254.66 };
		const to = { currency: Currencies.EUR, amount: 4.08 };
		const action = {
			type: ActionTypes.UPDATE_WALLETS,
			from,
			to
		};
		expect(reducer(INITIAL_STATE, action)).toEqual({
			USD: 25.51,
			EUR: 120.20,
			GBP: 58.33,
			RUB: 1000.00
		});
	});

	it('should handle undefined amount correctly', () => {
		const from = { currency: Currencies.GBP, amount: undefined };
		const to = { currency: Currencies.USD, amount: undefined };
		const action = {
			type: ActionTypes.UPDATE_WALLETS,
			from,
			to
		};
		expect(reducer(INITIAL_STATE, action)).toEqual(INITIAL_STATE);
	});
});