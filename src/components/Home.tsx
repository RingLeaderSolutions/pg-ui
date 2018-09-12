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
import Spinner from "./common/Spinner";


interface StateProps {
    backendVersion: string;
    instance_detail: InstanceDetail;
    working: boolean;
    selectedTab: ApplicationTab;
}
  
interface DispatchProps {
    fetchBackendVersion: () => void;
    fetchInstanceDetails: () => void;
}

class Home extends React.Component<StateProps & DispatchProps, {}> {
    componentDidMount(){
        this.props.fetchBackendVersion();
        this.props.fetchInstanceDetails();
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
                <div className="app-container">
                    <Spinner hasMargin={true}/>
                </div>)
        }
        return (
            <div className="uk-grid uk-grid-collapse uk-height-1-1">
                <div className="sidebar uk-width-1-6 uk-height-1-1">
                    <div className="app-title">
                        <img src={this.props.instance_detail.logoUri} alt={this.props.instance_detail.name} /> 
                        {/* <img src={require('../images/tpi-flow-logo.png')} alt={this.props.instance_detail.name} />  */}
                        <div className="environment">
                            <span className="uk-label">{appConfig.environment_name} v0.1.39</span>
                        </div>
                        <div className="environment">
                            <span className="uk-label">Backend v{this.props.backendVersion}</span>
                        </div>
                    </div>
                    <ul className="uk-nav-default uk-nav-parent-icon" data-uk-nav>
                        <li className="uk-nav-header">Navigation</li>
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
        selectedTab: state.view.app.selectedTab
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(Home);