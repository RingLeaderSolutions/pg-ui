import * as React from "react";
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import Spinner from '../../common/Spinner';
import ErrorMessage from "../../common/ErrorMessage";
import * as moment from 'moment';
import DatePicker from 'react-datepicker';

import { issueTenderPack } from '../../../actions/tenderActions';
import { Tender, TenderPack, TenderSupplier } from "../../../model/Tender";

interface IssueTenderPackDialogProps {
    tender: Tender;
    portfolioId: string;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    suppliers: TenderSupplier[];
}
  
interface DispatchProps {
    issueTenderPack: (tenderId: string, subject: string, body: string) => void;
}

class IssueTenderPackDialog extends React.Component<IssueTenderPackDialogProps & StateProps & DispatchProps, {}> {    
    subjectElement: HTMLInputElement;
    bodyElement: HTMLTextAreaElement;

    issueTender() {
        this.props.issueTenderPack(this.props.tender.tenderId, this.subjectElement.value, this.bodyElement.value);
    }

    renderPackDialogContent(){
        return (
            <div className="uk-margin">
            <form>
                <div className='uk-flex'>
                    <div className='uk-card uk-card-default uk-card-body uk-flex-1'>
                        <fieldset className='uk-fieldset'>
                            <div className='uk-margin'>
                                <label className='uk-form-label'>Subject</label>
                                <input className='uk-input' 
                                    ref={ref => this.subjectElement = ref}/>
                            </div>

                            <div className='uk-margin'>
                                <label className='uk-form-label'>Body</label>
                                <textarea className='uk-textarea' 
                                    rows={4}
                                    ref={ref => this.bodyElement = ref}/>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </form>
            <div className="uk-modal-footer uk-text-right">
                <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">Cancel</button>
                <button className="uk-button uk-button-primary uk-modal-close" type="button" onClick={() => this.issueTender()}>Issue</button>
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
                    <h2 className="uk-modal-title">Issue Tender Packs</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        {content}
                    </div>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, IssueTenderPackDialogProps> = (dispatch) => {
    return {
        issueTenderPack: (tenderId: string, subject: string, body: string) => dispatch(issueTenderPack(tenderId, subject, body))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, IssueTenderPackDialogProps> = (state: ApplicationState) => {
    return {
        suppliers: state.portfolio.tender.suppliers.value,
        working: state.portfolio.tender.issue_pack.working,
        error: state.portfolio.tender.issue_pack.error,
        errorMessage: state.portfolio.tender.issue_pack.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(IssueTenderPackDialog);