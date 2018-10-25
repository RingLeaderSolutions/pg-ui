import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../../applicationState';

import ErrorMessage from "../../../common/ErrorMessage";
import * as moment from 'moment';

import { acceptQuote } from '../../../../actions/tenderActions';
import { Tender, TenderSupplier, TenderRecommendation, TenderIssuance, isComplete } from "../../../../model/Tender";
import { AccountDetail, PortfolioDetails } from "../../../../model/Models";
import { retrieveAccount } from "../../../../actions/portfolioActions";
import GenerateRecommendationDialog, { GenerateRecommendationDialogData } from "./GenerateRecommendationDialog";
import RecommendationDetailDialog, { RecommendationDetailDialogData } from "./RecommendationDetailDialog";
import SendRecommendationDialog, { SendRecommendationDialogData } from "./SendRecommendationDialog";
import { LoadingIndicator } from "../../../common/LoadingIndicator";
import { ButtonGroup, Button, Row, UncontrolledTooltip, Col, Alert, Card, CardHeader, CardBody } from "reactstrap";
import { openDialog } from "../../../../actions/viewActions";
import { ModalDialogNames } from "../../../common/modal/ModalDialogNames";
import { IsNullOrEmpty } from "../../../../helpers/extensions/ArrayExtensions";

interface TenderRecommendationsListProps {
    tender: Tender;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    suppliers: TenderSupplier[];
    account: AccountDetail;
    portfolio: PortfolioDetails;
}
  
interface DispatchProps {
    retrieveAccount: (accountId: string) => void;
    acceptQuote: (tenderId: string, quoteId: string) => void;

    openRecommendationReportDialog: (data: RecommendationDetailDialogData) => void;
    openGenerateRecommendationDialog: (data: GenerateRecommendationDialogData) => void;
    openSendRecommendationReport: (data: SendRecommendationDialogData) => void;
}

class TenderRecommendationsList extends React.Component<TenderRecommendationsListProps & StateProps & DispatchProps, {}> {
    componentDidMount(){
        this.props.retrieveAccount(this.props.portfolio.portfolio.accountId);
    }

    viewRecommendationReport(recommendation: TenderRecommendation){
        this.props.openRecommendationReportDialog({ tender: this.props.tender, recommendation });
    }


    renderRecommendationActions(recommendation: TenderRecommendation, enableAction: boolean){
        let { tenderId, winningQuoteId, summaryId } = recommendation;
        if(recommendation.communicated){
            return (
                <ButtonGroup>
                    <Button color="success" outline className="btn-grey-outline" id={`accept-recommendation-report-${summaryId}`}
                            disabled={!enableAction}
                            onClick={() => this.props.acceptQuote(tenderId, winningQuoteId)}>
                        <i className="fas fa-check"></i>
                    </Button>
                    <UncontrolledTooltip target={`accept-recommendation-report-${summaryId}`} placement="bottom">
                            <strong>Accept the winning quote associated with this report</strong>
                        </UncontrolledTooltip>
                    <Button color="accent" outline className="btn-grey-outline" id={`resend-recommendation-report-${summaryId}`}
                        disabled={!enableAction}
                        onClick={() => this.props.openSendRecommendationReport({ tender : this.props.tender, recommendation})}>
                        <i className="material-icons">send</i>
                    </Button>
                    <UncontrolledTooltip target={`resend-recommendation-report-${summaryId}`} placement="bottom">
                        <strong>Re-send this report</strong>
                    </UncontrolledTooltip>
                </ButtonGroup>);
        }

        return (
            <div>
                <Button color="accent" outline className="btn-grey-outline" id={`send-recommendation-report-${summaryId}`}
                    disabled={!enableAction}
                    onClick={() => this.props.openSendRecommendationReport({ tender : this.props.tender, recommendation})}>
                    <i className="material-icons">send</i>
                </Button>
                <UncontrolledTooltip target={`send-recommendation-report-${summaryId}`} placement="bottom">
                    <strong>Send this report</strong>
                </UncontrolledTooltip>
            </div>);
    }

    renderSummaryTableContent(enableAction: boolean){
        return this.props.tender.summaries
            .sort((q1: TenderRecommendation, q2: TenderRecommendation) => {        
                if (q1.created < q2.created) return 1;
                if (q1.created > q2.created) return -1;
                return 0;
            })
            .map(s => {
                var supplier = this.props.suppliers.find(su => su.supplierId == s.supplierId);
                var supplierText = supplier == null ? "Unknown" : (<img src={supplier.logoUri} style={{ maxWidth: "70px", maxHeight: "40px"}}/>);

                var created = moment.utc(s.created).local();
                var communicated = s.communicated != null ? moment.utc(s.communicated).local().fromNow() : "Never";
                return (
                    <tr key={s.summaryId}>
                        <td className="align-middle">
                            <Button color="primary" outline className="btn-grey-outline" id={`view-recommendation-report-${s.summaryId}`}
                                onClick={() => this.viewRecommendationReport(s)}>
                                <i className="far fa-eye fa"></i>
                            </Button>
                            <UncontrolledTooltip target={`view-recommendation-report-${s.summaryId}`} placement="bottom">
                                <strong>Open and view this report</strong>
                            </UncontrolledTooltip>
                        </td>
                        <td className="align-middle">
                            <div>
                                <p id={`recommendation-created-${s.summaryId}`} className="m-0">{created.fromNow()}</p>
                                <UncontrolledTooltip target={`recommendation-created-${s.summaryId}`} placement="bottom">
                                    <strong>{created.format("DD/MM/YYYY HH:mm:ss")}</strong>
                                </UncontrolledTooltip>
                            </div>
                        </td>
                        <td className="align-middle">{s.meterCount}</td>
                        <td className="align-middle">{s.supplierCount}</td>
                        <td className="align-middle">{supplierText}</td>
                        <td className="align-middle">{s.winningDuration == 0 ? "Flexi" : `${s.winningDuration} months`}</td>
                        <td className="align-middle">
                            <div>
                                <p id={`recommendation-communicated-${s.summaryId}`} className="m-0">{communicated}</p>
                                <UncontrolledTooltip target={`recommendation-communicated-${s.summaryId}`} placement="bottom">
                                    <strong>{s.communicated ? `${moment.utc(s.communicated).local().format("DD/MM/YYYY HH:mm:ss")}` : "This recommendation report has not yet been sent."}</strong>
                                </UncontrolledTooltip>
                            </div>
                        </td>
                        <td className="align-middle">
                            <div>
                                {this.renderRecommendationActions(s, enableAction)}
                            </div>
                        </td>
                    </tr>
                )
            });
    }

    renderSummaryTable(tenderComplete: boolean){
        var hasContact = !IsNullOrEmpty(this.props.account.contacts);

        let enableAction = !tenderComplete && hasContact;
        var tableContent = this.renderSummaryTableContent(enableAction);

        return (
            <Card className="card-small h-100">
                <CardHeader className="border-bottom pl-3 pr-2 py-2">
                    <h6 className="m-0"><i className="fas fa-bullhorn mr-1"></i>Recommendations</h6>
                </CardHeader>
                <CardBody className="p-2">
                    {!hasContact && (
                        <Alert color="light" className="mb-2">
                            <div className="d-flex align-items-center flex-column">
                                <i className="fas fa-exclamation-triangle mr-2"></i>
                                <p className="m-0 pt-2">Issuance of recommendations is disabled as this portfolio's account does not have any contacts.</p>
                                <p className="m-0 pt-1">Please visit the Accounts tab to add a contact to this account!</p>
                            </div>
                        </Alert>)}

                    <table className="table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Created</th>
                                <th>Meter Count</th>
                                <th>Supplier Count</th>
                                <th colSpan={2}>Winner</th>
                                <th>Last Sent</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableContent}
                        </tbody>
                    </table>
                </CardBody>
            </Card>);
    }

    getLatestPackIssuance(){
        return this.props.tender.issuances
            .sort(
                (i1: TenderIssuance, i2: TenderIssuance) => {
                    var firstDate = moment.utc(i1.created).unix();
                    var secondDate = moment.utc(i2.created).unix();
            
                    if (firstDate > secondDate) return -1;
                    if (firstDate < secondDate) return 1;
                    return 0;
                })[0];
    }

    render() {
        let { tender } = this.props;
        if(this.props.suppliers == null || this.props.working){
            return (<LoadingIndicator />);
        }
        else if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage}/>);
        }
        else if(IsNullOrEmpty(tender.issuances)){
            return (
                <Alert color="light" className="pt-3 m-0">
                    <div className="d-flex align-items-center flex-column">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        <p className="m-0 pt-2">No packs have been issued for this tender yet.</p>
                        <p className="m-0 pt-1">Head back to the Offers tab to issue some and start receiving offers!</p>
                    </div>
                </Alert>);
        }

        let tenderComplete = isComplete(tender);
        let content = (
            <Alert color="light" className="pt-3 m-0">
                <div className="d-flex align-items-center flex-column">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    <p className="m-0 pt-2">No recommendations have been generated for this tender yet.</p>
                    <p className="m-0 pt-1">Click on the button above to get started!</p>
                </div>
            </Alert>);
        
        if(tender.summaries && tender.summaries.length > 0){
            content = this.renderSummaryTable(tenderComplete);
        }

        return (
            <div className="w-100 px-3 py-2">
                <Row noGutters>
                    <Col className="d-flex justify-content-center justify-content-md-start align-items-center">
                        <Button color="accent" id="create-recommendation-button"
                                disabled={tenderComplete}
                                onClick={() => this.props.openGenerateRecommendationDialog({ tender: this.props.tender, issuance: this.getLatestPackIssuance() })}>
                            <i className="fas fa-plus-circle mr-1"></i>
                             Create Recommendation
                        </Button>
                        <UncontrolledTooltip target="create-recommendation-button" placement="bottom">
                            <strong>Create a recommendation report and select a winning offer</strong>
                        </UncontrolledTooltip>
                    </Col>
                </Row>
                <div className="mt-3">
                    {content}
                </div>
                <GenerateRecommendationDialog />
                <RecommendationDetailDialog />
                <SendRecommendationDialog />
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderRecommendationsListProps> = (dispatch) => {
    return {
        retrieveAccount: (accountId: string) => dispatch(retrieveAccount(accountId)),
        acceptQuote: (tenderId: string, quoteId: string) => dispatch(acceptQuote(tenderId, quoteId)),

        openRecommendationReportDialog: (data: RecommendationDetailDialogData) => dispatch(openDialog(ModalDialogNames.RecommendationDetail, data)),
        openGenerateRecommendationDialog: (data: GenerateRecommendationDialogData) => dispatch(openDialog(ModalDialogNames.GenerateRecommendation, data)),
        openSendRecommendationReport: (data: SendRecommendationDialogData) => dispatch(openDialog(ModalDialogNames.SendRecommendation, data))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderRecommendationsListProps, ApplicationState> = (state: ApplicationState) => {
    return {
        suppliers: state.suppliers.value,
        working: state.portfolio.tender.issue_summary.working || state.portfolio.account.working,
        error: state.portfolio.tender.issue_summary.error || state.portfolio.account.error,
        errorMessage: state.portfolio.tender.issue_summary.errorMessage || state.portfolio.account.errorMessage,
        account: state.portfolio.account.value,
        portfolio: state.portfolio.details.value
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderRecommendationsList);