import * as React from "react";
import Header from "../Header";
import CounterCard from "../common/CounterCard";
import Spinner from "../common/Spinner";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { getPortfoliosStatus } from '../../actions/portfolioActions';
import { ApplicationState } from '../../applicationState';
import { PortfoliosStatus, PortfolioStatusEntry } from '../../model/Models';
import { ChartConfig } from "./DashboardStatusChartConfig";

var ReactHighCharts = require("react-highcharts");

interface StatusProps {
}

interface StateProps {
    status: PortfoliosStatus;
    working: boolean;
}

interface DispatchProps {
    getStatus: () => void;
}

class DashboardStatus extends React.Component<StatusProps & StateProps & DispatchProps, {}> {
    componentDidMount() {
        this.props.getStatus();
    }
    render() {
        var content = (<Spinner />);
        if(!this.props.working){
            var config = ChartConfig;
            
            config.series[0].data = this.props.status.statusList.map(statusItem => {
                return { name: statusItem.status, y: statusItem.count };
            });

            content = (<ReactHighCharts config={config} />);
        }
        return (
            <div>
                <div className="uk-card uk-card-default uk-card-body">
                    <h3>Portfolio Status</h3>
                    {content}
                </div>
            </div>)
    }
}
const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, StatusProps> = (dispatch) => {
    return {
        getStatus: () => dispatch(getPortfoliosStatus())
    };
};

const mapStateToProps: MapStateToProps<StateProps, StatusProps> = (state: ApplicationState) => {
    return {
        status: state.portfolio.status,
        working: state.portfolio.status_working
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardStatus);