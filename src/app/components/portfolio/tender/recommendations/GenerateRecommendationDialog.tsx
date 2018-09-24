import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../../applicationState';
import Spinner from '../../../common/Spinner';
import ErrorMessage from "../../../common/ErrorMessage";
import * as moment from 'moment';

import { generateSummaryReport } from '../../../../actions/tenderActions';
import { Tender, TenderSupplier, TenderQuote, TenderIssuance } from "../../../../model/Tender";
import { format } from 'currency-formatter';
import { selectMany } from "../../../../helpers/listHelpers";
import { closeModalDialog } from "../../../../actions/viewActions";
import { StringsAreNotNullOrEmpty } from "../../../../helpers/ValidationHelpers";

interface GenerateRecommendationDialogProps {
    tender: Tender;
    issuance: TenderIssuance;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    suppliers: TenderSupplier[];
}
  
interface DispatchProps {
    generateSummaryReport: (tenderId: string, quoteId: string, marketCommentary: string, selectionCommentary: string) => void;
    closeModalDialog: () => void;
}

interface GenerateRecommendationDialogState {
    selectedQuoteId: string;
    selectionCommentary: string
    marketCommentary: string;
}
class GenerateRecommendationDialog extends React.Component<GenerateRecommendationDialogProps & StateProps & DispatchProps, GenerateRecommendationDialogState> {    
    constructor(){
        super();
        this.state = {
            selectedQuoteId: "",
            selectionCommentary: "",
            marketCommentary: ""
        };
    }

    generateReport() {
        this.props.generateSummaryReport(
            this.props.tender.tenderId,
            this.state.selectedQuoteId, 
            this.state.marketCommentary, 
            this.state.selectionCommentary);
        this.props.closeModalDialog();
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

    renderPackDialogContent(){
        var quotes = selectMany(this.props.issuance.packs, (p) => p.quotes);

        let quoteOptions = quotes
            .filter((q: TenderQuote) => q.status == "SUBMITTED")
            .map((quote: TenderQuote) => {
                var supplier = this.props.suppliers.find(s => s.supplierId == quote.supplierId);
                var supplierText = supplier == null ? "Unknown" : supplier.name;
                
                var key = `${supplierText}-${quote.quoteId}`;
                return (<option key={key} value={quote.quoteId}>{supplierText} - {quote.quoteId.substr(0, 8)}-V{quote.version} - {format(quote.totalIncCCL, { locale: 'en-GB'})}</option>)
            });

        if(quoteOptions.length == 0){
            return (
                <div>
                    <div className="uk-modal-body">
                        <div className="uk-alert-warning uk-margin-small-top uk-margin-small-bottom" data-uk-alert>
                            <p><i className="fas fa-exclamation-triangle uk-margin-small-right"></i> Sorry! The latest issuance has not yet received any quotes, so a recommendation cannot be created.</p>
                        </div>
                    </div>
                    <div className="uk-modal-footer uk-text-right">
                        <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}>OK</button>
                    </div>
                </div>
            )
        }

        return (
            <div>
                <div className="uk-modal-body">
                    <p>You are creating a recommendation report against the issuance issued on <strong>{this.getFormattedDateTime(this.props.issuance.created)}</strong>, which has received <strong>{quoteOptions.length}</strong> supplier responses.</p>
                    <form>
                        <fieldset className='uk-fieldset'>
                            <div className="uk-margin">
                                <select className='uk-select' 
                                    value={this.state.selectedQuoteId}
                                    onChange={(e) => this.handleFormChange("selectedQuoteId", e)}>
                                    <option value="" disabled>Select</option>
                                    {quoteOptions}
                                </select>
                            </div>

                            <div className='uk-margin'>
                                <label className='uk-form-label'>Market Commentary</label>
                                <textarea className='uk-textarea' 
                                    rows={4}
                                    value={this.state.marketCommentary}
                                    onChange={(e) => this.handleFormChange("marketCommentary", e)} />
                            </div>

                            <div className='uk-margin'>
                                <label className='uk-form-label'>Quote Selection Commentary</label>
                                <textarea className='uk-textarea' 
                                    rows={4}
                                    value={this.state.selectionCommentary}
                                    onChange={(e) => this.handleFormChange("selectionCommentary", e)} />
                            </div>
                        </fieldset>
                    </form>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}><i className="fas fa-times uk-margin-small-right"></i>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.generateReport()} disabled={!this.canSubmit()}><i className="fas fa-plus-circle uk-margin-small-right"></i>Create</button>
                </div>
            </div>);
    }

    canSubmit(){
        return StringsAreNotNullOrEmpty(
            this.state.selectedQuoteId,
             this.state.marketCommentary,
              this.state.selectionCommentary);
    }

    render() {
        let content;
        if(this.props.suppliers == null || this.props.working){
            content = (<Spinner hasMargin={true} />);
        }
        else if(this.props.error){
            content = (<ErrorMessage content={this.props.errorMessage}/> )
        }
        else {
            content = this.renderPackDialogContent();
        }
        
        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title"><i className="fas fa-bullhorn uk-margin-right"></i>Create Recommendation Report</h2>
                </div>
                {content}
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, GenerateRecommendationDialogProps> = (dispatch) => {
    return {
        generateSummaryReport: (tenderId: string, quoteId: string, marketCommentary: string, selectionCommentary: string) =>  dispatch(generateSummaryReport(tenderId, quoteId, marketCommentary, selectionCommentary)),
        closeModalDialog: () => dispatch(closeModalDialog()) 
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
  
export default connect(mapStateToProps, mapDispatchToProps)(GenerateRecommendationDialog);