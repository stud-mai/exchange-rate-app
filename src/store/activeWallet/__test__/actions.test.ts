import * as actions from '../actions';
import { ActionTypes } from '../actionTypes';
import { Currencies } from '../../../constants/currencies';

describe('Active Wallet Actions', () => {
	it('should create an action to change active wallet', () => {
		const expectedAction = {
			type: ActionTypes.CHANGE_ACTIVE_WALLET,
			activeWallet: Currencies.RUB
		};
		expect(actions.changeActiveWallet(Currencies.RUB)).toEqual(expectedAction);
	});
});