import * as React from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { User, PortfolioDetails } from '../../../model/Models';
import Spinner from '../../common/Spinner';
import { fetchUsers, editPortfolio } from '../../../actions/portfolioActions';
import { PortfolioCreationRequest, Portfolio } from "../../../model/Portfolio";
import { openDialog } from "../../../actions/viewActions";
import { Strings } from "../../../helpers/Utils";
import asModalDialog, { ModalDialogProps } from "../../common/modal/AsModalDialog";
import { LoadingIndicator } from "../../common/LoadingIndicator";
import { ModalFooter, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Button, CustomInput } from "reactstrap";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";
import DeletePortfolioDialog from "./DeletePortfolioDialog";

export interface UpdatePortfolioDialogData {
    portfolio: Portfolio;   
    detail: PortfolioDetails;
}

interface UpdatePortfolioDialogProps extends ModalDialogProps<UpdatePortfolioDialogData> { }

interface StateProps {
    users: User[];
    working: boolean;
    error: boolean;
    errorMessage: string;
}

interface DispatchProps {
    editPortfolio: (portfolio: PortfolioCreationRequest) => void;
    fetchUsers: () => void;
    openDeletePortfolioDialog: (portfolioId: string) => void;
}

interface UpdatePortfolioDialogState {
    title: string;
    supportExecId: string;
    salesLeadId: string;
}

class UpdatePortfolioDialog extends React.Component<UpdatePortfolioDialogProps & StateProps & DispatchProps, UpdatePortfolioDialogState> {
    constructor(props: UpdatePortfolioDialogProps & StateProps & DispatchProps){
        super(props);
        this.state = {
            title: props.data.portfolio.title,
            supportExecId: String(props.data.portfolio.supportExec.id),
            salesLeadId: String(props.data.portfolio.salesLead.id)
        };
    }

    componentDidMount(){
        this.props.fetchUsers();
    }

    editPortfolio(){
        var portfolio: PortfolioCreationRequest = {
            id: this.props.data.portfolio.id,
            accountId: this.props.data.detail.portfolio.accountId,
            title: this.state.title,
            teamId: 989,
            category: "direct",
            supportOwner: Number(this.state.supportExecId),
            ownerId: Number(this.state.salesLeadId)
        }
        
        this.props.editPortfolio(portfolio);
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
            this.state.salesLeadId,
            this.state.supportExecId);
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.users == null){
            return (<LoadingIndicator />);
        }

        let portfolioId = this.props.data.portfolio.id;

        var userOptions = this.props.users.map(u => {
            return (<option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)
        });

        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle}><i className="fas fa-layer-group mr-2"></i>Edit Portfolio</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="edit-portfolio-name">Name</Label>
                            <Input id="edit-portfolio-name"
                                    value={this.state.title}
                                    onChange={(e) => this.handleFormChange("title", e)} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="edit-portfolio-account-manager">Account Manager</Label>
                            <CustomInput type="select" name="account-manager-picker" id="edit-portfolio-account-manager"
                                   value={this.state.salesLeadId}
                                   onChange={(e) => this.handleFormChange("salesLeadId", e)}>
                                    <option value="" disabled>Select</option>
                                    {userOptions}
                            </CustomInput>
                        </FormGroup>
                        <FormGroup>
                            <Label for="edit-portfolio-tender-analyst">Tender Analyst</Label>
                            <CustomInput type="select" name="tender-analyst-picker" id="edit-portfolio-tender-analyst"
                                   value={this.state.supportExecId}
                                   onChange={(e) => this.handleFormChange("supportExecId", e)}>
                                    <option value="" disabled>Select</option>
                                    {userOptions}
                            </CustomInput>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter className="justify-content-between">
                    <Button color="danger"
                            onClick={() => this.props.openDeletePortfolioDialog(portfolioId)} >
                            <i className="fas fa-trash-alt mr-1" />Delete
                    </Button>
                    <div className="d-flex">
                        <Button color="secondary" 
                                onClick={this.props.toggle}>
                            <i className="fas fa-times mr-1"></i>Cancel    
                        </Button>
                        <Button color="accent" className="ml-1"
                                onClick={() => this.editPortfolio()}
                                disabled={!this.canSubmit()}>
                            <i className="material-icons mr-1">edit</i>Save
                        </Button>
                    </div>
                </ModalFooter>
                <DeletePortfolioDialog />
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UpdatePortfolioDialogProps> = (dispatch) => {
    return {
        editPortfolio: (portfolio: PortfolioCreationRequest) => dispatch(editPortfolio(portfolio)),
        fetchUsers: () => dispatch(fetchUsers()),

        openDeletePortfolioDialog: (portfolioId: string) => dispatch(openDialog(ModalDialogNames.DeletePortfolio, { portfolioId }))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, UpdatePortfolioDialogProps, ApplicationState> = (state: ApplicationState) => {
    return {
        users: state.users.value,
        working: state.users.working,
        error: state.users.error,
        errorMessage: state.users.errorMessage
    };
};
  
export default asModalDialog<UpdatePortfolioDialogProps, StateProps, DispatchProps>(
{ 
    name: ModalDialogNames.UpdatePortfolio, 
    centered: true, 
    backdrop: true
}, mapStateToProps, mapDispatchToProps)(UpdatePortfolioDialog)