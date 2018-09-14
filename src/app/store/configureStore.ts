import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers/root';
import thunk from 'redux-thunk';

import { ApplicationState } from '../applicationState';

export default function configureStore(initialState?: ApplicationState) {

  // Specific set up with enhancer to enable redux browser devtools
  const composeEnhancers = (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(rootReducer, initialState, composeEnhancers(
    applyMiddleware(thunk)
  ));
  
  // Disabled redux dev tools:
  // return createStore(
  //   rootReducer,
  //   initialState,
  //   applyMiddleware(thunk)
  // );
}