import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './rootReducer';
import rootSaga from '../sagas';

declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
	}
}

export type AppState = ReturnType<typeof rootReducer>;

export default function () {
	const composeEnchancers = (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
	const sagaMiddleware = createSagaMiddleware();
	const enchancers = composeEnchancers(
		applyMiddleware(sagaMiddleware)
	);
	const store = createStore(
		rootReducer,
		enchancers
	);

	sagaMiddleware.run(rootSaga);

	if (process.env.NODE_ENV !== 'production' && (module as any).hot) {
		(module as any).hot.accept('./rootReducer', () => store.replaceReducer(rootReducer));
	}

	return store;
}