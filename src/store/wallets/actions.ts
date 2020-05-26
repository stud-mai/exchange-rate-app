import { ActionTypes } from './actionTypes';
import { Exchangable } from '../exchange/reducer';

export type WalletsActions = { type: ActionTypes.UPDATE_WALLETS, from: Exchangable, to: Exchangable };

export const updateWallets = (from: Exchangable, to: Exchangable): WalletsActions => ({
	type: ActionTypes.UPDATE_WALLETS,
	from,
	to
});