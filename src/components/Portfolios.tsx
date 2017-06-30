import * as React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

const Portfolios : React.SFC<{}> = () => {
    return (
        <div className="content-inner">
            <Header title="Portfolios" />
            <div className="content-portfolios">
                <div className="filters-portfolios">
                    <ul className="uk-tab-right" data-uk-tab>
                        <li><a>All Portfolios</a></li>
                        <li><a><div className="circle circle-grey" /><p>Qualified</p></a></li>
                        <li><a><div className="circle circle-blue" /><p>Indicative Pricing Only</p></a></li>
                        <li><a><div className="circle circle-orange" /><p>Proposal</p></a></li>
                        <li><a><div className="circle circle-green" /><p>Priced</p></a></li>
                    </ul>
                </div>
                <div className="table-portfolios">
                    <div className="search-portfolios">
                        <form className="uk-search uk-search-default">
                            <span className="uk-search-icon-flip" data-uk-search-icon></span>
                            <input className="uk-search-input" type="search" placeholder="Search..." />
                        </form>
                        <div className="actions-portfolios">
                            <button className="uk-button uk-button-primary">New portfolio</button>
                        </div>
                    </div>
                    <div>
                        <table className="uk-table uk-table-divider">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Sales Lead</th>
                                    <th>Support Executive</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Accounts</th>
                                    <th>Sites</th>
                                    <th>MPANs</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><Link to="/portfolio">B4B Energy 17/18</Link></td>
                                    <td><Link to="/portfolio"><div className="circle circle-orange" /></Link></td>
                                    <td><Link to="/portfolio">Aiden Day</Link></td>
                                    <td><Link to="/portfolio">Miles O'Brien</Link></td>
                                    <td><Link to="/portfolio">01/04/17</Link></td>
                                    <td><Link to="/portfolio">31/04/18</Link></td>
                                    <td><Link to="/portfolio">3</Link></td>
                                    <td><Link to="/portfolio">3</Link></td>
                                    <td><Link to="/portfolio">6</Link></td>
                                </tr>
                                <tr>
                                    <td>Capalona 18/19</td>
                                    <td><div className="circle circle-green" /></td>
                                    <td>Tony Walsh</td>
                                    <td>Deanna Troi</td>
                                    <td>01/04/18</td>
                                    <td>31/04/19</td>
                                    <td>7</td>
                                    <td>7</td>
                                    <td>384</td>
                                </tr>
                                <tr>
                                    <td>Zenergi Ltd 18/19</td>
                                    <td><div className="circle circle-blue" /></td>
                                    <td>Wesley Campbell</td>
                                    <td>William Riker</td>
                                    <td>01/07/19</td>
                                    <td>30/06/10</td>
                                    <td>18</td>
                                    <td>18</td>
                                    <td>1054</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>)
}

export default Portfolios;