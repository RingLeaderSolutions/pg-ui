import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../../applicationState';
import Spinner from '../../../common/Spinner';
import ErrorMessage from "../../../common/ErrorMessage";
import * as moment from 'moment';

import { generateSummaryReport } from '../../../../actions/tenderActions';
import { Tender, TenderPack, TenderSupplier, TenderQuote, TenderIssuance } from "../../../../model/Tender";
import { format } from 'currency-formatter';
import { selectMany } from "../../../../helpers/listHelpers";
import { closeModalDialog } from "../../../../actions/viewActions";

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

class GenerateRecommendationDialog extends React.Component<GenerateRecommendationDialogProps & StateProps & DispatchProps, {}> {    
    quoteSelectElement: HTMLSelectElement;
    selectionCommentaryElement: HTMLTextAreaElement;
    marketCommentaryElement: HTMLTextAreaElement;

    generateReport() {
        this.props.generateSummaryReport(this.props.tender.tenderId, this.quoteSelectElement.value, this.marketCommentaryElement.value, this.selectionCommentaryElement.value);
        this.props.closeModalDialog();
    }

    getFormattedDateTime(dateTime: string){
        return moment.utc(dateTime).local().format("MMMM Do, HH:mm");
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
                    <div className="uk-alert-warning uk-margin-small-top uk-margin-small-bottom" data-uk-alert>
                        <p><i className="fas fa-exclamation-triangle uk-margin-small-right"></i> Sorry! The latest issuance has not yet received any quotes, so a recommendation cannot be created.</p>
                    </div>
                    <div className="uk-modal-footer uk-text-right">
                        <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}>OK</button>
                    </div>
                </div>
            )
        }

        return (
            <div>
                <p>You are creating a recommendation report against the issuance issued on <strong>{this.getFormattedDateTime(this.props.issuance.created)}</strong>, which has received <strong>{quoteOptions.length}</strong> supplier responses.</p>
                <form>
                    <fieldset className='uk-fieldset'>
                        <div className="uk-margin">
                            <select className='uk-select' 
                                ref={ref => this.quoteSelectElement = ref}>
                                <option value="" disabled>Select</option>
                                {quoteOptions}
                            </select>
                        </div>

                        <div className='uk-margin'>
                            <label className='uk-form-label'>Market Commentary</label>
                            <textarea className='uk-textarea' 
                                rows={4}
                                ref={ref => this.marketCommentaryElement = ref}/>
                        </div>

                        <div className='uk-margin'>
                            <label className='uk-form-label'>Quote Selection Commentary</label>
                            <textarea className='uk-textarea' 
                                rows={4}
                                ref={ref => this.selectionCommentaryElement = ref}/>
                        </div>
                    </fieldset>
                </form>
            </div>);
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
                <div className="uk-modal-body">
                    <div>
                        {content}
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}><i className="fas fa-times uk-margin-small-right"></i>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.generateReport()}><i className="fas fa-plus-circle uk-margin-small-right"></i>Create</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, GenerateRecommendationDialogProps> = (dispatch) => {
    return {
        generateSummaryReport: (tenderId: string, quoteId: string, marketCommentary: string, selectionCommentary: string) =>  dispatch(generateSummaryReport(tenderId, quoteId, marketCommentary, selectionCommentary)),
        closeModalDialog: () => dispatch(closeModalDialog()) 
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, GenerateRecommendationDialogProps> = (state: ApplicationState) => {
    return {
        suppliers: state.suppliers.value,
        working: state.portfolio.tender.generate_summary.working,
        error: state.portfolio.tender.generate_summary.error,
        errorMessage: state.portfolio.tender.generate_summary.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(GenerateRecommendationDialog);