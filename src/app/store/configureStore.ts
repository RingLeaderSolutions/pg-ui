import { createStore, applyMiddleware, compose, Reducer } from 'redux';
import rootReducer from '../reducers/root';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import thunk from 'redux-thunk';
import { ApplicationState } from '../applicationState';
import { History } from 'history';

export default function configureStore(history: History, initialState?: ApplicationState) {

    // To enable Redux Dev tools, uncomment the below line and comment the line below, and vice-versa
    const composeEnhancers = (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    //const composeEnhancers = compose;

    return createStore<ApplicationState>(
        connectRouter(history)(rootReducer), 
        initialState, 
        composeEnhancers(
            applyMiddleware(
                thunk, 
                routerMiddleware(history)
            ),
        )
    );
}