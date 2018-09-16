import * as React from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Account, User } from '../../../model/Models';
import Spinner from '../../common/Spinner';

import { retrieveAccounts } from '../../../actions/hierarchyActions';
import { fetchUsers, createPortfolio } from '../../../actions/portfolioActions';
import { PortfolioCreationRequest } from "../../../model/Portfolio";
import { closeModalDialog } from "../../../actions/viewActions";
import { StringsAreNotNullOrEmpty } from "../../../helpers/ValidationHelpers";

interface CreatePortfolioFromAccountDialogProps {    
}

interface StateProps {
    accounts: Account[];
    users: User[];
    working: boolean;
    error: boolean;
    errorMessage: string;
}

interface DispatchProps {
    createPortfolio: (portfolio: PortfolioCreationRequest) => void;
    fetchUsers: () => void;
    retrieveAccounts: () => void;
    closeModalDialog: () => void;
}

interface CreatePortfolioDialogState {
    title: string;
    selectedAccountId: string;
    supportExecId: string;
    salesLeadId: string;
}

class CreatePortfolioFromAccountDialog extends React.Component<CreatePortfolioFromAccountDialogProps & StateProps & DispatchProps, CreatePortfolioDialogState> {
    constructor(){
        super();
        this.state = {
            title: "",
            selectedAccountId: "",
            supportExecId: "",
            salesLeadId: ""
        };
    }

    componentDidMount(){
        this.props.retrieveAccounts();
        this.props.fetchUsers();
    }

    createPortfolio(){
        var portfolio: PortfolioCreationRequest = {
            accountId: this.state.selectedAccountId,
            title: this.state.title,
            teamId: 989,
            category: "direct",
            supportOwner: Number(this.state.supportExecId),
            ownerId: Number(this.state.salesLeadId)
        }
        
        this.props.createPortfolio(portfolio);
        this.props.closeModalDialog();
    }

    handleFormChange(attribute: string, event: React.ChangeEvent<any>, isCheck: boolean = false){
        var value = isCheck ? event.target.checked : event.target.value;

        this.setState({
            ...this.state,
            [attribute]: value
        })
    }

    canSubmit(){
        return StringsAreNotNullOrEmpty(
            this.state.title,
            this.state.selectedAccountId,
            this.state.salesLeadId,
            this.state.supportExecId);
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.accounts == null || this.props.users == null){
            return (<Spinner />);
        }

        var accountOptions = this.props.accounts.map(a => {
            return (<option key={a.id} value={a.id}>{a.companyName}</option>)
        });

        var userOptions = this.props.users.map(u => {
            return (<option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)
        });

        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title"><i className="fas fa-layer-group uk-margin-right"></i>Create New Portfolio</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        <form>
                            <fieldset className="uk-fieldset">
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Account</label>
                                    <select className='uk-select' 
                                        value={this.state.selectedAccountId}
                                        onChange={(e) => this.handleFormChange("selectedAccountId", e)}>
                                        <option value="" disabled>Select</option>
                                        {accountOptions}
                                    </select>
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Name</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        value={this.state.title}
                                        onChange={(e) => this.handleFormChange("title", e)} />
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Account Manager</label>
                                    <select className='uk-select' 
                                        value={this.state.salesLeadId}
                                        onChange={(e) => this.handleFormChange("salesLeadId", e)}>
                                        <option value="" disabled>Select</option>
                                        {userOptions}
                                    </select>
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Tender Analyst</label>
                                    <select className='uk-select' 
                                        value={this.state.supportExecId}
                                        onChange={(e) => this.handleFormChange("supportExecId", e)}>
                                        <option value="" disabled>Select</option>
                                        {userOptions}
                                    </select>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}><i className="fas fa-times uk-margin-small-right"></i>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.createPortfolio()} disabled={!this.canSubmit()}><i className="fas fa-plus-circle uk-margin-small-right"></i>Create</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, CreatePortfolioFromAccountDialogProps> = (dispatch) => {
    return {
        createPortfolio: (portfolio: PortfolioCreationRequest) => dispatch(createPortfolio(portfolio)),
        fetchUsers: () => dispatch(fetchUsers()),
        retrieveAccounts: () => dispatch(retrieveAccounts()),
        closeModalDialog: () => dispatch(closeModalDialog())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, CreatePortfolioFromAccountDialogProps> = (state: ApplicationState) => {
    return {
        accounts: state.hierarchy.accounts.value,
        users: state.users.value,
        working: state.hierarchy.accounts.working || state.users.working,
        error: state.hierarchy.accounts.error || state.users.error,
        errorMessage: state.hierarchy.accounts.errorMessage || state.users.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(CreatePortfolioFromAccountDialog);