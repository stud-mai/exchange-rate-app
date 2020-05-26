/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import ExpandIcon from '@material-ui/icons/ExpandMoreRounded';

import { ReactComponent as Logo } from '../assets/logo.svg';
import { identity } from '../utils';

import { CurrencySigns } from '../constants/currencies';
import { WalletsState } from '../store/wallets/reducer';
import { ActiveWalletState } from '../store/activeWallet/reducer';

const useStyles = makeStyles(theme => ({
	card: {
		background: 'linear-gradient(45deg, #d5278a, #0274ba)',
		width: theme.spacing(60),
		height: theme.spacing(35),
		margin: theme.spacing(2),
		padding: theme.spacing(3, 3.5),
		boxSizing: 'border-box',
		borderRadius: theme.spacing(1),
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		[theme.breakpoints.down('xs')]: {
			width: theme.spacing(40),
			height: theme.spacing(24),
			padding: theme.spacing(2, 2.5),
		}
	},
	logo: {
		fill: '#fff'
	},
	cardCurrency: {
		lineHeight: 'initial'
	},
	cardSum: {
		color: '#fff',
		fontSize: '2.5rem',
		[theme.breakpoints.down('xs')]: {
			fontSize: '1.5rem'
		},
	},
	rightColumn: {
		textAlign: 'right'
	},
	balance: {
		color: '#fff'
	}
}));

const useSelectStyles = makeStyles(theme => ({
	root: {
		color: '#fff',
		fontSize: '2.5rem',
		'&$select': {
			paddingRight: '2.5rem',
		},
		[theme.breakpoints.down('xs')]: {
			fontSize: '1.5rem',
			'&$select': {
				paddingRight: '1.5rem',
			}
		}
	},
	select: {},
	icon: {
		fill: '#fff',
		top: 'auto',
		width: '2.5rem',
		height: '2.5rem',
		color: theme.palette.common.black,
		[theme.breakpoints.down('xs')]: {
			width: '1.5rem',
			height: '1.5rem',
		}
	}
}));

const useMenuItemStyles = makeStyles(theme => ({
	root: {
		'&$selected': {
			fontSize: '2.5rem',
			background: 'transparent',
			[theme.breakpoints.down('xs')]: {
				fontSize: '1.5rem'
			}
		},
	},
	selected: {}
}));

interface WalletsProps {
	variant: 'wallet' | 'exchangeable',
	wallets: WalletsState,
	activeWallet: ActiveWalletState,
	excludedWallet?: ActiveWalletState,
	amount?: number,
	onActiveWalletChange: (activeWallet: ActiveWalletState) => void,
	onAmountChange?: (amount?: number) => void
}

const Wallets: React.FC<WalletsProps> = (props) => {
	const {
		variant, wallets, activeWallet, excludedWallet, amount, onActiveWalletChange, onAmountChange = identity
	} = props;

	const classes = useStyles();
	const selectClasses = useSelectStyles();
	const menuItemClasses = useMenuItemStyles();

	const activeWalletChangeHandler = useCallback((event: React.ChangeEvent<{ value: unknown }>): void => {
		onActiveWalletChange(event.target.value as ActiveWalletState);
	}, []);

	const amountChangeHandler = useCallback((event: React.ChangeEvent<{ value: string }>): void => {
		const matchedValue: string = (event.target.value.match(/^\d+|(\.\d{0,2})/g) || []).join('');
		if (matchedValue.length) {
			const value: number = Number(matchedValue);
			if (value <= wallets[activeWallet]) {
				onAmountChange(value);
			}
		} else {
			onAmountChange(undefined);
		}
	}, [activeWallet]);

	return (
		<Card elevation={3} className={classes.card}>
			<Logo className={classes.logo} />
			<Grid container alignItems="center" justify="space-between">
				<Grid item xs={6}>
					<Select
						classes={selectClasses}
						input={<InputBase classes={{ root: classes.cardCurrency }} />}
						IconComponent={ExpandIcon}
						value={activeWallet}
						onChange={activeWalletChangeHandler}
					>
						{Object.keys(wallets)
							.filter(wallet => wallet !== excludedWallet)
							.map(wallet => (
								<MenuItem
									key={wallet}
									value={wallet}
									classes={menuItemClasses}
								>
									{wallet}
								</MenuItem>
							))
						}
					</Select>
				</Grid>
				<Grid item xs={6} className={classes.rightColumn}>
					{variant === 'exchangeable'
						? <InputBase
							className={classes.cardSum}
							classes={{ input: classes.rightColumn }}
							endAdornment={CurrencySigns[activeWallet]}
							type="number"
							value={amount !== undefined ? amount : ''}
							onChange={amountChangeHandler}
						/>
						: <Typography className={classes.cardSum}>
							{CurrencySigns[activeWallet] + wallets[activeWallet]}
						</Typography>
					}
				</Grid>
				{variant !== 'wallet' &&
					<Typography className={classes.balance}>
						Balance: {CurrencySigns[activeWallet] + wallets[activeWallet]}
					</Typography>
				}
			</Grid>
		</Card >
	);
};

export default Wallets;
