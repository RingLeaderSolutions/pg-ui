import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';

import { deletePortfolio } from '../../../actions/portfolioActions';
import { withRouter } from "react-router-dom";

interface DeletePortfolioDialogProps {    
    portfolioId: string;
}

interface StateProps {
}

interface DispatchProps {
    deletePortfolio: (portfolioId: string) => void;
}

class DeletePortfolioDialog extends React.Component<DeletePortfolioDialogProps & StateProps & DispatchProps, {}> {
    completeDeletion(){
        this.props.deletePortfolio(this.props.portfolioId);
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
                        <p><strong>Are you sure you want to delete this portfolio?</strong></p>
                        <p>Deleting this portfolio will also delete any tenders in progress.</p>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">No</button>
                    <button className="uk-button uk-button-primary uk-modal-close" type="button" onClick={() => this.completeDeletion()}>Yes</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, DeletePortfolioDialogProps> = (dispatch) => {
    return {
        deletePortfolio: (portfolioId: string) => dispatch(deletePortfolio(portfolioId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, DeletePortfolioDialogProps> = () => {
    return {};
};
  
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DeletePortfolioDialog));