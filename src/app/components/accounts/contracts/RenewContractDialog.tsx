import * as React from "react";
import { MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import { createContractRenewal, getTenderSuppliers, clearRenewalState } from '../../../actions/tenderActions';
import { TenderContract, TenderSupplier, ContractRenewalResponse } from "../../../model/Tender";
import { redirectToPortfolio } from "../../../actions/viewActions";
import ErrorMessage from "../../common/ErrorMessage";
import { ContractRenewalStage } from "../../../model/app/ContractRenewalStage";
import asModalDialog, { ModalDialogProps } from "../../common/modal/AsModalDialog";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";
import ModalFooter from "reactstrap/lib/ModalFooter";
import { LoadingIndicator } from "../../common/LoadingIndicator";
import { ModalBody, Button, ModalHeader } from "reactstrap";

export interface RenewContractDialogData {
    contract: TenderContract;
}

interface RenewContractDialogProps extends ModalDialogProps<RenewContractDialogData> { }

interface StateProps {
    suppliers_working: boolean;
    suppliers_error: boolean;
    suppliers_errorMessage: string;
    suppliers: TenderSupplier[];
    renewal_stage: ContractRenewalStage;
    renewal_errorMessage: string;
    renewal_result: ContractRenewalResponse;
}
  
interface DispatchProps {
    getSuppliers: () => void;
    renewContract: (contractId: string) => void;
    clearRenewalState: () => void;
    redirectToPortfolio: (portfolioId: string) => void;
}

class RenewContractDialog extends React.Component<RenewContractDialogProps & StateProps & DispatchProps, {}> {
    componentDidMount(){
        if(this.props.suppliers == null){
            this.props.getSuppliers();
        }
    }

    redirectToPortfolio(portfolioId: string){
        this.props.redirectToPortfolio(portfolioId);
        this.closeAndClear();
    }

    renewContract(){
        var { contractId } = this.props.data.contract;
        this.props.renewContract(contractId);
    }

    closeAndClear(){
        this.props.clearRenewalState();
        this.props.toggle();
    }

    renderOnlyOKButton(){
        return (
            <ModalFooter>
                <Button onClick={() => this.closeAndClear()}>
                    <i className="fas fa-times mr-1"></i>OK
                </Button>
            </ModalFooter>);
    }

    renderInProgressDisplay(step: string){
        return (
            <div className="modal-content">
                <ModalHeader><i className="fas fa-file-signature mr-1"></i>Working...</ModalHeader>
                <ModalBody>
                    <LoadingIndicator minHeight={200} text={`Contract renewal in progress (Step ${step})`} />
                </ModalBody>
            </div>);
    }

    renderSupplierPane(){
        if(this.props.suppliers_working){
            return (<LoadingIndicator minHeight={200} />);
        }

        if(this.props.suppliers_error){
            return (<ErrorMessage content={this.props.suppliers_errorMessage} />)
        }

        return <ErrorMessage />
    }

    render(){
        if(this.props.suppliers == null){
            return this.renderSupplierPane();
        }

        switch(this.props.renewal_stage){
            case ContractRenewalStage.Idle:
                return (
                    <div className="modal-content">
                        <ModalHeader><i className="fas fa-file-signature mr-1"></i>Renew Existing Contract</ModalHeader>
                        <ModalBody>
                            <p className="text-midweight">This process will:</p>
                            <ul className="text-midweight">
                                <li>Create a new renewal portfolio, if one does not yet exist</li>
                                <li>Assign the meters included in the previous contract to the new portfolio</li>
                                <li>Create a new tender and assign the existing supplier as an intended recipient</li>
                            </ul>
                            <p className="mb-0">Would you like to proceed?</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={() => this.closeAndClear()}>
                                <i className="fas fa-times mr-1"></i>Cancel
                            </Button>
                            <Button color="accent" 
                                    onClick={() => this.renewContract()}>
                               <i className="fas fa-redo mr-1"></i>Renew
                            </Button>
                        </ModalFooter>
                    </div>);
            case ContractRenewalStage.RenewalRequestSent:
                return this.renderInProgressDisplay('1');
            case ContractRenewalStage.WaitingForCompletion:
                return this.renderInProgressDisplay('2');
            case ContractRenewalStage.RenewalFailed:
                return (
                    <div className="modal-content">
                        <ModalHeader><i className="fas fa-file-signature mr-1"></i>Renew Existing Contract: Error</ModalHeader>
                        <ModalBody>
                            <ErrorMessage>
                                <div>
                                    <p>Sorry, we encountered a problem trying to renew this contract:</p>
                                    <p>{this.props.renewal_errorMessage}</p>
                                </div>
                            </ErrorMessage>
                        </ModalBody>
                        {this.renderOnlyOKButton()}
                    </div>);
            case ContractRenewalStage.Complete:
                var result = this.props.renewal_result;
                var successMessage = result.status.toLowerCase() == 'created' ? 
                    (<p className="mb-1">A new portfolio, <i>"{result.title}"</i> has been created.</p>) : (<p className="mb-1">The <i>"{result.title}"</i> portfolio has been updated.</p>);
                return (
                    <div className="modal-content">
                        <ModalHeader toggle={() => this.closeAndClear()}><i className="fa fa-check-circle text-success mr-1"></i>Success!</ModalHeader>
                        <ModalBody>
                            <h4>This contract was successfully renewed!</h4> 
                            {successMessage}
                            <p>Click on the button below to view the portfolio, or click OK to close this window.</p>
                            <Button color="white" onClick={() => this.redirectToPortfolio(result.portfolioId)}>
                                <i className="fa fa-external-link-alt mr-1"></i>{result.title}
                            </Button>
                        </ModalBody>
                        {this.renderOnlyOKButton()}
                    </div>);
        }
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, RenewContractDialogProps> = (dispatch) => {
    return {
        getSuppliers: () => dispatch(getTenderSuppliers()),
        renewContract: (contractId: string) => dispatch(createContractRenewal(contractId)),
        clearRenewalState: () => dispatch(clearRenewalState()),
        redirectToPortfolio: (portfolioId: string) => dispatch(redirectToPortfolio(portfolioId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, RenewContractDialogProps, ApplicationState> = (state: ApplicationState) => {
    return {
        suppliers: state.suppliers.value,
        suppliers_working: state.suppliers.working,
        suppliers_error: state.suppliers.error,
        suppliers_errorMessage: state.suppliers.errorMessage,
        renewal_stage: state.hierarchy.renew_contract.stage,
        renewal_errorMessage: state.hierarchy.renew_contract.errorMessage,
        renewal_result: state.hierarchy.renew_contract.result
    };
};
  
export default asModalDialog<RenewContractDialogProps, StateProps, DispatchProps>(
{ 
    name: ModalDialogNames.RenewAccountContract, 
    centered: true, 
    backdrop: true
}, mapStateToProps, mapDispatchToProps)(RenewContractDialog)