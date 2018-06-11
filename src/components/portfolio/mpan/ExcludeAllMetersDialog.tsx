import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { PortfolioDetails } from '../../../model/Models';

import { excludeMeters } from '../../../actions/meterActions';

interface ExcludeAllMetersDialogProps {    
    portfolio: PortfolioDetails;
    includedMeters: string[];
}

interface StateProps {
}

interface DispatchProps {
    excludeMeters: (portfolioId: string, meters: string[]) => void;
}

class ExcludeAllMetersDialog extends React.Component<ExcludeAllMetersDialogProps & StateProps & DispatchProps, {}> {
    completeExclusion(){
        this.props.excludeMeters(this.props.portfolio.portfolio.id, this.props.includedMeters);
    }

    render() {
        return (
            <div className="uk-modal-dialog">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
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
                    <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">No</button>
                    <button className="uk-button uk-button-primary uk-modal-close" type="button" onClick={() => this.completeExclusion()}>Yes</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, ExcludeAllMetersDialogProps> = (dispatch) => {
    return {
        excludeMeters: (portfolioId: string, meters: string[]) => dispatch(excludeMeters(portfolioId, meters))        
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, ExcludeAllMetersDialogProps> = () => {
    return {};
};
  
export default connect(mapStateToProps, mapDispatchToProps)(ExcludeAllMetersDialog);