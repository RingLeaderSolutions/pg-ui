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
import { InstanceDetail } from "../model/Models";
import Spinner from "./common/Spinner";


interface StateProps {
    backendVersion: string;
    instance_detail: InstanceDetail;
    working: boolean;
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

    renderDashboardTriangle(){
        if(window.location.pathname == "/"){
            return (<span className="uk-margin-small-right" data-uk-icon="icon: triangle-right"></span>)
        }
        
        return null;
    }
    renderSelectedTriangle(pathIdentifier: string){
        if(window.location.href.includes(pathIdentifier)){
            return (<span className="uk-margin-small-right" data-uk-icon="icon: triangle-right"></span>)
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
            <div className="app-container">
                <div className="sidebar">
                    <div className="app-title">
                        <img src={this.props.instance_detail.logoUri} alt={this.props.instance_detail.name} /> 
                        {/* <img src={require('../images/tpi-flow-logo.png')} alt={this.props.instance_detail.name} />  */}
                        <div className="environment">
                            <span className="uk-label">{appConfig.environment_name} v0.1.31</span>
                        </div>
                        <div className="environment">
                            <span className="uk-label">Backend v{this.props.backendVersion}</span>
                        </div>
                    </div>
                    <ul className="uk-nav-default uk-nav-parent-icon" data-uk-nav>
                        <li className="uk-nav-header">Navigation</li>
                        <li>
                            <Link to="/">{this.renderDashboardTriangle()}<span className="uk-margin-small-right" data-uk-icon="icon: thumbnails"></span>Dashboard</Link>
                        </li>
                        <li className="uk-nav-divider"></li>                    
                        <li>
                            <Link to="/portfolios">{this.renderSelectedTriangle("portfolio")}<span className="uk-margin-small-right" data-uk-icon="icon: table"></span>Portfolios</Link>
                        </li>
                        <li className="uk-nav-divider"></li>
                        <li>
                            <Link to="/accounts">{this.renderSelectedTriangle("account")}<span className="uk-margin-small-right" data-uk-icon="icon: social"></span>Accounts</Link>
                        </li>
                    </ul>
                </div>
                <div className="content-container">
                    <Route exact path="/" component={Dashboard} />
                    <Route path="/portfolios" component={Portfolios} />
                    <Route path="/accounts" component={Accounts} />
                    <Route path="/account" component={AccountDetailView} />
                    <Route path="/portfolio" component={PortfolioDetail} />
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
        working: state.backend_version.working || state.instance_detail.working
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(Home);