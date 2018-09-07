import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { UtilityType } from '../../../model/Models';

import { uploadSupplyMeterData } from '../../../actions/portfolioActions';
import { closeModalDialog } from "../../../actions/viewActions";
import { UploadPanel } from "../../common/UploadPanel";

interface UploadSupplyDataDialogProps {
    accountId: string;
    type: UtilityType;
}

interface StateProps {
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    uploadSupplyData: (accountId: string, file: Blob, type: UtilityType) => void;
    closeModalDialog: () => void;
}

interface UploadHistoricState {
    file: File;
}

class UploadSupplyDataDialog extends React.Component<UploadSupplyDataDialogProps & StateProps & DispatchProps, UploadHistoricState> {
    constructor(){
        super();
        this.state = {
            file: null
        };
    }
    
    upload() {
        this.props.uploadSupplyData(this.props.accountId, this.state.file, this.props.type);

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
                    <h2 className="uk-modal-title"><i className="fa fa-file-upload uk-margin-right"></i>Upload Supply Data</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        <UploadPanel 
                            file={this.state.file}
                            onFileSelected={(file: File) => this.onFileSelected(file)}
                            onFileCleared={() => this.onFileCleared()} />
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}><i className="fa fa-times uk-margin-small-right"></i>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.upload} disabled={this.state.file == null}><i className="fa fa-arrow-circle-up uk-margin-small-right"></i>Upload</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UploadSupplyDataDialogProps> = (dispatch) => {
    return {
        uploadSupplyData: (accountId: string, file: Blob, type: UtilityType) => dispatch(uploadSupplyMeterData(accountId, file, type)),
        closeModalDialog: () => dispatch(closeModalDialog()) 
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, UploadSupplyDataDialogProps> = (state: ApplicationState) => {
    return {
        working: state.portfolio.details.working,
        error: state.portfolio.details.error,
        errorMessage: state.portfolio.details.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(UploadSupplyDataDialog);