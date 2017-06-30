import * as React from "react";

import Dashboard from "./Dashboard";
import Portfolios from "./Portfolios";
import Portfolio from "./portfolio/Portfolio";

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
                    <li><Link to="/"><span className="uk-margin-small-right" data-uk-icon="icon: table"></span>Dashboard</Link></li>
                    <li className="uk-nav-divider"></li>                    
                    <li><Link to="/portfolios"><span className="uk-margin-small-right" data-uk-icon="icon: thumbnails"></span>Portfolios</Link></li>
                    <li className="uk-nav-divider"></li>
                    <li><Link to="/calendar"><span className="uk-margin-small-right" data-uk-icon="icon: trash"></span>Calendar</Link></li>
                    <li className="uk-nav-divider"></li>                    
                    <li><Link to="/uploads"><span className="uk-margin-small-right" data-uk-icon="icon: trash"></span>Uploads</Link></li>
                </ul>
            </div>
            <div className="content-container">
                <Route exact path="/" component={Dashboard} />
                <Route path="/portfolios" component={Portfolios} />
                <Route path="/portfolio" component={Portfolio} />
            </div>
        </div>
    );
    
}

export default Home;