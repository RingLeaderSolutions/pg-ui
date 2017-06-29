import * as React from "react";

import Dashboard from "./Dashboard";
import Portfolios from "./Portfolios";

import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

const Home : React.SFC<{}> = () => {
    return (
        <div className="uk-container app-container">
            <div className="sidebar">
                <ul className="uk-nav-default uk-nav-parent-icon" data-uk-nav>
                    <li className="uk-nav-header">ZENBI Retail</li>
                    <li><Link to="/"><span className="uk-margin-small-right" data-uk-icon="icon: table"></span>Dashboard</Link></li>
                    <li className="uk-nav-divider"></li>                    
                    <li><Link to="/portfolios"><span className="uk-margin-small-right" data-uk-icon="icon: thumbnails"></span>Portfolios</Link></li>
                    <li className="uk-nav-divider"></li>
                    <li><Link to="/calendar"><span className="uk-margin-small-right" data-uk-icon="icon: trash"></span>Calendar</Link></li>
                    <li className="uk-nav-divider"></li>                    
                    <li><Link to="/uploads"><span className="uk-margin-small-right" data-uk-icon="icon: trash"></span>Uploads</Link></li>
                </ul>
            </div>
            <div className=" content-container">
                <Route exact path="/" component={Dashboard} />
                <Route path="/portfolios" component={Portfolios} />
            </div>
        </div>
    );
    
}

export default Home;