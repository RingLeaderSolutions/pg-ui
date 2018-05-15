import * as React from "react";
import Header from "../common/Header";
import ErrorMessage from "../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import Spinner from '../common/Spinner';
import { FormEvent } from "react";

import { uploadAccountDocument } from '../../actions/hierarchyActions';

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
}

interface UploadLOAState {
    file: Blob;
}

class UploadAccountDocumentDialog extends React.Component<UploadAccountDocumentDialogProps & StateProps & DispatchProps, UploadLOAState> {
    constructor(props: UploadAccountDocumentDialogProps & StateProps & DispatchProps){
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
                    <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">Cancel</button>
                    <button className="uk-button uk-button-primary uk-modal-close" type="button" onClick={this.upload}>Upload</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UploadAccountDocumentDialogProps> = (dispatch) => {
    return {
        uploadAccountDocument: (accountId: string, documentType: string, file: Blob) => dispatch(uploadAccountDocument(accountId, documentType, file))        
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