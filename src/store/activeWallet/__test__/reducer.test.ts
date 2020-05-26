import reducer from '../reducer';
import { ActionTypes } from '../actionTypes';
import { Currencies } from '../../../constants/currencies';

describe('Active Wallet Reducer', () => {
	it('should be defined', () => {
		expect(reducer).toBeDefined();
	});

	it('should return the initial state', () => {
		expect(reducer(undefined, {} as any)).toEqual(Currencies.EUR);
	});

	it('should handle active wallet change', () => {
		const state = Currencies.USD;
		const action = {
			type: ActionTypes.CHANGE_ACTIVE_WALLET,
			activeWallet: Currencies.RUB
		};
		expect(reducer(state, action)).toEqual(Currencies.RUB);
	});
});