import * as React from "react";
import Header from "./Header";
import CounterCard from "./CounterCard";

const Portfolio : React.SFC<{}> = () => {

    return (
        <div className="content-inner">
            <Header title="Portfolios: B4B Energy 17/18" />
            <ul data-uk-tab>
                <li className="uk-active"><a href="#">Summary</a></li>
                <li className="uk-disabled"><a href="#">MPANs</a></li>
                <li className="uk-disabled"><a href="#">Forecast</a></li>
                <li className="uk-disabled"><a href="#">Quotes</a></li>
                <li><a href="#">Uploads</a></li>
            </ul>
            <div className="content-portfolio">
                <div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid>
                    <CounterCard title="B4B Energy" label="TPI" small/>
                    <CounterCard title="Tom Davies" label="TPI Contact" small/>
                    <CounterCard title="Aiden Day" label="Sales Lead" small/>
                    <CounterCard title="Miles O'Brien" label="Support Executive" small/>
                    <CounterCard title="A+" label="Credit Check" small/>
                    <CounterCard title="Yes" label="Has Approval" small/>
                </div>
                <div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid>
                    <CounterCard title="01/04/2017" label="Contract Start" small/>
                    <CounterCard title="31/04/2018" label="Contract End" small/>
                    <CounterCard title="2.4 GWh" label="Consumption" small/>
                    <CounterCard title="Processing..." label="Upload Activity" small/>
                    <CounterCard title="3" label="Accounts" small/>
                    <CounterCard title="6" label="MPANs" small />
                </div>
                <div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid>
                    <div>
                        <div className="uk-card uk-card-default uk-card-body">
                            <h4>MPAN Status</h4>
                            <table className="uk-table uk-table-divider">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Documents</th>
                                        <th>Validation</th>
                                        <th>HH Data</th>
                                        <th>Forecasts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Incomplete</td>
                                        <td className="uk-text-success">0</td>
                                        <td className="uk-text-danger">1</td>
                                        <td className="uk-text-danger">4</td>
                                        <td className="uk-text-danger">5</td>
                                    </tr>
                                    <tr>
                                        <td>Complete</td>
                                        <td className="uk-text-success">6</td>
                                        <td className="uk-text-success">5</td>
                                        <td className="uk-text-success">2</td>
                                        <td className="uk-text-success">1</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div>
                        <div className="uk-card uk-card-default uk-card-body">
                            <h4>Change History</h4>
                            <table className="uk-table uk-table-divider">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Activity</th>
                                        <th>Entries</th>
                                        <th>Author</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>4 hours ago</td>
                                        <td>HH Data bulk loaded</td>
                                        <td>10 MPANs</td>
                                        <td>Ada Thompson</td>
                                    </tr>
                                    <tr>
                                        <td>3 days ago</td>
                                        <td>Topline validated</td>
                                        <td>2 MPANs</td>
                                        <td>Gary Bryan</td>
                                    </tr>
                                    <tr>
                                        <td>5 days ago</td>
                                        <td>Topline loaded</td>
                                        <td>10 MPANs</td>
                                        <td>Gary Bryan</td>
                                    </tr>
                                    <tr>
                                        <td>2 months ago</td>
                                        <td>Approval</td>
                                        <td></td>
                                        <td>Ada Thompson</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>)
}

export default Portfolio;