import * as React from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Account, User } from '../../../model/Models';

import { retrieveAccounts } from '../../../actions/hierarchyActions';
import { fetchUsers, createPortfolio } from '../../../actions/portfolioActions';
import { PortfolioCreationRequest } from "../../../model/Portfolio";
import { Strings } from "../../../helpers/Utils";
import { LoadingIndicator } from "../../common/LoadingIndicator";
import AsModalDialog, { ModalDialogProps } from "../../common/modal/AsModalDialog";
import { ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Button, CustomInput } from "reactstrap";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";

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
}

interface CreatePortfolioDialogState {
    title: string;
    selectedAccountId: string;
    supportExecId: string;
    salesLeadId: string;
}

class CreatePortfolioDialog extends React.Component<ModalDialogProps & StateProps & DispatchProps, CreatePortfolioDialogState> {
    constructor(props: ModalDialogProps & StateProps & DispatchProps){
        super(props);
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
        this.props.toggle();
    }

    handleFormChange(attribute: string, event: React.ChangeEvent<any>, isCheck: boolean = false){
        var value = isCheck ? event.target.checked : event.target.value;

        this.setState({
            ...this.state,
            [attribute]: value
        })
    }

    canSubmit(){
        return Strings.AreNotNullOrEmpty(
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
            return (<LoadingIndicator />);
        }

        var accountOptions = this.props.accounts.map(a => {
            return (<option key={a.id} value={a.id}>{a.companyName}</option>)
        });

        var userOptions = this.props.users.map(u => {
            return (<option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)
        });

        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle}><i className="fas fa-layer-group mr-2"></i>Create New Portfolio</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="new-portfolio-account">Account</Label>
                            <CustomInput type="select" name="account-picker" id="new-portfolio-account"
                                   value={this.state.selectedAccountId}
                                    onChange={(e) => this.handleFormChange("selectedAccountId", e)}>
                                <option value="" disabled>Select</option>
                                {accountOptions}
                            </CustomInput>
                        </FormGroup>
                        <FormGroup>
                            <Label for="new-portfolio-name">Name</Label>
                            <Input id="new-portfolio-name"
                                    value={this.state.title}
                                    onChange={(e) => this.handleFormChange("title", e)} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="new-portfolio-account-manager">Account Manager</Label>
                            <CustomInput type="select" name="account-manager-picker" id="new-portfolio-account-manager"
                                   value={this.state.salesLeadId}
                                   onChange={(e) => this.handleFormChange("salesLeadId", e)}>
                                    <option value="" disabled>Select</option>
                                    {userOptions}
                            </CustomInput>
                        </FormGroup>
                        <FormGroup>
                            <Label for="new-portfolio-tender-analyst">Tender Analyst</Label>
                            <CustomInput type="select" name="tender-analyst-picker" id="new-portfolio-tender-analyst"
                                   value={this.state.supportExecId}
                                   onChange={(e) => this.handleFormChange("supportExecId", e)}>
                                    <option value="" disabled>Select</option>
                                    {userOptions}
                            </CustomInput>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" 
                            onClick={this.props.toggle}>
                        <i className="fas fa-times mr-1"></i>Cancel    
                    </Button>
                    <Button color="accent" 
                            onClick={() => this.createPortfolio()}
                            disabled={!this.canSubmit()}>
                        <i className="fas fa-plus-circle mr-1"></i>Create
                    </Button>
                </ModalFooter>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        createPortfolio: (portfolio: PortfolioCreationRequest) => dispatch(createPortfolio(portfolio)),
        fetchUsers: () => dispatch(fetchUsers()),
        retrieveAccounts: () => dispatch(retrieveAccounts())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, {}, ApplicationState> = (state: ApplicationState) => {
    return {
        accounts: state.hierarchy.accounts.value,
        users: state.users.value,
        working: state.hierarchy.accounts.working || state.users.working,
        error: state.hierarchy.accounts.error || state.users.error,
        errorMessage: state.hierarchy.accounts.errorMessage || state.users.errorMessage
    };
};
  
export default AsModalDialog<{}, StateProps, DispatchProps>(
{ 
    name: ModalDialogNames.CreatePortfolio, 
    centered: true, 
    backdrop: true
}, mapStateToProps, mapDispatchToProps)(CreatePortfolioDialog)