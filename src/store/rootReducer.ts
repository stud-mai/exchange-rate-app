import { combineReducers } from 'redux';
import walletsReducer from './wallets/reducer';
import activeWalletReducer from './activeWallet/reducer';
import exchangeReducer from './exchange/reducer';

export default combineReducers({
	wallets: walletsReducer,
	activeWallet: activeWalletReducer,
	exchange: exchangeReducer
});