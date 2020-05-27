import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga/effects';
import rootSaga from '../index';
import * as API from '../../API';
import * as actions from '../../store/exchange/actions';
import { changeActiveWallet } from '../../store/activeWallet/actions';
import { Currencies } from '../../constants/currencies';

describe('Sagas tests', () => {
	const mockedResponse = {
		base: Currencies.EUR,
		date: '2020-10-01',
		rates: {
			USD: 1.01,
			RUB: 78.42
		}
	};
	it('should get and set exchange rates', () => {
		return expectSaga(rootSaga)
			.provide([[call(API.getExchangeRates, mockedResponse.base), mockedResponse]])
			.put(actions.setExchangeRates(mockedResponse))
			.dispatch(actions.getExchangeRates(mockedResponse.base))
			.run();
	});

	it('should update currency for putcoming (from) wallet and get and set exchange rates', () => {
		return expectSaga(rootSaga)
			.provide([[call(API.getExchangeRates, mockedResponse.base), mockedResponse]])
			.put(changeActiveWallet(mockedResponse.base))
			.put(actions.setExchangeRates(mockedResponse))
			.dispatch(actions.updateOutcomingWallet(mockedResponse.base))
			.run();
	});
});