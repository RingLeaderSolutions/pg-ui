import * as React from "react";
import ErrorMessage from "../common/ErrorMessage";
import { connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { AccountDetail } from '../../model/Models';
import Spinner from '../common/Spinner';
import * as moment from 'moment';

import { Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import UploadsCard from "../common/UploadsCard";
import { FlagIcon } from "../common/FlagIcon";

interface AccountSummaryViewProps { }

interface StateProps {
    account: AccountDetail;
    working: boolean;
    error: boolean;
    errorMessage: string;
    portfolios: any;
}

class AccountSummaryView extends React.Component<AccountSummaryViewProps & StateProps, {}> {
    calculateTotalMeters(){
        if(this.props.account.sites.length == 0){
            return 0;
        }
        var meterCountBySite =  this.props.account.sites.map(s => s.mpans.length + s.mprns.length);
        return meterCountBySite.reduce((pv, cv) => pv + cv);
    }

    renderFriendlyValue(value: string){
        if(value == null || value == ""){
            return "-";
        }
        
        return value;
    }

    renderBooleanIcon(value: boolean){
        if(value){
            return (<p className="m-0 flex-grow-1 d-flex justify-content-center align-items-center"><i className="fa fa-check-circle fa-2x text-success"></i></p>)
        }
        return (<p className="m-0 flex-grow-1 d-flex justify-content-center align-items-center"><i className="fa fa-times-circle fa-2x text-danger"></i></p>)
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.account == null){
            return (<Spinner />);
        }

        var { account } = this.props;
        var incorporationDate = account.incorporationDate ? moment(account.incorporationDate).format("DD/MM/YYYY") : "-";
        var totalMeters = this.calculateTotalMeters();
        var totalPortfolios = this.props.portfolios == null ? 0 : Object.keys(this.props.portfolios).length;

        return (
            <div className="px-3 pt-3">
                <Row>
                    <Col className="mb-4" lg={6} xs={12}>
                        <Card className="card-small h-100">
                            <CardHeader className="border-bottom px-3 py-2 d-flex align-items-center">
                                <h6 className="m-0 flex-grow-1"><i className="fas fa-list-alt mr-1"></i>Account Details</h6>
                                <FlagIcon country={account.countryOfOrigin} />
                            </CardHeader>
                            <CardBody className="p-0 d-flex flex-column">
                                <Row className="px-2 pt-3 d-flex" noGutters>
                                    <Col xs={6} className="d-flex flex-column justify-content-center text-center px-1 mt-md-0 mt-3">
                                        <h5 className="m-0 flex-grow-1 d-flex justify-content-center align-items-center">{this.renderFriendlyValue(account.creditRating)}</h5>
                                        <div className="text-light pt-2"><i className="fas fa-star text-warning mr-1"></i>Credit Rating</div>
                                    </Col>
                                    <Col xs={6} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                        <h5 className="m-0 flex-grow-1 d-flex justify-content-center align-items-center">{incorporationDate}</h5>
                                        <div className="text-light pt-2"><i className="fas fa-calendar-alt mr-1 text-primary"></i>Incorporation Date</div>
                                    </Col>
                                </Row>
                                <Row noGutters className="d-block">
                                <hr />
                                </Row>
                                <Row className="p-2 pb-3" noGutters>
                                    <Col xs={6} className="d-flex flex-column justify-content-center text-center px-1 mt-md-0 mt-3">
                                        <h6 className="m-0 flex-grow-1 d-flex justify-content-center">{account.address}</h6>
                                        <div className="text-light pt-2"><i className="fas fa-building mr-1 text-accent"></i>Address</div>
                                    </Col>
                                    <Col xs={6} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                        <h5 className="m-0 flex-grow-1 d-flex justify-content-center align-items-center">{this.renderFriendlyValue(account.postcode)}</h5>
                                        <div className="text-light pt-2"><i className="fas fa-envelope mr-1 text-accent"></i>Postcode</div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col className="mb-4" lg={6} xs={12}>
                        <Card className="card-small h-100">
                            <CardHeader className="border-bottom px-3 py-2">
                                <h6 className="m-0"><i className="fas fa-chart-line mr-1"></i>Statistics</h6>
                            </CardHeader>
                            <CardBody className="p-0 d-flex flex-column">
                                <Row className="px-2 pt-3 d-flex" noGutters>
                                    <Col lg xs={6} className="d-flex flex-column justify-content-center text-center px-1 mt-md-0 mt-3">
                                        <h5 className="m-0 flex-grow-1 d-flex justify-content-center align-items-center">{String(account.sites.length)}</h5>
                                        <div className="text-light pt-2"><i className="fas fa-store text-accent mr-1"></i>Sites</div>
                                    </Col>
                                    <Col lg xs={6} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                        <h5 className="m-0 flex-grow-1 d-flex justify-content-center align-items-center">{String(totalMeters)}</h5>
                                        <div className="text-light pt-2"><i className="fas fa-tachometer-alt mr-1 text-orange"></i>Meters</div>
                                    </Col>
                                </Row>
                                <Row noGutters className="d-block">
                                    <hr />
                                </Row>
                                <Row className="p-2 pb-3 align-items-center flex-grow-1" noGutters>
                                    <Col lg xs={6} className="d-flex flex-column justify-content-center text-center px-1 mt-md-0 mt-3">
                                        <h5 className="m-0 flex-grow-1 d-flex justify-content-center align-items-center flex-grow-1 d-flex align-items-center">{String(totalPortfolios)}</h5>
                                        <div className="text-light pt-2"><i className="fas fa-layer-group mr-1 text-primary"></i>Portfolios</div>
                                    </Col>
                                    <Col lg xs={6} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-xs-3">
                                        <h5 className="m-0 flex-grow-1 d-flex justify-content-center align-items-center">{String(account.contacts.length)}</h5>
                                        <div className="text-light pt-2"><i className="fas fa-user mr-1 text-indigo"></i>Contacts</div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col lg={6} md={12}>
                        <Card className="card-small mb-4">
                            <CardHeader className="border-bottom px-3 py-2">
                                <h6 className="m-0"><i className="fas fa-info mr-1"></i>Eligibility &amp; Exceptions</h6>
                            </CardHeader>
                            <CardBody className="p-0 d-flex flex-column">
                                <Row className="px-2 pt-3 d-flex" noGutters>
                                    <Col lg xs={6} className="d-flex flex-column justify-content-center text-center px-1 mt-md-0 mt-3">
                                        {this.renderBooleanIcon(account.isVATEligible)}
                                        <div className="text-light pt-2"><i className="fas fa-percentage text-green mr-1"></i>VAT Eligible</div>
                                    </Col>
                                    <Col lg xs={6} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                        {this.renderBooleanIcon(account.isRegisteredCharity)}
                                        <div className="text-light pt-2"><i className="fas fa-registered mr-1 text-secondary"></i>Registered Charity</div>
                                    </Col>
                                </Row>
                                <Row noGutters className="d-block">
                                    <hr />
                                </Row>
                                <Row className="p-2 pb-3" noGutters>
                                    <Col lg xs={6} className="d-flex flex-column justify-content-center text-center px-1 mt-md-0 mt-3">
                                        {this.renderBooleanIcon(account.hasFiTException)} 
                                        <div className="text-light pt-2"><i className="fas fa-info mr-1 text-accent"></i>FiT Exception</div>
                                    </Col>
                                    <Col lg xs={6} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                        {this.renderBooleanIcon(account.hasCCLException)}
                                        <div className="text-light pt-2"><i className="fas fa-leaf mr-1 text-success"></i>CCL Exception</div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg={6} md={12} className="mb-4">
                        <UploadsCard entity="account" entityId={account.id} />
                    </Col>
                </Row>
                <Row>
                    
                </Row>
            </div>
        );
    }
}
  
const mapStateToProps: MapStateToProps<StateProps, AccountSummaryViewProps, ApplicationState> = (state: ApplicationState) => {
    return {
        portfolios: state.hierarchy.selected_portfolios.value,
        account: state.hierarchy.selected.value,
        working: state.hierarchy.selected.working,
        error: state.hierarchy.selected.error,
        errorMessage: state.hierarchy.selected.errorMessage,
    };
};
  
export default connect(mapStateToProps, {})(AccountSummaryView);