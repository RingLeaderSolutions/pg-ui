import * as React from "react";
import Spinner from "../common/Spinner";
import ErrorMessage from "../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { getDashboardTimeline } from '../../actions/dashboardActions';
import { ApplicationState } from '../../applicationState';
import { DashboardPortfolioTimeline } from '../../model/Models';

interface TimelineProps {
}

interface StateProps {
    timeline: DashboardPortfolioTimeline;
    working: boolean;
    error: boolean;
    errorMessage: string;
}

interface DispatchProps {
    getTimeline: () => void;
}

class DashboardSummary extends React.Component<TimelineProps & StateProps & DispatchProps, {}> {
    componentDidMount() {
        this.props.getTimeline();
    }

    renderTimelineTable(){
        var tableContent = this.props.timeline.timelineList.map(timelineItem => {
            var totalActions = (timelineItem.totalMpans * 2);
            var remainingPercentage = timelineItem.workload / totalActions;
            var label = (<span className="uk-label uk-label-success">Low</span>);
            if(remainingPercentage >= 0.7){
                label = (<span className="uk-label uk-label-danger">High</span>);
            }
            else if(remainingPercentage > 0){
                label = (<span className="uk-label uk-label-warning">Medium</span>);
            }
            return (
                <tr key={timelineItem.id}>
                    <td>{timelineItem.contractStart} - {timelineItem.contractEnd}</td>
                    <td><strong>{timelineItem.title}</strong></td>
                    <td>{label}</td>
                </tr>
            );
        });
        
        return (
            <div className="dashboard-timeline">
                <table className="uk-table uk-table-divider">
                    <thead>
                        <tr>
                            <th>Contract Dates</th>
                            <th>Portfolio</th>
                            <th>Meter Workload</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent}
                    </tbody>
                </table>
            </div>
        )
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
            if(this.props.timeline.timelineList.length == 0){
                content = (<p>Sorry, there are no portfolios for this team yet!</p>)                
            }
            else {
                content = this.renderTimelineTable();
            }
        }
        
        return (
            <div>
                <div className="uk-card uk-card-default uk-card-body">
                    <h3><span className="uk-margin-small-right" data-uk-icon="icon: clock"></span>Portfolio Workload</h3>
                    {content}
                </div>
            </div>)
        }
    }

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TimelineProps> = (dispatch) => {
    return {
        getTimeline: () => dispatch(getDashboardTimeline())
    };
};

const mapStateToProps: MapStateToProps<StateProps, TimelineProps> = (state: ApplicationState) => {
    return {
        timeline: state.dashboard.timeline.value,
        working: state.dashboard.timeline.working,
        error: state.dashboard.timeline.error,
        errorMessage: state.dashboard.timeline.errorMessage
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardSummary);