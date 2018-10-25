import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../../applicationState';
import Spinner from '../../../common/Spinner';
import ErrorMessage from "../../../common/ErrorMessage";
import * as moment from 'moment';

import { generateSummaryReport } from '../../../../actions/tenderActions';
import { Tender, TenderSupplier, TenderQuote, TenderIssuance } from "../../../../model/Tender";
import { format } from 'currency-formatter';
import { Strings } from "../../../../helpers/Utils";
import asModalDialog, { ModalDialogProps } from "../../../common/modal/AsModalDialog";
import { ModalDialogNames } from "../../../common/modal/ModalDialogNames";
import { ModalHeader, Alert, ModalBody, ModalFooter, Button, Form, FormGroup, Label, CustomInput, Input } from "reactstrap";
import { LoadingIndicator } from "../../../common/LoadingIndicator";

export interface GenerateRecommendationDialogData {
    tender: Tender;
    issuance: TenderIssuance;
}

interface GenerateRecommendationDialogProps extends ModalDialogProps<GenerateRecommendationDialogData> { }

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    suppliers: TenderSupplier[];
}
  
interface DispatchProps {
    generateSummaryReport: (tenderId: string, quoteId: string, marketCommentary: string, selectionCommentary: string) => void;
}

interface GenerateRecommendationDialogState {
    selectedQuoteId: string;
    selectionCommentary: string
    marketCommentary: string;
}
class GenerateRecommendationDialog extends React.Component<GenerateRecommendationDialogProps & StateProps & DispatchProps, GenerateRecommendationDialogState> {    
    constructor(props: GenerateRecommendationDialogProps & StateProps & DispatchProps){
        super(props);
        this.state = {
            selectedQuoteId: "",
            selectionCommentary: "",
            marketCommentary: ""
        };
    }

    generateReport() {
        this.props.generateSummaryReport(
            this.props.data.tender.tenderId,
            this.state.selectedQuoteId, 
            this.state.marketCommentary, 
            this.state.selectionCommentary);
        this.props.toggle();
    }

    getFormattedDateTime(dateTime: string){
        return moment.utc(dateTime).local().format("MMMM Do, HH:mm");
    }

    handleFormChange(attribute: string, event: React.ChangeEvent<any>, isCheck: boolean = false){
        var value = isCheck ? event.target.checked : event.target.value;

        this.setState({
            ...this.state,
            [attribute]: value
        })
    }

    renderNoValidQuotesAlert(){
        return (
            <Alert color="light">
                <div className="text-center">
                    <i className="fas fa-exclamation-triangle mr-2 mb-1 d-block"></i>
                    Sorry, this tender's latest issuance has not yet received any valid quotes!
                </div>
            </Alert>);
    }

    renderQuoteSelectionForm(quoteOptions: JSX.Element[]){
        return (
            <div>
                <p>You are creating a recommendation report against the issuance issued on <strong>{this.getFormattedDateTime(this.props.data.issuance.created)}</strong>, which has received <strong>{quoteOptions.length}</strong> supplier responses.</p>
                <Form>
                    <FormGroup>
                        <Label for="new-reco-selected-quote">Winning Quote</Label>
                        <CustomInput type="select" name="new-reco-selected-quote-picker" id="new-reco-selected-quote"
                                value={this.state.selectedQuoteId}
                                onChange={(e) => this.handleFormChange("selectedQuoteId", e)}>
                            <option value="" disabled>Select</option>
                            {quoteOptions}
                        </CustomInput>
                    </FormGroup>
                    <FormGroup>
                        <Label for="new-reco-market-comm">Market Commentary</Label>
                        <Input id="new-reco-market-comm"
                            type="textarea"
                            value={this.state.marketCommentary}
                            onChange={(e) => this.handleFormChange("marketCommentary", e)} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="new-reco-quote-comm">Quote Selection Commentary</Label>
                        <Input id="new-reco-quote-comm"
                            type="textarea"
                            value={this.state.selectionCommentary}
                            onChange={(e) => this.handleFormChange("selectionCommentary", e)} />
                    </FormGroup>
                </Form>
            </div>
        )
    }

    canSubmit(){
        return Strings.AreNotNullOrEmpty(
            this.state.selectedQuoteId,
             this.state.marketCommentary,
              this.state.selectionCommentary);
    }

    render() {
        if(this.props.suppliers == null || this.props.working){
            return (<LoadingIndicator />);
        }
        else if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage}/> )
        }

        var quotes = this.props.data.issuance.packs.SelectMany((p) => p.quotes);

        let quoteOptions = quotes
            .filter((q: TenderQuote) => q.status == "SUBMITTED")
            .map((quote: TenderQuote) => {
                var supplier = this.props.suppliers.find(s => s.supplierId == quote.supplierId);
                var supplierText = supplier == null ? "Unknown" : supplier.name;
                
                var key = `${supplierText}-${quote.quoteId}`;
                return (<option key={key} value={quote.quoteId}>{supplierText} - {quote.quoteId.substr(0, 8)}-V{quote.version} - {format(quote.totalIncCCL, { locale: 'en-GB'})}</option>)
            });

        let hasQuoteOptions = quoteOptions.length > 0;

        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle}><i className="fas fa-bullhorn mr-2"></i>Create Recommendation Report</ModalHeader>
                <ModalBody>
                {hasQuoteOptions ? this.renderQuoteSelectionForm(quoteOptions) : this.renderNoValidQuotesAlert()}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.props.toggle}>
                        <i className="fas fa-times mr-1"></i>Cancel
                    </Button>
                    { hasQuoteOptions && (<Button color="accent" 
                            disabled={!this.canSubmit()}
                            onClick={() => this.generateReport()}>
                        <i className="fas fa-plus-circle mr-1"></i>Create
                    </Button>)}
                </ModalFooter>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, GenerateRecommendationDialogProps> = (dispatch) => {
    return {
        generateSummaryReport: (tenderId: string, quoteId: string, marketCommentary: string, selectionCommentary: string) =>  dispatch(generateSummaryReport(tenderId, quoteId, marketCommentary, selectionCommentary))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, GenerateRecommendationDialogProps, ApplicationState> = (state: ApplicationState) => {
    return {
        suppliers: state.suppliers.value,
        working: state.portfolio.tender.generate_summary.working,
        error: state.portfolio.tender.generate_summary.error,
        errorMessage: state.portfolio.tender.generate_summary.errorMessage
    };
};
  
export default asModalDialog<GenerateRecommendationDialogProps, StateProps, DispatchProps>(
{ 
    name: ModalDialogNames.GenerateRecommendation, 
    centered: true, 
    backdrop: true
}, mapStateToProps, mapDispatchToProps)(GenerateRecommendationDialog)