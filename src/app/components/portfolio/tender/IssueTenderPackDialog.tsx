import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import Spinner from '../../common/Spinner';
import ErrorMessage from "../../common/ErrorMessage";
import * as moment from 'moment';

import { issueTenderPack, fetchTenderIssuanceEmail } from '../../../actions/tenderActions';
import { Tender, TenderSupplier, TenderIssuanceEmail } from "../../../model/Tender";
import { closeModalDialog } from "../../../actions/viewActions";

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
    closeModalDialog: () => void;
}

interface IssueTenderPackDialogState {
    subject: string;
    body: string;
}

class IssueTenderPackDialog extends React.Component<IssueTenderPackDialogProps & StateProps & DispatchProps, IssueTenderPackDialogState> {
    constructor(props: IssueTenderPackDialogProps & StateProps & DispatchProps) {
        super();
        this.state = {
            subject: props.email == null ? "" : props.email.subject,
            body: props.email == null ? "" : props.email.body
        }
    }

    componentWillReceiveProps(nextProps: IssueTenderPackDialogProps & StateProps & DispatchProps){
        if(nextProps.email != null) {
            this.setState({
                subject: nextProps.email.subject,
                body: nextProps.email.body
            });
        }
        if(this.props.tender == null || nextProps.tender.tenderId != this.props.tender.tenderId){
            this.props.fetchIssuanceEmail(nextProps.tender.tenderId);
        }
    }

    componentDidMount(){
        if(this.props.tender.unissuedPacks.length > 0){
            this.props.fetchIssuanceEmail(this.props.tender.tenderId);
        }
    }

    issueTender() {
        this.props.issueTenderPack(this.props.tender.tenderId, this.state.subject, this.state.body);
        this.props.closeModalDialog();
    }

    handleFormChange(attribute: string, event: React.ChangeEvent<any>){
        var value = event.target.value;

        this.setState({
            ...this.state,
            [attribute]: value
        })
    }

    renderPackDialogContent(){
        if(this.props.email == null) {
            return (<Spinner />)
        }

        var deadline = moment(this.props.tender.deadline);
        var now = moment();
        if(deadline.isSameOrBefore(now, 'day')){
            return (
                <div>
                    <div className="uk-alert-danger uk-margin-small-top uk-margin-small-bottom uk-modal-body" data-uk-alert>
                        <p>Sorry! The deadline set for this tender ({deadline.format('DD-MM-YYYY')}) is now in the past. </p>
                        <p>If you wish to issue a new requirements pack, please update the deadline by editing the tender.</p>
                    </div>
                    <div className="uk-modal-footer uk-text-right">
                        <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}>OK</button>
                    </div>
                </div>)
        }

        return (
            <div>
                <div className="uk-modal-body">
                    <form>
                        <div className='uk-flex'>
                            <div className='uk-flex-1'>
                                <fieldset className='uk-fieldset'>
                                    <div className='uk-margin'>
                                        <label className='uk-form-label'>Subject</label>
                                        <input className='uk-input' 
                                            value={this.state.subject}
                                            onChange={(e) => this.handleFormChange("subject", e)}/>
                                    </div>

                                    <div className='uk-margin'>
                                        <label className='uk-form-label'>Body</label>
                                        <textarea className='uk-textarea' 
                                            rows={4}
                                            value={this.state.body}
                                            onChange={(e) => this.handleFormChange("body", e)}/>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}><i className="fas fa-times uk-margin-small-right"></i>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.issueTender()}><i className="fas fa-envelope uk-margin-small-right"></i>Issue</button>
                </div>
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
                    <h2 className="uk-modal-title"><i className="fas fa-envelope uk-margin-small-right"></i>Issue Requirements Packs</h2>
                </div>
                <div>
                    {content}
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, IssueTenderPackDialogProps> = (dispatch) => {
    return {
        fetchIssuanceEmail: (tenderId: string) => dispatch(fetchTenderIssuanceEmail(tenderId)),
        issueTenderPack: (tenderId: string, subject: string, body: string) => dispatch(issueTenderPack(tenderId, subject, body)),
        closeModalDialog: () => dispatch(closeModalDialog()) 
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, IssueTenderPackDialogProps> = (state: ApplicationState) => {
    return {
        suppliers: state.suppliers.value,
        email: state.portfolio.tender.issuance_email.value,
        working: state.portfolio.tender.issue_pack.working || state.portfolio.tender.issuance_email.working,
        error: state.portfolio.tender.issue_pack.error || state.portfolio.tender.issuance_email.error,
        errorMessage: state.portfolio.tender.issue_pack.errorMessage || state.portfolio.tender.issuance_email.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(IssueTenderPackDialog);