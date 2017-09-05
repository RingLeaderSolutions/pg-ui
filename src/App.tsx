import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider, connect } from 'react-redux';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';

import configureStore from './store/configureStore'
import Home from "./components/Home";


// NOTE: Unable to get proper TS definitions working with UIkit.
const UIkit = require('uikit');
const Icons = require('uikit/dist/js/uikit-icons');
UIkit.use(Icons);

require('./styles/styles.scss');
require('./styles/uikit.css');

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

function mapStateToProps(state: any, ownProps: any) {
    return {};
}

function mapDispatchToProps(dispatch: any) {
    return {};
}

const WrappedApp = connect(mapStateToProps, mapDispatchToProps)(App);


ReactDOM.render(
    <WrappedApp store={store} />,
    document.getElementById("root")
);