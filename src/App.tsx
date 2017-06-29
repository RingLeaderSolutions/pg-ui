import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider, connect } from 'react-redux';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';

import configureStore from './store/configureStore'
import Home from "./components/Home";


declare global {
    interface NodeModule {
        hot: {
            accept: () => void;
        }
    }
}

if (module.hot) {
    module.hot.accept();
}

const store = configureStore();



class App extends React.Component<{}, {}> {
    constructor() {
        super();
    }

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Route path="/" component={Home} />
                </Router>
            </Provider>
        );
    }
}


const WrappedApp = connect(
    (state: any, ownProps: any) => { },
    (dispatch: any) => { }
)(App);


ReactDOM.render(
    <WrappedApp store={store} />,
    document.getElementById("root")
);