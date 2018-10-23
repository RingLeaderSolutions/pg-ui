import * as React from "react";
import Spinner from "../common/Spinner";
import ErrorMessage from "../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { getDashboardStatus } from '../../actions/dashboardActions';
import { ApplicationState } from '../../applicationState';
import { DashboardPortfolioStatus } from '../../model/Models';
import { Pie } from "react-chartjs-2";
import { Col, Card, CardHeader, CardBody, CardFooter, Row, Alert } from "reactstrap";

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

    toFriendlyPortfolioStatus(value: string){
        switch(value){
            case "onboard":
                return "Onboarding";
            case "tender":
                return "Tender"
            default:
                return value;
        }
    }

    renderChart(){        
        let items = this.props.status.statusList;
        return (
            <Pie height={220}
                data={{
                    datasets: [{
                        hoverBorderColor: '#ffffff',
                        data: items.map(si => si.count),
                        backgroundColor: [
                            'rgba(0,123,255,0.9)',
                            'rgba(0,123,255,0.5)',
                            'rgba(0,123,255,0.3)'
                        ]
                        }],
                        labels: items.map(si => this.toFriendlyPortfolioStatus(si.status))
                }}
                options={{
                    // Hides the gap between slices of the pie/donut
                    elements: {
                        arc: {
                            borderWidth: 0
                        }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 25,
                            boxWidth: 20
                        },
                    },
                    cutoutPercentage: 50,
                    tooltips: {
                        mode: 'index',
                        position: 'nearest'
                    }
                }} />)
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
                content = (
                    <Alert color="light">
                        <div className="d-flex align-items-center">
                            <i className="fas fa-info-circle mr-2"></i>
                            Sorry! No portfolios have been created yet.
                        </div>
                    </Alert>);
            }
            else {
                content = this.renderChart();
            }
        }

        return (
                <Card className="card-small">
                    <CardHeader className="border-bottom">
                        <h6 className="m-0"><i className="fas fa-chart-pie mr-1"></i>Portfolio Status</h6>
                    </CardHeader>
                    <CardBody className="d-flex py-3">
                        {content}
                    </CardBody>
                    <CardFooter className="border-top">
                        <Row>
                            <Col className="text-right view-report">
                                <a href="#">View portfolios &rarr;</a>
                            </Col>
                        </Row>
                    </CardFooter>
                </Card>)
    }
}
const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, StatusProps> = (dispatch) => {
    return {
        getStatus: () => dispatch(getDashboardStatus())
    };
};

const mapStateToProps: MapStateToProps<StateProps, StatusProps, ApplicationState> = (state: ApplicationState) => {
    return {
        status: state.dashboard.status.value,
        working: state.dashboard.status.working,
        error: state.dashboard.status.error,
        errorMessage: state.dashboard.status.errorMessage
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardStatus);