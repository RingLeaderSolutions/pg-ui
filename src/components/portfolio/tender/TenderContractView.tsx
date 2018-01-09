import * as React from "react";
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';

import { getPortfolioTenders } from '../../../actions/tenderActions';
import { Tender, TenderSupplier } from "../../../model/Tender";
import TenderStatus from "./TenderStatus";

interface TenderContractViewProps {
    tender: Tender;
}

class TenderContractView extends React.Component<TenderContractViewProps, {}> { 

    renderAddExistingContract(){
        return (<button className="uk-button uk-button-primary" type="button">Add existing contract</button>);
    }

    renderContractInfo(){
        return (
            <div className="uk-margin uk-grid" data-uk-grid>
                <div className="uk-width-1-3">
                    <p>Supplier: <strong>{this.props.tender.existingContract.reference}</strong></p>
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
                    <p>Comparison not possible - load backing sheets.</p>
                </div>);
        }

        return (
            <div>
                {warningMessage}
                <div className="uk-grid" data-uk-grid>
                    <div className="uk-width-1-4">
                        <button className="uk-button uk-button-primary uk-button-small" type="button">
                            <span className="uk-margin-small-right" data-uk-icon="icon: cloud-upload" />
                            Load
                        </button>
                    </div>
                    {hasDocuments ? (
                        <div className="uk-width-expand@m">
                            <button className="uk-button uk-button-default uk-button-small" type="button">
                                <span className="uk-margin-small-right" data-uk-icon="icon: copy" />
                                Backing sheets
                            </button>
                        </div>) : null}
                    <div className="uk-width-expand@m">
                        <button className="uk-button uk-button-danger uk-button-small uk-align-right" type="button">
                            <span className="uk-margin-small-right" data-uk-icon="icon: trash" />
                            Delete
                        </button>
                    </div>
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