import { Currencies } from '../constants/currencies';
import { ActiveWallet } from '../store/activeWallet/actions';
import { RateResponse } from '../store/exchange/actions';

export const getExchangeRates = (baseCurrency: ActiveWallet): Promise<RateResponse> => {
	const symbols: string = Object.values(Currencies).filter(c => c !== baseCurrency).join(',');
	return fetch(`https://api.exchangeratesapi.io/latest?base=${baseCurrency}&symbols=${symbols}`)
		.then(res => res.json())
		.catch(err => err);
};
