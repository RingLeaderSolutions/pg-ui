import * as React from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { User, PortfolioDetails } from '../../../model/Models';
import Spinner from '../../common/Spinner';
import { fetchUsers, editPortfolio } from '../../../actions/portfolioActions';
import { PortfolioCreationRequest, Portfolio } from "../../../model/Portfolio";

interface UpdatePortfolioDialogProps { 
    portfolio: Portfolio;   
    detail: PortfolioDetails;
}

interface StateProps {
    users: User[];
    working: boolean;
    error: boolean;
    errorMessage: string;
}

interface DispatchProps {
    editPortfolio: (portfolio: PortfolioCreationRequest) => void;
    fetchUsers: () => void;
}

class UpdatePortfolioDialog extends React.Component<UpdatePortfolioDialogProps & StateProps & DispatchProps, {}> {
    title: HTMLInputElement;
    account: HTMLSelectElement;
    supportExec: HTMLSelectElement;
    salesLead: HTMLSelectElement;

    componentDidMount(){
        this.props.fetchUsers();
    }

    editPortfolio(){
        var portfolio: PortfolioCreationRequest = {
            id: this.props.portfolio.id,
            accountId: this.props.detail.portfolio.accountId,
            title: this.title.value,
            teamId: 989,
            category: "direct",
            supportOwner: Number(this.supportExec.value),
            ownerId: Number(this.salesLead.value)
        }
        
        this.props.editPortfolio(portfolio);
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.users == null){
            return (<Spinner />);
        }

        var userOptions = this.props.users.map(u => {
            return (<option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)
        });

        return (
            <div className="uk-modal-dialog">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Edit Portfolio</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        <form>
                            <fieldset className="uk-fieldset">
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Name</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        defaultValue={this.props.portfolio.title}
                                        ref={ref => this.title = ref} />
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Account Manager</label>
                                    <select className='uk-select' 
                                        defaultValue={this.props.portfolio.salesLead.id}
                                        ref={ref => this.salesLead = ref}>
                                        <option value="" disabled>Select</option>
                                        {userOptions}
                                    </select>
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Tender Analyst</label>
                                    <select className='uk-select' 
                                        defaultValue={this.props.portfolio.supportExec.id}
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
                    <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">Cancel</button>
                    <button className="uk-button uk-button-primary uk-modal-close" type="button" onClick={() => this.editPortfolio()}>Update</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UpdatePortfolioDialogProps> = (dispatch) => {
    return {
        editPortfolio: (portfolio: PortfolioCreationRequest) => dispatch(editPortfolio(portfolio)),
        fetchUsers: () => dispatch(fetchUsers()),
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, UpdatePortfolioDialogProps> = (state: ApplicationState) => {
    return {
        users: state.users.value,
        working: state.users.working,
        error: state.users.error,
        errorMessage: state.users.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(UpdatePortfolioDialog);