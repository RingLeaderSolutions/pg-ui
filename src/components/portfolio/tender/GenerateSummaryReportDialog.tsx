import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import Spinner from '../../common/Spinner';
import ErrorMessage from "../../common/ErrorMessage";
import * as moment from 'moment';

import { generateSummaryReport } from '../../../actions/tenderActions';
import { Tender, TenderPack, TenderSupplier, TenderQuote, TenderIssuance } from "../../../model/Tender";
import { format } from 'currency-formatter';

interface GenerateSummaryReportDialogProps {
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
}

class GenerateSummaryReportDialog extends React.Component<GenerateSummaryReportDialogProps & StateProps & DispatchProps, {}> {    
    quoteSelectElement: HTMLSelectElement;
    selectionCommentaryElement: HTMLTextAreaElement;
    marketCommentaryElement: HTMLTextAreaElement;

    generateReport() {
        this.props.generateSummaryReport(this.props.tender.tenderId, this.quoteSelectElement.value, this.marketCommentaryElement.value, this.selectionCommentaryElement.value);
    }

    getFormattedDateTime(dateTime: string){
        return moment.utc(dateTime).local().format("MMMM Do, HH:mm");
    }

    renderPackDialogContent(){
        let quoteOptions = this.props.issuance.packs.map((p: any) => {
            return p.quotes
            .filter((q: TenderQuote) => q.status != "PENDING")
            .map((quote: TenderQuote) => {
                var supplier = this.props.suppliers.find(s => s.supplierId == quote.supplierId);
                var supplierText = supplier == null ? "Unknown" : supplier.name;
                
                var key = `${supplierText}-${quote.quoteId}`;
                return (<option key={key} value={quote.quoteId}>{supplierText} - {quote.quoteId.substr(0, 8)}-V{quote.version} - {format(quote.totalIncCCL, { locale: 'en-GB'})}</option>)
            });
        });

        return (
            <div className="uk-margin">
            <p>You are generating a recommendation report against the issuance issued on <strong>{this.getFormattedDateTime(this.props.issuance.created)}</strong>, which has received <strong>{quoteOptions.length}</strong> supplier responses.</p>
            <form>
                <div className='uk-flex'>
                    <div className='uk-card uk-card-default uk-card-body uk-flex-1'>
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
                    </div>
                </div>
            </form>
            <div className="uk-modal-footer uk-text-right">
                <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">Cancel</button>
                <button className="uk-button uk-button-primary uk-modal-close" type="button" onClick={() => this.generateReport()}>Generate</button>
            </div>
            </div>);
    }

    render() {
        let { tender } = this.props;
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
            <div className="uk-modal-dialog">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Create Recommendation Report</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        {content}
                    </div>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, GenerateSummaryReportDialogProps> = (dispatch) => {
    return {
        generateSummaryReport: (tenderId: string, quoteId: string, marketCommentary: string, selectionCommentary: string) =>  dispatch(generateSummaryReport(tenderId, quoteId, marketCommentary, selectionCommentary))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, GenerateSummaryReportDialogProps> = (state: ApplicationState) => {
    return {
        suppliers: state.portfolio.tender.suppliers.value,
        working: state.portfolio.tender.generate_summary.working,
        error: state.portfolio.tender.generate_summary.error,
        errorMessage: state.portfolio.tender.generate_summary.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(GenerateSummaryReportDialog);