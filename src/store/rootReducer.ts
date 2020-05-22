import { combineReducers } from 'redux';
import walletsReducer from './wallets/reducer';

export default combineReducers({
	wallets: walletsReducer
});