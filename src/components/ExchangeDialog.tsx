/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Spinner from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import SwapIcon from '@material-ui/icons/SwapHorizRounded';

import Wallets from './Wallets';

import { CurrencySigns } from '../constants/currencies';
import { ExchangeState } from '../store/exchange/reducer';
import { WalletsState } from '../store/wallets/reducer';
import { ActiveWallet } from '../store/activeWallet/actions';

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative',
	},
	exchangeRate: {
		marginLeft: theme.spacing(2),
		flex: 1,
		textAlign: 'center'
	},
	content: {
		height: `calc(100% - ${theme.spacing(8)}px)`,
		flexWrap: 'nowrap',
		[theme.breakpoints.down('md')]: {
			flexDirection: 'column'
		}
	},
	swapIcon: {
		[theme.breakpoints.down('md')]: {
			transform: 'rotate(90deg)'
		}
	}
}));

export interface ExchangeDialogProps {
	data: ExchangeState,
	wallets: WalletsState,
	dialogOpen: boolean,
	closeDialog: () => void,
	makeExchange: () => void,
	updateAmount: (wallet: 'from' | 'to', amount: string) => void,
	updateIncomingWallet: (currency: ActiveWallet) => void,
	updateOutcomingWallet: (currency: ActiveWallet) => void,
}

const ExchangeDialog: React.FC<ExchangeDialogProps> = (props) => {
	const {
		data, wallets, dialogOpen, closeDialog, makeExchange, updateAmount, updateIncomingWallet, updateOutcomingWallet
	} = props;

	const classes = useStyles();
	const { from, to, rates } = data;
	const ratesEmpty: boolean = !Object.keys(rates).length;
	const fromCurrencySign = from.currency && CurrencySigns[from.currency];
	const toCurrencySign = to.currency && CurrencySigns[to.currency];
	const rate = to.currency && rates[to.currency]?.toFixed(4);
	const exchangeDisallowed: boolean = ratesEmpty || wallets[from.currency] < Number(from.amount) || !from.amount;

	const amountChangeHandler = useCallback((wallet: 'from' | 'to') =>
		(event: React.ChangeEvent<{ value: string }>): void => updateAmount(wallet, event.target.value),
	[]);

	return (
		<Fragment>
			<Dialog fullScreen open={dialogOpen} onClose={closeDialog}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<IconButton edge="start" color="inherit" onClick={closeDialog}>
							<CloseIcon />
						</IconButton>
						<Typography variant="h6" className={classes.exchangeRate}>
							{!ratesEmpty && `${fromCurrencySign}1 = ${toCurrencySign}${rate}`}
						</Typography>
						<Button
							variant="outlined"
							color="inherit"
							onClick={makeExchange}
							disabled={exchangeDisallowed}
						>
							Exchange
						</Button>
					</Toolbar>
				</AppBar>
				{from.currency && to.currency &&
					<Grid container justify="center" alignItems="center" className={classes.content}>
						{dialogOpen && ratesEmpty
							? <Spinner color="inherit" />
							: <Fragment>
								<Grid item>
									<Wallets
										variant="exchangeable"
										wallets={wallets}
										activeWallet={from.currency}
										excludedWallet={to.currency}
										amount={from.amount}
										onActiveWalletChange={updateOutcomingWallet}
										onAmountChange={amountChangeHandler('from')}
									/>
								</Grid>
								<Grid item>
									<IconButton size="small" className={classes.swapIcon}>
										<SwapIcon fontSize="large" />
									</IconButton>
								</Grid>
								<Grid item>
									<Wallets
										variant="exchangeable"
										wallets={wallets}
										activeWallet={to.currency}
										excludedWallet={from.currency}
										amount={to.amount}
										onActiveWalletChange={updateIncomingWallet}
										onAmountChange={amountChangeHandler('to')}
									/>
								</Grid>
							</Fragment>
						}
					</Grid>
				}
			</Dialog>
		</Fragment>
	);
};

export default ExchangeDialog;
