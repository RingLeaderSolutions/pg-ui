import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider, Store } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { History, createBrowserHistory } from 'history'
import { ConnectedRouter } from 'connected-react-router';
import configureStore from './store/configureStore'

import Home from "./components/Home";
import Login from "./components/auth/Login";
import Logout from "./components/auth/Logout";
import AuthenticatedRoute from "./components/auth/AuthenticatedRoute";
import LoginComplete from "./components/auth/LoginComplete";
import NotFound from "./components/NotFound";

import * as moment from 'moment';
moment.locale('en-GB');

import 'react-table/react-table.css'
import 'react-day-picker/lib/style.css';
import 'react-toastify/dist/ReactToastify.css';

import { ApplicationState } from "./applicationState";
import { createNotificationService } from "./services/SignalRService";
import { NotificationListener } from "./services/NotificationListener";
require('./styles/styles.scss');

const history: History = createBrowserHistory();

/* Both the store and the SignalR connection are recreated on hot-reload, but should exist as const singletons otherwise */
let notificationService = createNotificationService();
let store = configureStore(history);

if (module.hot) {
    if(module.hot.data){
        console.log("[TPIFLOW-HMR]: Re-creating store with previous state, and reinitializing SignalRService");
        store = configureStore(history, module.hot.data.state);
        notificationService = createNotificationService();
    }
    module.hot.accept();
    module.hot.addDisposeHandler((data) => {
        console.log("[TPIFLOW-HMR]: Disposed, saving current state & unmounting");
        data.state = store.getState();
        ReactDOM.unmountComponentAtNode(document.getElementById("root"));
    })
}

interface AppProps {
    store: Store<ApplicationState>;
    history: History;
}

class App extends React.Component<AppProps, {}> {
    private notificationListener: NotificationListener;

    async componentDidMount() {
        this.notificationListener = new NotificationListener(this.props.store);    

        notificationService.subscribe('Notify', (message) => this.notificationListener.onNotification(message));
        await notificationService.start();
    }

    /* Despite us never explicitly unmounting <App /> in code, it's done for a hot reload */
    componentWillUnmount() {
        notificationService.onStateChanged = null;
        notificationService.unsubscribe('Notify');
        notificationService.stop();
    }

    render() {
        return (
            <Provider store={this.props.store}>
                <ConnectedRouter history={this.props.history}>
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
                </ConnectedRouter>
            </Provider>
        )
    }
}

/* Export the notificationService as a singleton to be used by other app services. */
/* TODO: Move this elsewhere? Being here results in `import { NotificationService } from './App'` - a smell? */
export const NotificationService = notificationService;

ReactDOM.render(
    <App store={store} history={history}/>,
    document.getElementById("root")
);