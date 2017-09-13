import * as React from "react";

const PortfolioUploads : React.SFC<{}> = () => {
    return (
        <div className="content-inner-portfolio">
            
            <div className="table-uploads">
                <div className="search-uploads">
                    <form className="uk-search uk-search-default">
                        <span data-uk-search-icon="search"></span>
                        <input className="uk-search-input" type="search" placeholder="Search..." />
                    </form>
                    <div className="actions-uploads">
                        <button className="uk-button uk-button-primary" data-uk-toggle="target: #modal-sections">Bulk upload MPANs</button>
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
                                <td>
                                    <div className="user">
                                        <img className="avatar" src={require('../../../images/user1.png')} />
                                        <p>Tony Walsh</p>
                                    </div>
                                </td>
                                <td>10 minutes ago</td>
                                <td>1 of 2 MPANs updated</td>
                                <td>HH data for St Albans MPANs</td>
                                <td><button className="uk-button uk-button-disabled">Processing...</button></td>
                            </tr>
                            <tr>
                                <td><div className="circle circle-green" /></td>
                                <td>
                                    <div className="user">
                                        <img className="avatar" src={require('../../../images/user3.png')} />
                                        <p>Deanna Troi</p>
                                    </div>
                                </td>
                                <td>4 hours ago</td>
                                <td>Completed</td>
                                <td>Topline data insertion</td>
                                <td><button className="uk-button uk-button-default">View</button></td>
                            </tr>
                            <tr>
                                <td><div className="circle circle-red" /></td>
                                <td>
                                    <div className="user">
                                        <img className="avatar" src={require('../../../images/user6.png')} />
                                        <p>Aiden Day</p>
                                    </div>
                                </td>
                                <td>A week ago</td>
                                <td>2 Anomalies detected</td>
                                <td>First attempt at topline insertion</td>
                                <td><button className="uk-button uk-button-primary">Resolve</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div id="modal-sections" data-uk-modal="center: true">
                <div className="uk-modal-dialog">
                    <button className="uk-modal-close-default" type="button" data-uk-close></button>
                    <div className="uk-modal-header">
                        <h2 className="uk-modal-title">Bulk upload MPANs</h2>
                    </div>
                    <div className="uk-modal-body">
                        <p>Drag files into the location below to upload.</p>
                    </div>
                    <div className="uk-modal-footer uk-text-right">
                        <button className="uk-button uk-button-primary uk-modal-close" type="button"><span data-uk-icon="icon: cloud-upload" /> Upload</button>
                        <button className="uk-button uk-button-secondary uk-modal-close uk-margin-left" type="button"><span data-uk-icon="icon: close" /> Cancel</button>
                    </div>
                </div>
            </div>
        </div>)
}

export default PortfolioUploads;