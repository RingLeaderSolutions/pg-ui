import * as React from "react";

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

const Home : React.SFC<{}> = () => {
    return (
        <div className="app-container">
            <div className="sidebar">
                <div className="app-title">
                    <h1><strong>全備 ZENBI</strong></h1>
                    <p>Retail</p>
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

export default Home;