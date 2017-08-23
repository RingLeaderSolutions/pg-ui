import * as React from "react";
import Header from "../Header";
import CounterCard from "../common/CounterCard";
import DashboardSummary from "./DashboardSummary";
import DashboardStatus from "./DashboardStatus";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { getPortfoliosSummary } from '../../actions/portfolioActions';
import { ApplicationState } from '../../applicationState';

var ReactHighCharts = require("react-highcharts");

const Dashboard : React.SFC<{}> = () => {
    return (
        <div className="content-inner">
            <Header title="Dashboard" />
            <div className="content-dashboard">
                <DashboardSummary />
                <div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid data-uk-height-match="target: > div > .uk-card">
                    <DashboardStatus />
                    <div>
                        <div className="uk-card uk-card-default uk-card-body">
                            <h3>Portfolio Timeline</h3>
                            <table className="uk-table uk-table-divider">
                                <thead>
                                    <tr>
                                        <th>Contract Dates</th>
                                        <th>Portfolios</th>
                                        <th>MPAN Workload</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1st October 2017</td>
                                        <td><strong>Quantum Analysis 17/18</strong></td>
                                        <td><span className="uk-label uk-label-danger">487</span></td>
                                    </tr>
                                    <tr>
                                        <td>1st April 2018</td>
                                        <td><strong>At Energy 18/19</strong></td>
                                        <td><span className="uk-label uk-label-warning">126</span></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><strong>Capalona 18/19</strong></td>
                                        <td><span className="uk-label uk-label-warning">65</span></td>
                                    </tr>
                                    <tr>
                                        <td>1st July 2018</td>
                                        <td><strong>Zenergi Ltd 18/19</strong></td>
                                        <td><span className="uk-label uk-label-danger">382</span></td>
                                    </tr>
                                    <tr>
                                        <td>1st April 2019</td>
                                        <td><strong>Eco Elite 19/20</strong></td>
                                        <td><span className="uk-label uk-label-warning">23</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }

export default Dashboard;