import * as React from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { User, PortfolioDetails } from '../../../model/Models';
import Spinner from '../../common/Spinner';
import { fetchUsers, editPortfolio } from '../../../actions/portfolioActions';
import { PortfolioCreationRequest, Portfolio } from "../../../model/Portfolio";
import { closeModalDialog } from "../../../actions/viewActions";
import { StringsAreNotNullOrEmpty } from "../../../helpers/ValidationHelpers";

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
    closeModalDialog: () => void;
}

interface UpdatePortfolioDialogState {
    title: string;
    supportExecId: string;
    salesLeadId: string;
}

class UpdatePortfolioDialog extends React.Component<UpdatePortfolioDialogProps & StateProps & DispatchProps, UpdatePortfolioDialogState> {
    constructor(){
        super();
        this.state = {
            title: "",
            supportExecId: "",
            salesLeadId: ""
        };
    }

    componentDidMount(){
        this.props.fetchUsers();
    }

    editPortfolio(){
        var portfolio: PortfolioCreationRequest = {
            id: this.props.portfolio.id,
            accountId: this.props.detail.portfolio.accountId,
            title: this.state.title,
            teamId: 989,
            category: "direct",
            supportOwner: Number(this.state.supportExecId),
            ownerId: Number(this.state.salesLeadId)
        }
        
        this.props.editPortfolio(portfolio);
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
            this.state.salesLeadId,
            this.state.supportExecId);
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
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title"><i className="fas fa-layer-group uk-margin-right"></i>Edit Portfolio</h2>
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
                                        value={this.state.title}
                                        onChange={(e) => this.handleFormChange("title", e)}  />
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
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.editPortfolio()} disabled={!this.canSubmit()}><i className="fas fa-edit uk-margin-small-right"></i>Save</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UpdatePortfolioDialogProps> = (dispatch) => {
    return {
        editPortfolio: (portfolio: PortfolioCreationRequest) => dispatch(editPortfolio(portfolio)),
        fetchUsers: () => dispatch(fetchUsers()),
        closeModalDialog: () => dispatch(closeModalDialog())
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