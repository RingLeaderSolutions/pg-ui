import * as React from "react";
import { MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../../applicationState';
import { TenderSupplier } from "../../../../model/Tender";

import { uploadElectricityOffer, uploadGasOffer } from '../../../../actions/tenderActions';
import { UploadPanel } from "../../../common/UploadPanel";
import { getWellFormattedUtilityName } from "../../../common/UtilityIcon";
import AsModalDialog, { ModalDialogProps } from "../../../common/modal/AsModalDialog";
import { ModalDialogNames } from "../../../common/modal/ModalDialogNames";
import { ModalFooter, ModalHeader, ModalBody, Form, FormGroup, Label, CustomInput, Button } from "reactstrap";

export interface UploadOfferDialogData {
    tenderId: string;
    assignedSuppliers: TenderSupplier[];
    utilityType: string;
}

interface StateProps {
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    uploadElectricityOffer: (tenderId: string, supplierId: string, file: Blob) => void;
    uploadGasOffer: (tenderId: string, supplierId: string, file: Blob) => void;
}

interface UploadOfferState {
    file: File;
    supplierId: string;
}

class UploadOfferDialog extends React.Component<ModalDialogProps<UploadOfferDialogData> & StateProps & DispatchProps, UploadOfferState> {
    constructor(props: ModalDialogProps<UploadOfferDialogData> & StateProps & DispatchProps){
        super(props);
        this.state = {
            file: null,
            supplierId: ""
        };
    }

    upload() {
        let { tenderId, utilityType } = this.props.data;
        if(utilityType.toLowerCase() == "gas"){
            this.props.uploadGasOffer(tenderId, this.state.supplierId, this.state.file);
        }
        else {
            this.props.uploadElectricityOffer(tenderId, this.state.supplierId, this.state.file);
        }
        
        this.onFileCleared();
        this.props.toggle();
    }

    handleFormChange(attribute: string, event: React.ChangeEvent<any>, isCheck: boolean = false){
        var value = isCheck ? event.target.checked : event.target.value;

        this.setState({
            ...this.state,
            [attribute]: value
        })
    }

    onFileSelected(file: File){
        this.setState({...this.state, file});
    }

    onFileCleared(){
        this.setState({...this.state, file: null});
    }

    canSubmit(){
        return this.state.file && this.state.supplierId && !this.state.supplierId.IsEmpty();
    }
    
    render() {  
        var friendlyUtility = getWellFormattedUtilityName(this.props.data.utilityType);
              
        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle}><i className="fas fa-file-upload mr-2"></i>Upload {friendlyUtility} Offer</ModalHeader>
                <ModalBody>
                    {/* <p className="text-center">Please select the originating supplier and locate the offer file.</p> */}
                    <Form>
                        <FormGroup>
                            <Label for="upload-offer-supplier">Supplier</Label>
                            <CustomInput type="select" name="upload-offer-supplier-picker" id="upload-offer-supplier"
                                   value={this.state.supplierId}
                                   onChange={(e) => this.handleFormChange("supplierId", e)}>
                                <option value="" disabled>Select</option>
                                {this.props.data.assignedSuppliers.map(s => {
                                        return (<option key={s.supplierId} value={s.supplierId}>{s.name}</option>)
                                })}
                            </CustomInput>
                        </FormGroup>
                        <hr />
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
        uploadElectricityOffer: (tenderId: string, supplierId: string, file: Blob) => dispatch(uploadElectricityOffer(tenderId, supplierId, file)),
        uploadGasOffer: (tenderId: string, supplierId: string,  file: Blob) => dispatch(uploadGasOffer(tenderId, supplierId, file))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, {}, ApplicationState> = (state: ApplicationState) => {
    return {
        working: state.portfolio.details.working,
        error: state.portfolio.details.error,
        errorMessage: state.portfolio.details.errorMessage,
        suppliers: state.suppliers.value,
    };
};
  
export default AsModalDialog<UploadOfferDialogData, StateProps, DispatchProps>(
{ 
    name: ModalDialogNames.UploadOffer, 
    centered: true, 
    backdrop: true,
}, mapStateToProps, mapDispatchToProps)(UploadOfferDialog)