import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import Spinner from '../../common/Spinner';

import { createContractRenewal, getTenderSuppliers, clearRenewalState } from '../../../actions/tenderActions';
import { TenderContract, TenderSupplier, ContractRenewalResponse } from "../../../model/Tender";
import { closeModalDialog, redirectToPortfolio } from "../../../actions/viewActions";
import ErrorMessage from "../../common/ErrorMessage";
import { ContractRenewalStage } from "../../../model/app/ContractRenewalStage";
import ModalDialog from "../../common/ModalDialog";

interface RenewContractDialogProps {
    contract: TenderContract;
    dialogId: string;
}

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
    closeModalDialog: () => void;
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
        this.props.clearRenewalState();
        this.props.closeModalDialog();
    }

    renewContract(){
        var { contractId } = this.props.contract;
        this.props.renewContract(contractId);
    }

    closeAndClear(){
        this.props.clearRenewalState();
        this.props.closeModalDialog();
    }

    renderOnlyOKButton(){
        return (
            <div className="uk-modal-footer uk-text-right">
                <button className="uk-button uk-button-default uk-margin-right" type="button"  onClick={() => this.closeAndClear()}><i className="fas fa-times uk-margin-small-right"></i>OK</button>
            </div>);
    }

    renderInProgressDisplay(step: string){
        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title"><i className="fas fa-exclamation-triangle uk-margin-right"></i><i className="fas fa-file-signature uk-margin-right"></i>Working</h2>
                </div>
                 <div className="uk-modal-body">
                    <div className="spinner-2"></div>
                    <h4 className="uk-text-center uk-margin-bottom">Contract renewal in progress (Step {step})</h4>
                </div>
            </div>
        )
    }

    renderSupplierPane(){
        if(this.props.suppliers_working){
            return (<Spinner />);
        }

        if(this.props.suppliers_error){
            return (<ErrorMessage content={this.props.suppliers_errorMessage} />)
        }

        return <ErrorMessage />
    }

    renderDialog(){
        if(this.props.suppliers == null){
            return this.renderSupplierPane();
        }

        switch(this.props.renewal_stage){
            case ContractRenewalStage.Idle:
                return (
                    <div>
                        <div className="uk-modal-header">
                            <h2 className="uk-modal-title"><i className="fas fa-redo uk-margin-right"></i><i className="fas fa-file-signature uk-margin-right"></i>Renew Existing Contract</h2>
                        </div>
                        <div className="uk-modal-body">
                            <p>This process will:</p>
                            <ul>
                                <li>Create a new renewal portfolio, if one does not yet exist</li>
                                <li>Assign the meters included in the previous contract to the new portfolio</li>
                                <li>Create a new tender and assign the existing supplier as an intended recipient</li>
                            </ul>
                            <p>Would you like to proceed?</p>
                        </div>
                        <div className="uk-modal-footer uk-text-right">
                            <button className="uk-button uk-button-default uk-margin-right" type="button"  onClick={() => this.props.closeModalDialog()}><i className="fas fa-times uk-margin-small-right"></i>Cancel</button>
                            <button className="uk-button uk-button-primary" type="button" onClick={() => this.renewContract()}><i className="fas fa-redo uk-margin-small-right"></i>Renew</button>
                        </div>
                    </div>);
            case ContractRenewalStage.RenewalRequestSent:
                return this.renderInProgressDisplay('1');
            case ContractRenewalStage.WaitingForCompletion:
                return this.renderInProgressDisplay('2');
            case ContractRenewalStage.RenewalFailed:
                return (
                    <div>
                        <div className="uk-modal-header">
                            <h2 className="uk-modal-title"><i className="fas fa-exclamation-triangle uk-margin-right"></i>Renew Existing Contract: Error</h2>
                        </div>
                        <div className="uk-modal-body">
                            <ErrorMessage>
                                <div>
                                    <p>Sorry, we encountered a problem trying to renew this contract:</p>
                                    <p>{this.props.renewal_errorMessage}</p>
                                </div>
                            </ErrorMessage>
                        </div>
                        {this.renderOnlyOKButton()}
                    </div>);
            case ContractRenewalStage.Complete:
                var result = this.props.renewal_result;
                var successMessage = result.status.toLowerCase() == 'created' ? 
                    (<p>A new portfolio, <i>"{result.title}"</i> has been created.</p>) : (<p>The <i>"{result.title}"</i> portfolio has been updated.</p>);
                return (
                    <div>
                        <div className="uk-modal-header">
                            <h2 className="uk-modal-title"><i className="fa fa-check-circle uk-margin-small-right" style={{color: '#006400'}}></i>Success!</h2>
                        </div>
                        <div className="uk-modal-body">
                            <div className="uk-text-center">
                                <h4>This contract was successfully renewed!</h4> 
                                {successMessage}
                                <p>Click on the button below to view the portfolio, or click OK to close this window.</p>
                                <button className='uk-button uk-button-default uk-button-small uk-margin-top' data-uk-tooltip="title: Jump to portfolio" onClick={() => this.redirectToPortfolio(result.portfolioId)}>
                                <i className="fa fa-external-link-alt uk-margin-small-right"></i>{result.title}</button>
                            </div>
                            
                        </div>
                        {this.renderOnlyOKButton()}
                    </div>);
        }
    }

    render(){
        return (
            <ModalDialog dialogId={this.props.dialogId} onClose={() => this.props.clearRenewalState()}>
                {this.renderDialog()}
            </ModalDialog>
        )
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, RenewContractDialogProps> = (dispatch) => {
    return {
        getSuppliers: () => dispatch(getTenderSuppliers()),
        renewContract: (contractId: string) => dispatch(createContractRenewal(contractId)),
        clearRenewalState: () => dispatch(clearRenewalState()),
        closeModalDialog: () => dispatch(closeModalDialog()),
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
  
export default connect(mapStateToProps, mapDispatchToProps)(RenewContractDialog);