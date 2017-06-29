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
        <div className="main">
            <div className="sidebar">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/portfolios">Portfolios</Link></li>
                </ul>
            </div>
            <div className="container">
                <Route exact path="/" component={Dashboard} />
                <Route path="/portfolios" component={Portfolios} />
            </div>
        </div>
    );
    
}

export default Home;