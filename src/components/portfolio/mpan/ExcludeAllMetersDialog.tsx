import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { PortfolioDetails } from '../../../model/Models';

import { excludeMeters } from '../../../actions/meterActions';
import { closeModalDialog } from "../../../actions/viewActions";

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
                    <h2 className="uk-modal-title">Confirm</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        <p><strong>Are you sure you want to exclude all current meters attached to this portfolio?</strong></p>
                        <p>You can add meters back at any time using the include meters button.</p>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}>No</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.completeExclusion()}>Yes</button>
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
  
const mapStateToProps: MapStateToProps<StateProps, ExcludeAllMetersDialogProps> = () => {
    return {};
};
  
export default connect(mapStateToProps, mapDispatchToProps)(ExcludeAllMetersDialog);