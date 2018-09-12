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

class CreatePortfolioFromAccountDialog extends React.Component<CreatePortfolioFromAccountDialogProps & StateProps & DispatchProps, {}> {
    title: HTMLInputElement;
    account: HTMLSelectElement;
    supportExec: HTMLSelectElement;
    salesLead: HTMLSelectElement;

    componentDidMount(){
        this.props.retrieveAccounts();
        this.props.fetchUsers();
    }

    createPortfolio(){
        var portfolio: PortfolioCreationRequest = {
            accountId: this.account.value,
            title: this.title.value,
            teamId: 989,
            category: "direct",
            supportOwner: Number(this.supportExec.value),
            ownerId: Number(this.salesLead.value)
        }
        
        this.props.createPortfolio(portfolio);
        this.props.closeModalDialog();
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
                    <h2 className="uk-modal-title">Create New Portfolio</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        <form>
                            <fieldset className="uk-fieldset">
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Account</label>
                                    <select className='uk-select' 
                                        ref={ref => this.account = ref}>
                                        <option value="" disabled>Select</option>
                                        {accountOptions}
                                    </select>
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Name</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        ref={ref => this.title = ref} />
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Account Manager</label>
                                    <select className='uk-select' 
                                        ref={ref => this.salesLead = ref}>
                                        <option value="" disabled>Select</option>
                                        {userOptions}
                                    </select>
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Tender Analyst</label>
                                    <select className='uk-select' 
                                        ref={ref => this.supportExec = ref}>
                                        <option value="" disabled>Select</option>
                                        {userOptions}
                                    </select>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.createPortfolio()}>Create</button>
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