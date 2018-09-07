import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { PortfolioDetails } from '../../../model/Models';

import { uploadHistoric } from '../../../actions/portfolioActions';
import { closeModalDialog } from "../../../actions/viewActions";

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
    files: Blob[];
}

class UploadHistoricDialog extends React.Component<UploadHistoricDialogProps & StateProps & DispatchProps, UploadHistoricState> {
    constructor(){
        super();
        this.state = {
            files: null
        };
    }
    historicalType: HTMLSelectElement;
    
    upload() {
        var portfolioId = this.props.details.portfolio.id;
        this.props.uploadHistoric(portfolioId, this.state.files, this.historicalType.value);
        this.props.closeModalDialog();
    }

    onFileChosen(e: any){
        this.setState({
            files: e.target.files
        });
    }

    render() {

        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Upload Historical Consumption</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        <p>Select the file you wish to upload.</p>
                        <form>
                            <fieldset className="uk-fieldset">
                                <div className="uk-margin">
                                    <div className="uk-form-file"><input type="file" onChange={(e:any) => this.onFileChosen(e)} multiple/></div>
                                </div>
                                <select className='uk-select' 
                                    ref={ref => this.historicalType = ref}>
                                    <option value="" disabled>Select</option>
                                    <option value="Generic">Generic</option>
                                    <option value="BACKWARDS">Backwards</option>
                                    <option value="UKDC">UKDC</option>
                                </select>
                            </fieldset>
                        </form>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.upload()} disabled={this.state.files == null}>Upload</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UploadHistoricDialogProps> = (dispatch) => {
    return {
        uploadHistoric: (portfolioId: string, files: Blob[], historicalType: string) => dispatch(uploadHistoric(portfolioId, files, historicalType)),
        closeModalDialog: () => dispatch(closeModalDialog())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, UploadHistoricDialogProps> = (state: ApplicationState) => {
    return {
        working: state.portfolio.details.working,
        error: state.portfolio.details.error,
        errorMessage: state.portfolio.details.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(UploadHistoricDialog);