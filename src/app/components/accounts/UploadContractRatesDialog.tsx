import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';

import { uploadElectricityBackingSheet, uploadGasBackingSheet } from '../../actions/tenderActions';
import { closeModalDialog } from "../../actions/viewActions";
import { UploadPanel } from "../common/UploadPanel";
import { TenderSupplier, TenderContract } from "../../model/Tender";
import { getWellFormattedUtilityName } from "../common/UtilityIcon";

interface UploadContractRatesDialogProps {
    contract: TenderContract;   
    supplier: TenderSupplier; 
}

interface StateProps {
}

interface DispatchProps {
    uploadElectricityBackingSheet: (contractId: string, useGeneric: boolean, file: Blob) => void;
    uploadGasBackingSheet: (contractId: string, useGeneric: boolean, file: Blob) => void;
    closeModalDialog: () => void;
}

interface UploadContractRatesDialogState {
    file: File;
    useGeneric: boolean;
}

class UploadContractRatesDialog extends React.Component<UploadContractRatesDialogProps & StateProps & DispatchProps, UploadContractRatesDialogState> {
    constructor(){
        super();
        this.state = {
            file: null,
            useGeneric: false
        };
    }
    
    upload() {
        var { contractId, utility } = this.props.contract;
        if(utility == "GAS"){
            this.props.uploadGasBackingSheet(contractId, this.state.useGeneric, this.state.file);
        }
        else {
            this.props.uploadElectricityBackingSheet(contractId, this.state.useGeneric, this.state.file);
        }

        this.onFileCleared();
        this.props.closeModalDialog();
    }

    onFileSelected(file: File){
        this.setState({...this.state, file});
    }

    onFileCleared(){
        this.setState({...this.state, file: null});
    }

    handleFormChange(attribute: string, event: React.ChangeEvent<any>, isCheck: boolean = false){
        var value = isCheck ? event.target.checked : event.target.value;

        this.setState({
            ...this.state,
            [attribute]: value
        })
    }

    canSubmit() {
        return this.state.file != null;
    }

    render() {
        var { supplier, contract } = this.props;
        var { reference, utility } = contract;

        var friendlyUtility = getWellFormattedUtilityName(utility);
        var supplierName = supplier == null ? "Unknown" : supplier.name;
        var supplierImage = supplier == null ? "Unknown" : (<img data-uk-tooltip={`title:${supplier.name}`} src={supplier.logoUri} style={{ maxWidth: "140px", maxHeight: "80px"}}/>);

        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title"><i className="fa fa-file-upload uk-margin-right"></i>Upload {friendlyUtility} Contract Rates</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        <div className="uk-grid uk-grid-collapse">
                            <div className="uk-width-expand" />
                            <div className="uk-width-auto uk-flex uk-flex-middle">
                                {supplierImage}
                            </div>
                            <div className="uk-width-expand" />
                        </div>
                        <p>Please upload the file representing the existing <strong>{supplierName}</strong> {friendlyUtility} contract rates.</p> 
                        <p>Contract Reference: <i>{reference}</i>.</p>
                        <hr />
                        <form>
                            <fieldset className="uk-fieldset">
                                <div className='uk-margin-bottom'>
                                    <label>
                                        <input 
                                            className='uk-checkbox'
                                            type='checkbox' 
                                            checked={this.state.useGeneric}
                                            onChange={(e) => this.handleFormChange("useGeneric", e, true)} /> Use Generic Template
                                    </label>
                                </div>
                            </fieldset>
                            
                            <UploadPanel 
                                file={this.state.file}
                                onFileSelected={(file: File) => this.onFileSelected(file)}
                                onFileCleared={() => this.onFileCleared()} />
                        </form>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}><i className="fa fa-times uk-margin-small-right"></i>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.upload()} disabled={!this.canSubmit()}><i className="fa fa-arrow-circle-up uk-margin-small-right"></i>Upload</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UploadContractRatesDialogProps> = (dispatch) => {
    return {
        uploadElectricityBackingSheet: (contractId: string, useGeneric: boolean, file: Blob) => dispatch(uploadElectricityBackingSheet(contractId, useGeneric, file)),
        uploadGasBackingSheet: (contractId: string, useGeneric: boolean, file: Blob) => dispatch(uploadGasBackingSheet(contractId, useGeneric, file)),
        closeModalDialog: () => dispatch(closeModalDialog())    
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, UploadContractRatesDialogProps> = (state: ApplicationState) => {
    return {
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(UploadContractRatesDialog);