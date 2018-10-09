import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { Route,Link} from 'react-router-dom';
import { ToastContainer, ToastPosition } from 'react-toastify';

import { ApplicationState } from '../applicationState';
import { fetchBackendVersion, fetchInstanceDetails } from '../actions/authActions';

import { InstanceDetail, ApplicationTab } from "../model/Models";

import Dashboard from "./dashboard/Dashboard";
import Portfolios from "./portfolio/Portfolios";
import Accounts from "./accounts/Accounts";
import PortfolioDetail from "./portfolio/PortfolioDetail";
import AccountDetailView from "./accounts/AccountDetailView";
import { NotificationService } from "../App";
import { SignalRConnectionState } from "../services/SignalRService";
import { LocalStorageRepository } from "../services/LocalStorageRepository";

interface StateProps {
    backendVersion: string;
    instance_detail: InstanceDetail;
    working: boolean;
    selectedTab: ApplicationTab;
    error: boolean;
    errorMessage: string;
}

interface HomeState {
    connectionState: SignalRConnectionState;
}
  
interface DispatchProps {
    fetchBackendVersion: () => void;
    fetchInstanceDetails: () => void;
}

class Home extends React.Component<StateProps & DispatchProps, HomeState> {
    constructor() {
        super();
        this.state = {
            connectionState: SignalRConnectionState.Idle
        };
    }

    componentDidMount(){
        this.props.fetchBackendVersion();
        this.props.fetchInstanceDetails();
        
        NotificationService.onStateChanged = (state) => {
            this.setState({
                connectionState: state
            });
        };
    }

    renderConnectionState(){
        let span: JSX.Element = null;
        let tooltip: string = null;
        switch(this.state.connectionState){
            case SignalRConnectionState.Active:
                span = (<span className="uk-label label-connected"><i className="fas fa-dot-circle"></i><span>Connected</span></span>);
                break;
            case SignalRConnectionState.Connecting:
                span = (<span className="uk-label label-connecting"><i className="fas fa-sync-alt"></i><span>Connecting...</span></span>);
                break;
            case SignalRConnectionState.Recovering:
                tooltip = "We are attempting to recover your connection to TPI Flow services.";
                span = (<span className="uk-label label-recovering" data-uk-tooltip={`title:${tooltip};pos:bottom;delay:1000`}><i className="fas fa-sync-alt"></i><span>Reconnecting...</span></span>);
                break;
            case SignalRConnectionState.Errored:
                tooltip = "We couldn't successfully connect to TPI Flow services.<br/>Please get in touch with support to resolve this issue.";
                span = (<span className="uk-label label-error" data-uk-tooltip={`title:${tooltip};pos:bottom;delay:1000`}><i className="fas fa-exclamation-triangle"></i><span>Disconnected</span></span>);
                break;
        }

        return (<div className="label-connection">{span}</div>);
    }

    renderSelectedTriangle(tab: ApplicationTab){
        if(this.props.selectedTab == tab){
            return (<i className="fas fa-caret-right uk-margin-small-right"></i>)
        }
        
        return null;
    }

    isSelected(tab: ApplicationTab){
        return this.props.selectedTab == tab;
    }

    render(){
        if(this.props.working){
            return (
                <div className="uk-cover-container uk-height-viewport">
                    <img src={require('../images/panels.png')} alt="" data-uk-cover />
                    <div className="app-loading-container uk-position-center">
                        <div className="uk-card uk-card-body uk-card-default">
                            <img src={require('../images/tpi-flow-logo.png')} alt="TPI Flow" />
                            <div>
                                <div className="spinner-2"></div>
                                <h4 className="uk-text-center">Initialising...</h4>
                            </div>
                        </div>
                    </div>
                </div>);
        }
        if(this.props.error){
            return (
                <div className="uk-cover-container uk-height-viewport">
                    <img src={require('../images/panels.png')} alt="" data-uk-cover />
                    <div className="app-loading-container uk-position-center">
                        <div className="uk-card uk-card-body uk-card-default">
                            <img src={require('../images/tpi-flow-logo.png')} alt="TPI Flow" />
                            <div className="uk-alert uk-alert-danger uk-margin-small-bottom" data-uk-alert>
                                <div className="uk-grid uk-grid-small" data-uk-grid>
                                    <div className="uk-width-auto uk-flex uk-flex-middle">
                                        <i className="fas fa-exclamation-triangle uk-margin-small-right"></i>
                                    </div>
                                    <div className="uk-width-expand uk-flex uk-flex-middle">
                                        <div>
                                            <p><strong>Sorry!</strong> We seem to be having trouble loading the application right now.</p>
                                            <p>Please contact support using the button below so that we can help you resolve this issue promptly.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="uk-width-auto uk-text-center">
                                <a className="uk-button uk-button-default uk-button-small uk-margin-small-top" href={`mailto:support@tpiflow.com?subject=Error%20Loading%20TPI%20Flow%20at%20${window.location.origin}`}><i className="fas fa-envelope uk-margin-small-right"></i>Contact Support</a>
                            </div>
                        </div>
                    </div>
                </div>);
        }
        return (
            <div className="app-container">
                <div className="app-header">
                    <div className="app-header-container uk-grid uk-grid-collapse">
                        <div className="app-header-logo uk-width-auto">
                            <Link to="/" >
                                <img src={require('../images/tpi-flow-logo-white.png')} alt="TPI Flow" />
                                {/* <img src={this.props.instance_detail.logoUri} alt={this.props.instance_detail.name} />  */}
                            </Link>
                        </div>
                        <div className="uk-width-expand" />
                        <div className="app-header-user uk-width-auto uk-flex uk-flex-middle">
                            <button className="uk-button uk-button-default" type="button">
                                <div className="uk-flex">
                                    {/* <img src={new LocalStorageRepository().fetchProfile().picture}  /> */}
                                    <div>
                                        <img src='https://cdn.auth0.com/avatars/dm.png' />
                                        <span className="connection-icon"><i className="fas fa-circle"></i></span>
                                    </div>

                                    <div className="uk-flex uk-flex-middle">
                                        <p>
                                            <span className="user-name uk-margin-small-right">Daniel May</span>
                                            <i className="fas fa-chevron-down fa-xs"></i>
                                        </p>
                                    </div>
                                </div>
                            </button>
                            <div data-uk-dropdown="mode: click; animation: uk-animation-slide-top-small; duration: 500">
                                <ul className="uk-nav uk-dropdown-nav">
                                    <li>
                                        <a href="#">
                                            <i className="far fa-user uk-margin-small-right"></i>
                                            Profile
                                        </a>
                                    </li>
                                    <li className="uk-nav-divider"></li>
                                    <li>
                                        <a href="#">
                                            <i className="fas fa-cog uk-margin-small-right"></i>
                                            Settings
                                        </a>
                                    </li>
                                    <li className="uk-nav-divider"></li>
                                    <li>
                                        <a href="#">
                                            <i className="fas fa-question-circle uk-margin-small-right"></i>
                                            Help
                                        </a>
                                    </li>
                                    <li className="uk-nav-divider"></li>
                                    <li>
                                        <a href="#">
                                            <i className="fas fa-sign-out-alt uk-margin-small-right"></i>
                                            Log out
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="app-nav-bar uk-grid uk-grid-collapse uk-flex-center uk-flex-bottom">
                        <h5>
                            <Link to="/" className={`nav-link ${this.isSelected(ApplicationTab.Dashboard) ? 'selected' : ''}`}>
                                <i className="fas fa-chart-line"></i>
                                <span className="nav-link-text">Dashboard</span>
                            </Link>
                        </h5>
                        <h5>
                            <Link to="/portfolios" className={`nav-link ${this.isSelected(ApplicationTab.Portfolios) ? 'selected' : ''}`}>
                                <i className="fas fa-layer-group"></i>
                                <span className="nav-link-text">Portfolios</span>
                            </Link>
                        </h5>
                        <h5>
                            <Link to="/accounts" className={`nav-link ${this.isSelected(ApplicationTab.Accounts) ? 'selected' : ''}`}>
                                <i className="fa fa-building"></i>
                                <span className="nav-link-text">Accounts</span>
                            </Link>
                        </h5>
                    </div>
                </div>
                <div className="app-content">
                    <div className="content-container">
                        <Route exact path="/" component={Dashboard} />
                        <Route path="/portfolios" component={Portfolios} />
                        <Route path="/accounts" component={Accounts} />
                        <Route path="/account" component={AccountDetailView} />
                        <Route path="/portfolio" component={PortfolioDetail} />
                    </div>
                </div>
                <ToastContainer 
                    newestOnTop={true}
                    className="notification-container"
                    closeButton={false}
                    position={ToastPosition.BOTTOM_LEFT} />
            </div>
            );
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        fetchBackendVersion: () => dispatch(fetchBackendVersion()),
        fetchInstanceDetails: () => dispatch(fetchInstanceDetails())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, {}, ApplicationState> = (state: ApplicationState) => {
    return {
        backendVersion: state.backend_version.value,
        instance_detail: state.instance_detail.value,
        working: state.backend_version.working || state.instance_detail.working,
        error: state.backend_version.error || state.backend_version.error,
        errorMessage: state.backend_version.errorMessage || state.backend_version.errorMessage,
        selectedTab: state.view.app.selectedTab
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(Home);