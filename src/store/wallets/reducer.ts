import { WalletsState, HadlersType } from './types';

export const INITIAL_STATE: WalletsState = {
	USD: 25.51,
	EUR: 116.12,
	GBP: 58.33,
	RUB: 1254.66
};

const walletsReducer = (state: WalletsState = INITIAL_STATE, action: any): WalletsState => {
	const handlers: { [actionType: string]: HadlersType } = {};
	return handlers[action.type] ? handlers[action.type](state, action) : state;
};

export default walletsReducer;