import * as React from "react";
import Header from "../Header";
import { RouteComponentProps } from 'react-router';

import DashboardSummary from "./DashboardSummary";
import DashboardStatus from "./DashboardStatus";
import DashboardTimeline from "./DashboardTimeline";

var ReactHighCharts = require("react-highcharts");

const Dashboard : React.SFC<{}> = () => {
    return (
        <div className="content-inner">
            <div className="content-dashboard">
                <Header title="Dashboard" />
                <div className="content-dashboard">
                    <DashboardSummary />
                    <div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid data-uk-height-match="target: > div > .uk-card">
                        <DashboardStatus />
                        <DashboardTimeline />
                    </div>
                </div>
            </div>
        </div>)
    }

export default Dashboard;