import * as React from "react";
import { MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import { uploadAccountDocument } from '../../../actions/hierarchyActions';
import { UploadPanel } from "../../common/UploadPanel";
import asModalDialog, { ModalDialogProps } from "../../common/modal/AsModalDialog";
import { ModalHeader, ModalBody, Form, FormGroup, Label, CustomInput, ModalFooter, Button } from "reactstrap";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";

export interface UploadAccountDocumentDialogData {
    accountId: string;
}

interface UploadAccountDocumentDialogProps extends ModalDialogProps<UploadAccountDocumentDialogData> { }

interface StateProps {
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    uploadAccountDocument: (accountId: string, documentType: string, file: Blob) => void;
}

interface UploadAccountDocumentDialogState {
    file: File;
    documentType: string;
}

class UploadAccountDocumentDialog extends React.Component<UploadAccountDocumentDialogProps & StateProps & DispatchProps, UploadAccountDocumentDialogState> {
    constructor(props: UploadAccountDocumentDialogProps & StateProps & DispatchProps){
        super(props);
        this.state = {
            file: null,
            documentType: ""
        };
    }
    
    upload() {
        this.props.uploadAccountDocument(this.props.data.accountId, this.state.documentType, this.state.file);
        this.onFileCleared();
        this.props.toggle();
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

    canSubmit(){
        return this.state.file != null && !this.state.documentType.IsNullOrEmpty();
    }

    render() {
        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle}><i className="fas fa-file-upload mr-2"></i>Upload Account Document</ModalHeader>
                <ModalBody>
                    <Form>
                        <p className="m-0 text-center">Select the file you wish to upload.</p> 
                        <FormGroup className="mt-2">
                            <Label for="upload-account-document-type">Type</Label>
                            <CustomInput type="select" name="upload-account-document-type-picker" id="upload-account-document-type"
                                    value={this.state.documentType}
                                    onChange={(e) => this.handleFormChange("documentType", e)}>
                                    <option value="" disabled>Select</option>
                                    <option value="loa">Letter of Authority</option>
                                    <option value="Other">Other</option>
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
                            disabled={!this.state.file}
                            onClick={() => this.upload()}>
                        <i className="fas fa-arrow-circle-up mr-1"></i>Upload
                    </Button>
                </ModalFooter>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UploadAccountDocumentDialogProps> = (dispatch) => {
    return {
        uploadAccountDocument: (accountId: string, documentType: string, file: Blob) => dispatch(uploadAccountDocument(accountId, documentType, file))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, UploadAccountDocumentDialogProps, ApplicationState> = (state: ApplicationState) => {
    return {
        working: state.hierarchy.selected.working,
        error: state.hierarchy.selected.error,
        errorMessage: state.hierarchy.selected.errorMessage
    };
};
  
export default asModalDialog<UploadAccountDocumentDialogProps, StateProps, DispatchProps>(
{ 
    name: ModalDialogNames.UploadAccountDocument, 
    centered: true, 
    backdrop: true,
}, mapStateToProps, mapDispatchToProps)(UploadAccountDocumentDialog)