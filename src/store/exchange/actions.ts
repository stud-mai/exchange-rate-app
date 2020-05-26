import { Currencies } from '../../constants/currencies';
import { ActiveWallet } from '../activeWallet/actions';
import { ActionTypes } from './actionTypes';

type Rates = {
	[currency in Currencies]?: number
}

export interface RateResponse {
	base: Currencies,
	date: string,
	rates: Rates
}

export type ExchangeActions =
	| { type: ActionTypes.GET_EXCHANGE_RATES; baseCurrency: ActiveWallet }
	| { type: ActionTypes.SET_EXCHANGE_RATES; data: RateResponse }
	| { type: ActionTypes.CANCEL_EXCHANGE }
	| { type: ActionTypes.UPDATE_AMOUNT; wallet: 'from' | 'to', amount?: number }
	| { type: ActionTypes.UPDATE_INCOMING_WALLET, currency: ActiveWallet }
	| { type: ActionTypes.UPDATE_OUTCOMING_WALLET, currency: ActiveWallet }

export const getExchangeRates = (baseCurrency: ActiveWallet): ExchangeActions => ({
	type: ActionTypes.GET_EXCHANGE_RATES,
	baseCurrency
});

export const setExchangeRates = (data: RateResponse): ExchangeActions => ({
	type: ActionTypes.SET_EXCHANGE_RATES,
	data
});

export const cancelExchange = (): ExchangeActions => ({ type: ActionTypes.CANCEL_EXCHANGE });

export const updateAmount = (wallet: 'from' | 'to', amount?: number): ExchangeActions => ({
	type: ActionTypes.UPDATE_AMOUNT,
	wallet,
	amount
});

export const updateIncomingWallet = (currency: ActiveWallet): ExchangeActions => ({
	type: ActionTypes.UPDATE_INCOMING_WALLET,
	currency
});

export const updateOutcomingWallet = (currency: ActiveWallet): ExchangeActions => ({
	type: ActionTypes.UPDATE_OUTCOMING_WALLET,
	currency
});