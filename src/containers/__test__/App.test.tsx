import React from 'react';
import { shallow } from 'enzyme';
import Fab from '@material-ui/core/Fab';

import { App, AppProps } from '../App';
import { Currencies } from '../../constants/currencies';
import * as wallets from '../../components/__test__/fixture/wallets';
import * as exchange from '../../components/__test__/fixture/exchageData';

describe('Wallets component', () => {
	const componentProps: AppProps = {
		wallets: wallets.initialWallets,
		activeWallet: Currencies.GBP,
		exchange: exchange.initialData,
		changeActiveWallet: jest.fn(),
		getExchangeRates: jest.fn(),
		cancelExchange: jest.fn(),
		updateAmount: jest.fn(),
		updateWallets: jest.fn(),
		updateIncomingWallet: jest.fn(),
		updateOutcomingWallet: jest.fn()
	};

	const setupWrapper = (props = {}) => shallow(
		<App {...componentProps} {...props} />
	);

	it('should be defined', () => {
		expect(App).toBeDefined();
	});

	describe('Initial render', () => {
		let wrapper: ReturnType<typeof setupWrapper>;

		beforeEach(() => {
			wrapper = setupWrapper();
		});

		it('should render Wallets component with correct properties', () => {
			const walletsSelector = wrapper.find('Wallets');
			expect(walletsSelector.exists()).toBeTruthy();
			expect(walletsSelector.prop('variant')).toEqual('wallet');
			expect(walletsSelector.prop('wallets')).toEqual(wallets.initialWallets);
			expect(walletsSelector.prop('activeWallet')).toEqual(Currencies.GBP);
		});

		it('should render ExchangeDialog component with correct properties', () => {
			const exchangeDialog = wrapper.find('ExchangeDialog');
			expect(exchangeDialog.exists()).toBeTruthy();
			expect(exchangeDialog.prop('data')).toEqual(exchange.initialData);
			expect(exchangeDialog.prop('wallets')).toEqual(wallets.initialWallets);
			expect(exchangeDialog.prop('dialogOpen')).toBeFalsy();
		});

		it('should render Fab (exchange button) component with correct properties', () => {
			const echangeButton = wrapper.find(Fab);
			expect(echangeButton.exists()).toBeTruthy();
			expect(echangeButton.prop('disabled')).toBeFalsy();
			expect(echangeButton.text()).toEqual('Exchange');
		});

		it('should call getExchangeRates on exchange button click', () => {
			const echangeButton = wrapper.find(Fab);
			echangeButton.simulate('click');
			expect(componentProps.getExchangeRates).toHaveBeenCalledWith(Currencies.GBP);
		});

		it('should change dialogOpen property of ExchangeDialog component on exchange button click', () => {
			const echangeButton = wrapper.find(Fab);
			expect(wrapper.find('ExchangeDialog').prop('dialogOpen')).toBeFalsy();
			echangeButton.simulate('click');
			expect(wrapper.find('ExchangeDialog').prop('dialogOpen')).toBeTruthy();
		});

		it('should call cancelExchange on closing exchange dialog', () => {
			const exchangeDialog = wrapper.find('ExchangeDialog');
			(exchangeDialog.prop('closeDialog') as () => void)();
			expect(componentProps.cancelExchange).toHaveBeenCalled();
		});

		it('should change dialogOpen property of ExchangeDialog component on closing exchange dialog', () => {
			const echangeButton = wrapper.find(Fab);
			expect(wrapper.find('ExchangeDialog').prop('dialogOpen')).toBeFalsy();
			echangeButton.simulate('click');
			expect(wrapper.find('ExchangeDialog').prop('dialogOpen')).toBeTruthy();
			(wrapper.find('ExchangeDialog').prop('closeDialog') as () => void)();
			expect(wrapper.find('ExchangeDialog').prop('dialogOpen')).toBeFalsy();
		});
	});

	describe('Render with provided data for exchange', () => {
		let wrapper: ReturnType<typeof setupWrapper>;

		beforeEach(() => {
			wrapper = setupWrapper({ exchange: exchange.dataWithRatesAndAmount });
		});

		it('should call updateWallets with correct data', () => {
			const exchangeDialog = wrapper.find('ExchangeDialog');
			(exchangeDialog.prop('makeExchange') as () => void)();
			expect(componentProps.updateWallets).toHaveBeenCalledWith(
				{ currency: Currencies.USD, amount: 10 },
				{ currency: Currencies.RUB, amount: 734.27 }
			);
		});

		it('should change dialogOpen property of ExchangeDialog component on closing exchange dialog', () => {
			expect(wrapper.find('ExchangeDialog').prop('dialogOpen')).toBeFalsy();
			(wrapper.find('ExchangeDialog').prop('makeExchange') as () => void)();
			expect(wrapper.find('ExchangeDialog').prop('dialogOpen')).toBeTruthy();
		});

		it('should call cancelExchange', () => {
			const exchangeDialog = wrapper.find('ExchangeDialog');
			(exchangeDialog.prop('makeExchange') as () => void)();
			expect(componentProps.cancelExchange).toHaveBeenCalled();
		});
	});

	describe('Render selected empty wallet', () => {
		let wrapper: ReturnType<typeof setupWrapper>;

		beforeEach(() => {
			wrapper = setupWrapper({
				wallets: wallets.changedWallets,
				activeWallet: Currencies.RUB,
			});
		});

		it('should render disabled Fab (exchange button) component', () => {
			const echangeButton = wrapper.find(Fab);
			expect(echangeButton.exists()).toBeTruthy();
			expect(echangeButton.prop('disabled')).toBeTruthy();
		});
	});
});
