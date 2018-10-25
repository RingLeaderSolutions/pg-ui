import * as React from "react";
import { MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { PortfolioDetails } from '../../../model/Models';

import { uploadHistoric } from '../../../actions/portfolioActions';
import { MultiUploadPanel } from "../../common/UploadPanel";
import asModalDialog, { ModalDialogProps } from "../../common/modal/AsModalDialog";
import { ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";

export interface UploadHistoricDialogData {
    details: PortfolioDetails;
}

interface UploadHistoricDialogProps extends ModalDialogProps<UploadHistoricDialogData> { }

interface StateProps {
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    uploadHistoric: (portfolioId: string, files: Blob[], historicalType: string) => void;
}

interface UploadHistoricState {
    files: File[];
    historicalType: string;
}

class UploadHistoricDialog extends React.Component<UploadHistoricDialogProps & StateProps & DispatchProps, UploadHistoricState> {
    constructor(props: UploadHistoricDialogProps & StateProps & DispatchProps){
        super(props);
        this.state = {
            files: null,
            historicalType: ""
        };
    }
    
    upload() {
        this.props.uploadHistoric(
            this.props.data.details.portfolio.id,
             this.state.files,
              this.state.historicalType);

        this.props.toggle();
    }

    onFilesSelected(files: File[]){
        this.setState({
            files
        });
    }

    onFilesCleared(){
        this.setState({...this.state, files: null});
    }

    handleFormChange(attribute: string, event: React.ChangeEvent<any>, isCheck: boolean = false){
        var value = isCheck ? event.target.checked : event.target.value;

        this.setState({
            ...this.state,
            [attribute]: value
        })
    }

    canSubmit(){
        return this.state.files != null && !this.state.historicalType.IsNullOrEmpty();
    }

    render() {
        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle}><i className="fas fa-file-upload mr-2"></i>Upload Historical Consumption</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Input type="select" name="upload-historic-type-picker" id="upload-historic-type"
                                   value={this.state.historicalType}
                                    onChange={(e) => this.handleFormChange("historicalType", e)}>
                                <option value="" disabled>Select</option>
                                <option value="Generic">Generic</option>
                                <option value="BACKWARDS">Backwards</option>
                                <option value="UKDC">UKDC</option>
                            </Input>
                        </FormGroup>
                        <hr />
                        <MultiUploadPanel 
                            files={this.state.files}
                            onFilesSelected={(files: File[]) => this.onFilesSelected(files)}
                            onFilesCleared={() => this.onFilesCleared()} />
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.props.toggle}>
                        <i className="fas fa-times mr-1"></i>Cancel
                    </Button>
                    <Button color="accent" 
                            disabled={!this.canSubmit()}
                            onClick={() => this.upload()}>
                        <i className="fas fa-arrow-circle-up mr-1"></i>Save
                    </Button>
                </ModalFooter>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UploadHistoricDialogProps> = (dispatch) => {
    return {
        uploadHistoric: (portfolioId: string, files: Blob[], historicalType: string) => dispatch(uploadHistoric(portfolioId, files, historicalType))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, UploadHistoricDialogProps, ApplicationState> = (state: ApplicationState) => {
    return {
        working: state.portfolio.details.working,
        error: state.portfolio.details.error,
        errorMessage: state.portfolio.details.errorMessage
    };
};
  
export default asModalDialog<UploadHistoricDialogProps, StateProps, DispatchProps>(
{ 
    name: ModalDialogNames.UploadHistoric, 
    centered: true, 
    backdrop: true,
}, mapStateToProps, mapDispatchToProps)(UploadHistoricDialog)