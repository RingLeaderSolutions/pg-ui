import * as React from "react";
import { MapDispatchToPropsFunction } from 'react-redux';
import { PortfolioDetails } from '../../../model/Models';

import { excludeMeters } from '../../../actions/meterActions';
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";
import AsModalDialog, { ModalDialogProps } from "../../common/modal/AsModalDialog";
import { ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

export interface ExcludeAllMetersDialogData {
    portfolio: PortfolioDetails;
    includedMeters: string[];
}

interface DispatchProps {
    excludeMeters: (portfolioId: string, meters: string[]) => void;
}

class ExcludeAllMetersDialog extends React.Component<ModalDialogProps<ExcludeAllMetersDialogData>  & DispatchProps, {}> {
    completeExclusion(){
        this.props.excludeMeters(this.props.data.portfolio.portfolio.id, this.props.data.includedMeters);
        this.props.toggle();
    }

    render() {
        return (
            <div className="modal-content">
                <ModalHeader className="modal-header-danger" toggle={this.props.toggle}><i className="fas fa-folder-minus mr-2"></i>Exclude All Meters</ModalHeader>
                <ModalBody>
                    <div className="d-flex align-items-center flex-column">
                        <p className="m-0 pt-2"><strong>Are you sure you wish to exclude all meters currently attached to this portfolio?</strong></p>
                        <p className="m-0 pt-1">You can add meters back at any time using the include meters button.</p>
                    </div>
                </ModalBody>
                <ModalFooter className="justify-content-between">
                    <Button onClick={this.props.toggle}>
                        <i className="fas fa-times mr-1"></i>No, Cancel!    
                    </Button>
                    <Button color="danger" 
                            onClick={() => this.completeExclusion()}>
                        <i className="fas fa-trash-alt mr-1"></i>Yes, I know what I'm doing!
                    </Button>
                </ModalFooter>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        excludeMeters: (portfolioId: string, meters: string[]) => dispatch(excludeMeters(portfolioId, meters))
    };
};
  
export default AsModalDialog<ExcludeAllMetersDialogData, {}, DispatchProps>(
{ 
    name: ModalDialogNames.ExcludeAllMeters, 
    centered: true, 
    backdrop: true,
}, null, mapDispatchToProps)(ExcludeAllMetersDialog)