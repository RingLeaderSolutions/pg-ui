import * as React from "react";
import Spinner from "../common/Spinner";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { getPortfoliosTimeline } from '../../actions/portfolioActions';
import { ApplicationState } from '../../applicationState';
import { PortfoliosTimeline } from '../../model/Models';

interface TimelineProps {
}

interface StateProps {
    timeline: PortfoliosTimeline;
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
                    <tr>
                        <td>{timelineItem.contractStart} - {timelineItem.contractEnd}</td>
                        <td><strong>{timelineItem.title}</strong></td>
                        <td><span className={labelClass}>{timelineItem.workload}/{totalActions}</span></td>
                    </tr>
                );
            });
            content = (
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
        getTimeline: () => dispatch(getPortfoliosTimeline())
    };
};

const mapStateToProps: MapStateToProps<StateProps, TimelineProps> = (state: ApplicationState) => {
    return {
        timeline: state.portfolio.timeline,
        working: state.portfolio.timeline_working
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardSummary);