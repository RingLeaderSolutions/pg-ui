import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { UtilityType } from '../../../model/Models';

import { uploadSupplyMeterData } from '../../../actions/portfolioActions';
import { UploadPanel } from "../../common/UploadPanel";
import { getWellFormattedUtilityType } from "../../common/UtilityIcon";
import asModalDialog, { ModalDialogProps } from "../../common/modal/AsModalDialog";
import { ModalFooter, ModalHeader, ModalBody, Form, Button } from "reactstrap";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";

export interface UploadSupplyDataDialogData {
    accountId: string;
    type: UtilityType;
}

interface UploadSupplyDataDialogProps extends ModalDialogProps<UploadSupplyDataDialogData> { }

interface StateProps {
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    uploadSupplyData: (accountId: string, file: Blob, type: UtilityType) => void;
}

interface UploadHistoricState {
    file: File;
}

class UploadSupplyDataDialog extends React.Component<UploadSupplyDataDialogProps & StateProps & DispatchProps, UploadHistoricState> {
    constructor(props: UploadSupplyDataDialogProps & StateProps & DispatchProps){
        super(props);
        this.state = {
            file: null
        };
    }
    
    upload() {
        this.props.uploadSupplyData(this.props.data.accountId, this.state.file, this.props.data.type);

        this.onFileCleared();
        this.props.toggle();
    }

    onFileSelected(file: File){
        this.setState({...this.state, file});
    }

    onFileCleared(){
        this.setState({...this.state, file: null});
    }

    render() {
        var friendlyUtility = getWellFormattedUtilityType(this.props.data.type);
        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle}><i className="fas fa-file-upload mr-2"></i>Upload {friendlyUtility} Supply Data</ModalHeader>
                <ModalBody>
                    <Form>
                        <p className="m-0">Please upload the file representing the {friendlyUtility} supply data.</p> 
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
                        <i className="fas fa-arrow-circle-up mr-1"></i>Save
                    </Button>
                </ModalFooter>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UploadSupplyDataDialogProps> = (dispatch) => {
    return {
        uploadSupplyData: (accountId: string, file: Blob, type: UtilityType) => dispatch(uploadSupplyMeterData(accountId, file, type))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, UploadSupplyDataDialogProps, ApplicationState> = (state: ApplicationState) => {
    return {
        working: state.portfolio.details.working,
        error: state.portfolio.details.error,
        errorMessage: state.portfolio.details.errorMessage
    };
};
  
export default asModalDialog(
{ 
    name: ModalDialogNames.UploadSupplyData, 
    centered: true, 
    backdrop: true,
}, mapStateToProps, mapDispatchToProps)(UploadSupplyDataDialog)