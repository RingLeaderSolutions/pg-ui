import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../applicationState';
import { fetchBackendVersion } from '../actions/portfolioActions';

import Dashboard from "./dashboard/Dashboard";
import Portfolios from "./Portfolios";
import PortfolioDetail from "./portfolio/PortfolioDetail";
import MpanToplineDetail from "./portfolio/mpan/MpanToplineDetail";
import MpanHistoricalDetail from "./portfolio/mpan/MpanHistoricalDetail";

import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

interface StateProps {
    backendVersion: string;
    working: boolean;
}
  
interface DispatchProps {
    fetchBackendVersion: () => void;
}

class Home extends React.Component<StateProps & DispatchProps, {}> {
    componentDidMount(){
        this.props.fetchBackendVersion();
    }

    render(){
            return (
                <div className="app-container">
                    <div className="sidebar">
                        <div className="app-title">
                            <img src={require('../images/tpi-flow-logo.png')} alt="TPI Flow" />
                            <div className="environment">
                                <span className="uk-label">{appConfig.environment_name} v0.1.8</span>
                            </div>
                            <div className="environment">
                                <span className="uk-label">Backend v{this.props.backendVersion}</span>
                            </div>
                        </div>
                        <ul className="uk-nav-default uk-nav-parent-icon" data-uk-nav>
                            <li className="uk-nav-header">Navigation</li>
                            <li><Link to="/"><span className="uk-margin-small-right" data-uk-icon="icon: thumbnails"></span>Dashboard</Link></li>
                            <li className="uk-nav-divider"></li>                    
                            <li><Link to="/portfolios"><span className="uk-margin-small-right" data-uk-icon="icon: table"></span>Portfolios</Link></li>
                            <li className="uk-nav-divider"></li>
                            <li><Link to="/calendar"><span className="uk-margin-small-right" data-uk-icon="icon: calendar"></span>Calendar</Link></li>
                            <li className="uk-nav-divider"></li>                    
                            <li><Link to="/uploads"><span className="uk-margin-small-right" data-uk-icon="icon: upload"></span>Uploads</Link></li>
                        </ul>
                    </div>
                    <div className="content-container">
                        <Route exact path="/" component={Dashboard} />
                        <Route path="/portfolios" component={Portfolios} />
                        <Route path="/portfolio" component={PortfolioDetail} />
                        <Route path="/topline" component={MpanToplineDetail} />
                        <Route path="/historical" component={MpanHistoricalDetail} />
                    </div>
                </div>
            );
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        fetchBackendVersion: () => dispatch(fetchBackendVersion())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, {}> = (state: ApplicationState) => {
    return {
        backendVersion: state.backend_version.value,
        working: state.backend_version.working
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(Home);