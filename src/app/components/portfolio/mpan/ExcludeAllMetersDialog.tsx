import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { PortfolioDetails } from '../../../model/Models';

import { excludeMeters } from '../../../actions/meterActions';
import { closeModalDialog } from "../../../actions/viewActions";
import { ApplicationState } from "../../../applicationState";

interface ExcludeAllMetersDialogProps {    
    portfolio: PortfolioDetails;
    includedMeters: string[];
}

interface StateProps {
}

interface DispatchProps {
    excludeMeters: (portfolioId: string, meters: string[]) => void;
    closeModalDialog: () => void;
}

class ExcludeAllMetersDialog extends React.Component<ExcludeAllMetersDialogProps & StateProps & DispatchProps, {}> {
    completeExclusion(){
        this.props.excludeMeters(this.props.portfolio.portfolio.id, this.props.includedMeters);
        this.props.closeModalDialog();
    }

    render() {
        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title"><i className="fas fa-folder-minus uk-margin-right"></i>Exclude All Meters</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-alert-danger uk-alert" data-uk-alert>
                        <div className="uk-grid uk-grid-small" data-uk-grid>
                            <div className="uk-width-auto uk-flex uk-flex-middle">
                                <i className="fas fa-exclamation-triangle uk-margin-small-right"></i>
                            </div>
                            <div className="uk-width-expand uk-flex uk-flex-middle">
                                <div>
                                    <p><strong>Are you sure you wish to exclude all meters currently attached to this portfolio?</strong></p>
                                    <p>You can add meters back at any time using the include meters button.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}><i className="fas fa-check-circle uk-margin-small-right" style={{color:'#006400'}}></i>No</button>
                    <button className="uk-button uk-button-danger" type="button" onClick={() => this.completeExclusion()}><i className="fas fa-minus-circle uk-margin-small-right"></i>Yes</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, ExcludeAllMetersDialogProps> = (dispatch) => {
    return {
        excludeMeters: (portfolioId: string, meters: string[]) => dispatch(excludeMeters(portfolioId, meters)),
        closeModalDialog: () => dispatch(closeModalDialog())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, ExcludeAllMetersDialogProps, ApplicationState> = () => {
    return {};
};
  
export default connect(mapStateToProps, mapDispatchToProps)(ExcludeAllMetersDialog);