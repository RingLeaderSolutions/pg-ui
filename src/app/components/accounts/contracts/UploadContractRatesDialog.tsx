import * as React from "react";
import { MapDispatchToPropsFunction } from 'react-redux';

import { uploadElectricityBackingSheet, uploadGasBackingSheet } from '../../../actions/tenderActions';
import { UploadPanel } from "../../common/UploadPanel";
import { TenderSupplier, TenderContract } from "../../../model/Tender";
import { getWellFormattedUtilityName } from "../../common/UtilityIcon";
import AsModalDialog, { ModalDialogProps } from "../../common/modal/AsModalDialog";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";
import { ModalHeader, ModalBody, Form, ModalFooter, Button } from "reactstrap";

export interface UploadContractRatesDialogData {
    contract: TenderContract;   
    supplier: TenderSupplier; 
}

interface DispatchProps {
    uploadElectricityBackingSheet: (contractId: string, file: Blob) => void;
    uploadGasBackingSheet: (contractId: string, file: Blob) => void;
}

interface UploadContractRatesDialogState {
    file: File;
}

class UploadContractRatesDialog extends React.Component<ModalDialogProps<UploadContractRatesDialogData> & DispatchProps, UploadContractRatesDialogState> {
    constructor(props: ModalDialogProps<UploadContractRatesDialogData> & DispatchProps){
        super(props);
        this.state = {
            file: null
        };
    }
    
    upload() {
        var { contractId, utility } = this.props.data.contract;
        if(utility == "GAS"){
            this.props.uploadGasBackingSheet(contractId, this.state.file);
        }
        else {
            this.props.uploadElectricityBackingSheet(contractId, this.state.file);
        }

        this.onFileCleared();
        this.props.toggle();
    }

    onFileSelected(file: File){
        this.setState({...this.state, file});
    }

    onFileCleared(){
        this.setState({...this.state, file: null});
    }

    canSubmit() {
        return this.state.file != null;
    }

    render() {
        var { supplier, contract } = this.props.data;
        var { reference, utility } = contract;

        var friendlyUtility = getWellFormattedUtilityName(utility);
        var supplierName = supplier == null ? "Unknown" : supplier.name;
        var supplierImage = supplier == null ? "Unknown" : (<img src={supplier.logoUri} style={{ maxWidth: "140px", maxHeight: "80px"}}/>);

        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle}><i className="fas fa-file-upload mr-2"></i>Upload {friendlyUtility} Contract Rates</ModalHeader>
                <ModalBody>
                    <div className="text-center mb-2">
                        {supplierImage}
                    </div>
                    <p className="mb-1 text-midweight">Please upload the file representing the existing <strong>{supplierName}</strong> {friendlyUtility} contract rates.</p> 
                    <p>Contract Reference: <i>{reference}</i>.</p>
                    <Form>
                        <UploadPanel 
                                file={this.state.file}
                                onFileSelected={(file: File) => this.onFileSelected(file)}
                                onFileCleared={() => this.onFileCleared()} />
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.props.toggle}>
                        <i className="fas fa-times mr-1"></i>Cancel
                    </Button>
                    <Button color="accent" 
                            disabled={!this.canSubmit()}
                            onClick={() => this.upload()}>
                        <i className="fas fa-arrow-circle-up mr-1"></i>Upload
                    </Button>
                </ModalFooter>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        uploadElectricityBackingSheet: (contractId: string, file: Blob) => dispatch(uploadElectricityBackingSheet(contractId, file)),
        uploadGasBackingSheet: (contractId: string, file: Blob) => dispatch(uploadGasBackingSheet(contractId, file))
    };
};
  
  
export default AsModalDialog<UploadContractRatesDialogData, {}, DispatchProps>(
{ 
    name: ModalDialogNames.UploadAccountContractRates, 
    centered: true, 
    backdrop: true
}, null, mapDispatchToProps)(UploadContractRatesDialog)