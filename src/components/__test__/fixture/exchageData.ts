import { ExchangeState } from '../../../store/exchange/reducer';
import { Currencies } from '../../../constants/currencies';

export const initialData: ExchangeState = {
	from: { currency: Currencies.USD },
	to: { currency: Currencies.RUB },
	rates: { }
};

export const dataWithRates: ExchangeState = {
	from: { currency: Currencies.USD },
	to: { currency: Currencies.RUB },
	rates: {
		EUR: 0.931,
		RUB: 73.427689
	}
};

export const dataWithRatesAndAmount: ExchangeState = {
	from: { currency: Currencies.USD, amount: 10 },
	to: { currency: Currencies.RUB, amount: 734.27 },
	rates: {
		EUR: 0.931,
		RUB: 73.427689
	}
};