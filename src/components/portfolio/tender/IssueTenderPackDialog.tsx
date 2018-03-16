import * as React from "react";
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import Spinner from '../../common/Spinner';
import ErrorMessage from "../../common/ErrorMessage";
import * as moment from 'moment';
import DatePicker from 'react-datepicker';

import { issueTenderPack, fetchTenderIssuanceEmail } from '../../../actions/tenderActions';
import { Tender, TenderPack, TenderSupplier, TenderIssuanceEmail } from "../../../model/Tender";

interface IssueTenderPackDialogProps {
    tender: Tender;
    portfolioId: string;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    suppliers: TenderSupplier[];
    email: TenderIssuanceEmail;    
}
  
interface DispatchProps {
    fetchIssuanceEmail: (tenderId: string) => void;
    issueTenderPack: (tenderId: string, subject: string, body: string) => void;
}

class IssueTenderPackDialog extends React.Component<IssueTenderPackDialogProps & StateProps & DispatchProps, {}> {    
    subjectElement: HTMLInputElement;
    bodyElement: HTMLTextAreaElement;

    componentDidMount(){
        if(this.props.tender.packs.length > 0){
            this.props.fetchIssuanceEmail(this.props.tender.tenderId);
        }
    }

    issueTender() {
        this.props.issueTenderPack(this.props.tender.tenderId, this.subjectElement.value, this.bodyElement.value);
    }

    renderPackDialogContent(){
        if(this.props.email == null) {
            return (<Spinner />)
        }

        return (
            <div className="uk-margin">
            <form>
                <div className='uk-flex'>
                    <div className='uk-card uk-card-default uk-card-body uk-flex-1'>
                        <fieldset className='uk-fieldset'>
                            <div className='uk-margin'>
                                <label className='uk-form-label'>Subject</label>
                                <input className='uk-input' 
                                    defaultValue={this.props.email.subject}
                                    ref={ref => this.subjectElement = ref}/>
                            </div>

                            <div className='uk-margin'>
                                <label className='uk-form-label'>Body</label>
                                <textarea className='uk-textarea' 
                                    rows={4}
                                    defaultValue={this.props.email.body}
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
        fetchIssuanceEmail: (tenderId: string) => dispatch(fetchTenderIssuanceEmail(tenderId)),
        issueTenderPack: (tenderId: string, subject: string, body: string) => dispatch(issueTenderPack(tenderId, subject, body))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, IssueTenderPackDialogProps> = (state: ApplicationState) => {
    return {
        suppliers: state.portfolio.tender.suppliers.value,
        email: state.portfolio.tender.issuance_email.value,
        working: state.portfolio.tender.issue_pack.working || state.portfolio.tender.issuance_email.working,
        error: state.portfolio.tender.issue_pack.error || state.portfolio.tender.issuance_email.error,
        errorMessage: state.portfolio.tender.issue_pack.errorMessage || state.portfolio.tender.issuance_email.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(IssueTenderPackDialog);