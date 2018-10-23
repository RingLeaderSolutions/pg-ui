import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { getDashboardSummary } from '../../actions/dashboardActions';
import { ApplicationState } from '../../applicationState';
import { DashboardPortfolioSummary } from '../../model/Models';
import { CardBody, Row, Col, Card } from "reactstrap";
import { Line } from "react-chartjs-2";

interface SummaryProps {
}

interface StateProps {
    summary: DashboardPortfolioSummary;
    working: boolean;
    error: boolean;
    errorMessage: string;
}

interface DispatchProps {
    getSummary: () => void;
}

class DashboardSummary extends React.Component<SummaryProps & StateProps & DispatchProps, {}> {
    componentDidMount() {
        this.props.getSummary();
    }
    render() {
        let portfolioCount, siteCount, meterCount = "";
        // TODO: Loading & error handling
        if(!this.props.working && !this.props.error){
            portfolioCount = String(this.props.summary.portfolioCount);
            siteCount = String(this.props.summary.siteCount);
            meterCount = String(this.props.summary.mpanCount);
        }
        
        return (
            <Row>
                <Col lg md={6} sm={6} className="mb-4">
                    <Card className="stats-small stats-small--1 card-small">
                        <CardBody className="p-0 d-flex">
                            <div className="d-flex flex-column m-auto">
                                <div className="stats-small__data text-center">
                                    <span className="stats-small__label text-uppercase"><i className="fas fa-layer-group mr-1"></i>Portfolios</span>
                                    <h6 className="stats-small__value count my-3">{portfolioCount}</h6>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg md={6} sm={6} className="mb-4">
                    <Card className="stats-small stats-small--1 card-small">
                        <CardBody className="p-0 d-flex">
                            <div className="d-flex flex-column m-auto">
                                <div className="stats-small__data text-center">
                                    <span className="stats-small__label text-uppercase"><i className="fas fa-store mr-1"></i>Sites</span>
                                    <h6 className="stats-small__value count my-3">{siteCount}</h6>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg md={6} sm={6} className="mb-4">
                    <Card className="stats-small stats-small--1 card-small">
                        <CardBody className="p-0 d-flex">
                            <div className="d-flex flex-column m-auto">
                                <div className="stats-small__data text-center">
                                    <span className="stats-small__label text-uppercase"><i className="fas fa-tachometer-alt mr-1"></i>Meters</span>
                                    <h6 className="stats-small__value count my-3">{meterCount}</h6>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg md={6} sm={6} className="mb-4">
                    <Card className="stats-small stats-small--1 card-small">
                        <CardBody className="p-0 d-flex">
                            <div className="d-flex flex-column m-auto">
                                <div className="stats-small__data text-center">
                                    <span className="stats-small__label text-uppercase"><i className="fas fa-user-friends mr-1"></i>Team</span>
                                    <h6 className="stats-small__value count my-3">TPI</h6>
                                </div>
                            </div>
                            <Line data={{
            labels: ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5", "Label 6", "Label 7"],
            datasets: [{
                label: 'Today',
                fill: 'start',
                data: [1, 2, 1, 3, 5, 4, 7],
                backgroundColor: 'rgba(0, 184, 216, 0.1)',
                borderColor: 'rgb(0, 184, 216)',
                borderWidth: 1.5
            }]
        }} options={{
            maintainAspectRatio: true,
            responsive: true,
            legend: {
                display: false
            },
            tooltips: {
            enabled: false
            },
            elements: {
            point: {
                radius: 0
            },
            line: {
                tension: 0.3
            }
            },
            scales: {
                ticks: {
                    display: false,
                    // Avoid getting the graph line cut of at the top of the canvas.
                    // Chart.js bug link: https://github.com/chartjs/Chart.js/issues/4790
                    lineHeight: 1
                },
            xAxes: [{
                display: false,
            }],
            yAxes: [{
                display: false,
            }],
            }
        }} 
        height={120}/>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        )
        }
    }

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, SummaryProps> = (dispatch) => {
    return {
        getSummary: () => dispatch(getDashboardSummary())
    };
};

const mapStateToProps: MapStateToProps<StateProps, SummaryProps, ApplicationState> = (state: ApplicationState) => {
    return {
        summary: state.dashboard.summary.value,
        working: state.dashboard.summary.working,
        error: state.dashboard.summary.error,
        errorMessage: state.dashboard.summary.errorMessage
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardSummary);