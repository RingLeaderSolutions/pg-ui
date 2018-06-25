import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { UtilityType } from '../../../model/Models';

import { uploadSupplyMeterData } from '../../../actions/portfolioActions';
import { closeModalDialog } from "../../../actions/viewActions";

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
    file: Blob;
}

class UploadSupplyDataDialog extends React.Component<UploadSupplyDataDialogProps & StateProps & DispatchProps, UploadHistoricState> {
    constructor(){
        super();
        this.state = {
            file: null
        };

        this.upload = this.upload.bind(this);
        this.onFileChosen = this.onFileChosen.bind(this);
    }
    
    upload() {
        this.props.uploadSupplyData(this.props.accountId, this.state.file, this.props.type);
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
                    <h2 className="uk-modal-title">Upload Supply Data</h2>
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
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={this.upload}>Upload</button>
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