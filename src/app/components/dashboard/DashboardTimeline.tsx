import * as React from "react";
import Spinner from "../common/Spinner";
import ErrorMessage from "../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { getDashboardTimeline } from '../../actions/dashboardActions';
import { ApplicationState } from '../../applicationState';
import { DashboardPortfolioTimeline } from '../../model/Models';
import { Col, Card, CardHeader, CardBody, ListGroup, Alert } from "reactstrap";
import { Doughnut } from "react-chartjs-2";
import { Link } from "react-router-dom";

// ListGroupItem doesn't appear to work with option #1 of passing `tag={Link}`
// See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20461
import { default as ListGroupItem } from "reactstrap/lib/ListGroupItem";

interface TimelineProps { }

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
        let listItems = this.props.timeline.timelineList.map(item => {
            let remainingPercentage = item.totalMpans === 0 ? 1 : item.workload / (item.totalMpans * 2);
            let completedPercentage = 1 - remainingPercentage;

            let color = "#c4183c" // Danger
            
            if(completedPercentage >= 0.75) {
                color = "#17c671" // Green
            }
            else if(completedPercentage >= 0.50){
                color = "#007bff" // Primary
            }
            else if(completedPercentage > 0.25){
                color = "#ffb400" // Warning
            }

            let chartData = [completedPercentage * 100, remainingPercentage * 100];
            return (
                <ListGroupItem key={item.id} action tag={Link} to={`/portfolio/${item.id}`} className="p-2 d-flex row m-0 border-top-0">
                    <Col lg={8} md={8} sm={8}>
                        <h6 className="text-truncate">{item.title}</h6>
                        <div className="text-meta">
                            <span className="mr-2">
                                <strong>{item.totalMpans}</strong>
                                <span className="ml-1">Meters</span>
                            </span>
                            <span>
                                <strong style={{color}}>{item.workload}</strong>
                                <span className="ml-1">Remaining Actions</span>
                            </span>
                        </div>
                    </Col>
                    <Col lg={4} md={4} sm={4} className="d-flex">
                        <div className="text-right ml-auto pr-2">
                            <h6 className="mb-1">{completedPercentage * 100}%</h6>
                            <span className="text-meta">Complete</span>
                        </div>
                        <div className="d-flex">
                            <Doughnut height={45} width={45}
                            data={{
                                datasets: [{
                                    hoverBorderColor: '#ffffff',
                                    data: chartData,
                                    backgroundColor: [
                                        color,
                                        'rgba(0,0,0,0.1)'
                                    ]
                                    }]
                            }}
                            options={{
                                
                                legend: {
                                    display: false,
                                },
                                cutoutPercentage: 70,
                                tooltips: {
                                    enabled: false
                                }
                            }} />
                        </div>
                    </Col>
                </ListGroupItem>)
        })

        return (
            <ListGroup flush className="d-block" style={{overflowY: "auto"}}>
                {listItems}
            </ListGroup>);
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
                content = (
                    <Alert color="light">
                        <div className="d-flex align-items-center">
                            <i className="fas fa-info-circle mr-2"></i>
                            Sorry! No portfolios have been created yet.
                        </div>
                    </Alert>);         
            }
            else {
                content = this.renderTimelineTable();
            }
        }

        return (
                <Card className="card-small h-100 flex-grow-1" style={{flexBasis: '400px'}}>
                    <CardHeader className="border-bottom">
                        <h6 className="m-0"><i className="fas fa-briefcase mr-1"></i>Onboarding Workload</h6>
                    </CardHeader>
                    <CardBody className="py-0 px-0 d-flex flex-column">
                        {content}
                    </CardBody> 
                </Card>)
        }
    }

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TimelineProps> = (dispatch) => {
    return {
        getTimeline: () => dispatch(getDashboardTimeline())
    };
};

const mapStateToProps: MapStateToProps<StateProps, TimelineProps, ApplicationState> = (state: ApplicationState) => {
    return {
        timeline: state.dashboard.timeline.value,
        working: state.dashboard.timeline.working,
        error: state.dashboard.timeline.error,
        errorMessage: state.dashboard.timeline.errorMessage
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardSummary);