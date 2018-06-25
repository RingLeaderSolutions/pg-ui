import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';

import { deletePortfolio } from '../../../actions/portfolioActions';
import { closeModalDialog } from "../../../actions/viewActions";

interface DeletePortfolioDialogProps {    
    portfolioId: string;
}

interface StateProps {
}

interface DispatchProps {
    deletePortfolio: (portfolioId: string) => void;
    closeModalDialog: () => void;
}

class DeletePortfolioDialog extends React.Component<DeletePortfolioDialogProps & StateProps & DispatchProps, {}> {
    completeDeletion(){
        this.props.deletePortfolio(this.props.portfolioId);
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
                        <p><strong>Are you sure you want to delete this portfolio?</strong></p>
                        <p>Deleting this portfolio will also delete any tenders in progress.</p>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}>No</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.completeDeletion()}>Yes</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, DeletePortfolioDialogProps> = (dispatch) => {
    return {
        deletePortfolio: (portfolioId: string) => dispatch(deletePortfolio(portfolioId)),
        closeModalDialog: () => dispatch(closeModalDialog())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, DeletePortfolioDialogProps> = () => {
    return {};
};
  
export default connect(mapStateToProps, mapDispatchToProps)(DeletePortfolioDialog);