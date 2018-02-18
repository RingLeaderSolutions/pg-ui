import * as React from "react";
import Header from "../../common/Header";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { PortfolioDetails, PortfolioContact } from '../../../model/Models';
import Spinner from '../../common/Spinner';
import { FormEvent } from "react";

import { uploadElectricityBackingSheet, uploadGasBackingSheet } from '../../../actions/tenderActions';

interface UploadBackingSheetDialogProps {
    tenderId: string;
    utilityType: string;
}

interface StateProps {
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    uploadElectricityBackingSheet: (tenderId: string, file: Blob) => void;
    uploadGasBackingSheet: (tenderId: string, file: Blob) => void;
}

interface UploadBackingSheetState {
    file: Blob;
}

class UploadBackingSheetDialog extends React.Component<UploadBackingSheetDialogProps & StateProps & DispatchProps, UploadBackingSheetState> {
    constructor(props: UploadBackingSheetDialogProps & StateProps & DispatchProps){
        super();
        this.state = {
            file: null
        };

        this.upload = this.upload.bind(this);
        this.onFileChosen = this.onFileChosen.bind(this);
    }
    
    upload() {
        if(this.props.utilityType == "GAS"){
            this.props.uploadGasBackingSheet(this.props.tenderId, this.state.file);
            return;
        }
        this.props.uploadElectricityBackingSheet(this.props.tenderId, this.state.file);
    }

    onFileChosen(e: any){
        this.setState({
            file: e.target.files[0]
        });
    }

    render() {
        return (
            <div className="uk-modal-dialog">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Upload Contract Rates</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        <p>Select the file you wish to upload.</p>
                        <form>
                            <fieldset className="uk-fieldset">
                                <div className="uk-margin">
                                    <div className="uk-form-file"><input type="file" onChange={this.onFileChosen}/></div>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">Cancel</button>
                    <button className="uk-button uk-button-primary uk-modal-close" type="button" onClick={this.upload}>Upload</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UploadBackingSheetDialogProps> = (dispatch) => {
    return {
        uploadElectricityBackingSheet: (tenderId: string, file: Blob) => dispatch(uploadElectricityBackingSheet(tenderId, file)),
        uploadGasBackingSheet: (tenderId: string, file: Blob) => dispatch(uploadGasBackingSheet(tenderId, file))        
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