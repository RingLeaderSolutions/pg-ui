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
        return (
            <div className="uk-grid uk-child-width-expand@s uk-grid-match" data-uk-grid>
                <p>Ref: <strong>{existingContract.reference}</strong></p>
                <p>Contract Start: <strong>{moment.utc(existingContract.contractStart).format('ll')}</strong></p>
                <p>Contract End: <strong>{moment.utc(existingContract.contractEnd).format('ll')}</strong></p>
                <p>Supplier: <strong>{supplierText}</strong></p>
            </div>);
    }

    fetchBackingSheets(){
        let contractId = this.props.tender.existingContract.contractId;
        this.props.fetchContractBackingSheets(this.props.tender.tenderId, contractId);
    }

    renderContractActions(){
        var hasDocuments = this.props.tender.existingContract.sheetCount > 0;
        var warningMessage = null;
        if(!hasDocuments){
            warningMessage = (
                <div className="uk-alert-danger" data-uk-alert>
                    <p>Comparison is not yet possible - please upload contract rate(s).</p>
                </div>);
        }

        var uploadBackingSheetDialogName = `modal-upload-backing-${this.props.tender.tenderId}`;
        var showUploadBackingSheetClass = `target: #${uploadBackingSheetDialogName}`;

        var viewContractBackingSheetsName = `modal-view-backing-${this.props.tender.tenderId}`;
        var showViewContractBackingSheetsClass = `target: #${viewContractBackingSheetsName}`;

        var uploadStyle = hasDocuments ? "uk-button-default" : "uk-button-primary";
        var viewStyle = !hasDocuments ? "uk-button-default" : "uk-button-primary";

        var uploadClass = `uk-button ${uploadStyle} uk-button-small`;
        var viewClass = `uk-button ${viewStyle} uk-button-small`;

        return (
            <div>
                {warningMessage}
                <div className="uk-grid uk-margin-top" data-uk-grid>
                    <div className="uk-width-1-2">
                        <button className={uploadClass} type="button" data-uk-toggle={showUploadBackingSheetClass}>
                            <span className="uk-margin-small-right" data-uk-icon="icon: cloud-upload" />
                            Upload contract rates
                        </button>
                    </div>
                    {hasDocuments ? (
                        <div className="uk-width-expand@m">
                            <button className={viewClass} type="button" data-uk-toggle={showViewContractBackingSheetsClass} onClick={() => this.fetchBackingSheets()}>
                                <span className="uk-margin-small-right" data-uk-icon="icon: copy" />
                                View contract rates
                            </button>
                        </div>) : null}
                </div>

                <div id={uploadBackingSheetDialogName} data-uk-modal="center: true">
                    <UploadBackingSheetDialog contractId={this.props.tender.existingContract.contractId} utilityType={this.props.tender.utility} />
                </div>

                <div id={viewContractBackingSheetsName} data-uk-modal="center: true">
                    <TenderBackingSheetsDialog />
                </div>
            </div>
        )
    }
    
    render() {
        if(this.props.working){
            return (<Spinner />);
        }
        if(this.props.tender.existingContract == null){
            return this.renderAddExistingContract();
        }

        var contractInfo = this.renderContractInfo();
        var actions = this.renderContractActions();
        return (
            <div>
                {contractInfo}
                {actions}
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