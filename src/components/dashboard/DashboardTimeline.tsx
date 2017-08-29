import * as React from "react";
import Spinner from "../common/Spinner";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { getDashboardTimeline } from '../../actions/dashboardActions';
import { ApplicationState } from '../../applicationState';
import { DashboardPortfolioTimeline } from '../../model/Models';

interface TimelineProps {
}

interface StateProps {
    timeline: DashboardPortfolioTimeline;
    working: boolean;
}

interface DispatchProps {
    getTimeline: () => void;
}

class DashboardSummary extends React.Component<TimelineProps & StateProps & DispatchProps, {}> {
    componentDidMount() {
        this.props.getTimeline();
    }
    render() {
        var content = (<Spinner hasMargin={true}/>);
        if(!this.props.working){
            var tableContent = this.props.timeline.timelineList.map(timelineItem => {
                var totalActions = (timelineItem.totalMpans * 2);
                var remainingPercentage = timelineItem.workload / totalActions;
                var labelClass = "uk-label uk-label-success";
                if(remainingPercentage >= 0.7){
                    labelClass = "uk-label uk-label-danger";
                }
                else if(remainingPercentage > 0){
                    labelClass = "uk-label uk-label-warning";
                }
                return (
                    <tr key={timelineItem.id}>
                        <td>{timelineItem.contractStart} - {timelineItem.contractEnd}</td>
                        <td><strong>{timelineItem.title}</strong></td>
                        <td><span className={labelClass}>{timelineItem.workload}/{totalActions}</span></td>
                    </tr>
                );
            });
            content = (
                <div className="dashboard-timeline">
                    <table className="uk-table uk-table-divider">
                        <thead>
                            <tr>
                                <th>Contract Dates</th>
                                <th>Portfolios</th>
                                <th>MPAN Workload</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableContent}
                        </tbody>
                    </table>
                </div>
            )
        }
        
        return (
            <div>
                <div className="uk-card uk-card-default uk-card-body">
                    <h3>Portfolio Timeline</h3>
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
        timeline: state.dashboard.timeline,
        working: state.dashboard.timeline_working
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardSummary);