import * as React from "react";
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import * as moment from 'moment';
import { fetchContractBackingSheets } from '../../../actions/tenderActions';
import { Tender, TenderSupplier } from "../../../model/Tender";
import TenderStatus from "./TenderStatus";
import UploadBackingSheetDialog from './UploadBackingSheetDialog';
import AddExistingContractDialog from './AddExistingContractDialog';
import TenderBackingSheetsDialog from './TenderBackingSheetsDialog';
import Spinner from "../../common/Spinner";
import UpdateExistingContractDialog from "./UpdateExistingContractDialog";

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
}

class TenderContractView extends React.Component<TenderContractViewProps & DispatchProps & StateProps, {}> { 
    renderAddExistingContract(){
        var addExistingContractDialogName = `modal-add-contract-${this.props.tender.tenderId}`;
        var addExistingContractTargetClass = `target: #${addExistingContractDialogName}`;
        return (
            <div>
                <div>
                    <button className="uk-button uk-button-primary" type="button" data-uk-toggle={addExistingContractTargetClass}>Add existing contract</button>
                </div>
                <div id={addExistingContractDialogName} data-uk-modal="center: true">
                    <AddExistingContractDialog tender={this.props.tender} portfolioId={this.props.portfolioId} />
                </div>
            </div>);
    }

    renderContractInfo(){
        var { existingContract } = this.props.tender;
        var existingSupplier = this.props.suppliers.find(s => s.supplierId == existingContract.supplierId);
        var supplierText = existingSupplier == null ? "Unknown" : existingSupplier.name;

        // return (
        //     <div className="uk-grid uk-child-width-expand@s uk-grid-match" data-uk-grid>
        //         <p>Ref: <strong>{existingContract.reference}</strong></p>
        //         <p>Contract Start: <strong>{moment.utc(existingContract.contractStart).format('ll')}</strong></p>
        //         <p>Contract End: <strong>{moment.utc(existingContract.contractEnd).format('ll')}</strong></p>
        //         <p>Supplier: <strong>{supplierText}</strong></p>
        //     </div>);

        return (
            <div className="uk-grid uk-margin-small-left uk-margin-small-right uk-grid-match" data-uk-grid>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-5 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{existingContract.reference}</p>
                    <p className="uk-text-meta uk-margin-small">Reference</p>
                </div>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-5 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{moment.utc(existingContract.contractStart).format('ll')}</p>
                    <p className="uk-text-meta uk-margin-small">Contract Start</p>
                </div>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-5 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{moment.utc(existingContract.contractEnd).format('ll')}</p>
                    <p className="uk-text-meta uk-margin-small">Contract End</p>
                </div>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-5 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{supplierText}</p>
                    <p className="uk-text-meta uk-margin-small">Supplier</p>
                </div>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-5 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{existingContract.product}</p>
                    <p className="uk-text-meta uk-margin-small">Product</p>
                </div>
            </div>
        )
    }

    fetchBackingSheets(){
        let contractId = this.props.tender.existingContract.contractId;
        this.props.fetchContractBackingSheets(this.props.tender.tenderId, contractId);
    }

    renderContractActions(){

        var uploadBackingSheetDialogName = `modal-upload-backing-${this.props.tender.tenderId}`;
        var showUploadBackingSheetClass = `target: #${uploadBackingSheetDialogName}`;

        var viewContractBackingSheetsName = `modal-view-backing-${this.props.tender.tenderId}`;
        var showViewContractBackingSheetsClass = `target: #${viewContractBackingSheetsName}`;

        var editContractDialogName = `modal-edit-contract-${this.props.tender.tenderId}`;
        var showEditContractDialogName = `target: #${editContractDialogName}`;

        return (
            <div>
                <div>
                    <div className="uk-inline">
                        <button className="uk-button uk-button-default" type="button">
                            <span data-uk-icon="icon: more" />
                        </button>
                        <div data-uk-dropdown="pos:bottom-justify;mode:click">
                            <ul className="uk-nav uk-dropdown-nav">
                            <li><a href="#" data-uk-toggle={showUploadBackingSheetClass}>
                                <span className="uk-margin-small-right" data-uk-icon="icon: cloud-upload" />
                                Upload Contract Rates
                            </a></li>
                            <li className="uk-nav-divider"></li>
                            <li><a href="#" data-uk-toggle={showViewContractBackingSheetsClass} onClick={() => this.fetchBackingSheets()}>
                                <span className="uk-margin-small-right" data-uk-icon="icon: copy" />
                                View Contract Rates
                            </a></li>
                            <li className="uk-nav-divider"></li>
                            <li><a href="#" data-uk-toggle={showEditContractDialogName}>
                                <span className="uk-margin-small-right" data-uk-icon="icon: pencil" />                                        
                                Edit contract
                            </a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div id={uploadBackingSheetDialogName} data-uk-modal="center: true">
                    <UploadBackingSheetDialog contractId={this.props.tender.existingContract.contractId} utilityType={this.props.tender.utility} />
                </div>

                <div id={viewContractBackingSheetsName} data-uk-modal="center: true">
                    <TenderBackingSheetsDialog />
                </div>

                <div id={editContractDialogName} data-uk-modal="center: true">
                    <UpdateExistingContractDialog existingContract={this.props.tender.existingContract} portfolioId={this.props.portfolioId} tenderId={this.props.tender.tenderId} />
                </div>
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
                    <div>
                        {content}
                    </div>
                </div>
            )
        }

        var contractInfo = this.renderContractInfo();
        var actions = this.renderContractActions();

        var hasDocuments = this.props.tender.existingContract.sheetCount > 0;
        var warningMessage = null;
        if(!hasDocuments){
            warningMessage = (
                <div className="uk-alert-warning uk-margin-small-top uk-margin-small-bottom" data-uk-alert>
                    <p>Comparison is not yet possible - please upload contract rate(s).</p>
                </div>);
        }
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
        fetchContractBackingSheets: (tenderId: string, contractId: string) => dispatch(fetchContractBackingSheets(tenderId, contractId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderContractViewProps> = (state: ApplicationState) => {
    return {
        suppliers: state.portfolio.tender.suppliers.value,
        working: state.portfolio.tender.suppliers.working
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderContractView);