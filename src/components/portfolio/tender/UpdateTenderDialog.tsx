import * as React from "react";
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import Spinner from '../../common/Spinner';
import ErrorMessage from "../../common/ErrorMessage";
import * as moment from 'moment';
import DatePicker from 'react-datepicker';

import { updateTender } from '../../../actions/tenderActions';
import { Tender } from "../../../model/Tender";

interface UpdateTenderDialogProps {
    tender: Tender;
    utilityDescription: string;
    utility: UtilityType;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
}
  
interface DispatchProps {
    updateTender: (tenderId: string, details: Tender) => void;
}

interface UpdateTenderState {
    deadline: moment.Moment;
}

class UpdateTenderDialog extends React.Component<UpdateTenderDialogProps & StateProps & DispatchProps, UpdateTenderState> {
    constructor(props: UpdateTenderDialogProps & StateProps & DispatchProps){
        super();
        this.state = {
            deadline: props.tender.deadline ? moment(props.tender.deadline) : moment() 
        };

        this.handleDeadlineChange = this.handleDeadlineChange.bind(this);
        this.updateTender = this.updateTender.bind(this);
    }
    titleElement: HTMLInputElement;
    commissionElement: HTMLInputElement;
    billingMethodElement: HTMLSelectElement;
    deadlineNotesElement: HTMLTextAreaElement;
    isHalfHourlyElement: HTMLInputElement;
    ebInclusiveElement: HTMLInputElement;

    handleDeadlineChange(date: moment.Moment, event: React.SyntheticEvent<any>){
        this.setState({
            deadline: date
        });

        event.preventDefault();
    }

    updateTender(){
        var halfHourly = this.isHalfHourlyElement == null ? false : this.isHalfHourlyElement.checked
        var tender: Tender = {
            ...this.props.tender,
            tenderTitle: this.titleElement.value,
            billingMethod: this.billingMethodElement.value,
            deadline: this.state.deadline.format("YYYY-MM-DDTHH:mm:ss"),
            deadlineNotes: this.deadlineNotesElement.value,
            commission: Number(this.commissionElement.value),
            halfHourly: halfHourly,
            allInclusive: this.ebInclusiveElement.checked
        }
        this.props.updateTender(this.props.tender.tenderId, tender);
    }

    render() {
        let { tender } = this.props;
        return (
            <div className="uk-modal-dialog">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Update {this.props.utilityDescription} Tender</h2>
                </div>
                <div className="uk-modal-body">
                    <form>
                        <div className='uk-flex'>
                            <div className='uk-card uk-card-default uk-card-body uk-flex-1'>
                                <fieldset className='uk-fieldset'>
                                    <div className='uk-margin'>
                                        <label className='uk-form-label'>Title</label>
                                        <input className='uk-input' 
                                            defaultValue={tender.tenderTitle}
                                            ref={ref => this.titleElement = ref}/>
                                    </div>

                                    <div className='uk-margin'>
                                        <label className='uk-form-label'>Commission</label>
                                        <input className='uk-input' 
                                            defaultValue={String(tender.commission)}
                                            ref={ref => this.commissionElement = ref}/>
                                    </div>

                                    <div className='uk-margin'>
                                        <label className='uk-form-label'>Billing Method</label>
                                        <select className='uk-select' 
                                            defaultValue={tender.billingMethod}
                                            ref={ref => this.billingMethodElement = ref}>
                                            <option value="" disabled>Select</option>
                                            <option>Paper</option>
                                            <option>Electronic</option>
                                        </select>
                                    </div>

                                    <div className='uk-margin'>
                                        <label className='uk-form-label'>Embedded Benefits</label>
                                        <div className="uk-margin-small">
                                            <label><input className="uk-radio" type="radio" name="ebChoice" ref={ref => this.ebInclusiveElement = ref} defaultChecked={tender.allInclusive} /> Inclusive</label>
                                            <label><input className="uk-radio uk-margin-large-left" type="radio" name="ebChoice" defaultChecked={!tender.allInclusive} />Pass-Through</label>
                                        </div>
                                    </div>

                                    <div className="uk-margin">
                                        <label className="uk-form-label" data-for="deadline-input">Deadline</label>
                                        <div className="uk-form-controls">
                                            <DatePicker id="deadline-input"
                                                        className="uk-input"
                                                        selected={this.state.deadline}
                                                        onChange={this.handleDeadlineChange}/>
                                        </div>
                                    </div>

                                    <div className='uk-margin'>
                                        <label className='uk-form-label'>Deadline notes</label>
                                        <textarea className='uk-textarea' 
                                            rows={4}
                                            ref={ref => this.deadlineNotesElement = ref}
                                            defaultValue={tender.deadlineNotes}/>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        
                    </form>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">Cancel</button>
                    <button className="uk-button uk-button-primary uk-modal-close" type="button" onClick={() => this.updateTender()}>Update</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UpdateTenderDialogProps> = (dispatch) => {
    return {
        updateTender: (portfolioId, tender) => dispatch(updateTender(portfolioId, tender))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, UpdateTenderDialogProps> = (state: ApplicationState) => {
    return {
        working: state.portfolio.tender.update_tender.working,
        error: state.portfolio.tender.update_tender.error,
        errorMessage: state.portfolio.tender.update_tender.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(UpdateTenderDialog);