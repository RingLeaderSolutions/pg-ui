import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers/root';
import thunk from 'redux-thunk';

import { ApplicationState } from '../applicationState';

export default function configureStore(initialState?: ApplicationState) {

  // Enable React devToolsExtension
  //   compose(applyMiddleware(thunk, logger), window.devToolsExtension ? window.devToolsExtension() : f => f)
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk)
  );
}