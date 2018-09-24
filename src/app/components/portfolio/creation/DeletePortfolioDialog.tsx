import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';

import { deletePortfolio } from '../../../actions/portfolioActions';
import { closeModalDialog } from "../../../actions/viewActions";
import { ApplicationState } from "../../../applicationState";

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
                    <h2 className="uk-modal-title"><i className="fas fa-trash-alt uk-margin-right"></i>Delete Portfolio</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-alert-danger uk-alert" data-uk-alert>
                        <div className="uk-grid uk-grid-small" data-uk-grid>
                            <div className="uk-width-auto uk-flex uk-flex-middle">
                                <i className="fas fa-exclamation-triangle uk-margin-small-right"></i>
                            </div>
                            <div className="uk-width-expand uk-flex uk-flex-middle">
                                <div>
                                    <p><strong>Are you sure you want to delete this portfolio?</strong></p>
                                    <p>Deleting this portfolio will also delete any in-progress tenders, remove any generated requirements packs, and clear any received offers.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}><i className="fas fa-check-circle uk-margin-small-right" style={{color:'#006400'}}></i>No</button>
                    <button className="uk-button uk-button-danger" type="button" onClick={() => this.completeDeletion()}><i className="fas fa-trash-alt uk-margin-small-right"></i>Yes</button>
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
  
const mapStateToProps: MapStateToProps<StateProps, DeletePortfolioDialogProps, ApplicationState> = () => {
    return {};
};
  
export default connect(mapStateToProps, mapDispatchToProps)(DeletePortfolioDialog);