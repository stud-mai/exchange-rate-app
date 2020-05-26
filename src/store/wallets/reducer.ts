import { Currencies } from '../../constants/currencies';
import { WalletsActions } from './actions';
import { ActionTypes } from './actionTypes';
import { toHundredths } from '../../utils';

export type WalletsState = {
	[key in Currencies]: number
}

export const INITIAL_STATE: WalletsState = {
	USD: 25.51,
	EUR: 116.12,
	GBP: 58.33,
	RUB: 1254.66
};

const walletsReducer = (state = INITIAL_STATE, action: WalletsActions): WalletsState => {
	switch (action.type) {
		case ActionTypes.UPDATE_WALLETS: {
			const { from, to } = action;
			return {
				...state,
				[from.currency]: toHundredths(state[from.currency] - (from.amount || 0)),
				[to.currency]: toHundredths(state[to.currency] + (to.amount || 0))
			};
		}

		default:
			return state;
	}
};

export default walletsReducer;