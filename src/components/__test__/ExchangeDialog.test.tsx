import React from 'react';
import { shallow } from 'enzyme';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Spinner from '@material-ui/core/CircularProgress';

import ExchangeDialog, { ExchangeDialogProps } from '../ExchangeDialog';
import * as wallets from './fixture/wallets';
import * as data from './fixture/exchageData';


describe('ExchangeDialog component', () => {
	const componentProps: ExchangeDialogProps = {
		data: data.initialData,
		wallets: wallets.initialWallets,
		dialogOpen: true,
		closeDialog: jest.fn(),
		makeExchange: jest.fn(),
		updateAmount: jest.fn(),
		updateIncomingWallet: jest.fn(),
		updateOutcomingWallet: jest.fn()
	};

	const setupWrapper = (props = {}) => shallow(
		<ExchangeDialog {...componentProps} {...props} />
	);

	it('should be defined', () => {
		expect(ExchangeDialog).toBeDefined();
	});

	describe('Initial render', () => {
		let wrapper: ReturnType<typeof setupWrapper>;

		beforeEach(() => {
			wrapper = setupWrapper();
		});

		describe('AppBar render', () => {
			it('should render appbar', () => {
				const appbar = wrapper.find(AppBar);
				expect(appbar.exists()).toBeTruthy();
			});

			it('should have close button', () => {
				const button = wrapper.find(AppBar).find(IconButton);
				const buttonIcon = button.find('CloseIcon');
				expect(button.exists()).toBeTruthy();
				expect(buttonIcon.exists()).toBeTruthy();
			});

			it('should call closeDialog on close button click', () => {
				const button = wrapper.find(AppBar).find(IconButton);
				button.simulate('click');
				expect(componentProps.closeDialog).toHaveBeenCalled();
			});

			it('should not render any exchange rate', () => {
				const exchangeRate = wrapper.find(AppBar).find(Typography);
				expect(exchangeRate.text()).toEqual('');
			});

			it('should have disabled exchange button', () => {
				const button = wrapper.find(AppBar).find(Button);
				expect(button.exists()).toBeTruthy();
				expect(button.text()).toEqual('Exchange');
				expect(button.prop('disabled')).toBeTruthy();
			});
		});

		it('should have spinner in content area', () => {
			const spinner = wrapper.find(Spinner);
			expect(spinner.exists()).toBeTruthy();
		});

		it('should not have Wallets components', () => {
			const wallets = wrapper.find('Wallets');
			expect(wallets.exists()).toBeFalsy();
		});
	});

	describe('Render after receiving exchange rates', () => {
		let wrapper: ReturnType<typeof setupWrapper>;

		beforeEach(() => {
			wrapper = setupWrapper({ data: data.dataWithRates });
		});

		describe('AppBar render', () => {
			it('should render any exchange rate', () => {
				const exchangeRate = wrapper.find(AppBar).find(Typography);
				expect(exchangeRate.text()).toEqual('$1 = ₽73.4277');
			});

			it('should have disabled exchange button', () => {
				const button = wrapper.find(AppBar).find(Button);
				expect(button.exists()).toBeTruthy();
				expect(button.prop('disabled')).toBeTruthy();
			});
		});

		it('should not have spinner in content area', () => {
			const spinner = wrapper.find(Spinner);
			expect(spinner.exists()).toBeFalsy();
		});

		it('should have two Wallets components', () => {
			const wallets = wrapper.find('Wallets');
			expect(wallets.length).toEqual(2);
		});

		describe('Outcoming (from) wallet render', () => {
			it('should have correct properties', () => {
				const wallet = wrapper.find('Wallets').at(0);
				expect(wallet.prop('variant')).toEqual('exchangeable');
				expect(wallet.prop('activeWallet')).toEqual('USD');
				expect(wallet.prop('excludedWallet')).toEqual('RUB');
				expect(wallet.prop('amount')).toBeUndefined();
			});

			it('should have call updateAmount with correct parametrs', () => {
				const wallet = wrapper.find('Wallets').at(0);
				const handler: (event: { target: { value: string } }) => void = wallet.prop('onAmountChange');
				handler({ target: { value: '432' } });
				expect(componentProps.updateAmount).toHaveBeenCalledWith('from', '432');
			});
		});

		describe('Incoming (to) wallet render', () => {
			it('should have correct properties', () => {
				const wallet = wrapper.find('Wallets').at(1);
				expect(wallet.prop('variant')).toEqual('exchangeable');
				expect(wallet.prop('activeWallet')).toEqual('RUB');
				expect(wallet.prop('excludedWallet')).toEqual('USD');
				expect(wallet.prop('amount')).toBeUndefined();
			});

			it('should have call updateAmount with correct parametrs', () => {
				const wallet = wrapper.find('Wallets').at(1);
				const handler: (event: { target: { value: string } }) => void = wallet.prop('onAmountChange');
				handler({ target: { value: '432.123' } });
				expect(componentProps.updateAmount).toHaveBeenCalledWith('to', '432.123');
			});
		});
	});

	describe('Render with entered amount to exchange', () => {
		let wrapper: ReturnType<typeof setupWrapper>;

		beforeEach(() => {
			wrapper = setupWrapper({ data: data.dataWithRatesAndAmount });
		});

		describe('AppBar render', () => {
			it('should have enabled exchange button', () => {
				const button = wrapper.find(AppBar).find(Button);
				expect(button.exists()).toBeTruthy();
				expect(button.prop('disabled')).toBeFalsy();
			});

			it('should call makeExchange on exchange button click', () => {
				const button = wrapper.find(AppBar).find(Button);
				button.simulate('click');
				expect(componentProps.makeExchange).toHaveBeenCalled();
			});
		});

		describe('Outcoming (from) wallet render', () => {
			it('should have correct amount property', () => {
				const wallet = wrapper.find('Wallets').at(0);
				expect(wallet.prop('amount')).toEqual(10);
			});
		});

		describe('Incoming (to) wallet render', () => {
			it('should have correct amount property', () => {
				const wallet = wrapper.find('Wallets').at(1);
				expect(wallet.prop('amount')).toEqual(734.27);
			});
		});
	});

	describe('Render with entered amount to exchange which exceeds wallet\'s balance', () => {
		let wrapper: ReturnType<typeof setupWrapper>;

		beforeEach(() => {
			wrapper = setupWrapper({
				data: {
					...data.dataWithRatesAndAmount,
					from: {
						...data.dataWithRatesAndAmount.from,
						amount: 30
					}
				}
			});
		});

		it('should have disabled exchange button', () => {
			const button = wrapper.find(AppBar).find(Button);
			expect(button.exists()).toBeTruthy();
			expect(button.prop('disabled')).toBeTruthy();
		});
	});
});
