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

import * as moment from 'moment';
moment.locale('en-GB');

import * as UIkit from 'uikit';
import * as UIkitIcons from 'uikit/dist/js/uikit-icons';
UIkit.use(UIkitIcons);

import 'react-table/react-table.css'
import 'react-day-picker/lib/style.css';
import NotFound from "./components/NotFound";
require('./styles/styles.scss');

if (module.hot) {
    module.hot.accept();
}

const store = configureStore();

connectSignalR(store);

const App : React.SFC<{}> = () => {
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
                    <AuthenticatedRoute path="/accounts" component={Home} />
                    <AuthenticatedRoute path="/account" component={Home} />

                    <Route component={NotFound} />
                </Switch>
            </Router>
        </Provider>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById("root")
);