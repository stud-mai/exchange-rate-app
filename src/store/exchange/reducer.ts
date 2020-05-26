import { Currencies } from '../../constants/currencies';
import { ExchangeActions } from './actions';
import { ActionTypes } from './actionTypes';
import { toHundredths } from '../../utils';

export interface Exchangable {
	currency: keyof typeof Currencies,
	amount?: number
}

type Rates = {
	[currency in Currencies]?: number
}

export interface ExchangeState {
	from: Exchangable,
	to: Exchangable,
	rates: Rates
}

const INITIAL_STATE: ExchangeState = {
	from: { currency: Currencies.EUR },
	to: { currency: Currencies.USD },
	rates: { }
};

const exchangeReducer = (state = INITIAL_STATE, action: ExchangeActions): ExchangeState => {
	switch (action.type) {
		case ActionTypes.GET_EXCHANGE_RATES:
			return {
				...state,
				from: {
					currency: action.baseCurrency
				},
				to: {
					currency: Object.values(Currencies).filter(currency => currency !== action.baseCurrency)[0]
				}
			};

		case ActionTypes.SET_EXCHANGE_RATES: {
			const { from, to } = state;
			const { data: { rates } } = action;
			const rate = rates[to.currency];
			const amount = from.amount === undefined
				? to.amount
				: toHundredths(from.amount * Number(rate));
			return {
				...state,
				to: {
					...to,
					amount
				},
				rates: action.data.rates
			};
		}

		case ActionTypes.UPDATE_AMOUNT: {
			const { from, to, rates } = state;
			const { wallet, amount } = action;
			const rate = rates[to.currency];
			return {
				...state,
				from: {
					...from,
					amount: wallet === 'from'
						? amount
						: amount === undefined
							? amount
							: toHundredths(amount / Number(rate))
				},
				to: {
					...to,
					amount: wallet === 'to'
						? amount
						: amount === undefined
							? amount
							: toHundredths(amount * Number(rate))
				}
			};
		}

		case ActionTypes.UPDATE_INCOMING_WALLET: {
			const { from, to, rates } = state;
			const { currency } = action;
			const rate = rates[currency];
			const amount = from.amount === undefined
				? to.amount
				: toHundredths(from.amount * Number(rate));
			return {
				...state,
				to: {
					currency,
					amount
				}
			};
		}

		case ActionTypes.UPDATE_OUTCOMING_WALLET:
			return {
				...state,
				from: {
					...state.from,
					currency: action.currency
				},
				rates: {}
			};

		case ActionTypes.CANCEL_EXCHANGE:
			return INITIAL_STATE;

		default:
			return state;
	}
};

export default exchangeReducer;