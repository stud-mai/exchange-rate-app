import * as API from '../index';
import { Currencies } from '../../constants/currencies';

describe('API test', () => {
	it('should send correct request', () => {
		const mockJsonPromise = Promise.resolve({});
		const mockFetchPromise = Promise.resolve({ json: () => mockJsonPromise } as Response);
		jest.spyOn(window, 'fetch').mockImplementation(() => mockFetchPromise);

		API.getExchangeRates(Currencies.RUB);
		expect(window.fetch).toHaveBeenCalledWith('https://api.exchangeratesapi.io/latest?base=RUB&symbols=EUR,USD,GBP');
	});

	it('should return promise', () => {
		const mockJsonPromise = Promise.resolve({});
		const mockFetchPromise = Promise.resolve({ json: () => mockJsonPromise } as Response);
		jest.spyOn(window, 'fetch').mockImplementation(() => mockFetchPromise);

		const response = API.getExchangeRates(Currencies.RUB);
		expect(response).toBeInstanceOf(Promise);
	});

	it('should return correct data if promise resolves', async () => {
		const mockJsonPromise = Promise.resolve('test');
		const mockFetchPromise = Promise.resolve({ json: () => mockJsonPromise } as Response);
		jest.spyOn(window, 'fetch').mockImplementation(() => mockFetchPromise);

		const response = API.getExchangeRates(Currencies.RUB);
		expect(await response).toEqual('test');
	});
});