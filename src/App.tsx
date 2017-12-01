import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider, connect } from 'react-redux';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';

import connectSignalR from './helpers/SignalRController';

import configureStore from './store/configureStore'
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Logout from "./components/auth/Logout";
import AuthenticatedRoute from "./components/auth/AuthenticatedRoute";
import LoginComplete from "./components/auth/LoginComplete";
import { Switch } from "react-router";


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

connectSignalR(store);

class App extends React.Component<{}, {}> {
    constructor() {
        super();
    }

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Switch>
                        <AuthenticatedRoute exact path="/" component={Home} />
                        
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/login_complete" component={LoginComplete} />
                        <Route exact path="/logout" component={Logout} />                        

                        <AuthenticatedRoute path="/portfolios" component={Home} />
                        <AuthenticatedRoute path="/portfolio" component={Home} />
                        <AuthenticatedRoute path="/topline" component={Home} />
                        <AuthenticatedRoute path="/historical" component={Home} />
                        <AuthenticatedRoute path="/calendar" component={Home} />
                        <AuthenticatedRoute path="/uploads" component={Home} />
                    </Switch>
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