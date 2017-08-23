import * as React from "react";
import Header from "../Header";
import CounterCard from "../common/CounterCard";
import DashboardSummary from "./DashboardSummary";
import DashboardStatus from "./DashboardStatus";
import DashboardTimeline from "./DashboardTimeline";
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
                    <DashboardTimeline />
                </div>
            </div>
        </div>)
    }

export default Dashboard;