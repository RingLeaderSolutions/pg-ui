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

import * as UIkit from 'uikit';
import * as UIkitIcons from 'uikit/dist/js/uikit-icons';
UIkit.use(UIkitIcons);

import 'react-table/react-table.css'
import 'react-day-picker/lib/style.css';
import 'react-toastify/dist/ReactToastify.css';

import { ApplicationState } from "./applicationState";
import { SignalRService } from "./services/SignalRService";
import { NotificationListener } from "./services/NotificationListener";
require('./styles/styles.scss');

const history: History = createBrowserHistory();
let store = configureStore(history);

if (module.hot) {
    if(module.hot.data){
        console.log("[TPIFLOW-HMR]: Re-creating store with previous state");
        store = configureStore(history, module.hot.data.state);
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
    private signalRService: SignalRService;
    private notificationListener: NotificationListener;

    async componentDidMount() {
        this.notificationListener = new NotificationListener(this.props.store);    

        this.signalRService = new SignalRService(appConfig.signalRUri, false);    
        this.signalRService.subscribe('Notify', (message) => this.notificationListener.onNotification(message));
        await this.signalRService.start();
    }

    async componentWillUnmount() {
        this.signalRService.unsubscribe('Notify');
        await this.signalRService.stop();
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

ReactDOM.render(
    <App store={store} history={history}/>,
    document.getElementById("root")
);