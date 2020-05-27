import * as actions from '../actions';
import { ActionTypes } from '../actionTypes';
import { Currencies } from '../../../constants/currencies';

describe('Exchange Actions', () => {
	it('should create an action to get exchange rates', () => {
		const expectedAction = {
			type: ActionTypes.GET_EXCHANGE_RATES,
			baseCurrency: Currencies.GBP
		};
		expect(actions.getExchangeRates(Currencies.GBP)).toEqual(expectedAction);
	});

	it('should create an action to set new exhchange rates', () => {
		const data = {
			base: Currencies.GBP,
			date: '2020-10-01',
			rates: {
				USD: 1.01,
				EUR: 0.99
			}
		};
		const expectedAction = {
			type: ActionTypes.SET_EXCHANGE_RATES,
			data
		};
		expect(actions.setExchangeRates(data)).toEqual(expectedAction);
	});

	it('should create an action to cancel updating exchange rates', () => {
		const expectedAction = {
			type: ActionTypes.CANCEL_EXCHANGE
		};
		expect(actions.cancelExchange()).toEqual(expectedAction);
	});

	it('should create an action to update amount property for particular wallet', () => {
		const expectedAction = {
			type: ActionTypes.UPDATE_AMOUNT,
			wallet: 'from',
			value: '100'
		};
		expect(actions.updateAmount('from', '100')).toEqual(expectedAction);
	});

	it('should create an action to update currency of incomming wallet', () => {
		const expectedAction = {
			type: ActionTypes.UPDATE_INCOMING_WALLET,
			currency: Currencies.RUB
		};
		expect(actions.updateIncomingWallet(Currencies.RUB)).toEqual(expectedAction);
	});

	it('should create an action to update currency of outcomming wallet', () => {
		const expectedAction = {
			type: ActionTypes.UPDATE_OUTCOMING_WALLET,
			currency: Currencies.GBP
		};
		expect(actions.updateOutcomingWallet(Currencies.GBP)).toEqual(expectedAction);
	});
});