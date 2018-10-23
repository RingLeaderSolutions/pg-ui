import * as React from "react";

import { Portfolio, PortfolioDetails, User } from '../../../model/Models';
import PortfolioMeterStatus from "./PortfolioMeterStatus";
import UploadsCard from "../../common/UploadsCard";
import { Row, Col, Card, CardBody } from "reactstrap";

interface PortfolioSummaryProps {
    portfolio: Portfolio;
    detail: PortfolioDetails;
}

export default class PortfolioSummary extends React.Component<PortfolioSummaryProps, {}> {
    missingFieldText: string = "-";

    formatForDisplay(value: string){
        if(value == null || value == ""){
            return this.missingFieldText;
        }

        return value;
    }

    renderUser(user: User){
        if(user == null){
            return (<h6><strong>-</strong></h6>)
        }

        return (
            <div className="d-flex align-items-center">
                <img className="user-avatar rounded-circle mr-2" src={user.avatarUrl} style={{height: '45px'}}/>
                <h6 className="flex-grow-1 m-0"><span><strong>{user.firstName} {user.lastName}</strong></span></h6>
            </div>
        )
    }

    render() {
        var { portfolio } = this.props;

        var salesLead = this.renderUser(portfolio.salesLead);
        var supportExec = this.renderUser(portfolio.supportExec);

        return (
            <div className="w-100 p-3">
                <Row>
                    <Col lg md={4} sm={4} className="mb-4">
                        <Card className="stats-small stats-small--1 card-small">
                            <CardBody className="p-0 d-flex">
                                <div className="d-flex flex-column m-auto">
                                    <div className="stats-small__data text-center">
                                        <span className="stats-small__label text-uppercase"><i className="fas fa-user-alt mr-1"></i>Account Manager</span>
                                        <h6 className="stats-small__value count my-3">{salesLead}</h6>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg md={4} sm={4} className="mb-4">
                        <Card className="stats-small stats-small--1 card-small">
                            <CardBody className="p-0 d-flex">
                                <div className="d-flex flex-column m-auto">
                                    <div className="stats-small__data text-center">
                                        <span className="stats-small__label text-uppercase"><i className="fas fa-user-alt mr-1"></i>Support Executive</span>
                                        <h6 className="stats-small__value count my-3">{supportExec}</h6>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg md={4} sm={4} className="mb-4">
                        <Card className="stats-small stats-small--1 card-small">
                            <CardBody className="p-0 d-flex">
                                <div className="d-flex flex-column m-auto">
                                    <div className="stats-small__data text-center">
                                        <span className="stats-small__label text-uppercase"><i className="fas fa-tachometer-alt mr-1"></i>Included Meters</span>
                                        <h6 className="stats-small__value count my-3">{String(portfolio.mpans)}</h6>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <PortfolioMeterStatus portfolio={portfolio} />
                    <Col lg={6} md={12} className="mb-4">
                        <UploadsCard entity="portfolio" entityId={portfolio.id} />
                    </Col>
                </Row>
            </div>);
    }
}