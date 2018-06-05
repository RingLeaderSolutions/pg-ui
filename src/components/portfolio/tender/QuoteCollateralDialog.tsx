import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';

import { TenderQuoteCollateral } from "../../../model/Tender";

interface QuoteCollateralDialogProps {
    collateral: TenderQuoteCollateral[];
}

interface StateProps {
}
  
interface DispatchProps {
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
                            {/* <span className="uk-margin-small-right" data-uk-icon="icon: cloud-download" /> */}
                            View
                        </a> 
                    </td>
                </tr>
            )
        });
    }

    renderCollateralTable(){
        if(!this.props.collateral || this.props.collateral.length == 0){
            return (<p>This quote does not have any collateral.</p>);
        }

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
        return (
            <div className="uk-modal-dialog">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Quote Collateral</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        {this.renderCollateralTable()}
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">Close</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, QuoteCollateralDialogProps> = () => {
    return {};
};
  
const mapStateToProps: MapStateToProps<StateProps, QuoteCollateralDialogProps> = () => {
    return {};
};
  
export default connect(mapStateToProps, mapDispatchToProps)(QuoteCollateralDialog);