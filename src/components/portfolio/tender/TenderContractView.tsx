import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import { fetchContractBackingSheets } from '../../../actions/tenderActions';
import { Tender, TenderSupplier } from "../../../model/Tender";
import UploadBackingSheetDialog from './UploadBackingSheetDialog';
import AddExistingContractDialog from './AddExistingContractDialog';
import TenderBackingSheetsDialog from './TenderBackingSheetsDialog';
import Spinner from "../../common/Spinner";
import UpdateExistingContractDialog from "./UpdateExistingContractDialog";
import { format } from 'currency-formatter';
import ModalDialog from "../../common/ModalDialog";
import { openModalDialog } from "../../../actions/viewActions";

interface TenderContractViewProps {
    tender: Tender;
    portfolioId: string;
}

interface StateProps {
    suppliers: TenderSupplier[];
    working: boolean;
}

interface DispatchProps {
    fetchContractBackingSheets: (tenderId: string, contractId: string) => void;
    openModalDialog: (dialogId: string) => void;
}

class TenderContractView extends React.Component<TenderContractViewProps & DispatchProps & StateProps, {}> { 
    renderAddExistingContract(){
        var addExistingContractDialogName = `add_contract_${this.props.tender.tenderId}`;
        return (
            <div>
                <div>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.props.openModalDialog(addExistingContractDialogName)}>Add existing contract</button>
                </div>
                <ModalDialog dialogId={addExistingContractDialogName}>
                    <AddExistingContractDialog tender={this.props.tender} portfolioId={this.props.portfolioId} />
                </ModalDialog>
            </div>);
    }

    renderContractInfo(){
        var { existingContract } = this.props.tender;
        var existingSupplier = this.props.suppliers.find(s => s.supplierId == existingContract.supplierId);
        var supplierLogo = existingSupplier == null ? "Unknown" : (<img src={existingSupplier.logoUri} style={{ width: "70px"}}/>);

        var appu = `${existingContract.averagePPU.toFixed(4)}p`;
        return (
            <div className="uk-grid uk-margin-small-left uk-margin-small-right uk-grid-match" data-uk-grid>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-5 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{existingContract.reference}</p>
                    <p className="uk-text-meta uk-margin-small">Reference</p>
                </div>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-5 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{supplierLogo}</p>
                    <p className="uk-text-meta uk-margin-small">Supplier</p>
                </div>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-5 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{existingContract.product}</p>
                    <p className="uk-text-meta uk-margin-small">Product</p>
                </div>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-5 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{format(existingContract.totalIncCCL, { locale: 'en-GB'})}</p>
                    <p className="uk-text-meta uk-margin-small">Contract Value</p>
                </div>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-5 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{appu}</p>
                    <p className="uk-text-meta uk-margin-small">Avg Pence Per Unit</p>
                </div>
            </div>
        )
    }

    fetchRatesAndOpenDialog(dialogName: string){
        let contractId = this.props.tender.existingContract.contractId;
        this.props.fetchContractBackingSheets(this.props.tender.tenderId, contractId);
        this.props.openModalDialog(dialogName);
    }

    renderContractActions(hasContractRates: boolean){
        var uploadExistingDialogName = `upload_contract_${this.props.tender.tenderId}`;
        var viewContractDialogName = `view_contract_${this.props.tender.tenderId}`;
        var editContractDialogName = `edit_contract_${this.props.tender.tenderId}`;

        return (
            <div>
                <div>
                    <div className="uk-inline">
                        <button className="uk-button uk-button-default" type="button">
                            <span data-uk-icon="icon: more" />
                        </button>
                        <div data-uk-dropdown="pos:bottom-justify;mode:click">
                            <ul className="uk-nav uk-dropdown-nav">
                            <li><a href="#" onClick={() => this.props.openModalDialog(uploadExistingDialogName)}>
                                <span className="uk-margin-small-right" data-uk-icon="icon: cloud-upload" />
                                Upload Contract Rates
                            </a></li>
                            <li className="uk-nav-divider"></li>
                            { hasContractRates ? (<li><a href="#" onClick={() => this.fetchRatesAndOpenDialog(viewContractDialogName)}>
                                <span className="uk-margin-small-right" data-uk-icon="icon: copy" />
                                View Contract Rates
                            </a></li>) : null }
                            <li className="uk-nav-divider"></li>
                            <li><a href="#" onClick={() => this.props.openModalDialog(editContractDialogName)}>
                                <span className="uk-margin-small-right" data-uk-icon="icon: pencil" />                                        
                                Edit contract
                            </a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <ModalDialog dialogId={uploadExistingDialogName}>
                    <UploadBackingSheetDialog contractId={this.props.tender.existingContract.contractId} utilityType={this.props.tender.utility} />
                </ModalDialog>

                <ModalDialog dialogId={viewContractDialogName} dialogClass="backing-sheet-modal">
                    <TenderBackingSheetsDialog />
                </ModalDialog>

                <ModalDialog dialogId={editContractDialogName}>
                    <UpdateExistingContractDialog existingContract={this.props.tender.existingContract} portfolioId={this.props.portfolioId} tenderId={this.props.tender.tenderId} />
                </ModalDialog>
            </div>
        )
    }
    
    render() {
        if(this.props.working){
            return (<Spinner />);
        }
        if(this.props.tender.existingContract == null){
            var content = this.renderAddExistingContract();

            return (
                <div className="uk-card uk-card-small uk-card-default uk-card-body">
                    <div className="uk-grid">
                        <h3 className="uk-width-expand@s">Existing Contract</h3>
                    </div>
                    <div className="uk-margin">
                        {content}
                    </div>
                </div>
            )
        }

        var hasContractRates = this.props.tender.existingContract.sheetCount > 0;
        var warningMessage = null;
        if(!hasContractRates){
            warningMessage = (
                <div className="uk-alert-warning uk-margin-small-top uk-margin-small-bottom" data-uk-alert>
                    <p>Comparison is not yet possible - please upload contract rate(s).</p>
                </div>);
        }

        var contractInfo = this.renderContractInfo();
        var actions = this.renderContractActions(hasContractRates);
        return (
            <div className="uk-card uk-card-small uk-card-default uk-card-body">
                <div className="uk-grid">
                    <h3 className="uk-width-expand@s">Existing Contract</h3>
                    <div>
                        {actions}
                    </div>
                </div>
                <div>
                    {contractInfo}
                    {warningMessage}
                </div>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderContractViewProps> = (dispatch) => {
    return {
        fetchContractBackingSheets: (tenderId: string, contractId: string) => dispatch(fetchContractBackingSheets(tenderId, contractId)),
        openModalDialog: (dialogId: string) => dispatch(openModalDialog(dialogId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderContractViewProps> = (state: ApplicationState) => {
    return {
        suppliers: state.portfolio.tender.suppliers.value,
        working: state.portfolio.tender.suppliers.working
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderContractView);