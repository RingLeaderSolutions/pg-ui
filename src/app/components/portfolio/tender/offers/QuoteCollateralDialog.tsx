import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';

import { TenderQuoteCollateral } from "../../../../model/Tender";
import { closeModalDialog } from "../../../../actions/viewActions";
import { ApplicationState } from "../../../../applicationState";

interface QuoteCollateralDialogProps {
    collateral: TenderQuoteCollateral[];
}

interface StateProps {
}
  
interface DispatchProps {
    closeModalDialog: () => void;
}

class QuoteCollateralDialog extends React.Component<QuoteCollateralDialogProps & StateProps & DispatchProps, {}> {
    renderTableContent(){
        return this.props.collateral.map(p => {
            var fileName = p.documentBlobId.substring(p.documentBlobId.lastIndexOf('/') + 1)

            return (
                <tr key={p.collateralId}>
                    <td>{fileName}</td>
                    <td>
                        <a className="uk-button uk-button-default uk-button-small" href={p.documentBlobId} target="_blank">
                            <i className="far fa-eye uk-margin-small-right"></i>
                            View
                        </a> 
                    </td>
                </tr>
            )
        });
    }

    renderCollateralTable(){
        var tableContent = this.renderTableContent();
        return (
            <table className="uk-table uk-table-divider">
                <thead>
                    <tr>
                        <th>Document Name</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>)
    }


    render() {
        var hasCollateral = this.props.collateral && this.props.collateral.length > 0;
        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title"><i className="fas fa-folder-open uk-margin-small-right"></i>Quote Collateral</h2>
                </div>
                <div className="uk-modal-body">
                
                {hasCollateral ? 
                    (<div className="uk-margin">
                        {this.renderCollateralTable()}
                    </div>)
                :
                    (<p>This quote does not have any collateral.</p>)}

                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}><i className="fas fa-times uk-margin-small-right"></i>Close</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, QuoteCollateralDialogProps> = (dispatch) => {
    return {
        closeModalDialog: () => dispatch(closeModalDialog()) 
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, QuoteCollateralDialogProps, ApplicationState> = () => {
    return {};
};
  
export default connect(mapStateToProps, mapDispatchToProps)(QuoteCollateralDialog);