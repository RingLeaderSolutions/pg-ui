import * as React from "react";
import { MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import { selectCompanySearchMethod, selectManualMethod, clearAccountCreation } from '../../../actions/hierarchyActions';
import { AccountCreationStage } from "../../../model/app/AccountCreationStage";
import CompanySearch from "./CompanySearch";
import CreateAccountDialog from "./CreateAccountDialog";
import AsModalDialog, { ModalDialogProps } from "../../common/modal/AsModalDialog";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";
import { ModalHeader, ModalBody, Card, CardHeader, CardBody, ModalFooter, Button } from "reactstrap";
import { LoadingIndicator } from "../../common/LoadingIndicator";

interface StateProps {
    stage: AccountCreationStage;
}

interface DispatchProps {
    selectCompanySearchMethod: () => void;
    selectManualMethod: () => void;
    clearAccountCreation: () => void;
}

class NewAccountDialog extends React.Component<ModalDialogProps & StateProps & DispatchProps, {}> {
    constructor(props: ModalDialogProps & StateProps & DispatchProps) {
        super(props);
        
        this.selectCompanySearch = this.selectCompanySearch.bind(this);
        this.selectManualMethod = this.selectManualMethod.bind(this);
        this.finishCreation = this.finishCreation.bind(this);
    }

    selectCompanySearch(event: any){
        event.preventDefault();
        this.props.selectCompanySearchMethod();
    }

    selectManualMethod(event: any){
        event.preventDefault();
        this.props.selectManualMethod();
    }

    finishCreation() {
        this.props.clearAccountCreation();
        this.props.toggle();
    }

    render() {
        switch(this.props.stage){
            case AccountCreationStage.CompanySearch:
                return (
                    <div className="new-account-dialog">
                        <CompanySearch toggle={this.props.toggle} />
                    </div>);
            case AccountCreationStage.EnterDetail:
                return (
                    <div className="new-account-dialog">
                        <CreateAccountDialog toggle={this.props.toggle} />
                    </div>);
            case AccountCreationStage.Creation:
                return (
                    <div className="modal-content">
                        <ModalHeader toggle={() => this.finishCreation()}><i className="fas fa-building mr-2"></i>Working...</ModalHeader>
                        <ModalBody>
                            <LoadingIndicator text="Creating account..." />
                        </ModalBody>
                    </div>);
            case AccountCreationStage.Complete:
                return (
                    <div className="modal-content">
                        <ModalHeader toggle={() => this.finishCreation()}><i className="fa fa-check-circle mr-2 text-success"></i>Success!</ModalHeader>
                        <ModalBody>
                            Your account has been created! Click below to exit this screen.
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={() => this.finishCreation()}>
                                <i className="fas fa-arrow-circle-right mr-1"></i>Contrinue
                            </Button>
                        </ModalFooter>
                    </div>);
        }

        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle}><i className="fas fa-building mr-2"></i>Create Account</ModalHeader>
                <ModalBody>
                    <p>Select a way to create your account:</p>
                    <Card className="card-small" onClick={this.selectCompanySearch} style={{cursor: "pointer"}}>
                        <CardHeader className="border-bottom d-flex align-items-center">
                            <img className="rounded-circle " width="40" height="40" src={require('../../../assets/img/companies-house.jpg')} />
                            <h6 className="ml-2 mb-0">Company Search</h6>
                        </CardHeader>
                        <CardBody>
                            <p className="mb-0 text-midweight">Search Companies House to retrieve information about a company. Requires the company's registration number.</p>
                        </CardBody>
                    </Card>

                    <Card className="card-small mt-3" onClick={this.selectManualMethod} style={{cursor: "pointer"}}>
                        <CardHeader className="border-bottom d-flex align-items-center">
                            <img className="rounded-circle " width="40" height="40" src={require('../../../assets/img/manual-icon.png')} />
                            <h6 className="ml-2 mb-0">Manual</h6>
                        </CardHeader>
                        <CardBody>
                            <p className="mb-0 text-midweight">Enter the company's details manually.</p>
                        </CardBody>
                    </Card>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.props.toggle}>
                        <i className="fas fa-times mr-1"></i>Cancel
                    </Button>
                </ModalFooter>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        selectCompanySearchMethod: () => dispatch(selectCompanySearchMethod()),
        selectManualMethod: () => dispatch(selectManualMethod()),
        clearAccountCreation: () => dispatch(clearAccountCreation())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, {}, ApplicationState> = (state: ApplicationState) => {
    return {
        stage: state.hierarchy.create_account.stage.stage,
    };
};
  
export default AsModalDialog<{}, StateProps, DispatchProps>(
{ 
    name: ModalDialogNames.CreateAccount, 
    centered: true, 
    backdrop: true
}, mapStateToProps, mapDispatchToProps)(NewAccountDialog)