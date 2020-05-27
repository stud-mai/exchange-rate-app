import reducer, { INITIAL_STATE } from '../reducer';
import { ExchangeActions } from '../actions';
import { ActionTypes } from '../actionTypes';
import { Currencies } from '../../../constants/currencies';

describe('Wallets Reducer', () => {
	it('should be defined', () => {
		expect(reducer).toBeDefined();
	});

	it('should return the initial state', () => {
		expect(reducer(undefined, {} as any)).toEqual(INITIAL_STATE);
	});

	it('should set currencies for incoming (to) and outcomming (from) wallets', () => {
		const action: ExchangeActions = {
			type: ActionTypes.GET_EXCHANGE_RATES,
			baseCurrency: Currencies.RUB
		};
		expect(reducer(INITIAL_STATE, action)).toEqual({
			from: { currency: Currencies.RUB },
			to: { currency: Currencies.EUR },
			rates: {}
		});
	});

	it('should be different currencies for incoming (to) and outcomming (from) wallets', () => {
		const action: ExchangeActions = {
			type: ActionTypes.GET_EXCHANGE_RATES,
			baseCurrency: Currencies.EUR
		};
		expect(reducer(INITIAL_STATE, action)).toEqual({
			from: { currency: Currencies.EUR },
			to: { currency: Currencies.USD },
			rates: {}
		});
	});

	describe('Setting new exchange rates', () => {
		const action: ExchangeActions = {
			type: ActionTypes.SET_EXCHANGE_RATES,
			data: {
				base: Currencies.EUR,
				date: '2020-10-01',
				rates: {
					USD: 1.01,
					RUB: 78.42
				}
			}
		};

		it('should set new exchange rates', () => {
			expect(reducer(INITIAL_STATE, action)).toEqual({
				from: { currency: Currencies.EUR },
				to: { currency: Currencies.USD },
				rates: {
					USD: 1.01,
					RUB: 78.42
				}
			});
		});

		it('should recalculate amount prop of incoming wallet', () => {
			const state = {
				...INITIAL_STATE,
				from: { ...INITIAL_STATE.from, amount: 100 },
				to: { ...INITIAL_STATE.to, amount: 99 },
			};
			expect(reducer(state, action)).toEqual({
				from: { currency: Currencies.EUR, amount: 100 },
				to: { currency: Currencies.USD, amount: 101 },
				rates: {
					USD: 1.01,
					RUB: 78.42
				}
			});
		});
	});

	describe('Updating amount prop for given wallet', () => {
		const state = {
			from: { currency: Currencies.USD, amount: 10 },
			to: { currency: Currencies.RUB, amount: 733.90 },
			rates: { RUB: 73.39 }
		};
		it('should update amount prop for outcomming (from) wallet', () => {
			const action: ExchangeActions = {
				type: ActionTypes.UPDATE_AMOUNT,
				wallet: 'from',
				value: '100'
			};
			expect(reducer(state, action)).toEqual({
				from: { currency: Currencies.USD, amount: 100 },
				to: { currency: Currencies.RUB, amount: 7339 },
				rates: { RUB: 73.39 }
			});
		});

		it('should update amount prop for outcomming (from) wallet with undefined', () => {
			const action: ExchangeActions = {
				type: ActionTypes.UPDATE_AMOUNT,
				wallet: 'from',
				value: ''
			};
			expect(reducer(state, action)).toEqual({
				from: { currency: Currencies.USD, amount: undefined },
				to: { currency: Currencies.RUB, amount: undefined },
				rates: { RUB: 73.39 }
			});
		});

		it('should update amount prop for incomming (to) wallet', () => {
			const action: ExchangeActions = {
				type: ActionTypes.UPDATE_AMOUNT,
				wallet: 'to',
				value: '14678'
			};
			expect(reducer(state, action)).toEqual({
				from: { currency: Currencies.USD, amount: 200 },
				to: { currency: Currencies.RUB, amount: 14678 },
				rates: { RUB: 73.39 }
			});
		});

		it('should not update amount prop if value has more than two digits after dot', () => {
			const action: ExchangeActions = {
				type: ActionTypes.UPDATE_AMOUNT,
				wallet: 'to',
				value: '733.9032'
			};
			expect(reducer(state, action)).toEqual(state);
		});

		it('should handle undefined value of amount prop for incomming (to) wallet', () => {
			const action: ExchangeActions = {
				type: ActionTypes.UPDATE_AMOUNT,
				wallet: 'to',
				value: ''
			};
			expect(reducer(state, action)).toEqual({
				from: { currency: Currencies.USD, amount: undefined },
				to: { currency: Currencies.RUB, amount: undefined },
				rates: { RUB: 73.39 }
			});
		});
	});

	describe('Updating incoming (to) wallet', () => {
		const action: ExchangeActions = {
			type: ActionTypes.UPDATE_INCOMING_WALLET,
			currency: Currencies.EUR
		};

		it('should update currency and amount props of incoming (to) wallet', () => {
			const state = {
				from: { currency: Currencies.USD, amount: 10 },
				to: { currency: Currencies.RUB, amount: 733.9 },
				rates: { RUB: 73.39, EUR: 0.93 }
			};
			expect(reducer(state, action)).toEqual({
				from: { currency: Currencies.USD, amount: 10 },
				to: { currency: Currencies.EUR, amount: 9.3 },
				rates: { RUB: 73.39, EUR: 0.93 }
			});
		});

		it('should update only currency prop of incoming (to) wallet', () => {
			const state = {
				from: { currency: Currencies.USD },
				to: { currency: Currencies.RUB },
				rates: { RUB: 73.39, EUR: 0.93 }
			};
			expect(reducer(state, action)).toEqual({
				from: { currency: Currencies.USD },
				to: { currency: Currencies.EUR },
				rates: { RUB: 73.39, EUR: 0.93 }
			});
		});
	});

	it('should update currency for outcoming (from) wallet and reset exchange rates', () => {
		const state = {
			from: { currency: Currencies.USD, amount: 10 },
			to: { currency: Currencies.RUB, amount: 733.9 },
			rates: { RUB: 73.39, EUR: 0.93 }
		};
		const action: ExchangeActions = {
			type: ActionTypes.UPDATE_OUTCOMING_WALLET,
			currency: Currencies.EUR
		};
		expect(reducer(state, action)).toEqual({
			from: { currency: Currencies.EUR, amount: 10 },
			to: { currency: Currencies.RUB },
			rates: {}
		});
	});

	it('should reset state to initial', () => {
		const state = {
			from: { currency: Currencies.USD, amount: 10 },
			to: { currency: Currencies.RUB, amount: 733.9 },
			rates: { RUB: 73.39, EUR: 0.93 }
		};
		const action: ExchangeActions = {
			type: ActionTypes.CANCEL_EXCHANGE
		};
		expect(reducer(state, action)).toEqual(INITIAL_STATE);
	});
});