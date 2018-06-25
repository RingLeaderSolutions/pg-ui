import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';

import { uploadAccountDocument } from '../../actions/hierarchyActions';
import { closeModalDialog } from "../../actions/viewActions";

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

interface UploadLOAState {
    file: Blob;
}

class UploadAccountDocumentDialog extends React.Component<UploadAccountDocumentDialogProps & StateProps & DispatchProps, UploadLOAState> {
    constructor(){
        super();
        this.state = {
            file: null
        };

        this.upload = this.upload.bind(this);
        this.onFileChosen = this.onFileChosen.bind(this);
    }
    documentType: HTMLSelectElement;
    
    upload() {
        this.props.uploadAccountDocument(this.props.accountId, this.documentType.value, this.state.file);
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
                    <h2 className="uk-modal-title">Upload Account Document</h2>
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