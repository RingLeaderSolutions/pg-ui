import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { PortfolioDetails } from '../../../model/Models';

import { uploadHistoric } from '../../../actions/portfolioActions';
import { closeModalDialog } from "../../../actions/viewActions";
import { MultiUploadPanel } from "../../common/UploadPanel";

interface UploadHistoricDialogProps {
    details: PortfolioDetails;
}

interface StateProps {
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    uploadHistoric: (portfolioId: string, files: Blob[], historicalType: string) => void;
    closeModalDialog: () => void;
}

interface UploadHistoricState {
    files: File[];
    historicalType: string;
}

class UploadHistoricDialog extends React.Component<UploadHistoricDialogProps & StateProps & DispatchProps, UploadHistoricState> {
    constructor(){
        super();
        this.state = {
            files: null,
            historicalType: ""
        };
    }
    
    upload() {
        this.props.uploadHistoric(
            this.props.details.portfolio.id,
             this.state.files,
              this.state.historicalType);

        this.props.closeModalDialog();
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
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title"><i className="fa fa-file-upload uk-margin-right"></i>Upload Historical Consumption</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        <p>Select the files you wish to upload.</p>
                        <form>
                            <fieldset className="uk-fieldset">
                                <select className='uk-select' 
                                    value={this.state.historicalType}
                                    onChange={(e) => this.handleFormChange("historicalType", e)} >
                                    <option value="" disabled>Select</option>
                                    <option value="Generic">Generic</option>
                                    <option value="BACKWARDS">Backwards</option>
                                    <option value="UKDC">UKDC</option>
                                </select>
                            </fieldset>
                            <hr />
                            <MultiUploadPanel 
                                files={this.state.files}
                                onFilesSelected={(files: File[]) => this.onFilesSelected(files)}
                                onFilesCleared={() => this.onFilesCleared()} />
                        </form>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}><i className="fas fa-times uk-margin-right"></i>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.upload()} disabled={!this.canSubmit()}><i className="fa fa-arrow-circle-up uk-margin-right"></i>Upload</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UploadHistoricDialogProps> = (dispatch) => {
    return {
        uploadHistoric: (portfolioId: string, files: File[], historicalType: string) => dispatch(uploadHistoric(portfolioId, files, historicalType)),
        closeModalDialog: () => dispatch(closeModalDialog())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, UploadHistoricDialogProps, ApplicationState> = (state: ApplicationState) => {
    return {
        working: state.portfolio.details.working,
        error: state.portfolio.details.error,
        errorMessage: state.portfolio.details.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(UploadHistoricDialog);