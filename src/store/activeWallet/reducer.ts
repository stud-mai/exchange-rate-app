import { Currencies } from '../../constants/currencies';
import { ActiveWallet, ActiveWalletActions } from './actions';
import { ActionTypes } from './actionTypes';

export type ActiveWalletState = ActiveWallet;

export const INITIAL_STATE: ActiveWalletState = Currencies.EUR;

const activeWalletReducer = (state = INITIAL_STATE, action: ActiveWalletActions): ActiveWalletState => {
	switch (action.type) {
		case ActionTypes.CHANGE_ACTIVE_WALLET:
			return action.activeWallet;
		default:
			return state;
	}
};

export default activeWalletReducer;