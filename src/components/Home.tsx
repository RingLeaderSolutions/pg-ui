import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../applicationState';
import { fetchBackendVersion, fetchInstanceDetails } from '../actions/authActions';

import Dashboard from "./dashboard/Dashboard";
import Portfolios from "./portfolio/Portfolios";
import Accounts from "./accounts/Accounts";
import PortfolioDetail from "./portfolio/PortfolioDetail";
import AccountDetailView from "./accounts/AccountDetailView";

import {
    Route,
    Link
} from 'react-router-dom';
import { InstanceDetail, ApplicationTab } from "../model/Models";


interface StateProps {
    backendVersion: string;
    instance_detail: InstanceDetail;
    working: boolean;
    selectedTab: ApplicationTab;
    error: boolean;
    errorMessage: string;
}
  
interface DispatchProps {
    fetchBackendVersion: () => void;
    fetchInstanceDetails: () => void;
}

class Home extends React.Component<StateProps & DispatchProps, {}> {
    componentDidMount(){
        setTimeout(() => {
            this.props.fetchBackendVersion();
            this.props.fetchInstanceDetails();
        }, 2000);
    }

    renderSelectedTriangle(tab: ApplicationTab){
        if(this.props.selectedTab == tab){
            return (<i className="fas fa-caret-right uk-margin-small-right"></i>)
        }
        
        return null;
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
            <div className="app-container uk-grid uk-grid-collapse uk-height-1-1">
                <div className="sidebar uk-width-1-6 uk-height-1-1">
                    <div className="app-title">
                        <img src={this.props.instance_detail.logoUri} alt={this.props.instance_detail.name} /> 
                        {/* <img src={require('../images/tpi-flow-logo.png')} alt={this.props.instance_detail.name} />  */}
                    </div>
                    <div className="uk-text-center">
                        <div>
                            <span className="uk-label label-grey">{appConfig.environment_name} v0.1.41</span>
                        </div>
                        <div>
                            <span className="uk-label label-grey">Server v{this.props.backendVersion}</span>
                        </div>
                    </div>
                    <ul className="uk-margin-large-top uk-nav-default uk-nav-parent-icon" data-uk-nav>
                        <li>
                            <Link to="/">{this.renderSelectedTriangle(ApplicationTab.Dashboard)}<i className="fa fa-tachometer-alt uk-margin-small-right fa-lg"></i>Dashboard</Link>
                        </li>
                        <li className="uk-nav-divider"></li>                    
                        <li>
                            <Link to="/portfolios">{this.renderSelectedTriangle(ApplicationTab.Portfolios)}<i className="fa fa-cubes uk-margin-small-right fa-lg"></i>Portfolios</Link>
                        </li>
                        <li className="uk-nav-divider"></li>
                        <li>
                            <Link to="/accounts">{this.renderSelectedTriangle(ApplicationTab.Accounts)}<i className="fa fa-building uk-margin-small-right fa-lg"></i>Accounts</Link>
                        </li>
                    </ul>
                </div>
                <div className="uk-height-1-1 uk-width-5-6">
                    <div className="content-container">
                        <Route exact path="/" component={Dashboard} />
                        <Route path="/portfolios" component={Portfolios} />
                        <Route path="/accounts" component={Accounts} />
                        <Route path="/account" component={AccountDetailView} />
                        <Route path="/portfolio" component={PortfolioDetail} />
                    </div>
                </div>
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
  
const mapStateToProps: MapStateToProps<StateProps, {}> = (state: ApplicationState) => {
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