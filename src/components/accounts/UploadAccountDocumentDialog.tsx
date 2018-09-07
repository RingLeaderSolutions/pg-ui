import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';

import { uploadAccountDocument } from '../../actions/hierarchyActions';
import { closeModalDialog } from "../../actions/viewActions";
import { UploadPanel } from "../common/UploadPanel";

interface UploadAccountDocumentDialogProps {
    accountId: string;
}

interface StateProps {
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    uploadAccountDocument: (accountId: string, documentType: string, file: Blob) => void;
    closeModalDialog: () => void;
}

interface UploadAccountDocumentDialogState {
    file: File;
}

class UploadAccountDocumentDialog extends React.Component<UploadAccountDocumentDialogProps & StateProps & DispatchProps, UploadAccountDocumentDialogState> {
    constructor(){
        super();
        this.state = {
            file: null
        };
    }
    documentType: HTMLSelectElement;
    
    upload() {
        this.props.uploadAccountDocument(this.props.accountId, this.documentType.value, this.state.file);
        this.onFileCleared();
        this.props.closeModalDialog();
    }

    onFileSelected(file: File){
        this.setState({...this.state, file});
    }

    onFileCleared(){
        this.setState({...this.state, file: null});
    }

    render() {
        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title"><i className="fa fa-file-upload uk-margin-right"></i>Upload Account Document</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        <p>Select the file you wish to upload.</p>
                        <form>
                            <fieldset className="uk-fieldset">
                                <div className="uk-margin">
                                    <label className='uk-form-label'>Document Type</label>
                                    <select className='uk-select' 
                                        ref={ref => this.documentType = ref}>
                                        <option value="" disabled>Select</option>
                                        <option value="loa">Letter of Authority</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </fieldset>
                            <hr />
                            <UploadPanel 
                                file={this.state.file}
                                onFileSelected={(file: File) => this.onFileSelected(file)}
                                onFileCleared={() => this.onFileCleared()} />
                        </form>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}><i className="fa fa-times uk-margin-small-right"></i>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.upload} disabled={this.state.file == null}><i className="fa fa-arrow-circle-up uk-margin-small-right"></i>Upload</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UploadAccountDocumentDialogProps> = (dispatch) => {
    return {
        uploadAccountDocument: (accountId: string, documentType: string, file: Blob) => dispatch(uploadAccountDocument(accountId, documentType, file)),
        closeModalDialog: () => dispatch(closeModalDialog()) 
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, UploadAccountDocumentDialogProps> = (state: ApplicationState) => {
    return {
        working: state.hierarchy.selected.working,
        error: state.hierarchy.selected.error,
        errorMessage: state.hierarchy.selected.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(UploadAccountDocumentDialog);