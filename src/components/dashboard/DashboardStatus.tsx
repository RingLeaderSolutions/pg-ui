import * as React from "react";
import Spinner from "../common/Spinner";
import ErrorMessage from "../common/ErrorMessage";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { getDashboardStatus } from '../../actions/dashboardActions';
import { ApplicationState } from '../../applicationState';
import { DashboardPortfolioStatus } from '../../model/Models';
import { ChartConfig } from "./DashboardStatusChartConfig";

var ReactHighCharts = require("react-highcharts");

interface StatusProps {
}

interface StateProps {
    status: DashboardPortfolioStatus;
    working: boolean;
    error: boolean;
    errorMessage: string;
}

interface DispatchProps {
    getStatus: () => void;
}

class DashboardStatus extends React.Component<StatusProps & StateProps & DispatchProps, {}> {
    componentDidMount() {
        this.props.getStatus();
    }

    renderChart(){
        var config = ChartConfig;
        
        config.series[0].data = this.props.status.statusList.map(statusItem => {
            return { name: statusItem.status, y: statusItem.count };
        });

        return (<ReactHighCharts config={config} />);
    }
    render() {
        var content;
        if(this.props.working){
            content = (<Spinner hasMargin={true}/>);
        }
        else if(this.props.error){
            content = (<ErrorMessage content={this.props.errorMessage}/>);            
        }
        else {
            if(this.props.status.statusList.length == 0){
                content = (<p>Sorry, there are no portfolios for this team yet!</p>)                
            }
            else {
                content = this.renderChart();
            }
        }

        return (
            <div>
                <div className="uk-card uk-card-default uk-card-body">
                    <h3><span className="uk-margin-small-right" data-uk-icon="icon: world"></span>Portfolio Status</h3>
                    {content}
                </div>
            </div>)
    }
}
const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, StatusProps> = (dispatch) => {
    return {
        getStatus: () => dispatch(getDashboardStatus())
    };
};

const mapStateToProps: MapStateToProps<StateProps, StatusProps> = (state: ApplicationState) => {
    return {
        status: state.dashboard.status.value,
        working: state.dashboard.status.working,
        error: state.dashboard.status.error,
        errorMessage: state.dashboard.status.errorMessage
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardStatus);