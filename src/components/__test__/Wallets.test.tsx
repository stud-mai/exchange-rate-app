import React from 'react';
import { shallow } from 'enzyme';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';

import Wallets, { WalletsProps } from '../Wallets';
import { Currencies } from '../../constants/currencies';
import { identity } from '../../utils';
import * as wallets from './fixture/wallets';

describe('Wallets component', () => {
	const componentProps: WalletsProps = {
		variant: 'wallet',
		wallets: wallets.initialWallets,
		activeWallet: Currencies.EUR,
		onActiveWalletChange: jest.fn()
	};

	const setupWrapper = (props = {}) => shallow(
		<Wallets {...componentProps} {...props} />
	);

	it('should be defined', () => {
		expect(Wallets).toBeDefined();
	});

	describe('Rendering as wallet', () => {
		it('should display correct initial data', () => {
			const wrapper = setupWrapper();
			const walletSelector = wrapper.find(Select);
			const availableWallets = walletSelector.children();
			const walletBalance = wrapper.find(Typography);

			expect(walletSelector.prop('value')).toEqual(Currencies.EUR);
			expect(availableWallets.length).toEqual(4);
			expect(walletBalance.text()).toEqual('€116.12');
		});

		it('should call onActiveWalletChange when another wallet has been changed', () => {
			const wrapper = setupWrapper();
			const walletSelector = wrapper.find(Select);
			const selectedWallet = walletSelector.children().last().prop('value');
			const handler = walletSelector.prop('onChange') || identity;

			handler({ target: { value: selectedWallet } } as any, null);
			expect(componentProps.onActiveWalletChange).toHaveBeenCalledWith(selectedWallet);
		});
	});

	describe('Rendering as exchangable', () => {
		const props = {
			variant: 'exchangeable',
			excludedWallet: Currencies.RUB
		};

		it('should display correct data', () => {
			const wrapper = setupWrapper(props);
			const walletSelector = wrapper.find(Select);
			const availableWallets = walletSelector.children();
			const amountInput = wrapper.find(InputBase);
			const walletBalance = wrapper.find(Typography);

			expect(walletSelector.prop('value')).toEqual(Currencies.EUR);
			expect(availableWallets.length).toEqual(3);
			availableWallets.forEach(wallet => {
				expect(wallet.text()).not.toEqual(props.excludedWallet);
			});
			expect(amountInput.prop('endAdornment')).toEqual('€');
			expect(amountInput.text()).toEqual('');
			expect(walletBalance.text()).toEqual('Balance: €116.12');
		});

		it('should display correct amount', () => {
			const wrapper = setupWrapper({ ...props, amount: 76.29 });
			const amountInput = wrapper.find(InputBase);

			expect(amountInput.props().value).toEqual(76.29);
		});

		it('should call onAmountChange with correct data when amount has been changed (float number with 4 digits after dot case)', () => {
			const onAmountChange = jest.fn();
			const wrapper = setupWrapper({ ...props, onAmountChange });
			const amountInput = wrapper.find(InputBase);

			amountInput.simulate('change', { target: { value: '98.2352' } });
			expect(onAmountChange).toHaveBeenCalledWith({ target: { value: '98.2352' } });
		});

		it('should call onAmountChange with correct data when amount has been changed (empty string case)', () => {
			const onAmountChange = jest.fn();
			const wrapper = setupWrapper({ ...props, amount: 98.23, onAmountChange });
			const amountInput = wrapper.find(InputBase);

			amountInput.simulate('change', { target: { value: '' } });
			expect(onAmountChange).toHaveBeenCalledWith({ target: { value: '' } });
		});
	});
});
