import { WalletsState } from '../../../store/wallets/reducer';

export const initialWallets: WalletsState = {
	USD: 25.51,
	EUR: 116.12,
	GBP: 58.33,
	RUB: 1254.66
};

export const changedWallets: WalletsState = {
	USD: 45.51,
	EUR: 116.12,
	GBP: 58.33,
	RUB: 0
};