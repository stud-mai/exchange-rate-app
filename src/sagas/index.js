import { all, takeLatest, take, put, call, fork, cancel, delay, race } from 'redux-saga/effects';
import * as API from '../API';
import { setExchangeRates } from '../store/exchange/actions';
import { changeActiveWallet } from '../store/activeWallet/actions';
import { ActionTypes } from '../store/exchange/actionTypes';

const DELAY = 10000;

function* ratesUpdating(baseCurrency) {
	while (true) {
		const data = yield call(API.getExchangeRates, baseCurrency);
		yield put(setExchangeRates(data));
		yield delay(DELAY);
	}
}

function* getExchangeRates({ baseCurrency }) {
	const updateTask = yield fork(ratesUpdating, baseCurrency);
	yield race([
		take(ActionTypes.CANCEL_EXCHANGE),
		take(ActionTypes.UPDATE_OUTCOMING_WALLET)
	]);
	yield cancel(updateTask);
}

function* updateOutcomingWallet({ currency }) {
	yield put(changeActiveWallet(currency));
	yield call(getExchangeRates, { baseCurrency: currency });
}

function* rootSaga() {
	yield all([
		takeLatest(ActionTypes.GET_EXCHANGE_RATES, getExchangeRates),
		takeLatest(ActionTypes.UPDATE_OUTCOMING_WALLET, updateOutcomingWallet),
	]);
}

export default rootSaga;