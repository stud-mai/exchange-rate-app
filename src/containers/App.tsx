import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import { AppState } from '../store';
import { WalletsState } from '../store/wallets/types';

interface AppProps {
	wallets: WalletsState
}

const useStyles = makeStyles({
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100vw',
		height: '100vh',
	}
});

const App: React.FC<AppProps> = ({ wallets }) => {
	const classes = useStyles();
	return (
		<div className={classes.container}>
			{Object.entries(wallets).map(([currency, amount]) => (
				<div>{currency}: {amount}</div>
			))}
		</div>
	);
};

const mapStatesToProps = ({ wallets }: AppState) => ({ wallets });

export default connect(mapStatesToProps)(App);
