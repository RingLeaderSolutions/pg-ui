import * as React from "react";
import Header from "../Header";

const PortfolioUploads : React.SFC<{}> = () => {
    return (
        <div className="content-inner-portfolio">
            <div className="table-uploads">
                    <div className="search-uploads">
                        <form className="uk-search uk-search-default">
                            <span className="uk-search-icon-flip" data-uk-search-icon></span>
                            <input className="uk-search-input" type="search" placeholder="Search..." />
                        </form>
                        <div className="actions-uploads">
                            <button className="uk-button uk-button-primary">Bulk upload MPANs</button>
                            <button className="uk-button uk-button-default">Bulk upload HH Data</button>
                        </div>
                    </div>
                    <div>
                        <table className="uk-table uk-table-divider">
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Uploader</th>
                                    <th>Upload Date</th>
                                    <th>Progress</th>
                                    <th>Notes</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><div className="circle circle-blue" /></td>
                                    <td>Tony Walsh</td>
                                    <td>10 minutes ago</td>
                                    <td>1 of 2 MPANs updated</td>
                                    <td>HH data for St Albans MPANs</td>
                                    <td><button className="uk-button uk-button-disabled">Processing...</button></td>
                                </tr>
                                <tr>
                                    <td><div className="circle circle-green" /></td>
                                    <td>Deanna Troi</td>
                                    <td>4 hours ago</td>
                                    <td>Completed</td>
                                    <td>Topline data insertion</td>
                                    <td><button className="uk-button uk-button-default">View</button></td>
                                </tr>
                                <tr>
                                    <td><div className="circle circle-red" /></td>
                                    <td>Wesley Crusher</td>
                                    <td>A week ago</td>
                                    <td>2 Anomalies detected</td>
                                    <td>First attempt at topline insertion</td>
                                    <td><button className="uk-button uk-button-primary">Resolve</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
        </div>)
}

export default PortfolioUploads;