import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider, connect, Store } from 'react-redux';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';

import SignalRController from './helpers/SignalRController';

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
import { ApplicationState } from "./applicationState";
require('./styles/styles.scss');

let store = configureStore();

if (module.hot) {
    if(module.hot.data){
        store = configureStore(module.hot.data.state);
    }
    module.hot.accept();
    module.hot.addDisposeHandler((data) => {
        data.state = store.getState();
        ReactDOM.unmountComponentAtNode(document.getElementById("root"));
    })
}

class App extends React.Component<{ store: Store<ApplicationState> }, {}> {
    notificationController: SignalRController;
    componentDidMount() {
        this.notificationController = new SignalRController(this.props.store);
        this.notificationController.start();
    }

    componentWillUnmount() {
        this.notificationController.stop();
    }

    render() {
        return (
            <Provider store={this.props.store}>
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
}

ReactDOM.render(
    <App store={store}/>,
    document.getElementById("root")
);