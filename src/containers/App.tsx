/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import LoopIcon from '@material-ui/icons/LoopRounded';

import Wallets from '../components/Wallets';
import ExchangeDialog from '../components/ExchangeDialog';
import { changeActiveWallet } from '../store/activeWallet/actions';
import { getExchangeRates, cancelExchange, updateAmount, updateIncomingWallet, updateOutcomingWallet } from '../store/exchange/actions';
import { updateWallets } from '../store/wallets/actions';

import { AppState } from '../store';
import { WalletsState } from '../store/wallets/reducer';
import { ActiveWalletState } from '../store/activeWallet/reducer';
import { ExchangeState } from '../store/exchange/reducer';

interface AppProps {
	wallets: WalletsState,
	activeWallet: ActiveWalletState,
	exchange: ExchangeState,
	changeActiveWallet: typeof changeActiveWallet,
	getExchangeRates: typeof getExchangeRates,
	cancelExchange: typeof cancelExchange,
	updateAmount: typeof updateAmount,
	updateWallets: typeof updateWallets,
	updateIncomingWallet: typeof updateIncomingWallet,
	updateOutcomingWallet: typeof updateOutcomingWallet,
}

const useStyles = makeStyles(theme => ({
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100vw',
		height: '100vh',
	},
	fab: {
		margin: theme.spacing(1),
		position: 'absolute',
		bottom: theme.spacing(3),
		left: '50%',
		transform: 'translateX(-50%)'
	},
	icon: {
		marginRight: theme.spacing(1),
		transform: 'rotate(90deg)'
	}
}));

const App: React.FC<AppProps> = (props) => {
	const {
		wallets, activeWallet, exchange, changeActiveWallet, getExchangeRates, cancelExchange,
		updateAmount, updateWallets, updateIncomingWallet, updateOutcomingWallet
	} = props;

	const classes = useStyles();
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const toggleDialogOpen = () => setDialogOpen(!dialogOpen);

	const exchangeDialogOpenHandler = () => {
		toggleDialogOpen();
		getExchangeRates(activeWallet);
	};
	const exchangeDialogCloseHandler = () => {
		toggleDialogOpen();
		cancelExchange();
	};
	const makeExchangeHandler = () => {
		updateWallets(exchange.from, exchange.to);
		exchangeDialogCloseHandler();
	};

	return (
		<div className={classes.container}>
			<Wallets
				variant="wallet"
				wallets={wallets}
				activeWallet={activeWallet}
				onActiveWalletChange={changeActiveWallet}
			/>
			<ExchangeDialog
				data={exchange}
				wallets={wallets}
				dialogOpen={dialogOpen}
				closeDialog={exchangeDialogCloseHandler}
				makeExchange={makeExchangeHandler}
				updateAmount={updateAmount}
				updateIncomingWallet={updateIncomingWallet}
				updateOutcomingWallet={updateOutcomingWallet}
			/>
			<Fab
				variant="extended"
				size="medium"
				color="primary"
				className={classes.fab}
				onClick={exchangeDialogOpenHandler}
				disabled={!wallets[activeWallet]}
			>
				<LoopIcon className={classes.icon} />
				<span>Exchange</span>
			</Fab>
		</div>
	);
};

const mapStatesToProps = (state: AppState) => ({ ...state });

const mapDispathToProps = {
	changeActiveWallet,
	getExchangeRates,
	cancelExchange,
	updateAmount,
	updateWallets,
	updateIncomingWallet,
	updateOutcomingWallet
};

export default connect(mapStatesToProps, mapDispathToProps)(App);
