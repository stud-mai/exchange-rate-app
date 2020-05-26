import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';

import createStore from './store';
import App from './containers/App';

const store = createStore();

const renderApp = () => ReactDOM.render(
	<Provider store={store}>
		<CssBaseline />
		<App />
	</Provider>,
	document.getElementById('root')
);

if (process.env.NODE_ENV !== 'production' && (module as any).hot) {
	(module as any).hot.accept('./containers/App', renderApp);
}

renderApp();
