import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import { uploadElectricityBackingSheet, uploadGasBackingSheet } from '../../../actions/tenderActions';
import { closeModalDialog } from "../../../actions/viewActions";

interface UploadBackingSheetDialogProps {
    contractId: string;
    utilityType: string;
}

interface StateProps {
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    uploadElectricityBackingSheet: (contractId: string, useGeneric: boolean, file: Blob) => void;
    uploadGasBackingSheet: (contractId: string, useGeneric: boolean, file: Blob) => void;
    closeModalDialog: () => void;
}

interface UploadBackingSheetState {
    file: Blob;
}

class UploadBackingSheetDialog extends React.Component<UploadBackingSheetDialogProps & StateProps & DispatchProps, UploadBackingSheetState> {
    constructor(){
        super();
        this.state = {
            file: null
        };

        this.upload = this.upload.bind(this);
        this.onFileChosen = this.onFileChosen.bind(this);
    }
    useGeneric: HTMLInputElement;
    
    upload() {
        if(this.props.utilityType == "GAS"){
            this.props.uploadGasBackingSheet(this.props.contractId, this.useGeneric.checked, this.state.file);
        }
        else {
            this.props.uploadElectricityBackingSheet(this.props.contractId, this.useGeneric.checked, this.state.file);
        }

        this.props.closeModalDialog();
    }

    onFileChosen(e: any){
        this.setState({
            file: e.target.files[0]
        });
    }

    render() {
        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Upload Contract Rates</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        <p>Select the file you wish to upload.</p>
                        <form>
                            <fieldset className="uk-fieldset">
                                <div className='uk-margin uk-grid-small uk-child-width-auto uk-grid'>
                                    <label>
                                        <input 
                                            className='uk-checkbox'
                                            type='checkbox' 
                                            defaultChecked={false}
                                            ref={ref => this.useGeneric = ref}
                                            /> Use Generic Template
                                    </label>
                                </div>
                                <div className="uk-margin">
                                    <div className="uk-form-file"><input type="file" onChange={this.onFileChosen}/></div>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={this.upload}>Upload</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UploadBackingSheetDialogProps> = (dispatch) => {
    return {
        uploadElectricityBackingSheet: (contractId: string, useGeneric: boolean, file: Blob) => dispatch(uploadElectricityBackingSheet(contractId, useGeneric, file)),
        uploadGasBackingSheet: (contractId: string, useGeneric: boolean, file: Blob) => dispatch(uploadGasBackingSheet(contractId, useGeneric, file)),
        closeModalDialog: () => dispatch(closeModalDialog())    
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, UploadBackingSheetDialogProps> = (state: ApplicationState) => {
    return {
        working: state.portfolio.details.working,
        error: state.portfolio.details.error,
        errorMessage: state.portfolio.details.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(UploadBackingSheetDialog);