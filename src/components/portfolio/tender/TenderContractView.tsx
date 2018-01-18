import * as React from "react";
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';

import { getPortfolioTenders } from '../../../actions/tenderActions';
import { Tender, TenderSupplier } from "../../../model/Tender";
import TenderStatus from "./TenderStatus";
import UploadBackingSheetDialog from './UploadBackingSheetDialog';
import AddExistingContractDialog from './AddExistingContractDialog';

interface TenderContractViewProps {
    tender: Tender;
    portfolioId: string;
}

class TenderContractView extends React.Component<TenderContractViewProps, {}> { 
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
        return (
            <div className="uk-margin uk-grid" data-uk-grid>
                <div className="uk-width-1-3">
                    <p>Ref: <strong>{this.props.tender.existingContract.reference}</strong></p>
                </div>
                <div className="uk-text-right uk-width-expand@m">
                    <p>Contract Start: <strong>{this.props.tender.existingContract.contractStart}</strong></p>
                    <p>Contract End: <strong>{this.props.tender.existingContract.contractEnd}</strong></p>
                </div>
            </div>);
    }

    renderContractActions(){
        var hasDocuments = this.props.tender.existingContract.uploaded != null;
        var warningMessage = null;
        if(!hasDocuments){
            warningMessage = (
                <div className="uk-alert-danger" data-uk-alert>
                    <p>Comparison is not yet possible - please upload backing sheet(s).</p>
                </div>);
        }

        var uploadBackingSheetDialogName = `modal-upload-backing-${this.props.tender.tenderId}`;
        var showUploadBackingSheetClass = `target: #${uploadBackingSheetDialogName}`;
        return (
            <div>
                {warningMessage}
                <div className="uk-grid" data-uk-grid>
                    <div className="uk-width-1-2">
                        <button className="uk-button uk-button-primary uk-button-small" type="button" data-uk-toggle={showUploadBackingSheetClass}>
                            <span className="uk-margin-small-right" data-uk-icon="icon: cloud-upload" />
                            Upload backing sheet
                        </button>
                    </div>
                    {hasDocuments ? (
                        <div className="uk-width-expand@m">
                            <button className="uk-button uk-button-default uk-button-small" type="button" disabled>
                                <span className="uk-margin-small-right" data-uk-icon="icon: copy" />
                                View backing sheets
                            </button>
                        </div>) : null}
                </div>

                <div id={uploadBackingSheetDialogName} data-uk-modal="center: true">
                    <UploadBackingSheetDialog tenderId={this.props.tender.tenderId} />
                </div>
            </div>
        )
    }
    
    render() {
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

export default TenderContractView;