import * as actions from '../actions';
import { ActionTypes } from '../actionTypes';
import { Currencies } from '../../../constants/currencies';

describe('Wallets Actions', () => {
	it('should create an action to update wallets state', () => {
		const from = { currency: Currencies.RUB, amount: 730 };
		const to = { currency: Currencies.EUR, amount: 10 };
		const expectedAction = {
			type: ActionTypes.UPDATE_WALLETS,
			from,
			to
		};
		expect(actions.updateWallets(from, to)).toEqual(expectedAction);
	});
});