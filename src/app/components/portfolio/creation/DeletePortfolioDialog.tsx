import * as React from "react";
import { MapDispatchToPropsFunction } from 'react-redux';
import asModalDialog, { ModalDialogProps } from "../../common/modal/AsModalDialog";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";
import { ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

import { deletePortfolio } from '../../../actions/portfolioActions';
import { closeDialog } from "../../../actions/viewActions";

export interface DeletePortfolioDialogData {
    portfolioId: string;
}

interface DeletePortfolioDialogProps extends ModalDialogProps<DeletePortfolioDialogData> { }

interface DispatchProps {
    deletePortfolio: (portfolioId: string) => void;
    closePortfolioUpdateDialog: () => void;
}

class DeletePortfolioDialog extends React.Component<DeletePortfolioDialogProps & DispatchProps, {}> {
    completeDeletion(){
        this.props.deletePortfolio(this.props.data.portfolioId);
        this.props.closePortfolioUpdateDialog();
        this.props.toggle();
    }

    render() {
        return (
            <div className="modal-content">
                <ModalHeader className="modal-header-danger" toggle={this.props.toggle}><i className="fas fa-trash-alt mr-2"></i>Delete Portfolio</ModalHeader>
                <ModalBody>
                    <div className="d-flex align-items-center flex-column">
                        <i className="fas fa-info-circle mr-2"></i>
                        <p className="m-0 pt-2"><strong>Are you sure you want to delete this portfolio?</strong></p>
                        <p className="m-0 pt-1">Deleting this portfolio will also delete any in-progress tenders, remove any generated requirements packs, and clear any received offers.</p>
                    </div>
                </ModalBody>
                <ModalFooter className="justify-content-between">
                    <Button onClick={this.props.toggle}>
                        <i className="fas fa-times mr-1"></i>No, Cancel!    
                    </Button>
                    <Button color="danger" 
                            onClick={() => this.completeDeletion()}>
                        <i className="fas fa-trash-alt mr-1"></i>Yes, I know what I'm doing!
                    </Button>
                </ModalFooter>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, DeletePortfolioDialogProps> = (dispatch) => {
    return {
        deletePortfolio: (portfolioId: string) => dispatch(deletePortfolio(portfolioId)),
        closePortfolioUpdateDialog: () => dispatch(closeDialog(ModalDialogNames.UpdatePortfolio))
    };
};
  
export default asModalDialog(
{ 
    name: ModalDialogNames.DeletePortfolio, 
    centered: true, 
    backdrop: true,
}, null, mapDispatchToProps)(DeletePortfolioDialog)