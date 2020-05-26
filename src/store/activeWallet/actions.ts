
import { Currencies} from '../../constants/currencies';
import { ActionTypes } from './actionTypes';

export type ActiveWallet = keyof typeof Currencies;

export type ActiveWalletActions = { type: ActionTypes.CHANGE_ACTIVE_WALLET; activeWallet: ActiveWallet };

export const changeActiveWallet = (activeWallet: ActiveWallet): ActiveWalletActions => ({
	type: ActionTypes.CHANGE_ACTIVE_WALLET,
	activeWallet
});