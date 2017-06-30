import * as React from "react";
import Header from "../Header";

import PortfolioSummary from "./PortfolioSummary";
import PortfolioUploads from "./PortfolioUploads";

const Portfolio : React.SFC<{}> = () => {
    return (
        <div className="content-inner">
            <Header title="Portfolios: B4B Energy 17/18" />
            <ul data-uk-tab>
                <li className="uk-active"><a href="#">Summary</a></li>
                <li><a href="#">MPANs</a></li>
                <li><a href="#">Forecast</a></li>
                <li><a href="#">Quotes</a></li>
                <li><a href="#">Uploads</a></li>
            </ul>
            <ul className="uk-switcher">
                <li><PortfolioSummary /></li>
                <li>MPANs tab not yet built.</li>
                <li>Forecast tab not yet built.</li>
                <li>Quotes tab not yet built.</li>
                <li><PortfolioUploads /></li>
            </ul>
        </div>)
}

export default Portfolio;